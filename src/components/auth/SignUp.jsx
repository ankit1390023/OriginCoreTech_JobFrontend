import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import { FcGoogle } from "react-icons/fc";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

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
      const response = await axios.post(`${baseUrl}/users/register`, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        userRole: data.userRole,
      });
      alert("Signup successful!");
      if (response.status === 201) {
        navigate("/send-otp-email");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        alert(
          "Network error: Please check if the backend server is running on http://localhost:5000"
        );
      } else {
        alert("Network error");
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
    <div className="w-full min-h-screen bg-white overflow-hidden relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          YourLogo
        </span>
      </div>

      <div className="absolute top-0 left-0 w-full h-[50%] bg-[#6EB5DD66] z-0" />

      <div className="absolute top-1/2 left-0 w-full z-10 -translate-y-1/2">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q720,100 1440,0 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>

      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-4 sm:px-4 lg:px-6 py-16 gap-y-10 gap-x-6">
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            Sign Up
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 max-w-md">
            Create an account to continue!
          </p>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800">{roleLabel}</p>
          </div>
          <img
            src={SignUpIllustration}
            alt="Sign Up Illustration"
            className="w-52 sm:w-64 md:w-72 lg:w-80 mt-4"
          />
        </div>

        <div className="flex-1 w-full flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-xl shadow-lg p-10 w-full max-w-md"
          >
            <input
              type="hidden"
              {...register("userRole")}
              value={selectedRole}
            />

            {/* First Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                {...register("firstName")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="First Name"
                disabled={loading}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                {...register("lastName")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Last Name"
                disabled={loading}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600">
                  <img
                    src="https://flagcdn.com/in.svg"
                    alt="IN"
                    className="w-5 h-5 mr-1"
                  />
                  +91
                </span>
                <input
                  type="text"
                  {...register("phone")}
                  className={`w-full px-4 py-2 border rounded-r-lg focus:outline-none ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="9876543210"
                  disabled={loading}
                />
              </div>
              {errors.phone && (
                <span className="text-red-500 text-sm">
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email ID</label>
              <input
                type="email"
                {...register("email")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email"
                disabled={loading}
              />
              {errors.email && (
                <span className="text-red-500 text-sm flex items-center mt-1">
                  <span className="mr-1">⚠️</span>
                  {errors.email.message}
                </span>
              )}
              {selectedRole && selectedRole.toUpperCase() === "COMPANY" && (
                <p className="text-xs text-gray-500 mt-1">
                  Company emails must use professional domains (.com, .org,
                  .net, etc.)
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Password"
                disabled={loading}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 mb-4">
              By signing up, you agree to our{" "}
              <span className="font-semibold text-gray-700">
                Terms and Conditions
              </span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold text-lg mb-4 transition ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#f44336] text-white hover:bg-[#d32f2f]"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-2 text-gray-400">Or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <button
              type="button"
              disabled={loading}
              className={`w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg font-semibold text-gray-700 bg-white transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              <FcGoogle size={20} className="sm:w-6 sm:h-6 mr-2" />
              Sign up with Google
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-semibold">
                Login
              </Link>
            </p>

            <p className="text-center text-sm text-gray-600 mt-2">
              <Link
                to="/signup-choose-role"
                className="text-blue-600 font-semibold"
              >
                ← Choose different role
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
