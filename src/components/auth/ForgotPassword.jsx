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
        className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
      >
        {/* Email */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="example@gmail.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Get OTP Button */}
        <button
          type="button"
          onClick={handleGetOtp}
          className={`w-full py-2 sm:py-3 mb-4 rounded-lg text-white font-semibold text-sm sm:text-lg transition-colors ${otpLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
          disabled={otpLoading}
        >
          {otpLoading ? "Sending OTP..." : "Get OTP"}
        </button>

        {/* OTP Input */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Enter OTP to verify your Email
          </label>
          <input
            type="text"
            {...register("otp")}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${errors.otp ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter 4-digit OTP"
            maxLength={4}
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
          {otpSent && (
            <span className="text-xs text-green-600 mt-1 block">
              OTP sent successfully! Check your email.
            </span>
          )}
        </div>

        {/* New Password */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              {...register("newPassword")}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base pr-10 ${errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="********"
            />

          </div>
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
          <div className="relative">
            <input
              type="password"
              {...register("retypePassword")}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base pr-10 ${errors.retypePassword ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="********"
            />
          </div>
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
            className={`w-full sm:w-1/2 py-2 sm:py-3 rounded-lg text-white font-semibold text-sm sm:text-lg transition-colors ${saveLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 cursor-pointer"}`}
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
    </AuthLayout>
  );
}
