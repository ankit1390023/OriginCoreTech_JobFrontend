import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import StudentSignUpLayout from "../student/studentFillAccountDetails/StudentSignUpLayout";
import { FcGoogle } from "react-icons/fc";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
        alert("Signup successful!");
        navigate("/send-otp-email");
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
      ``
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.state?.selectedRole) {
      navigate("/signup-choose-role");
    }
  }, [location.state, navigate]);

  return (
    <StudentSignUpLayout
      heading="Create a New Account"
      subheading="Join us and find your dream job or recruit talented candidates."
      illustration={SignUpIllustration}
    >

      <div className="flex-1 w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        >
          <input
            type="hidden"
            {...register("userRole")}
            value={selectedRole}
          />

          {/* First Name */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 sm:mb-3">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              className={`w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm sm:text-base transition-all duration-200 ${errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="First Name"
              disabled={loading}
            />
            {errors.firstName && (
              <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2 block">
                {errors.firstName.message}
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 sm:mb-3">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              className={`w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm sm:text-base transition-all duration-200 ${errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Last Name"
              disabled={loading}
            />
            {errors.lastName && (
              <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2 block">
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 sm:mb-3">Phone Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 sm:px-4 border border-r-0 border-gray-300 bg-gray-50 rounded-l-xl text-gray-600 text-sm sm:text-base">
                <img
                  src="https://flagcdn.com/in.svg"
                  alt="IN"
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                />
                +91
              </span>
              <input
                type="text"
                {...register("phone")}
                className={`w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border rounded-r-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm sm:text-base transition-all duration-200 ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                placeholder="9876543210"
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2 block">
                {errors.phone.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 sm:mb-3">Email ID</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm sm:text-base transition-all duration-200 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Email"
              disabled={loading}
            />
            {errors.email && (
              <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2 block flex items-center">
                <span className="mr-1">⚠️</span>
                {errors.email.message}
              </span>
            )}
            {selectedRole && selectedRole.toUpperCase() === "COMPANY" && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                Company emails must use professional domains (.com, .org,
                .net, etc.)
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <label className="block text-gray-700 text-sm sm:text-base font-semibold mb-2 sm:mb-3">Password</label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm sm:text-base transition-all duration-200 ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                }`}
              placeholder="Password"
              disabled={loading}
            />
            {errors.password && (
              <span className="text-xs sm:text-sm text-red-500 mt-1 sm:mt-2 block">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Terms */}
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            By signing up, you agree to our{" "}
            <span className="font-semibold text-gray-700">
              Terms and Conditions
            </span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 sm:py-3 md:py-4 rounded-xl font-semibold text-sm sm:text-base md:text-lg mb-4 sm:mb-6 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#f44336] text-white hover:bg-[#d32f2f]"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Register"
            )}
          </button>

          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-3 sm:mx-4 text-gray-400 text-sm sm:text-base font-medium">Or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <button
            type="button"
            disabled={loading}
            className={`w-full flex items-center justify-center border border-gray-300 py-2.5 sm:py-3 md:py-4 rounded-xl font-semibold text-gray-700 bg-white transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
          >
            <FcGoogle size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            <span className="text-sm sm:text-base">Sign up with Google</span>
          </button>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-6 sm:mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 font-semibold hover:text-red-600 transition-colors duration-200">
              Login
            </Link>
          </p>

          <p className="text-center text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
            <Link
              to="/signup-choose-role"
              className="text-red-500 font-semibold hover:text-red-600 transition-colors duration-200"
            >
              ← Choose different role
            </Link>
          </p>
        </form>
      </div>
    </StudentSignUpLayout>
  );
}
