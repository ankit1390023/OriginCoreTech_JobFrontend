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
      <div className="flex-1 w-full min-h-[14rem] flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-4 w-full max-w-xs sm:max-w-sm md:max-w-md"
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
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.email.message}
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
                Sending OTP...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
