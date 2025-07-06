import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LoginIllustration from "../../assets/Login_Illustration.png";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional(),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setLoading(true);
    setLoginError("");
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email: data.email,
        password: data.password,
      });
      console.log("Login success:", response.data);
      localStorage.setItem("token", response.data.token);
      console.log("from login", response.data.token);
      alert("Login successful!");
      navigate("/send-otp-email");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("Network error");
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
              <Link to="/signup-choose-role" className="text-red-400 hover:underline font-medium">
                Sign Up
              </Link>
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

        {/* Right Side: Login Form */}
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

            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className="text-xs text-red-500 mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="mr-2"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-500 text-sm hover:underline"
              >
                Forgot Password ?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg mb-4 transition-colors text-base sm:text-lg ${loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {loginError && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {loginError}
              </div>
            )}

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-2 text-gray-400 text-sm">Or</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 sm:py-3 rounded-lg mb-3 hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <FcGoogle size={20} className="sm:w-6 sm:h-6" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className="w-full border border-gray-300 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              Login with OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
