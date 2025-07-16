import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { recruiterApi } from "../../api/recuiterApi";
import useResponsiveLayout from "../../hooks/useResponsiveLayout";
import { useNavigate } from "react-router-dom";
import { Input, Textarea, Label, Button, SuccessMessage, ErrorMessage, Checkbox } from "../../components/ui";
import SignUpLayoutForLarge from "../../components/layout/SignUpLayoutForLarge";
import SignUpLayoutForSmall from "../../components/layout/SignUpLayoutForSmall";

const formSchema = z.object({
    designation: z.string().min(1, { message: "Designation is required" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    about: z.string().min(10, { message: "About section must be at least 10 characters" }),
    logo: z.any().optional(),
    profilePic: z.any().optional(),
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
    const { isLargeDevice } = useResponsiveLayout();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        setValue,
        watch,
        trigger,
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
        mode: "onBlur",
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

        const result = await recruiterApi.createProfileWithFileUpload(data);
        console.log("result from recruiterApi", result);
        setSuccessMessage("Profile created successfully!");
        setIsEditMode(true);
        // Navigate after successful creation
        setTimeout(() => {
            navigate("/recruiter-post-job-intern-details");
        }, 1000);

    };

    const clearMessages = () => {
        setSuccessMessage("");
        setErrorMessage("");
        // Don't reset form data, just clear messages
    };

    // File change handlers
    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("Logo file size must be less than 5MB");
                event.target.value = "";
                return;
            }
            setValue("logo", file);
            setErrorMessage(""); // Clear any previous errors
        }
    };

    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage("Profile picture file size must be less than 5MB");
                event.target.value = "";
                return;
            }
            setValue("profilePic", file);
            setErrorMessage(""); // Clear any previous errors
        }
    };

    // File input styles
    const fileInputStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100";

    const FormContent = () => (
        <div className={`flex-1 w-full ${isLargeDevice ? 'flex justify-center' : ''}`}>
            <div className={`bg-white rounded-xl shadow-none sm:shadow-xl w-full ${isLargeDevice ? 'mt-4 max-w-full sm:max-w-2xl' : '-mt-4'} ${isLargeDevice ? 'p-6 sm:p-8' : 'px-0 py-6 sm:py-8'}`}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {/* Success Message */}
                    {successMessage && (
                        <div className="relative">
                            <SuccessMessage size="large">
                                {successMessage}
                            </SuccessMessage>
                            <button
                                type="button"
                                onClick={() => setSuccessMessage("")}
                                className="absolute top-2 right-2 text-green-600 hover:text-green-800 focus:outline-none"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="relative">
                            <ErrorMessage size="large">
                                {errorMessage}
                            </ErrorMessage>
                            <button
                                type="button"
                                onClick={() => setErrorMessage("")}
                                className="absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">
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
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">
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
                            <Label className="block text-base font-medium mb-1">Company Logo</Label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className={fileInputStyles + " mb-1"}
                            />
                            <p className="text-sm text-gray-500 mt-1">Upload your company logo (JPG, PNG, GIF - Max 5MB)</p>
                            {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>}

                            {/* Logo Preview */}
                            {logoPreview && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                    <img
                                        src={logoPreview}
                                        alt="Company Logo Preview"
                                        className="w-24 h-24 object-contain border border-gray-300 rounded-lg shadow"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Profile Picture Upload */}
                        <div>
                            <Label className="block text-base font-medium mb-1">Profile Picture</Label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicChange}
                                className={fileInputStyles + " mb-1"}
                            />
                            <p className="text-sm text-gray-500 mt-1">Upload your profile picture (JPG, PNG, GIF - Max 5MB)</p>
                            {errors.profilePic && <p className="text-red-500 text-sm mt-1">{errors.profilePic.message}</p>}

                            {/* Profile Picture Preview */}
                            {profilePicPreview && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                    <img
                                        src={profilePicPreview}
                                        alt="Profile Picture Preview"
                                        className="w-24 h-24 object-cover border border-gray-300 rounded-lg shadow"
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
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 mb-2">
                            Verification Status
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Email Verification */}
                            <Checkbox
                                id="isEmailVerified"
                                label="Email Verified"
                                {...register("isEmailVerified")}
                            />

                            {/* Phone Verification */}
                            <Checkbox
                                id="isPhoneVerified"
                                label="Phone Verified"
                                {...register("isPhoneVerified")}
                            />

                            {/* GST Verification */}
                            <Checkbox
                                id="isGstVerified"
                                label="GST Verified"
                                {...register("isGstVerified")}
                            />
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-row justify-between gap-2 sm:gap-4 mt-6 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearMessages}
                        >
                            Clear
                        </Button>
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            variant="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : (isEditMode ? "Update Profile" : "Create Profile")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (isLargeDevice) {
        return (
            <SignUpLayoutForLarge
                heading={isEditMode ? "Edit Company Profile" : "Create Company Profile"}
                subheading={isEditMode ? "Update your company recruiter profile information." : "Set up your company recruiter profile to start posting jobs and internships."}
            >
                <FormContent />
            </SignUpLayoutForLarge>
        )
    } else {
        return (
            <SignUpLayoutForSmall
                title={isEditMode ? "Edit Company Profile" : "Create Company Profile"}
                subtitle={isEditMode ? "Update your company recruiter profile information." : "Set up your company recruiter profile to start posting jobs and internships."}
                showIllustration={false}
            >
                <FormContent />
            </SignUpLayoutForSmall>
        )
    }

} 