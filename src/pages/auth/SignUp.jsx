import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { Input, Button, Link, PhoneInput } from "../../components/ui";
import SignUpLayoutForLarge from "../../components/layout/SignUpLayoutForLarge";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/feature/authSlice";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

//  Invalid personal domains (not allowed for COMPANY role)
const invalidDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "protonmail.com",
  "icloud.com",
  "aol.com",
];

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
        message: "Please enter a valid email (e.g., user@company.com)",
      }),
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
        const emailDomain = data.email.split("@")[1]?.toLowerCase();
        return emailDomain && !invalidDomains.includes(emailDomain);
      }
      return true;
    },
    {
      path: ["email"],
      message:
        "Company email must use an official domain (e.g., yourcompany.com)", 
    }
  );

export default function SignUp() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const selectedRole = location.state?.selectedRole || "STUDENT";

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

      if (signup.rejected.match(resultAction)) {
        return; // signup failed
      }

      // Send OTP after signup success
      const otpResponse = await axios.post(`${BASE_URL}/otp/send-otp`, {
        email: data.email,
      });

      if (otpResponse.status === 200) {
        alert("Registration successful! OTP sent to your email.");
        sessionStorage.setItem('inSignupFlow', 'true');
        navigate("/signup-verify-otp-email", {
          state: {
            email: data.email,
            user_role: data.user_role,
            inSignupFlow:true,
          },
        });
      } else {
        alert("Registration successful but failed to send OTP.");
      }
    } catch (err) {
      alert("Registration successful but failed to send OTP. Please try again.");
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
      <div className="flex flex-col items-center justify-center w-full px-0 mx-auto -mt-4 sm:max-w-sm sm:-mt-2">
        <div className="flex justify-center flex-1 w-full mt-6 md:mt-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-full p-4 mt-4 bg-white rounded-lg shadow-none sm:shadow-md sm:p-6 sm:max-w-sm md:max-w-md"
          >
            <input
              type="hidden"
              {...register("user_role")}
              value={selectedRole}
            />

            {/* First + Last Name */}
            <div className="flex gap-1 sm:gap-2">
              <div className="flex-1">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="First Name"
                  error={errors.first_name?.message}
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
                  disabled={loading}
                  {...register("last_name")}
                />
              </div>
            </div>

            {/* Phone */}
            <PhoneInput
              label="Phone Number"
              error={errors.phone?.message}
              disabled={loading}
              {...register("phone")}
            />

            {/* Email */}
            <Input
              label="Email ID"
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              disabled={loading}
              {...register("email")}
            />

            {/* Company hint */}
            {selectedRole === "COMPANY" && (
              <p className="text-xs text-gray-500 mt-0.5 mb-2">
                Company emails must use official domains  
                
              </p>
            )}

            {/* Password */}
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              error={errors.password?.message}
              disabled={loading}
              {...register("password")}
            />

            {/* Terms */}
            <p className="mb-2 text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <span className="font-semibold text-gray-700">
                Terms and Conditions
              </span>
            </p>

            {/* Submit */}
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full mb-2"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>

            {error && (
              <div className="p-2 mb-2 text-xs text-center text-red-500 rounded-md bg-red-50">
                {error}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center my-2">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-2 text-xs font-medium text-gray-400">Or</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google SignUp */}
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              className="flex items-center justify-center w-full"
            >
              <FcGoogle size={14} className="mr-1.5" />
              <span className="text-xs">Sign up with Google</span>
            </Button>

            <p className="mt-3 text-xs text-center text-gray-600">
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

