import React, { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";

// Zod schema for OTP validation
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "OTP must be 4 digits" })
    .max(4, { message: "OTP must be 4 digits" })
    .regex(/^\d{4}$/, { message: "OTP must contain only 4 digits" }),
});

export default function SignUpSendOtpEmail() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const watchedOtp = watch("otp");

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("OTP Data:", data);

    try {
      // Add your OTP verification logic here
      // const response = await axios.post(`${baseUrl}/verify-otp`, data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Email verified successfully!");
      navigate("/studentFillAccountDetails");
      // Navigate to next page or dashboard
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setValue("otp", value.slice(0, 4)); // Limit to 4 digits
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          YourLogo
        </span>
      </div>
      {/* Top Decorative Section */}
      <div className="absolute top-0 left-0 w-full h-[50%] bg-[#6EB5DD66] z-0" />

      {/* SVG Divider */}
      <div className="absolute top-1/2 left-0 w-full z-10 -translate-y-1/2">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q720,100 1440,0 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-4 sm:px-4 lg:px-6 py-16 gap-y-10 gap-x-6 mt-28">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white lg:text-gray-800">
              Verify Your Email
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-medium text-white lg:text-gray-800 max-w-md">
              Create an account to continue!
            </p>
          </div>

          <img
            src={SignUpIllustration}
            alt="Email Verification"
            className="w-52 sm:w-64 md:w-72 lg:w-80 mt-4"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 w-full flex justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
            {/* OTP Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <p className="block text-gray-400">
                One Time Password (OTP) has been sent your email on
                amangupta@gmail.com`
              </p>
              <div>
                <label className="block text-gray-400 font-medium mb-3">
                  Enter OTP to verify your email
                </label>
                <input
                  type="text"
                  {...register("otp")}
                  onChange={handleOtpChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-center text-lg font-semibold tracking-widest ${
                    errors.otp
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  placeholder="0000"
                  maxLength={4}
                  disabled={loading}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-2 text-center flex items-center justify-center">
                    <span className="mr-1">⚠️</span>
                    {errors.otp.message}
                  </p>
                )}
                {!errors.otp && (
                  <p className="text-xs text-gray-500 mt-2">
                    Enter the 4-digit verification code
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || watchedOtp.length !== 4}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : watchedOtp.length === 4
                    ? "bg-[#f44336] text-white hover:bg-[#d32f2f] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FaSpinner className="animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 text-center">
                <FaEnvelope className="inline mr-2 text-gray-400" />
                Can't find our email? Check spam folders or promotion tabs too!
              </p>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
