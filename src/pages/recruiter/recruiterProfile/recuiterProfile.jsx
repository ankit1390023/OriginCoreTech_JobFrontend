import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { recruiterApi } from "../../../api/recuiterApi";
import RecruiterPostJobInternLayout from "../recruiterPostJobInternDetails/RecruiterPostJobInternLayout";
import { useNavigate } from "react-router-dom";
import { Input, Textarea, Label, Button, SuccessMessage, ErrorMessage, Checkbox } from "../../../components/ui";

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

    // File input styles
    const fileInputStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100";

    return (
        <RecruiterPostJobInternLayout
            heading={isEditMode ? "Edit Company Profile" : "Create Company Profile"}
            subheading={isEditMode ? "Update your company recruiter profile information." : "Set up your company recruiter profile to start posting jobs and internships."}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white rounded-xl p-1">
                {/* Success Message */}
                {successMessage && (
                    <SuccessMessage onClose={() => setSuccessMessage("")}>
                        {successMessage}
                    </SuccessMessage>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <ErrorMessage onClose={() => setErrorMessage("")}>
                        {errorMessage}
                    </ErrorMessage>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Basic Information
                    </h3>

                    {/* Designation */}
                    <Input
                        label="Designation"
                        required
                        placeholder="e.g., HR Manager, Recruiter, Hiring Manager"
                        error={errors.designation?.message}
                        {...register("designation")}
                    />

                    {/* Company Name */}
                    <Input
                        label="Company Name"
                        required
                        placeholder="e.g., Tech Solutions Inc."
                        error={errors.companyName?.message}
                        {...register("companyName")}
                    />

                    {/* Industry */}
                    <Input
                        label="Industry"
                        required
                        placeholder="e.g., Technology, Healthcare, Finance"
                        error={errors.industry?.message}
                        {...register("industry")}
                    />

                    {/* Location */}
                    <Input
                        label="Location"
                        required
                        placeholder="e.g., Mumbai, Maharashtra"
                        error={errors.location?.message}
                        {...register("location")}
                    />
                </div>

                {/* Company Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Company Details
                    </h3>

                    {/* About Company */}
                    <Textarea
                        label="About Company"
                        required
                        placeholder="Describe your company, its mission, values, and what makes it unique..."
                        error={errors.about?.message}
                        {...register("about")}
                    />

                    {/* Company Logo Upload */}
                    <div>
                        <Label>Company Logo</Label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("logo")}
                            className={fileInputStyles}
                        />
                        {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}

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
                        <Label>Profile Picture</Label>
                        <input
                            type="file"
                            accept="image/*"
                            {...register("profilePic")}
                            className={fileInputStyles}
                        />
                        {errors.profilePic && <p className="text-red-500 text-sm mt-1">{errors.profilePic.message}</p>}

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
                    <Textarea
                        label="Hiring Preferences"
                        placeholder="Describe your hiring preferences, ideal candidate qualities..."
                        error={errors.hiringPreferences?.message}
                        {...register("hiringPreferences")}
                    />

                    {/* Languages Known */}
                    <Input
                        label="Languages Known"
                        placeholder="e.g., English, Hindi, Spanish"
                        error={errors.languagesKnown?.message}
                        {...register("languagesKnown")}
                    />
                </div>

                {/* Verification Status */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Verification Status
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Email Verification */}
                        <Checkbox
                            id="isEmailVerified"
                            {...register("isEmailVerified")}
                        >
                            Email Verified
                        </Checkbox>

                        {/* Phone Verification */}
                        <Checkbox
                            id="isPhoneVerified"
                            {...register("isPhoneVerified")}
                        >
                            Phone Verified
                        </Checkbox>

                        {/* GST Verification */}
                        <Checkbox
                            id="isGstVerified"
                            {...register("isGstVerified")}
                        >
                            GST Verified
                        </Checkbox>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                    <Button
                        variant="outline"
                        onClick={clearMessages}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="secondary"
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        type="submit"
                    >
                        {isEditMode ? "Update Profile" : "Create Profile"}
                    </Button>
                </div>
            </form>
        </RecruiterPostJobInternLayout>
    );
} 