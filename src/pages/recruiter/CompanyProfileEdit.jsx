import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSave } from "react-icons/fa";
import MainLayout from "../../components/layout/MainLayout";
import FeedRightSidebar from "../student/feed/FeedRightSidebar";
import dummyProfile3 from "../../assets/dummyProfile3.jpg";
import { useMasterData } from "../../hooks/master/useMasterData";
import useUploadImageApi from "../../hooks/useUploadImageApi";
import { recruiterApi } from "../../api/recuiterApi";
import { useSelector,useDispatch } from "react-redux";
import Select from 'react-select';
import { getImageUrl } from "../../../utils";
import { Loader2 } from 'lucide-react'; // Import a loading spinner
import { updateUser } from "../../redux/feature/authSlice";

const CompanyProfileEdit = () => {
    const navigate = useNavigate();
    const dispatch= useDispatch();
    const { token,user } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [editingSections, setEditingSections] = useState({});
    const [formValues, setFormValues] = useState({
        company_name: "",
        about: "",
        hiring_preferences: "",
        language_ids: [],
        profile_pic: "",
        logo_url: "",
    });
    const [isDirty, setIsDirty] = useState(false);
    const [uploading, setUploading] = useState({
        profilePic: false,
        logo: false
    });

    const { languages } = useMasterData();
    const { uploadImage } = useUploadImageApi();

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const response = await recruiterApi.getProfile(token);
                setUserData(response);
                const initialValues = {
                    company_name: response?.company_name || "",
                    about: response?.about || "",
                    hiring_preferences: response?.hiring_preferences || "",
                    language_ids: Array.isArray(response?.languages)
                        ? response.languages.map(lang => String(lang.id || lang))
                        : [],
                    profile_pic: response?.profile_picUrl || "",
                    logo_url: response?.logo_url || ""
                };
                
                setFormValues(initialValues);
                setIsDirty(false);
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Handle error (e.g., show error message)
            } finally {
                setLoading(false);
            }
        };
        if (token) {
            getProfile();
        }
    }, [token]);

    // Add loading state
    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-gray-600">Loading your profile...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const toggleEdit = (section) => {
        // Close all other sections first
        const newEditingSections = {};
        // Only set the current section to true if it's not already true
        if (!editingSections[section]) {
            newEditingSections[section] = true;
        }
        setEditingSections(newEditingSections);
        
        // setEditingSections(prev => ({
        // ...prev,
        // [section]: !prev[section]
        // }));   
    };

    const handleSaveSection = async (section) => {
        try {
            const response = await recruiterApi.updateProfile(formValues, token);
            if (response.success) {
                setUserData(response.data);
                console.log("update profile response", response.data);
                setFormValues({
                    ...formValues,
                    company_name: response.data.company_name || "",
                    about: response.data.about || "",
                    hiring_preferences: response.data.hiring_preferences || "",
                    language_ids: response.data.languages?.map(lang => String(lang.id || lang)) || [],
                    profile_pic: response.data.profile_pic || "",
                    logo_url: response.data.logo_url || ""
                });
                dispatch(updateUser({
                                    user_profile_pic: response.data.profile_pic || null,
                                    about_us: response.data.about || null,
                                    organization_name: response.data.company_name || null,
                                    organization_logo: response.data.university_logo_url || null,
                                    email: response.data.User?.email || formValues.email,
                                    phone: response.data.User?.phone || formValues.phone,
                                    }));
                    
                alert('Profile updated successfully!');
                
                toggleEdit(section);
            } else {
                alert(response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'An error occurred while updating the profile');
        }
    };

    const handleImageUpload = async (e, type = 'profilePic') => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [type]: true }));
        const result = await uploadImage(file, type);

        const field = type === 'profilePic' ? 'profile_pic' : 'logo_url';
        const updatedValues = {
            ...formValues,
            [field]: result
        };

        setFormValues(updatedValues);

        const response = await recruiterApi.updateProfile(updatedValues, token);
        if (response.success || response.message== "Company recruiter profile updated successfully") {
            setUserData(response.data);
            if(type==='profilePic'){
                dispatch(updateUser({user_profile_pic:response.profile.profile_picUrl}));
            }else{
                dispatch(updateUser({organization_logo:response.profile.logo_url}));
            }
            
            alert(type === 'profilePic' ? 'Profile picture updated successfully!' : 'Logo updated successfully!');
        } else {
            alert('Failed to update image. Please try again.');
        }
        setUploading(prev => ({ ...prev, [type]: false }));
    };

    const handleChange = (field, value) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
        setIsDirty(checkIsDirty({ ...formValues, [field]: value }));
    };

    const checkIsDirty = (values) => {
        if (!userData) return false;
        return (
            values.company_name !== userData.company_name ||
            values.about !== userData.about ||
            values.hiring_preferences !== userData.hiring_preferences ||
            JSON.stringify(values.language_ids) !== JSON.stringify(userData.languages?.map(lang => String(lang.id || lang))) ||
            values.profile_pic !== userData.profile_pic ||
            values.logo_url !== userData.logo_url
        );
    };

    const profile = userData;

    return (
        <MainLayout>
            <div className="flex flex-col w-full gap-6 p-4 mx-auto lg:flex-row max-w-7xl">
                {/* Main Content */}
                <div className="w-full lg:w-[70%] shadow-md space-y-6">
                    <div>
                        {/* Profile Header */}
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <div className="flex flex-col items-center">
                                {/* Profile Image */}
                                <div className="relative group">
                                    <img
                                        alt="Profile"
                                        src={
                                            getImageUrl(formValues.profile_pic) ||
                                            getImageUrl(profile?.profile_pic) ||
                                            dummyProfile3
                                        }
                                        className="object-cover w-24 h-24 border-2 border-white rounded-full shadow-sm"
                                    />
                                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full text-xs cursor-pointer hover:bg-blue-700">
                                        <FaCamera />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'profilePic')}
                                            className="hidden"
                                            id="profile-pic-upload"
                                            disabled={uploading.profilePic}
                                        />
                                    </label>
                                </div>

                            </div>
                        </div>




                        <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm">
                            {/* About Section */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">About</h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.about ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('about')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('about')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.about ? (
                                    <textarea
                                        value={formValues.about}
                                        onChange={(e) => handleChange("about", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="2"
                                        placeholder="Tell us about your company..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.about || "No information available"}
                                    </p>
                                )}
                            </div>

                            {/* company Name */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">Company Name</h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.companyName ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('companyName')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('companyName')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.companyName ? (
                                    <textarea
                                        value={formValues.company_name}
                                        onChange={(e) => handleChange("company_name", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="1"
                                        placeholder="Tell us about your company..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.company_name || "No information available"}
                                    </p>
                                )}
                            </div>

                            {/* Company Logo */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    {/* Left side: Title and Logo */}
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-sm font-medium text-gray-700">Company Logo</h3>
                                        {/* Logo Container */}
                                        <div className="relative">
                                            {formValues.logo_url ? (
                                                <img
                                                    className="object-cover w-12 h-12 border border-gray-200 rounded-full"
                                                    src={formValues.logo_url.startsWith('http') ? formValues.logo_url : getImageUrl(formValues.logo_url)}
                                                    alt="Company logo"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                                                    <span className="text-xs text-gray-500">No logo</span>
                                                </div>
                                            )}
                                            <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full text-xs cursor-pointer hover:bg-blue-700">
                                                <FaCamera />
                                                <input
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => handleImageUpload(e, 'logo')}
                                                    accept="image/*"
                                                    disabled={uploading.logo}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hiring Preferences */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Hiring Preferences
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.hiring ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('hiring')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('hiring')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.hiring ? (
                                    <textarea
                                        value={formValues.hiring_preferences}
                                        onChange={(e) => handleChange("hiring_preferences", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="2"
                                        placeholder="Describe your hiring preferences..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.hiring_preferences || "No preferences specified"}
                                    </p>
                                )}
                            </div>

                            {/* Languages */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Languages you know
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.languages ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('languages')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('languages')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.languages ? (
                                    <div className="space-y-1">
                                        <Select
                                            isMulti
                                            value={languages
                                                .filter(l => formValues.language_ids?.includes(String(l.id)))
                                                .map(l => ({
                                                    value: String(l.id),
                                                    label: l.name
                                                }))}
                                            onChange={(selectedOptions) => {
                                                const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFormValues(prev => ({
                                                    ...prev,
                                                    language_ids: selectedIds
                                                }));
                                                setIsDirty(true);
                                            }}
                                            options={languages.map(l => ({
                                                value: String(l.id),
                                                label: l.name
                                            }))}
                                            placeholder="Select languages"
                                            isClearable
                                            isSearchable
                                            className="text-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                                        {profile?.languages && profile.languages.length > 0 ? (
                                            profile.languages.map((language, index) => (
                                                <span key={index} className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    {typeof language === "object"
                                                        ? language.name || language.language || "Unknown"
                                                        : String(language)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">
                                                No languages specified
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Authentication Information */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Authentication</h3>
                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                        onClick={() => navigate("/company-authentication")}
                                    >
                                        Get Verified
                                        <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">
                                            i
                                        </span>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${profile?.is_email_verified
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`}
                                            ></span>
                                            <span>
                                                Email{" "}
                                                {profile?.is_email_verified
                                                    ? "Verified"
                                                    : "Not Verified"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${profile?.is_phone_verified
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`}
                                            ></span>
                                            <span>
                                                Phone{" "}
                                                {profile?.is_phone_verified
                                                    ? "Verified"
                                                    : "Not Verified"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${profile?.is_gst_verified
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                                    }`}
                                            ></span>
                                            <span>
                                                GST{" "}
                                                {profile?.is_gst_verified
                                                    ? "Verified"
                                                    : "Not Verified"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-full lg:w-[30%]">
                    <FeedRightSidebar />
                </div>

            </div>
        </MainLayout>
    );
};

export default CompanyProfileEdit;