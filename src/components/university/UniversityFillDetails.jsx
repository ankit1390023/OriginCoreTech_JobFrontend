import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentSignUpLayout from "../student/studentFillAccountDetails/StudentSignUpLayout";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const schema = z.object({
    collegeName: z.string().min(2, { message: "College name must be at least 2 characters" }),
    course: z.string().min(1, { message: "Course is required" }),
    address: z.string().min(10, { message: "Address must be at least 10 characters" }),
    pincode: z.string().length(6, { message: "Pincode must be exactly 6 digits" }).regex(/^\d{6}$/, { message: "Pincode must contain only numbers" }),
    websiteLink: z.string().url({ message: "Please enter a valid website URL" }),
    about: z.string().min(20, { message: "About section must be at least 20 characters" }),
    socialMediaLink: z.string().url({ message: "Please enter a valid social media URL" }).optional().or(z.literal("")),
});

export default function UniversityFillDetails() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${BASE_URL}/universitydetail`, {
                
                ...data,
                emailIdVerified: true,
                adharVerified: false,
                phoneVerified: false,
            });

            console.log("University details saved:", response.data);
            // Redirect to home or dashboard after successful submission
            navigate("/");
        } catch (error) {
            console.error("Error saving university details:", error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to save university details. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <StudentSignUpLayout
            heading="University Sign Up"
            subheading="Complete your university profile."
        >
                <div className="bg-white rounded-lg shadow-md p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                College/University Name *
                            </label>
                            <input
                                type="text"
                                {...register("collegeName")}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.collegeName ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter your college/university name"
                            />
                            {errors.collegeName && (
                                <span className="text-sm text-red-500 mt-1">
                                    {errors.collegeName.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course/Program *
                            </label>
                            <input
                                type="text"
                                {...register("course")}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.course ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="e.g., BTech, MTech, MBA, etc."
                            />
                            {errors.course && (
                                <span className="text-sm text-red-500 mt-1">
                                    {errors.course.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address *
                            </label>
                            <textarea
                                {...register("address")}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter complete address"
                            />
                            {errors.address && (
                                <span className="text-sm text-red-500 mt-1">
                                    {errors.address.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pincode *
                            </label>
                            <input
                                type="text"
                                {...register("pincode")}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.pincode ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter 6-digit pincode"
                                maxLength={6}
                            />
                            {errors.pincode && (
                                <span className="text-sm text-red-500 mt-1">
                                    {errors.pincode.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website Link *
                            </label>
                            <input
                                type="url"
                                {...register("websiteLink")}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.websiteLink ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="https://www.youruniversity.edu"
                            />
                            {errors.websiteLink && (
                                <span className="text-sm text-red-500 mt-1">
                                    {errors.websiteLink.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                About University *
                            </label>
                            <textarea
                                {...register("about")}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.about ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Tell us about your university, its mission, and what makes it special..."
                            />
                            {errors.about && (
                                <span className="text-sm text-red-500 mt-1">
                                    {errors.about.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Social Media Link (Optional)
                            </label>
                            <input
                                type="url"
                                {...register("socialMediaLink")}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.socialMediaLink ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="https://linkedin.com/company/youruniversity"
                            />
                            {errors.socialMediaLink && (
                                <span className="text-sm text-red-500 mt-1">
                                    {errors.socialMediaLink.message}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Saving..." : "Save University Details"}
                    </button>
                    
                    <div className="flex items-center my-4 sm:my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="mx-3 sm:mx-4 text-gray-400 text-sm sm:text-base font-medium">Or</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        className={`w-full flex items-center justify-center border border-gray-300 py-2.5 sm:py-3 md:py-4 rounded-xl font-semibold text-gray-700 bg-white transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                            }`}
                    >
                        <FcGoogle size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                        <span className="text-sm sm:text-base">Sign up with Google</span>
                    </button>

                    <p className="text-center text-sm sm:text-base text-gray-600 mt-6 sm:mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-red-500 font-semibold hover:text-red-600 transition-colors duration-200">
                            Login
                        </Link>
                    </p>
                    </form>
                </div>
        </StudentSignUpLayout>
    );
} 