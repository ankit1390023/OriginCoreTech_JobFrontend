import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { recruiterApi } from "../../../api/recuiterApi";
import RecruiterPostJobInternLayout from "../recruiterPostJobInternDetails/RecruiterPostJobInternLayout";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    designation: z.string().min(1, { message: "Designation is required" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    about: z.string().min(10, { message: "About section must be at least 10 characters" }),
    logo: z.instanceof(File).optional().or(z.literal("")),
    profilePic: z.instanceof(File).optional().or(z.literal("")),
    hiringPreferences: z.string().optional(),
    languagesKnown: z.string().optional(),
    isEmailVerified: z.boolean().default(false),
    isPhoneVerified: z.boolean().default(false),
    isGstVerified: z.boolean().default(false),
});

export default function CompanyRecruiterProfile() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [existingProfile, setExistingProfile] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [profilePicPreview, setProfilePicPreview] = useState("");
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            designation: "",
            companyName: "",
            industry: "",
            location: "",
            about: "",
            logo: "",
            profilePic: "",
            hiringPreferences: "",
            languagesKnown: "",
            isEmailVerified: false,
            isPhoneVerified: false,
            isGstVerified: false,
        },
    });

    // Watch for file changes to show previews
    const watchedLogo = watch("logo");
    const watchedProfilePic = watch("profilePic");

    // Handle file previews
    useEffect(() => {
        if (watchedLogo && watchedLogo instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => setLogoPreview(e.target.result);
            reader.readAsDataURL(watchedLogo);
        } else if (existingProfile?.logoUrl) {
            setLogoPreview(existingProfile.logoUrl);
        } else {
            setLogoPreview("");
        }
    }, [watchedLogo, existingProfile?.logoUrl]);

    useEffect(() => {
        if (watchedProfilePic && watchedProfilePic instanceof File) {
            const reader = new FileReader();
            reader.onload = (e) => setProfilePicPreview(e.target.result);
            reader.readAsDataURL(watchedProfilePic);
        } else if (existingProfile?.profilePic) {
            setProfilePicPreview(existingProfile.profilePic);
        } else {
            setProfilePicPreview("");
        }
    }, [watchedProfilePic, existingProfile?.profilePic]);

    // Check if profile exists on component mount
    useEffect(() => {
        checkExistingProfile();
    }, []);

    const checkExistingProfile = async () => {
        try {
            const profile = await recruiterApi.getProfile();
            setExistingProfile(profile);
            setIsEditMode(true);

            // Populate form with existing data
            setValue("designation", profile.designation || "");
            setValue("companyName", profile.companyName || "");
            setValue("industry", profile.industry || "");
            setValue("location", profile.location || "");
            setValue("about", profile.about || "");
            setValue("hiringPreferences", profile.hiringPreferences || "");
            setValue("languagesKnown", profile.languagesKnown || "");
            setValue("isEmailVerified", profile.isEmailVerified || false);
            setValue("isPhoneVerified", profile.isPhoneVerified || false);
            setValue("isGstVerified", profile.isGstVerified || false);
        } catch (error) {
            if (error.response?.status === 404) {
                // Profile doesn't exist, stay in create mode
                setIsEditMode(false);
            } else {
                console.error("Error checking profile:", error);
                setErrorMessage("Error loading profile. Please try again.");
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            setErrorMessage("");
            setSuccessMessage("");

            if (isEditMode) {
                // Update existing profile
                await recruiterApi.updateProfile(data);
                setSuccessMessage("Profile updated successfully!");
                navigate("/recruiter-post-job-intern-details");
            } else {
                // Create new profile
                await recruiterApi.createProfile(data);
                setSuccessMessage("Profile created successfully!");
                setIsEditMode(true);
                navigate("/recruiter-post-job-intern-details");
            }

            // Refresh profile data
            await checkExistingProfile();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccessMessage("");
            }, 5000);

        } catch (error) {
            console.error("Profile submission error:", error);

            if (error.response) {
                const status = error.response.status;
                let errorMessage = "Error saving profile";

                if (status === 401) {
                    errorMessage = "Authentication failed. Please log in again.";
                } else if (status === 400) {
                    errorMessage = error.response.data?.message || "Invalid data provided. Please check your inputs.";
                } else if (status === 403) {
                    errorMessage = "Unauthorized. Only company users can create recruiter profiles.";
                } else if (status === 500) {
                    errorMessage = "Server error. Please try again later.";
                } else {
                    errorMessage = error.response.data?.message || "Error saving profile";
                }

                setErrorMessage(errorMessage);
            } else if (error.request) {
                setErrorMessage("Network error. Please check your connection and ensure the backend server is running.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
    };

    // Common input styles
    const inputStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
    const textareaStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical min-h-[120px]";
    const labelStyles = "block text-sm font-semibold text-gray-700 mb-2";
    const errorStyles = "text-red-500 text-sm mt-1";
    const fileInputStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100";

    return (
        <RecruiterPostJobInternLayout
            heading={isEditMode ? "Edit Company Profile" : "Create Company Profile"}
            subheading={isEditMode ? "Update your company recruiter profile information." : "Set up your company recruiter profile to start posting jobs and internships."}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white rounded-xl p-1">
                {/* Success Message */}
                {successMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-green-800">{successMessage}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    type="button"
                                    onClick={() => setSuccessMessage("")}
                                    className="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    type="button"
                                    onClick={() => setErrorMessage("")}
                                    className="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
                                >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Basic Information
                    </h3>

                    {/* Designation */}
                    <div>
                        <label htmlFor="designation" className={labelStyles}>
                            Designation *
                        </label>
                        <input
                            type="text"
                            id="designation"
                            {...register("designation")}
                            className={inputStyles}
                            placeholder="e.g., HR Manager, Recruiter, Hiring Manager"
                        />
                        {errors.designation && <p className={errorStyles}>{errors.designation.message}</p>}
                    </div>

                    {/* Company Name */}
                    <div>
                        <label htmlFor="companyName" className={labelStyles}>
                            Company Name *
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            {...register("companyName")}
                            className={inputStyles}
                            placeholder="e.g., Tech Solutions Inc."
                        />
                        {errors.companyName && <p className={errorStyles}>{errors.companyName.message}</p>}
                    </div>

                    {/* Industry */}
                    <div>
                        <label htmlFor="industry" className={labelStyles}>
                            Industry *
                        </label>
                        <input
                            type="text"
                            id="industry"
                            {...register("industry")}
                            className={inputStyles}
                            placeholder="e.g., Technology, Healthcare, Finance"
                        />
                        {errors.industry && <p className={errorStyles}>{errors.industry.message}</p>}
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className={labelStyles}>
                            Location *
                        </label>
                        <input
                            type="text"
                            id="location"
                            {...register("location")}
                            className={inputStyles}
                            placeholder="e.g., Mumbai, Maharashtra"
                        />
                        {errors.location && <p className={errorStyles}>{errors.location.message}</p>}
                    </div>
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Company Details
                    </h3>

                    {/* About Company */}
                    <div>
                        <label htmlFor="about" className={labelStyles}>
                            About Company *
                        </label>
                        <textarea
                            id="about"
                            {...register("about")}
                            className={textareaStyles}
                            placeholder="Describe your company, its mission, values, and what makes it unique..."
                        />
                        {errors.about && <p className={errorStyles}>{errors.about.message}</p>}
                    </div>

                    {/* Company Logo Upload */}
                    <div>
                        <label htmlFor="logo" className={labelStyles}>
                            Company Logo
                        </label>
                        <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            {...register("logo")}
                            className={fileInputStyles}
                        />
                        {errors.logo && <p className={errorStyles}>{errors.logo.message}</p>}

                        {/* Logo Preview */}
                        {logoPreview && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <img
                                    src={logoPreview}
                                    alt="Company Logo Preview"
                                    className="w-32 h-32 object-contain border border-gray-300 rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Profile Picture Upload */}
                    <div>
                        <label htmlFor="profilePic" className={labelStyles}>
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profilePic"
                            accept="image/*"
                            {...register("profilePic")}
                            className={fileInputStyles}
                        />
                        {errors.profilePic && <p className={errorStyles}>{errors.profilePic.message}</p>}

                        {/* Profile Picture Preview */}
                        {profilePicPreview && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <img
                                    src={profilePicPreview}
                                    alt="Profile Picture Preview"
                                    className="w-32 h-32 object-cover border border-gray-300 rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Hiring Preferences */}
                    <div>
                        <label htmlFor="hiringPreferences" className={labelStyles}>
                            Hiring Preferences
                        </label>
                        <textarea
                            id="hiringPreferences"
                            {...register("hiringPreferences")}
                            className={textareaStyles}
                            placeholder="Describe your hiring preferences, ideal candidate qualities..."
                        />
                        {errors.hiringPreferences && <p className={errorStyles}>{errors.hiringPreferences.message}</p>}
                    </div>

                    {/* Languages Known */}
                    <div>
                        <label htmlFor="languagesKnown" className={labelStyles}>
                            Languages Known
                        </label>
                        <input
                            type="text"
                            id="languagesKnown"
                            {...register("languagesKnown")}
                            className={inputStyles}
                            placeholder="e.g., English, Hindi, Spanish"
                        />
                        {errors.languagesKnown && <p className={errorStyles}>{errors.languagesKnown.message}</p>}
                    </div>
                </div>

                {/* Verification Status */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Verification Status
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Email Verification */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isEmailVerified"
                                {...register("isEmailVerified")}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isEmailVerified" className="ml-2 text-sm text-gray-700">
                                Email Verified
                            </label>
                        </div>

                        {/* Phone Verification */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isPhoneVerified"
                                {...register("isPhoneVerified")}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isPhoneVerified" className="ml-2 text-sm text-gray-700">
                                Phone Verified
                            </label>
                        </div>

                        {/* GST Verification */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isGstVerified"
                                {...register("isGstVerified")}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isGstVerified" className="ml-2 text-sm text-gray-700">
                                GST Verified
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={clearMessages}
                        className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditMode ? "Updating..." : "Creating..."}
                            </div>
                        ) : (
                            isEditMode ? "Update Profile" : "Create Profile"
                        )}
                    </button>
                </div>
            </form>
        </RecruiterPostJobInternLayout>
    );
} 