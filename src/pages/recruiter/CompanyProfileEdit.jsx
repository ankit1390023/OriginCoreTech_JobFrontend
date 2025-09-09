import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaTrashAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import MainLayout from "../../components/layout/MainLayout";
import FeedRightProfile from "../student/feed/FeedRightProfile";
import dummyProfile3 from "../../assets/dummyProfile3.jpg";
import { useMasterData } from "../../hooks/master/useMasterData";
import useUploadImageApi from "../../hooks/useUploadImageApi";
import { recruiterApi } from "../../api/recuiterApi";
import { useSelector } from "react-redux";
import { getImageUrl } from "../../../utils.js";
const CompanyProfileEdit = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState(null);
    const [editingSections, setEditingSections] = useState({});
    const [statusMessage, setStatusMessage] = useState("");

    const {
        languages = [],
        isLoading,
        isError,
    } = useMasterData();

    const { uploadImage, loading: uploading } = useUploadImageApi();

    // Form state
    const [formState, setFormState] = useState({
        company_name: "",
        about: "",
        hiring_preferences: "",
        languages: [],
        profile_picUrl: "",
    });

    // Form errors
    const [formErrors, setFormErrors] = useState({});

    // Track if form is dirty (modified)
    const [isDirty, setIsDirty] = useState(false);

    // Load user data and populate form
    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await recruiterApi.getProfile(token);
                console.log("Profile data:", response);
                setUserData(response);

                setFormState({
                    company_name: response?.company_name || "",
                    about: response?.about || "",
                    hiring_preferences: response?.hiring_preferences || "",
                    languages: response?.languages || [],
                    profile_picUrl: response?.profile_picUrl || "",
                    company_logo: response?.company_logo || "",
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setStatusMessage("Failed to fetch profile data");
            }
        };

        if (token) {
            getProfile();
        }
    }, [token]);

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormState(prev => {
            const newState = { ...prev, [field]: value };
            setIsDirty(true);
            return newState;
        });

        // Clear error when user types
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const toggleEdit = (section) => {
        setEditingSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formState.company_name.trim()) {
            errors.company_name = "Company name is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            console.log("Submitting form data:", formState);
            // await recruiterApi.updateProfile(token, formState);

            setStatusMessage("Profile updated successfully!");
            setEditingSections({});
            setIsDirty(false);

            setTimeout(() => setStatusMessage(""), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setStatusMessage("Failed to update profile");
        }
    };

    const handleSaveSection = (section) => {
        if (validateForm()) {
            onSubmit({ preventDefault: () => { } }); // fake event
        }
        toggleEdit(section);
    };

    const handleCancelEdit = (section) => {
        if (userData) {
            setFormState({
                company_name: userData.company_name || "",
                about: userData.about || "",
                hiring_preferences: userData.hiring_preferences || "",
                languages: userData.languages || [],
                profile_picUrl: userData.profile_picUrl || "",
                company_logo: userData.company_logo || "",
            });
            setIsDirty(false);
        }
        toggleEdit(section);
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await uploadImage(file, "profilePic");
        console.log('Upload result:', result);
        if (result?.url) {
            setFormState(prev => ({
                ...prev,
                profile_picUrl: result.url
            }));

            console.log('✅ Profile picture uploaded successfully:', result.url);
            setStatusMessage('Profile picture uploaded! Click Save to update your profile.');
        }
    };

    const profile = userData;

    return (
        <MainLayout>
            <div className="flex flex-col p-4 lg:flex-row gap-6 max-w-7xl mx-auto w-full">
                {/* Main Content */}
                <div className="w-full lg:w-[70%] shadow-md space-y-6">
                    <form onSubmit={onSubmit}>
                        {/* Profile Header */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col items-center">
                                {/* Profile Image */}
                                <div className="relative group">
                                    <img
                                        alt="Profile"
                                        src={formState.profile_picUrl ? getImageUrl(formState.profile_picUrl) : (profile?.profile_picUrl ? getImageUrl(profile.profile_picUrl) : dummyProfile3)}
                                        className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full text-xs cursor-pointer hover:bg-blue-700">
                                        <FaCamera />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleProfilePicUpload}
                                        />
                                    </label>
                                </div>

                                {/* Company Name */}
                                <div className="mt-4 text-center">
                                    {editingSections.companyName ? (
                                        <div className="space-y-2">
                                            <input
                                                value={formState.company_name}
                                                onChange={(e) => handleInputChange("company_name", e.target.value)}
                                                className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-500 text-center focus:outline-none"
                                            />
                                            {formErrors.company_name && (
                                                <p className="text-red-500 text-sm">{formErrors.company_name}</p>
                                            )}
                                            <div className="flex gap-2 justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveSection("companyName")}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    <FaSave />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <h1 className="text-2xl font-bold text-gray-900">
                                                {formState.company_name || profile?.company_name || "Company Name"}
                                            </h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                            {/* About Section */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">About</h3>
                                    {editingSections.about ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection("about")}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCancelEdit("about")}
                                                className="text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button type="button" onClick={() => toggleEdit("about")} className="text-sm text-blue-600 hover:text-blue-800">Edit</button>
                                    )}
                                </div>

                                {editingSections.about ? (
                                    <textarea
                                        value={formState.about}
                                        onChange={(e) => handleInputChange("about", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                        placeholder="Tell us about your company..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formState.about || profile?.about || "No information available"}
                                    </p>
                                )}
                            </div>

                            {/* Hiring Preferences */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Hiring Preferences</h3>
                                    {editingSections.hiring ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection("hiring")}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCancelEdit("hiring")}
                                                className="text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => toggleEdit("hiring")}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {editingSections.hiring ? (
                                    <textarea
                                        value={formState.hiring_preferences}
                                        onChange={(e) => handleInputChange("hiring_preferences", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        placeholder="Describe your hiring preferences..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formState.hiring_preferences || profile?.hiring_preferences || "No preferences specified"}
                                    </p>
                                )}
                            </div>

                            {/* Languages */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Languages you know</h3>
                                    {editingSections.languages ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection("languages")}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleCancelEdit("languages")}
                                                className="text-sm text-gray-600 hover:text-gray-800"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => toggleEdit("languages")}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>

                                {editingSections.languages ? (
                                    <input
                                        value={Array.isArray(formState.languages) ? formState.languages.join(", ") : formState.languages}
                                        onChange={(e) => handleInputChange("languages", e.target.value.split(",").map(l => l.trim()))}
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="English, Hindi, Spanish"
                                    />
                                ) : (
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                                        {profile?.languages && profile.languages.length > 0 ? (
                                            profile.languages.map((language, index) => (
                                                <span key={index} className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    {typeof language === 'object' ? (language.name || language.language || 'Unknown') : String(language)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">No languages specified</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Company Logo */}
                            {formState.company_logo && (
                                <div className="mt-4">
                                    <img
                                        alt="Company Logo"
                                        src={getImageUrl(formState.company_logo)}
                                        className="h-16 object-contain"
                                    />
                                </div>
                            )}

                            {/* Authentication Information */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Authentication</h3>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                        onClick={() => console.log("Get Verified clicked")}
                                    >
                                        Get Verified
                                        <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">i</span>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className={"w-2 h-2 rounded-full " + (profile?.is_email_verified ? 'bg-green-500' : 'bg-red-500')}></span>
                                            <span>Email {profile?.is_email_verified ? 'Verified' : 'Not Verified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={"w-2 h-2 rounded-full " + (profile?.is_phone_verified ? 'bg-green-500' : 'bg-red-500')}></span>
                                            <span>Phone {profile?.is_phone_verified ? 'Verified' : 'Not Verified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={"w-2 h-2 rounded-full " + (profile?.is_gst_verified ? 'bg-green-500' : 'bg-red-500')}></span>
                                            <span>GST {profile?.is_gst_verified ? 'Verified' : 'Not Verified'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Data Debug Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-2">Profile Data (Debug)</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <p><strong>Company Name:</strong> {profile?.company_name || 'N/A'}</p>
                                    <p><strong>About:</strong> {profile?.about || 'N/A'}</p>
                                    <p><strong>Hiring Preferences:</strong> {profile?.hiring_preferences || 'N/A'}</p>
                                    <p><strong>Languages:</strong> {
                                        profile?.languages && Array.isArray(profile.languages)
                                            ? profile.languages.map(lang =>
                                                typeof lang === 'object' && lang !== null
                                                    ? (lang.name || lang.language || 'Unknown')
                                                    : String(lang)
                                            ).filter(Boolean).join(', ') || 'N/A'
                                            : 'N/A'
                                    }</p>
                                    <p><strong>Logo URL:</strong> {profile?.logo_url || 'N/A'}</p>
                                    <p><strong>Profile Pic URL:</strong> {profile?.profile_picUrl || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Save All Changes Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!isDirty}
                                    className={`px-4 py-2 rounded-lg ${isDirty
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Save All Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Sidebar */}
                <div className="w-full lg:w-[30%]">
                    <FeedRightProfile />
                </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
                <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-green-100 text-green-800">
                    {statusMessage}
                </div>
            )}
        </MainLayout>
    );
};

export default CompanyProfileEdit;