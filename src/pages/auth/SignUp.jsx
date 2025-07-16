import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import WebsiteLogo from "../../assets/WebsiteLogo.svg";
import { FcGoogle } from "react-icons/fc";
import { Input, Button, Link, PhoneInput } from "../../components/ui";

const BASE_URL = import.meta.env.VITE_BASE_URL;
console.log("BASE_URL:", BASE_URL); // should print: http://localhost:5000

const companyDomains = [".com", ".org", ".net", ".co", ".io", ".tech", ".in"];

const schema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" }),
    lastName: z
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
    userRole: z.enum(["COMPANY", "STUDENT", "UNIVERSITY"], {
      required_error: "Role is required",
    }),
  })
  .refine(
    (data) => {
      if (data.userRole === "COMPANY") {
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
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      userRole: selectedRole,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        userRole: data.userRole,
      });
      if (response.status === 201) {
        // Store user data in localStorage after successful registration
        const userData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          userRole: data.userRole,
          phone: data.phone
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem("token", response.data.token);

        // After successful registration, send OTP to email
        try {
          const otpResponse = await axios.post(`${BASE_URL}/otp/send-otp`, {
            email: data.email,
          });
          if (otpResponse.status === 200) {
            alert("Registration successful! OTP sent to your email.");
            // Navigate to OTP verification page with email
            navigate("/signup-verify-otp-email", {
              state: {
                email: data.email,
                userRole: data.userRole
              }
            });
          } else {
            alert("Registration successful but failed to send OTP. Please try again.");
          }
        } catch (otpError) {
          console.error("OTP sending error:", otpError);
          alert("Registration successful but failed to send OTP. Please try again.");
        }
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.selectedRole) {
      navigate("/signup-choose-role");
    }
  }, [location.state, navigate]);

  return (
    <div className="w-full min-h-screen  overflow-hidden relative">
      {/* Mobile Background Pattern */}
      <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-blue-100/30 via-blue-50/20 to-indigo-100/30 z-0" />

      {/* Logo */}
      <div className="absolute top-4 left-2 sm:top-6 sm:left-4 md:top-8 md:left-6 lg:top-8 lg:left-8 z-30">
        <Link to="/" className="text-xl sm:text-2xl font-bold text-white tracking-wide hover:opacity-80 transition-opacity">
          <img src={WebsiteLogo} alt="Logo" className="w-10 h-10" />
        </Link>
      </div>

      {/* Fixed Top Decorative Section - Only covers top section for mobile/tablet, half height for desktop */}
      <div className="absolute top-0 left-0 w-full h-48 sm:h-56 md:h-64 lg:h-[50vh] bg-[#6EB5DD66] z-0 pointer-events-none" />

      {/* Fixed SVG Divider - Only for desktop */}
      <div className="absolute top-[40vh] left-0 w-full z-10 pointer-events-none hidden lg:block">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q720,100 1440,0 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col lg:flex-row items-start justify-start max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-12 md:py-16 gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-x-2 mt-12 sm:mt-16 md:mt-20 lg:mt-12 lg:mt-16 lg:mt-20">
        {/* Left Section - Desktop Only */}
        <div className="hidden ml-14 lg:flex flex-1 flex-col items-center lg:items-start text-center lg:text-left space-y-2 sm:space-y-3 lg:sticky lg:top-28">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black">
            Sign Up
          </h1>
          <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 max-w-md">
            Create an account to contunue!.
          </p>
          <img
            src={SignUpIllustration}
            alt="Sign Up Illustration"
            className="w-40 sm:w-48 md:w-56 lg:w-64 mt-1 sm:mt-2 hidden lg:block"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1  w-full flex flex-col items-center justify-center">
          {/* Heading and Subheading for mobile/tablet only */}
          <div className="block lg:hidden flex flex-col mb-12 sm:mb-16 md:mb-20 w-full items-start text-left">
            <h1 className="text-2xl font-bold text-black mb-1">Sign Up</h1>
            <p className="text-sm text-gray-700">Create an account to contunue!.</p>
          </div>

          {/* Form */}
          <div className="flex-1 w-full flex justify-center">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white mt-4 rounded-lg shadow-none sm:shadow-md p-4 sm:p-6 w-full max-w-full sm:max-w-sm md:max-w-md"
            >
              <input
                type="hidden"
                {...register("userRole")}
                value={selectedRole}
              />

              {/* First Name and Last Name in one row */}
              <div className="flex gap-1 sm:gap-2">
                <div className="flex-1">
                  <Input
                    label="First Name"
                    type="text"
                    placeholder="First Name"
                    error={errors.firstName?.message}
                    variant={errors.firstName ? "error" : "default"}
                    disabled={loading}
                    {...register("firstName")}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Last Name"
                    type="text"
                    placeholder="Last Name"
                    error={errors.lastName?.message}
                    variant={errors.lastName ? "error" : "default"}
                    disabled={loading}
                    {...register("lastName")}
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
                  Company emails must use professional domains (.com, .org,
                  .net, etc.)
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
      </div>
    </div>
  );
}
