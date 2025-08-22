import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import WebsiteLogo from "../../assets/WebsiteLogo.svg";
import { FcGoogle } from "react-icons/fc";
import { Input, Button, Link, PhoneInput } from "../../components/ui";
import SignUpLayoutForLarge from "../../components/layout/SignUpLayoutForLarge";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/feature/authSlice";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const companyDomains = [".com", ".org", ".net", ".co", ".io", ".tech", ".in"];

const schema = z
  .object({
    first_name: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" }),
    last_name: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
    email: z
      .string()
      .email({
        message:
          "Please enter a valid email address format (e.g., user@example.com)",
      })
      .refine(
        (email) => {
          // Basic email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        {
          message:
            "Please enter a valid email address format (e.g., user@example.com)",
        }
      ),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    user_role: z.enum(["COMPANY", "STUDENT", "UNIVERSITY"], {
      required_error: "Role is required",
    }),
  })
  .refine(
    (data) => {
      if (data.user_role === "COMPANY") {
        return companyDomains.some((domain) =>
          data.email.toLowerCase().endsWith(domain)
        );
      }
      return true;
    },
    {
      path: ["email"],
      message:
        "Company email must use a professional domain (.com, .org, .net, .co, .io, .tech, .in)",
    }
  );

export default function SignUp() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const selectedRole = location.state?.selectedRole || "STUDENT";
  const roleLabel =
    location.state?.roleLabel || "Sign up as a Student/Professional";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      user_role: selectedRole,
    },
  });

  const onSubmit = async (data) => {
    try {
      // Dispatch signup thunk
      const resultAction = await dispatch(
        signup({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: data.email,
          password: data.password,
          user_role: data.user_role,
        })
      );

      // Check if signup failed (email exists or other error)
      if (signup.rejected.match(resultAction)) {
        // Redux will already set `error` in state
        // Just stop here without sending OTP
        return;
      }

      // ✅ Signup successful → Send OTP
      const otpResponse = await axios.post(`${BASE_URL}/otp/send-otp`, {
        email: data.email,
      });

      if (otpResponse.status === 200) {
        alert("Registration successful! OTP sent to your email.");
        navigate("/signup-verify-otp-email", {
          state: {
            email: data.email,
            user_role: data.user_role,
          },
        });
      } else {
        alert(
          "Registration successful but failed to send OTP. Please try again."
        );
      }
    } catch (otpError) {
      alert(
        "Registration successful but failed to send OTP. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!location.state?.selectedRole) {
      navigate("/signup-choose-role");
    }
  }, [location.state, navigate]);

  return (
    <SignUpLayoutForLarge
      heading="SignUp"
      subheading="Create an account to continue!"
      hideMobileIllustration={true}
    >
      <div className="w-full  px-0 sm:max-w-sm mx-auto flex flex-col items-center justify-center -mt-4 sm:-mt-2">
        {/* Form */}
        <div className="flex-1 w-full flex justify-center mt-6 md:mt-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white mt-4 rounded-lg shadow-none sm:shadow-md p-4 sm:p-6 w-full max-w-full sm:max-w-sm md:max-w-md"
          >
            <input
              type="hidden"
              {...register("user_role")}
              value={selectedRole}
            />
            {/* First Name and Last Name in one row */}
            <div className="flex gap-1 sm:gap-2">
              <div className="flex-1">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  error={errors.first_name?.message}
                  variant={errors.first_name ? "error" : "default"}
                  disabled={loading}
                  {...register("first_name")}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
                  error={errors.last_name?.message}
                  variant={errors.last_name ? "error" : "default"}
                  disabled={loading}
                  {...register("last_name")}
                />
              </div>
            </div>
            {/* Phone Number with country code */}
            <PhoneInput
              label="Phone Number"
              error={errors.phone?.message}
              variant={errors.phone ? "error" : "default"}
              disabled={loading}
              {...register("phone")}
            />
            {/* Email */}
            <Input
              label="Email ID"
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              variant={errors.email ? "error" : "default"}
              disabled={loading}
              {...register("email")}
            />
            {/* Company email hint */}
            {selectedRole && selectedRole.toUpperCase() === "COMPANY" && (
              <p className="text-xs text-gray-500 mt-0.5 mb-2 sm:mb-3">
                Company emails must use professional domains (.com, .org, .net,
                etc.)
              </p>
            )}
            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              variant={errors.password ? "error" : "default"}
              disabled={loading}
              {...register("password")}
            />
            {/* Terms */}
            <p className="text-xs text-gray-500 mb-2 sm:mb-3">
              By signing up, you agree to our{" "}
              <span className="font-semibold text-gray-700">
                Terms and Conditions
              </span>
            </p>
            {/* Submit Button - Using new UI component */}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full mb-2 sm:mb-3"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
            {error && (
              <div className="text-xs text-red-500 mb-2 sm:mb-3 text-center bg-red-50 p-2 sm:p-3 rounded-md">
                {error}
              </div>
            )}
            <div className="flex items-center my-2 sm:my-3">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-1.5 sm:mx-2 text-gray-400 text-xs font-medium">
                Or
              </span>
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
              <span className="text-xs">Sign up with Google</span>
            </Button>
            <p className="text-center text-xs text-gray-600 mt-3 sm:mt-4">
              Already have an account?{" "}
              <Link to="/login" variant="primary">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </SignUpLayoutForLarge>
  );
}
