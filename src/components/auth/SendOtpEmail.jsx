import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./authLayout";

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
      alert("OTP sent successfully, please check your email");
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
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-10"
        style={{ boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.15)" }}
      >
        <div className="mb-4 sm:mb-5 md:mb-6">
          <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 sm:mb-3">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm sm:text-base transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2 block">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Error message display */}
        {otpError && (
          <div className="text-red-500 text-sm sm:text-base mb-4 sm:mb-6 text-center bg-red-50 p-3 sm:p-4 rounded-xl">
            {otpError}
          </div>
        )}

        <button
          type="submit"
          className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 md:py-4 rounded-xl mb-4 sm:mb-6 transition-all duration-200 text-sm sm:text-base md:text-lg transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending OTP...
            </span>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
