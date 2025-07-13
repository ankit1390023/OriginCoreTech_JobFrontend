import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./authLayout";
import { Input, Button, Link, ErrorMessage } from "../../components/ui";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z
    .string()
    .length(4, { message: "OTP must be exactly 4 digits" })
    .regex(/^\d{4}$/, { message: "OTP must contain only numbers" }),
});

export default function VerifyOtpEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", otp: "" },
  });

  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const otpValue = watch("otp") || "";
  const navigate = useNavigate();

  // Get logged-in user's email from localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setValue("email", userEmail);
    }
  }, [setValue]);

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

  const onSubmit = async (data) => {
    setLoading(true);
    setOtpError("");
    try {
      const response = await axios.post(`${BASE_URL}/otp/verify-otp`, {
        email: data.email,
        otp: data.otp,
      });
      console.log("OTP verification success:", response);
      console.log("OTP verification success:", response.data);

      // Role-based redirection
      const userRole = response.data.userRole;
      console.log("User role:", userRole);
      switch (userRole) {
        case 'STUDENT':
          navigate("/student-fill-account-details");
          break;
        case 'COMPANY':
          navigate("/recruiter-post-job-intern-details");
          break;
        case 'UNIVERSITY':
          navigate("/university-fill-details");
          break;
        default:
          // Fallback to student page if role is not recognized
          navigate("/student-fill-account-details");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setOtpError(error.response.data.message);
      } else {
        setOtpError("Network error");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup-choose-role" variant="primary">
            Sign Up
          </Link>
        </>
      }
    >
      <div className="flex-1 w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-2 sm:p-4 md:p-5 w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          {/* Email Input - Using new UI component */}
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            variant={errors.email ? "error" : "default"}
            size="small"
            {...register("email")}
          />

          {/* OTP Input Grid */}
          <div className="mb-1 sm:mb-2">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5">
              OTP
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
                  className={`w-full h-7 sm:h-8 text-center text-xs font-semibold border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${errors.otp ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
                  placeholder=""
                />
              ))}
            </div>
            {errors.otp && (
              <span className="text-xs text-red-500 mt-0.5 block text-center">
                {errors.otp.message}
              </span>
            )}
          </div>

          {/* Error message display - Using new UI component */}
          {otpError && (
            <ErrorMessage size="small" className="mb-1 sm:mb-2">
              {otpError}
            </ErrorMessage>
          )}

          {/* Submit Button - Using new UI component */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            size="small"
            className="w-full mb-1 sm:mb-2"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
