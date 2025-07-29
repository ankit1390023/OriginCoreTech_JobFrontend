import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { Input, Button, Link } from "../../components/ui";
import { useDispatch, useSelector } from 'react-redux';
import { login } from "../../redux/feature/authSlice";


const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  remember: z.coerce.boolean().optional(),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  // Prefill email from localStorage if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("userEmail");
    if (rememberedEmail) {
      setValue("email", rememberedEmail);
    }
  }, [setValue]);

  // Redirect after login
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user });
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'STUDENT':
          console.log('Navigating to /student-fill-account-details');
          navigate("/student-fill-account-details");
          break;
        case 'COMPANY':
          console.log('Navigating to /recruiter-post-job-intern-details');
          navigate("/recruiter-post-job-intern-details");
          break;
        case 'UNIVERSITY':
          console.log('Navigating to /university-fill-details');
          navigate("/university-fill-details");
          break;
        default:
          console.log('Navigating to /student-fill-account-details (default)');
          navigate("/student-fill-account-details");
      }
    }
  }, [isAuthenticated, user, navigate]);



  const onSubmit = (data) => {
    console.log('Login form submitted with:', data);
    if (data.remember) {
      localStorage.setItem("userEmail", data.email);
    } else {
      localStorage.removeItem("userEmail");
    }
    dispatch(login({ email: data.email, password: data.password }));
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
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          variant={errors.email ? "error" : "default"}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
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
          <Link to="/forgot-password" variant="primary" className="text-xs">
            Forgot Password?
          </Link>
        </div>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full mb-2 sm:mb-3"
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>
        {error && (
          <div className="text-xs text-red-500 mb-2 sm:mb-3 text-center bg-red-50 p-2 sm:p-3 rounded-md">
            {error}
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
