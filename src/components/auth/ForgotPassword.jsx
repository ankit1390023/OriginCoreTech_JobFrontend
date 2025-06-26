import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginIllustration from "../../assets/Login_Illustration.png";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const schema = z
  .object({
    emailOrPhone: z.string().min(1, "Email/Phone is required"),
    otp: z.string().min(1, "OTP is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    retypePassword: z.string().min(6, "Retype your password"),
  })
  .refine((data) => data.newPassword === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });

export default function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      emailOrPhone: "",
      otp: "",
      newPassword: "",
      retypePassword: "",
    },
  });

  // Handler for sending OTP
  const handleGetOtp = async () => {
    setOtpLoading(true);
    setOtpError("");
    setValue("otp", "");
    try {
      await axios.post(`${BASE_URL}/otp/send`, {
        emailOrPhone: getValues("emailOrPhone"),
      });
      setOtpSent(true);
    } catch (err) {
      setOtpError("Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handler for saving new password
  const onSubmit = async (data) => {
    setSaveLoading(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      await axios.post(
        `${BASE_URL}/api/otp/reset-password`,
        {
          emailOrPhone: data.emailOrPhone,
          otp: data.otp,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSaveSuccess("Password changed successfully!");
    } catch (err) {
      setSaveError("Failed to reset password.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-white overflow-hidden">
      {/* Logo at top-left */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          YourLogo
        </span>
      </div>

      {/* Top Blue Section */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#072366] z-0" />
      {/* Bottom White Section */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Text and Illustration */}
        <div className="flex-1 flex flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-16 pt-24 sm:pt-28 md:pt-32 lg:pt-28">
          {/* Top-left text in blue section */}
          <div className="text-center lg:text-left mb-8 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Forgot Password
            </h2>
            <p className="text-white text-sm sm:text-base mb-2">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-red-400 hover:underline font-medium">
                Sign In
              </a>
            </p>
          </div>

          {/* Bottom-left illustration in white section */}
          <div className="hidden lg:block lg:pb-12">
            <img
              src={LoginIllustration}
              alt="Login Illustration"
              className="w-[280px] sm:w-[320px] lg:w-[340px] max-w-full rotate-[-90deg]"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 lg:py-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8"
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
          >
            {/* Email/Phone Number */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email/Phone Number
              </label>
              <input
                type="text"
                {...register("emailOrPhone")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${
                  errors.emailOrPhone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="example@gmail.com"
              />
              {errors.emailOrPhone && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.emailOrPhone.message}
                </span>
              )}
            </div>

            {/* Get OTP Button */}
            <button
              type="button"
              onClick={handleGetOtp}
              className="w-full py-2 sm:py-3 mb-4 rounded-lg text-white font-semibold text-sm sm:text-lg bg-gradient-to-r from-[#fa5a3d] to-[#f73c3c] shadow-md hover:opacity-90 transition"
              disabled={otpLoading || !getValues("emailOrPhone")}
              style={{ boxShadow: "0 2px 8px 0 rgba(250, 90, 61, 0.15)" }}
            >
              {otpLoading ? "Sending OTP..." : "Get OTP"}
            </button>

            {/* OTP Input */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Enter OTP to verify your Email/Phone Number
              </label>
              <input
                type="text"
                {...register("otp")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${
                  errors.otp ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter OTP"
              />
              {errors.otp && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.otp.message}
                </span>
              )}
              {otpError && (
                <span className="text-xs text-red-500 mt-1 block">
                  {otpError}
                </span>
              )}
            </div>

            {/* New Password */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                {...register("newPassword")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="********"
              />
              {errors.newPassword && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* Retype Password */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Retype Password
              </label>
              <input
                type="password"
                {...register("retypePassword")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${
                  errors.retypePassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="********"
              />
              {errors.retypePassword && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.retypePassword.message}
                </span>
              )}
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-1/2 py-2 sm:py-3 rounded-full text-white font-semibold text-sm sm:text-lg bg-gradient-to-r from-[#fa5a3d] to-[#f73c3c] shadow-md hover:opacity-90 transition"
                style={{ boxShadow: "0 2px 8px 0 rgba(250, 90, 61, 0.15)" }}
                disabled={saveLoading}
              >
                {saveLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {saveError && (
              <div className="text-xs text-red-500 mt-2 text-center">
                {saveError}
              </div>
            )}
            {saveSuccess && (
              <div className="text-xs text-green-600 mt-2 text-center">
                {saveSuccess}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
