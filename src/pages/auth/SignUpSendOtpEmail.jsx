import React, { useState } from "react";
import { FaCheckCircle, FaEnvelope, FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import AuthLayout from "../../components/layout/AuthLayout";
import { Input, Button, Link } from "../../components/ui";

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

            {/* OTP Input - Using new UI component */}
            <Input
              label="Enter OTP to verify your email"
              type="text"
              placeholder="0000"
              maxLength={4}
              disabled={loading}
              error={errors.otp?.message}
              variant={errors.otp ? "error" : "default"}
              className="text-center font-semibold tracking-widest"
              {...register("otp")}
              onChange={handleOtpChange}
            />

            {!errors.otp && (
              <span className="text-xs text-gray-500 mt-0.5 block">
                Enter the 4-digit verification code
              </span>
            )}
          </div>

          {/* Submit Button - Using new UI component */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading || watchedOtp.length !== 4}
            className="w-full mb-2 sm:mb-3"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>

          {/* Help Text */}
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              <FaEnvelope className="inline mr-1 text-gray-400" />
              Can't find our email? Check spam folders or promotion tabs too!
            </p>
          </div>

          {/* Login Link - Using new UI component */}
          <div className="text-center mt-2 pt-2 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Already have an account?{" "}
              <Link
                to="/login"
                variant="primary"
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
