import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./authLayout";

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
          <Link to="/signup-choose-role" className="text-red-400 hover:underline font-medium">
            Sign Up
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
      >
        <div className="mb-4 sm:mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="Enter your email"
            defaultValue="Loisbecket@gmail.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            OTP
          </label>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                maxLength={1}
                value={otpValue[index] || ""}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-full h-10 sm:h-12 text-center text-base sm:text-lg font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder=""
              />
            ))}
          </div>
          {errors.otp && (
            <span className="text-xs text-red-500 mt-2 block text-center">
              {errors.otp.message}
            </span>
          )}
        </div>

        {/* Error message display */}
        {otpError && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {otpError}
          </div>
        )}

        <button
          type="submit"
          className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg mb-4 transition-colors text-base sm:text-lg ${loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </AuthLayout>
  );
}
