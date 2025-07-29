import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { Input, Button, Link } from "../../components/ui";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional(),
});

export default function Login() {
  // Add state to hold the default email
  const [defaultEmail, setDefaultEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage if available
    const userDataString = localStorage.getItem("userData");
    let storedEmail = "";
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        storedEmail = userData.email || "";
      } catch (e) {
        console.error("Failed to parse userData from localStorage", e);
      }
    }
    if (storedEmail) {
      setDefaultEmail(storedEmail);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  // Update form default value when defaultEmail changes
  useEffect(() => {
    if (defaultEmail) {
      reset((prev) => ({ ...prev, email: defaultEmail }));
    }
  }, [defaultEmail, reset]);

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

      // Role-based redirection
      const userRole = response.data.user.role;
      console.log("User role:", userRole);
      switch (userRole) {
        case 'STUDENT':
          navigate("/student-fill-account-details");
          break;
        case 'COMPANY':
          navigate("/recruiter-post-job-intern-details");
          break;
        case 'UNIVERSITY':
          navigate("/university-fill-details");
          break;
        default:
          // Fallback to student page if role is not recognized
          navigate("/student-fill-account-details");
      }
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
          <Link to="/signup-choose-role" variant="primary">
            Sign Up
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white p-0 rounded-none shadow-none max-w-full md:p-4 md:rounded-lg md:shadow-md md:max-w-md md:mx-auto"
      >
        {/* Email Input - Using new UI component */}
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          variant={errors.email ? "error" : "default"}
          {...register("email")}
        // If you want to make it read-only, uncomment the next line:
        // readOnly={!!defaultEmail}
        />

        {/* Password Input - Using new UI component */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          variant={errors.password ? "error" : "default"}
          {...register("password")}
        />

        <div className="flex flex-row items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-0">
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
            variant="primary"
            className="text-xs"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button - Using new UI component */}
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full mb-2 sm:mb-3"
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>

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

        {/* Google Button - Using new UI component */}
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="w-full flex items-center justify-center shadow-none hover:shadow-none"
        >
          <FcGoogle size={14} className="mr-1.5" />
          <span className="text-xs">Continue with Google</span>
        </Button>

        {/* OTP Button - Using new UI component */}
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          as={Link}
          to="/login-send-otp-email"
          className="w-full mt-2 shadow-none hover:shadow-none flex items-center justify-center"
        >
          <span className="text-xs">Login with OTP</span>
        </Button>
      </form>
    </AuthLayout>
  );
}
