import React, { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import AuthLayout from "./authLayout";

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
      const response = await axios.post(`${BASE_URL}/verify-otp`, data);

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
    <AuthLayout
      title="Verify Your Email"
      subtitle="Create an account to continue!"
      showIllustration={false}
    >
      <div className="flex-1 w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          <div className="mb-2 sm:mb-3">
            <p className="text-gray-600 text-xs mb-2">
              One Time Password (OTP) has been sent to your email on
              amangupta@gmail.com
            </p>

            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              Enter OTP to verify your email
            </label>
            <input
              type="text"
              {...register("otp")}
              onChange={handleOtpChange}
              className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 text-center font-semibold tracking-widest ${errors.otp ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="0000"
              maxLength={4}
              disabled={loading}
            />
            {errors.otp && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.otp.message}
              </span>
            )}
            {!errors.otp && (
              <span className="text-xs text-gray-500 mt-0.5 block">
                Enter the 4-digit verification code
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || watchedOtp.length !== 4}
            className={`w-full py-1.5 sm:py-2 rounded-md font-semibold text-xs mb-2 sm:mb-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${loading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : watchedOtp.length === 4
                ? "bg-[#f44336] text-white hover:bg-[#d32f2f]"
                : "bg-gray-400 text-white cursor-not-allowed"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-1">
                <FaSpinner className="animate-spin h-3 w-3" />
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Help Text */}
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              <FaEnvelope className="inline mr-1 text-gray-400" />
              Can't find our email? Check spam folders or promotion tabs too!
            </p>
          </div>

          {/* Login Link */}
          <div className="text-center mt-2 pt-2 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-red-500 font-semibold hover:text-red-600 transition-colors duration-200"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
