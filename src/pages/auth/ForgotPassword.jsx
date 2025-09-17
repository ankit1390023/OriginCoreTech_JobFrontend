import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthLayout from "../../components/layout/AuthLayout";
import {
  Input,
  Button,
  Link,
  SuccessMessage,
  ErrorMessage,
} from "../../components/ui";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const schema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    otp: z
      .string()
      .length(4, { message: "OTP must be exactly 4 digits" })
      .regex(/^\d{4}$/, { message: "OTP must contain only numbers" }),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    retypePassword: z.string().min(6, "Retype your password"),
  })
  .refine((data) => data.newPassword === data.retypePassword, {
    message: "Passwords do not match",
    path: ["retypePassword"],
  });

export default function ForgotPassword() {
  const { user } = useSelector((state) => state.auth);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(0); // 30s countdown
  const [resendLoading, setResendLoading] = useState(false);

  const {
    register,
    handleSubmit,
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

  // Get email from Redux user instead of localStorage
  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    } else {
      setValue("email", "");
    }
  }, [user, setValue]);

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const otpValue = watch("otp") || "";

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (value.match(/^\d?$/)) {
      const newOtp = otpValue.split("");
      newOtp[index] = value;
      const otpString = newOtp.join("");
      setValue("otp", otpString);

      // Auto-focus to next input
      if (value && index < 3) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

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
      const response = await axios.post(`${BASE_URL}/users/forgotPassword`, {
        email: email,
      });

      if (response.data.message === "OTP sent to email") {
        alert("OTP sent successfully! Check your email.");
        setOtpSent(true);
        setOtpError("");
        setResendTimer(30);
      } else {
        setOtpError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP send error:", err);
      if (err.response?.data?.message) {
        setOtpError(err.response.data.message);
      } else {
        alert("Failed to send OTP. Please check your email and try again.");
        setOtpError(
          "Failed to send OTP. Please check your email and try again."
        );
      }
    } finally {
      setOtpLoading(false);
    }
  };

  //to resend otp
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Handler for saving new password
  const onSubmit = async (data) => {
    setSaveLoading(true);
    setSaveError("");
    setSaveSuccess("");

    console.log("Resetting password with:", {
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/users/resetPasswordWithOtp`,
        {
          email: data.email,
          otp: data.otp,
          newPassword: data.newPassword,
        }
      );

      if (response.data.message === "Password reset successfully") {
        alert(
          "Password changed successfully! You can now login with your new password."
        );
        setSaveSuccess(
          "Password changed successfully! You can now login with your new password."
        );

        // Clear form after successful password reset
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
        setSaveError(
          "Failed to reset password. Please check your OTP and try again."
        );
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
          <Link to="/login" variant="primary">
            Sign In
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-full p-4 bg-white rounded-lg shadow-md sm:p-6 sm:max-w-sm md:max-w-md"
      >
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          variant={errors.email ? "error" : "default"}
          {...register("email")}
          disabled={!!user?.email} // ✅ lock if from Redux
        />

        {/* Get OTP Button */}
        <Button
          type="button"
          onClick={handleGetOtp}
          loading={otpLoading || resendLoading}
          disabled={otpLoading || resendLoading || (otpSent && resendTimer > 0)}
          className="w-full mb-2 sm:mb-3"
        >
          {otpLoading || resendLoading ? "Sending OTP..." : "Get OTP"}
        </Button>

        {/* OTP Input */}
        {/* OTP Input Grid */}
        <div className="mb-1 sm:mb-2">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5">
            Enter OTP
          </label>
          <div className="grid grid-cols-4 gap-1 sm:gap-2">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                maxLength={1}
                value={otpValue[index] || ""}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder=""
                className={`w-full h-7 sm:h-8 text-center text-xs font-semibold border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                  errors.otp || otpError
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              />
            ))}
          </div>
          {(errors.otp || otpError) && (
            <span className="text-xs text-red-500 mt-0.5 block text-center">
              {errors.otp?.message || otpError}
            </span>
          )}
        </div>

        {/* Success message for OTP */}
        {otpSent && (
          <SuccessMessage className="mt-0.5 mb-2 sm:mb-3">
            OTP sent successfully! Check your email.
          </SuccessMessage>
        )}
        {/* Timer Display */}
        {resendTimer > 0 && (
          <div className="p-2 mb-2 text-center border border-blue-200 rounded-md sm:mb-3 bg-blue-50">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <p className="text-sm text-gray-700">
                Resend OTP available in{" "}
                <span className="text-lg font-bold text-blue-600">
                  {resendTimer}s
                </span>
              </p>
            </div>
            <div className="w-full h-1 mt-2 bg-gray-200 rounded-full"></div>
          </div>
        )}

        {/* Resend OTP Button - Only show when timer is 0 */}
        {resendTimer === 0 && otpSent && (
          <Button
            type="button"
            variant="outline"
            loading={resendLoading}
            disabled={resendLoading}
            size="small"
            className="w-full mb-2 sm:mb-3"
            onClick={handleGetOtp}
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </Button>
        )}

        {/* New Password */}
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          error={errors.newPassword?.message}
          variant={errors.newPassword ? "error" : "default"}
          {...register("newPassword")}
        />
        {!errors.newPassword && (
          <p className="mt-1 mb-2 text-xs text-gray-500">
            Must be 8+ chars with uppercase, lowercase, number, and special
            character.
          </p>
        )}

        {/* Retype Password */}
        <Input
          label="Retype Password"
          type="password"
          placeholder="Confirm new password"
          error={errors.retypePassword?.message}
          variant={errors.retypePassword ? "error" : "default"}
          {...register("retypePassword")}
        />

        {/* Save Changes Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            loading={saveLoading}
            disabled={saveLoading}
            className="w-full"
          >
            {saveLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Error and Success Messages */}
        {saveError && (
          <ErrorMessage className="mt-2 sm:mt-3">{saveError}</ErrorMessage>
        )}
        {saveSuccess && (
          <SuccessMessage className="mt-2 sm:mt-3">
            {saveSuccess}
          </SuccessMessage>
        )}
      </form>
    </AuthLayout>
  );
}
