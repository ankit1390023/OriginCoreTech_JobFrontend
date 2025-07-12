import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./authLayout";

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
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userRole", response.data.user.role);
      localStorage.setItem("userEmail", response.data.user.email);
      // console.log("userId from login", response.data.user.id);
      // console.log("from login", response.data.token);
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
        className="w-full bg-white p-0 rounded-none shadow-none max-w-full md:p-4 md:rounded-lg md:shadow-md md:max-w-md md:mx-auto"
      >
        <div className="mb-2 sm:mb-3">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-0.5 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="mb-2 sm:mb-3">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="text-xs text-red-500 mt-0.5 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
          <label className="flex items-center text-[10px] cursor-pointer space-x-1">
            <input
              type="checkbox"
              {...register("remember")}
              className="w-3 h-3 text-red-500 border-gray-300 rounded focus:ring-red-400 focus:ring-1"
            />
            <span className="text-gray-700">Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-red-500 text-xs hover:text-red-600 hover:underline transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-1.5 sm:py-2 rounded-md font-semibold text-xs mb-2 sm:mb-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${loading
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
              Logging in...
            </span>
          ) : (
            "Log In"
          )}
        </button>

        {loginError && (
          <div className="text-xs text-red-500 mb-2 sm:mb-3 text-center bg-red-50 p-2 sm:p-3 rounded-md">
            {loginError}
          </div>
        )}

        <div className="flex items-center my-2 sm:my-3">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-1.5 sm:mx-2 text-gray-400 text-xs font-medium">Or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button
          type="button"
          disabled={loading}
          className={`w-full flex items-center justify-center border border-gray-300 py-1.5 sm:py-2 rounded-md font-semibold text-gray-700 bg-white transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
        >
          <FcGoogle size={14} className="mr-1.5" />
          <span className="text-xs">Continue with Google</span>
        </button>



        <button
          type="button"
          disabled={loading}
          className={`w-full border mt-2 border-gray-300 py-1 sm:py-2 rounded-md font-semibold text-gray-700 bg-white transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
        >
          <span className="text-xs">Login with OTP</span>
        </button>
      </form>
    </AuthLayout>
  );
}
