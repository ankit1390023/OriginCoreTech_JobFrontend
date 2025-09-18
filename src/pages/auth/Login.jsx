import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../../components/layout/AuthLayout";
import { Input, Button, Link } from "../../components/ui";
import { login, loginWithGoogle } from "../../redux/feature/authSlice";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ Validation schema
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  remember: z.coerce.boolean().optional(),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", remember: false },
  });

  // Prefill email (from localStorage OR state passed via navigation)
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("userEmail");
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setValue("email", stateEmail);
    } else if (rememberedEmail) {
      setValue("email", rememberedEmail);
    }
  }, [setValue, location.state]);

  useEffect(() => {
    if (user?.profile_status === 0) {
      // Send OTP and redirect to verify page
      axios
        .post(`${BASE_URL}/otp/send-otp`, { email: user.email })
        .then(() => {
          navigate("/login-verify-otp-email", {
            state: { email: user.email, user_role: user.user_role },
            replace: true,
          });
        })
        .catch(() => alert("Failed to send OTP"));
    }
  }, [isAuthenticated, user, navigate]);

  //  Handle submit
  const onSubmit = (data) => {
    if (data.remember) {
      localStorage.setItem("userEmail", data.email);
    } else {
      localStorage.removeItem("userEmail");
    }
    dispatch(login({ email: data.email, password: data.password }));
  };


useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const googleToken = urlParams.get('google_token');
  const googleUser = urlParams.get('google_user');

  if (googleToken && googleUser) {
    try {
      const user = JSON.parse(decodeURIComponent(googleUser));

      // Save to localStorage — same keys as your login thunk
      localStorage.setItem("authToken", googleToken);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(loginWithGoogle({ token: googleToken, user }));

      // PublicRoute handle redirect
      navigate("/", { replace: true });

    } catch (err) {
      console.error("Google login parse error:", err);
      navigate('/login', { replace: true });
    }
  }
}, [navigate,dispatch]);
  const showSignUpLink = !isAuthenticated || user?.profile_status === 0;

  return (
    <AuthLayout
      title="Sign in to your account"
      subtitle={
        showSignUpLink ? (
          <>
            Don&apos;t have an account?{" "}
            <Link to="/signup-choose-role" variant="primary">
              Sign Up
            </Link>
          </>
        ) : null
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-full p-0 bg-white rounded-none shadow-none md:p-4 md:rounded-lg md:shadow-md md:max-w-md md:mx-auto"
      >
        {/* Email */}
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          variant={errors.email ? "error" : "default"}
          {...register("email")}
        />

        {/* Password */}
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          variant={errors.password ? "error" : "default"}
          {...register("password")}
        />

        {/* Remember + Forgot Password */}
        <div className="flex flex-row items-center justify-between gap-1 mb-2 sm:mb-3 sm:gap-0">
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

        {/* Submit */}
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full mb-2 sm:mb-3"
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>

        {/* Error */}
        {error && (
          <div className="p-2 mb-2 text-xs text-center text-red-500 rounded-md sm:mb-3 bg-red-50 sm:p-3">
            {error}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center my-2 sm:my-3">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-1.5 sm:mx-2 text-gray-400 text-xs font-medium">
            Or
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Button */}
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => {
            window.location.href = `${BASE_URL}/users/google`;
          }}
          className="flex items-center justify-center w-full shadow-none hover:shadow-none"
        >
          <FcGoogle size={14} className="mr-1.5" />
          <span className="text-xs">Continue with Google</span>
        </Button>

        {/* OTP Button */}
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          as={Link}
          to="/login-send-otp-email"
          className="flex items-center justify-center w-full mt-2 shadow-none hover:shadow-none"
        >
          <span className="text-xs">Login with OTP</span>
        </Button>
      </form>
    </AuthLayout>
  );
}
