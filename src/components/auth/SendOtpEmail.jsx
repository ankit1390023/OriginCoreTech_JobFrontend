import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LoginIllustration from "../../assets/Login_Illustration.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function SendOtpEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setOtpError("");
    try {
      const response = await axios.post(`${BASE_URL}/otp/send-otp`, {
        email: data.email,
      });
      console.log("OTP sent successfully:", response.data);
      // You can redirect or show success message here
      navigate("/verify-otp-email");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
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
              Sign in to your account
            </h2>
            <p className="text-white text-sm sm:text-base mb-2">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-red-400 hover:underline font-medium">
                Sign Up
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

        {/* Right Side: OTP Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 lg:py-0">
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
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.email.message}
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
              className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg mb-4 transition-colors text-base sm:text-lg ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
