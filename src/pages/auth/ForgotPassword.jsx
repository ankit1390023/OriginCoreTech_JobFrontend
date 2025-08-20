import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { Input, Button, Link, SuccessMessage, ErrorMessage } from "../../components/ui";


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

  // Get logged-in user's email from localStorage
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("userEmail");
    console.log("rememberedEmail", rememberedEmail);    
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
    } else {
      setValue("email", "");
    }
  }, [setValue]);

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
          <Link to="/login" variant="primary">
            Sign In
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-full sm:max-w-sm md:max-w-md"
      >
        {/* Email Input - Using new UI component */}
        <Input
          label="Email Address"
          type="email"
          placeholder="example@gmail.com"
          error={errors.email?.message}
          variant={errors.email ? "error" : "default"}
          {...register("email")}
        />

        {/* Get OTP Button - Using new UI component */}
        <Button
          type="button"
          onClick={handleGetOtp}
          loading={otpLoading}
          disabled={otpLoading}
          className="w-full mb-2 sm:mb-3"
        >
          {otpLoading ? "Sending OTP..." : "Get OTP"}
        </Button>

        {/* OTP Input - Using new UI component */}
        <Input
          label="Enter OTP to verify your Email"
          type="text"
          placeholder="Enter 4-digit OTP"
          maxLength={4}
          error={errors.otp?.message || otpError}
          variant={errors.otp || otpError ? "error" : "default"}
          {...register("otp")}
        />

        {/* Success message for OTP - Using new UI component */}
        {otpSent && (
          <SuccessMessage className="mt-0.5 mb-2 sm:mb-3">
            OTP sent successfully! Check your email.
          </SuccessMessage>
        )}

        {/* New Password Input - Using new UI component */}
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          error={errors.newPassword?.message}
          variant={errors.newPassword ? "error" : "default"}
          {...register("newPassword")}
        />

        {/* Retype Password Input - Using new UI component */}
        <Input
          label="Retype Password"
          type="password"
          placeholder="Confirm new password"
          error={errors.retypePassword?.message}
          variant={errors.retypePassword ? "error" : "default"}
          {...register("retypePassword")}
        />

        {/* Save Changes Button - Using new UI component */}
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

        {/* Error and Success Messages - Using new UI components */}
        {saveError && (
          <ErrorMessage className="mt-2 sm:mt-3">
            {saveError}
          </ErrorMessage>
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
