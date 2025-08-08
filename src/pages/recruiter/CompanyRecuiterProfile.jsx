import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { recruiterApi } from "../../api/recuiterApi";
import { useNavigate } from "react-router-dom";
import { Input, Textarea, Label, Button, Checkbox } from "../../components/ui";
import SignUpLayout from "../../components/layout/SignUpLayout";
import { useSelector } from "react-redux";

const formSchema = z.object({
    designation: z.string().min(1, { message: "Designation is required" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    about: z.string().min(10, { message: "About section must be at least 10 characters" }),
    logoUrl: z.instanceof(FileList).refine(
        (fileList) => fileList.length == 0 || fileList[0].type.startsWith("image/"),
        { message: "Only image files are allowed" }
    ).optional(),
    profilePic: z.instanceof(FileList).refine(
        (fileList) => fileList.length == 0 || fileList[0].type.startsWith("image/"),
        { message: "Only image files are allowed" }
    ).optional(),
    // hiringPreferences: z.string().optional(),
    // languagesKnown: z.string().optional(),
    isEmailVerified: z.boolean().default(false),
    isPhoneVerified: z.boolean().default(false),
    isGstVerified: z.boolean().default(false),
});

export default function CompanyRecruiterProfile() {
    const [logoPreview, setLogoPreview] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const { token } = useSelector((state) => state.auth); // <-- get token from Redux
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(formSchema),
    })

    const onSubmit = async (data) => {
        try {
            if (!token) {
                alert("Authentication token missing. Please log in again.");
                return;
            }
            const response = await recruiterApi.createProfileWithFileUpload(data, token); // <-- pass token here
            console.log("response from createProfileWithFileUpload", response);
            if (response && response.profile) {
                alert("Profile created successfully");
                reset();
            } else {
                alert("Failed to create profile");
            }
        } catch (error) {
            // Log the backend error details
            if (error.response) {
                console.error("API Error:", error.response.data);
                alert("Error: " + (error.response.data?.message || JSON.stringify(error.response.data)));
            } else {
                alert("An error occurred while creating the profile");
                console.error(error);
            }
        }
    };

    // Handle file input changes for previews
    const handleLogoChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setLogoPreview(null);
        }
    };
    const handleProfilePicChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setProfilePicPreview(URL.createObjectURL(file));
        } else {
            setProfilePicPreview(null);
        }
    };

    const FormContent = () => (
        <div className="bg-white  rounded-xl shadow-md sm:shadow-xl w-full mt-4 max-w-full sm:max-w-2xl p-6 sm:p-8 ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                    <div className="mb-2 sm:mb-3 mt-4">
                        <label htmlFor="logoUrl" className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Company Logo</label>
                        <input
                            id="logoUrl"
                            type="file"
                            accept="image/*"
                            {...register("logoUrl")}
                            className="w-full border rounded-md focus:outline-none transition-all duration-200 px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs border-gray-300 hover:border-gray-400 focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload your company logo (JPG, PNG, GIF - Max 5MB)</p>
                        {errors.logoUrl && <span className="text-xs text-red-500 mt-0.5 block">{errors.logoUrl.message}</span>}
                    </div>

                    {/* Profile Picture Upload */}
                    <div className="mb-2 sm:mb-3 mt-4">
                        <label htmlFor="profilePic" className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Profile Picture</label>
                        <input
                            id="profilePic"
                            type="file"
                            accept="image/*"
                            {...register("profilePic")}
                            className="w-full border rounded-md focus:outline-none transition-all duration-200 px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs border-gray-300 hover:border-gray-400 focus:ring-1 focus:ring-blue-400 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload your profile picture (JPG, PNG, GIF - Max 5MB)</p>
                        {errors.profilePic && <span className="text-xs text-red-500 mt-0.5 block">{errors.profilePic.message}</span>}
                    </div>

                    {/* Hiring Preferences
                    <Textarea
                        label="Hiring Preferences"
                        placeholder="Describe your hiring preferences, ideal candidate qualities..."
                        error={errors.hiringPreferences?.message}
                        {...register("hiringPreferences")}
                    /> */}

                    {/* Languages Known
                    <Input
                        label="Languages Known"
                        placeholder="e.g., English, Hindi, Spanish"
                        error={errors.languagesKnown?.message}
                        {...register("languagesKnown")}
                    /> */}
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
                <div className="flex flex-row justify-end gap-2 sm:gap-4 mt-6 pt-4 border-t border-gray-200">
                    <Button
                        type="submit"
                        loading={isSubmitting}
                        variant="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Create Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );

    return (
        <SignUpLayout
            heading="Create Company Profile"
            subheading="Set up your company recruiter profile to start posting jobs and internships."
            hideMobileIllustration={true}
        >
            <div className="w-full min-h-screen flex md:items-center md:justify-center overflow-hidden relative">
                <div className="flex-1 w-full flex justify-center mt-6 md:mt-0">
                    <FormContent />
                </div>
            </div>
        </SignUpLayout>
    );
}