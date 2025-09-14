import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaSave } from "react-icons/fa";
import MainLayout from "../../../components/layout/MainLayout";
import FeedRightSidebar from "../../student/feed/FeedRightSidebar";
import dummyProfile3 from "../../../assets/dummyProfile3.jpg";
import { useMasterData } from "../../../hooks/master/useMasterData";
import useUploadImageApi from "../../../hooks/useUploadImageApi";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { getImageUrl } from "../../../../utils";
import { Loader2 } from 'lucide-react'; // Import a loading spinner
import { universityApi } from "../../../api/university/universityApi";

const UniversityProfileEdit = () => {
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [editingSections, setEditingSections] = useState({});
    const [formValues, setFormValues] = useState({
        college_name: "",
        about: "",
        course_ids: [],
        pincode: "",
        website_link: "",
        address: "",
        phone: "",
        email: "",
        social_media_link: "",
        profile_pic: "",
        university_logo_url: "",
        is_email_verified: false,
        is_phone_verified: false,
    });
    const [isDirty, setIsDirty] = useState(false);
    const [uploading, setUploading] = useState({
        profilePic: false,
        logo: false
    });

    const { courses } = useMasterData();
    const { uploadImage } = useUploadImageApi();

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const response = await universityApi.getUniversityDetailsById(user?.id,token);
              
                setUserData(response.data);
                const initialValues = {
                    college_name: response.data?.college_name || "",
                    about: response.data?.about || "",
                    course_ids: response.data?.courses?.map(course => course.id) || [],
                    pincode: response.data?.pincode || "",
                    website_link: response.data?.website_link || "",
                    address: response.data?.address || "",
                    phone: response.data?.User?.phone || "",
                    email: response.data?.User?.email || "",
                    social_media_link: response.data?.social_media_link || "",
                    profile_pic: response.data?.profile_pic || "",
                    university_logo_url: response.data?.university_logo_url || ""
                };
                console.log("updated initialValues is",initialValues)

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
    }, [token, user?.id]);
    console.log("updated formdata is",userData)

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
    };

    const handleSaveSection = async (section) => {
        try {
            const response = await universityApi.updateUniversityDetails(formValues, token);
            if (response.success) {
                setUserData(response.data);
                setFormValues({
                    ...formValues,
                    college_name: response.data.college_name || "",
                    about: response.data.about || "",
                    course_ids: response.data.courses?.map(course => course.id) || [],
                    pincode: response.data.pincode || "",
                    website_link: response.data.website_link || "",
                    address: response.data.address || "",
                    phone: response.data.User?.phone || "",
                    email: response.data.User?.email || "",
                    social_media_link: response.data.social_media_link || "",
                    profile_pic: response.data.profile_pic || "",
                    university_logo_url: response.data.university_logo_url || ""
                });
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
        console.log("file is from handleImageUpload", file)
        console.log("type is from handleImageUpload", type)
        const result = await uploadImage(file, type);
        console.log("result is from handleImageUpload",result)
        const field = type === 'profilePic' ? 'profile_pic' : 'university_logo_url';
        const updatedValues = {
            ...formValues,
            [field]: result
        };

        setFormValues(updatedValues);
        console.log("updatedValues is from handleImageUpload",updatedValues)

        const response = await universityApi.updateUniversityDetails(updatedValues, token);
        console.log("response is from handleImageUpload rtrt",response)
        if (response.success) {
            setUserData(response.data);
            console.log("response is from handleImageUpload",response.data)
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
            values.college_name !== userData.college_name ||
            values.about !== userData.about ||
            values.course_ids !== userData.course_ids ||
            values.pincode !== userData.pincode ||
            values.website_link !== userData.website_link ||
            values.address !== userData.address ||
            values.phone !== userData.User?.phone ||
            values.email !== userData.User?.email ||
            values.social_media_link !== userData.social_media_link ||
            values.profile_pic !== userData.profile_pic ||
            values.university_logo_url !== userData.university_logo_url
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

                            {/* college Name */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">College Name</h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.collegeName ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('collegeName')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('collegeName')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.collegeName ? (
                                    <textarea
                                        value={formValues.college_name}
                                        onChange={(e) => handleChange("college_name", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="1"
                                        placeholder="Tell us about your company..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.college_name || "No information available"}
                                    </p>
                                )}
                            </div>

                            {/* University Logo */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    {/* Left side: Title and Logo */}
                                    <div className="flex items-center space-x-4">
                                        <h3 className="text-sm font-medium text-gray-700">University Logo</h3>
                                        {/* Logo Container */}
                                        <div className="relative">
                                            {formValues.university_logo_url ? (
                                                <img
                                                    className="object-cover w-12 h-12 border border-gray-200 rounded-full"
                                                    src={formValues.university_logo_url.startsWith('http') ? formValues.university_logo_url : getImageUrl(formValues.university_logo_url)}
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
                                                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                                                    accept="image/*"
                                                    disabled={uploading.universityLogo}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div> {/* courses */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Courses
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.courses ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('courses')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('courses')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.courses ? (
                                    <div className="space-y-1">
                                        <Select
                                            isMulti
                                            value={courses
                                                .filter(l => formValues.course_ids?.includes(String(l.id)))
                                                .map(l => ({
                                                    value: String(l.id),
                                                    label: l.name
                                                }))}
                                            onChange={(selectedOptions) => {
                                                const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFormValues(prev => ({
                                                    ...prev,
                                                    course_ids: selectedIds
                                                }));
                                                setIsDirty(true);
                                            }}
                                            options={courses.map(l => ({
                                                value: String(l.id),
                                                label: l.name
                                            }))}
                                            placeholder="Select courses"
                                            isClearable
                                            isSearchable
                                            className="text-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                                        {profile?.courses && profile.courses.length > 0 ? (
                                            profile.courses.map((course, index) => (
                                                <span key={index} className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                    {typeof course === "object"
                                                        ? course.name || course.course || "Unknown"
                                                        : String(course)}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">
                                                No courses specified
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                          

                            {/* address */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Address
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.address ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('address')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('address')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.address ? (
                                    <textarea
                                        value={formValues.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="2"
                                        placeholder="Describe your address..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.address || "No address specified"}
                                    </p>
                                )}
                            </div>
                            {/* email Id */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Email ID
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.email ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('email')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('email')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.email ? (
                                    <textarea
                                        value={formValues.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="2"
                                        placeholder="Enter your email id"
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.email || "No email specified"}
                                    </p>
                                )}
                            </div>

                            {/* phone */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Phone
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.phone ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('phone')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('phone')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.phone ? (
                                    <textarea
                                        value={formValues.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="2"
                                        placeholder="Enter your phone number."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.phone || "No phone specified"}
                                    </p>
                                )}
                            </div>

                            {/* website link */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Website Link
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.website_link ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('website_link')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('website_link')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.website_link ? (
                                    <textarea
                                        value={formValues.website_link}
                                        onChange={(e) => handleChange("website_link", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="1"
                                        placeholder="Enter your website link"
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.website_link || "No website link specified"}
                                    </p>
                                )}
                            </div>

                            {/* Social media link */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                        Social Media Link
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        {!editingSections.social_media_link ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('social_media_link')}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSection('social_media_link')}
                                                className="text-sm text-green-600 hover:text-green-800"
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {editingSections.social_media_link ? (
                                    <textarea
                                        value={formValues.social_media_link}
                                        onChange={(e) => handleChange("social_media_link", e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="1"
                                        placeholder="Enter your social media link"
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {formValues.social_media_link || "No social media link specified"}
                                    </p>
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

export default UniversityProfileEdit;