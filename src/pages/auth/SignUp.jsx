import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import StudentSignUpLayout from "../student/studentFillAccountDetails/StudentSignUpLayout";
import { FcGoogle } from "react-icons/fc";
import { Input, Button, Link } from "../../components/ui";

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
      heading="Sign Up"
      subheading="Create an account to contunue!."
      illustration={SignUpIllustration}
    >
      <div className="flex-1 w-full flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          <input
            type="hidden"
            {...register("userRole")}
            value={selectedRole}
          />

          {/* First Name and Last Name in one row */}
          <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
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
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Phone Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-1.5 sm:px-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md text-gray-600 text-xs">
                <img
                  src="https://flagcdn.com/in.svg"
                  alt="IN"
                  className="w-3 h-3 mr-1"
                />
                +91
              </span>
              <input
                type="text"
                {...register("phone")}
                className={`w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent text-xs transition-all duration-200 ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
                placeholder="9876543210"
                disabled={loading}
              />
            </div>
            {errors.phone && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.phone.message}
              </span>
            )}
          </div>

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
    </StudentSignUpLayout>
  );
}
