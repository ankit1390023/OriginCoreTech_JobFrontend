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
      <div className="flex-1 w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-2 sm:p-4 md:p-5 w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          <div className="mb-1 sm:mb-2">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-1.5 sm:px-2 py-1 sm:py-1.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Enter your email"
              defaultValue="Loisbecket@gmail.com"
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.email.message}
              </span>
            )}
          </div>

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
                  className={`w-full h-7 sm:h-8 text-center text-xs font-semibold border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition-all duration-200 ${errors.otp ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
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

          {/* Error message display */}
          {otpError && (
            <div className="text-red-500 text-xs mb-1 sm:mb-2 text-center bg-red-50 p-1.5 rounded-md">
              {otpError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-1 sm:py-1.5 rounded-md font-semibold text-xs mb-1 sm:mb-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#f44336] text-white hover:bg-[#d32f2f]"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
