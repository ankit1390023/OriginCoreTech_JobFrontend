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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
      >
        <div className="mb-4 sm:mb-5">
          <p className="text-gray-600 text-sm mb-4">
            One Time Password (OTP) has been sent to your email on
            amangupta@gmail.com
          </p>

          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Enter OTP to verify your email
          </label>
          <input
            type="text"
            {...register("otp")}
            onChange={handleOtpChange}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base text-center font-semibold tracking-widest ${errors.otp ? "border-red-500" : "border-gray-300"
              }`}
            placeholder="0000"
            maxLength={4}
            disabled={loading}
          />
          {errors.otp && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.otp.message}
            </span>
          )}
          {!errors.otp && (
            <span className="text-xs text-gray-500 mt-1 block">
              Enter the 4-digit verification code
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || watchedOtp.length !== 4}
          className={`w-full py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-lg transition-colors ${loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : watchedOtp.length === 4
              ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
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

        {/* Help Text */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <FaEnvelope className="inline mr-1 text-gray-400" />
            Can't find our email? Check spam folders or promotion tabs too!
          </p>
        </div>

        {/* Login Link */}
        <div className="text-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-xs">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
