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
          className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg mb-4 transition-colors text-base sm:text-lg ${loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </AuthLayout>
  );
}
