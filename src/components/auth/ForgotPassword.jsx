import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./authLayout";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const schema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    otp: z.string().min(4, "OTP must be 4 digits").max(4, "OTP must be 4 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    retypePassword: z.string().min(6, "Retype your password"),
  })
  .refine((data) => data.newPassword === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });

export default function ForgotPassword() {
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      retypePassword: "",
    },
  });

  const emailValue = watch("email");

  // Handler for sending OTP
  const handleGetOtp = async () => {
    const email = getValues("email");
    if (!email) {
      setOtpError("Please enter your email address first");
      return;
    }

    setOtpLoading(true);
    setOtpError("");
    setValue("otp", "");
    setOtpSent(false);

    try {
      const response = await axios.post(`${BASE_URL}/otp/send-otp`, {
        email: email,
      });
      // console.log("response from forgot password", response)
      if (response.data.message === "OTP sent successfully") {
        alert("OTP sent successfully! Check your email.");
        setOtpSent(true);
        setOtpError("");
      } else {
        setOtpError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      if (err.response?.data?.message) {
        setOtpError(err.response.data.message);
      } else {
        alert("Failed to send OTP. Please check your email and try again.");
        setOtpError("Failed to send OTP. Please check your email and try again.");
      }
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
      const response = await axios.post(
        `${BASE_URL}/users/resetPasswordWithOtp`,
        {
          email: data.email,
          otp: data.otp,
          newPassword: data.newPassword,
        }
      );
      console.log("response from reset Password", response);
      console.log("response.data.message", response.data.message);
      if (response.data.message === "Password reset successfully") {
        alert("Password changed successfully! You can now login with your new password.");
        setSaveSuccess("Password changed successfully! You can now login with your new password.");
        // Clear form after successful password reset
        setValue("email", "");
        setValue("otp", "");
        setValue("newPassword", "");
        setValue("retypePassword", "");
        setOtpSent(false);

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setSaveError("Failed to reset password. Please try again.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      if (err.response?.data?.message) {
        setSaveError(err.response.data.message);
      } else {
        setSaveError("Failed to reset password. Please check your OTP and try again.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle={
        <>
          Don&apos;t have an account?{" "}
          <a href="/login" className="text-red-400 hover:underline font-medium">
            Sign In
          </a>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        {/* Email */}
        <div className="mb-2 sm:mb-3">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            placeholder="example@gmail.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-0.5 block">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Get OTP Button */}
        <button
          type="button"
          onClick={handleGetOtp}
          className={`w-full py-1.5 sm:py-2 mb-2 sm:mb-3 rounded-md text-white font-semibold text-xs transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${otpLoading
            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
            : "bg-[#f44336] hover:bg-[#d32f2f]"
            }`}
          disabled={otpLoading}
        >
          {otpLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending OTP...
            </span>
          ) : (
            "Get OTP"
          )}
        </button>

        {/* OTP Input */}
        <div className="mb-2 sm:mb-3">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
            Enter OTP to verify your Email
          </label>
          <input
            type="text"
            {...register("otp")}
            className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 ${errors.otp ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            placeholder="Enter 4-digit OTP"
            maxLength={4}
          />
          {errors.otp && (
            <span className="text-xs text-red-500 mt-0.5 block">
              {errors.otp.message}
            </span>
          )}
          {otpError && (
            <span className="text-xs text-red-500 mt-0.5 block">
              {otpError}
            </span>
          )}
          {otpSent && (
            <span className="text-xs text-green-600 mt-0.5 block flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              OTP sent successfully! Check your email.
            </span>
          )}
        </div>

        {/* New Password */}
        <div className="mb-2 sm:mb-3">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              {...register("newPassword")}
              className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 ${errors.newPassword ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Enter new password"
            />
          </div>
          {errors.newPassword && (
            <span className="text-xs text-red-500 mt-0.5 block">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        {/* Retype Password */}
        <div className="mb-2 sm:mb-3">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
            Retype Password
          </label>
          <div className="relative">
            <input
              type="password"
              {...register("retypePassword")}
              className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 ${errors.retypePassword ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Confirm new password"
            />
          </div>
          {errors.retypePassword && (
            <span className="text-xs text-red-500 mt-0.5 block">
              {errors.retypePassword.message}
            </span>
          )}
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-full py-1.5 sm:py-2 rounded-md text-white font-semibold text-xs transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${saveLoading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-[#f44336] hover:bg-[#d32f2f]"
              }`}
            disabled={saveLoading}
          >
            {saveLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {saveError && (
          <div className="text-xs text-red-500 mt-2 sm:mt-3 text-center bg-red-50 p-2 sm:p-3 rounded-md">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="text-xs text-green-600 mt-2 sm:mt-3 text-center bg-green-50 p-2 sm:p-3 rounded-md flex items-center justify-center">
            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {saveSuccess}
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
