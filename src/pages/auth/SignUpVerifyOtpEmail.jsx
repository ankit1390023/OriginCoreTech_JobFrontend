import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle, FaEnvelope, FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import axios from "axios";
import { Input, Button, Link } from "../../components/ui";

import SignUpLayoutForLarge from "../../components/layout/SignUpLayoutForLarge";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
// Zod schema for OTP validation
const otpSchema = z.object({
  otp1: z.string().length(1, { message: "Required" }).regex(/^\d$/, { message: "Must be a digit" }),
  otp2: z.string().length(1, { message: "Required" }).regex(/^\d$/, { message: "Must be a digit" }),
  otp3: z.string().length(1, { message: "Required" }).regex(/^\d$/, { message: "Must be a digit" }),
  otp4: z.string().length(1, { message: "Required" }).regex(/^\d$/, { message: "Must be a digit" }),
});

export default function SignUpVerifyOtpEmail() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();


  useEffect(() => {
    // Try to get email from userData object first (from SignUp)
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData.email) {
          setEmail(parsedUserData.email);
          return;
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }

  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
    },
  });

  const watchedOtp1 = watch("otp1");
  const watchedOtp2 = watch("otp2");
  const watchedOtp3 = watch("otp3");
  const watchedOtp4 = watch("otp4");

  // Combine OTP digits for submission
  const getFullOtp = () => {
    return watchedOtp1 + watchedOtp2 + watchedOtp3 + watchedOtp4;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setOtpError("");
    try {
      const response = await axios.post(`${BASE_URL}/otp/verify-otp`, {
        email: email,
        otp: getFullOtp(),
      });
      console.log("OTP verification success:", response);
      console.log("OTP verification success:", response.data);

      // Role-based redirection
      const userRole = response.data.userRole;
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
        setOtpError(error.response.data.message);
      } else {
        setOtpError("Network error");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleOtpInputChange = (index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(0, 1);
    setValue(`otp${index + 1}`, digit);

    // Auto-focus to next input if digit is entered
    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !watchedOtp1 && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);

    if (pastedData.length === 4) {
      setValue("otp1", pastedData[0]);
      setValue("otp2", pastedData[1]);
      setValue("otp3", pastedData[2]);
      setValue("otp4", pastedData[3]);
      inputRefs[3].current?.focus();
    }
  };


  // Form content component
  const FormContent = () => (
    <div className="w-full min-h-screen flex md:items-center md:justify-center overflow-hidden relative sm:-mt-16">

      {/* Form */}
      <div className="flex-1 w-full flex justify-center mt-6 md:mt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-sm sm:shadow-md p-4 sm:p-6 w-full max-w-full sm:max-w-sm md:max-w-md"
        >
          <div className="mb-2 sm:mb-3">
            <p className="text-gray-600 text-xs mb-2">
              One Time Password (OTP) has been sent to your email on
              <span className="font-bold text-blue-500 ml-1">{email ? email : "amangupta@gmail.com"}</span>
            </p>
            {/* OTP Input - 4 separate boxes */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP to verify your email
              </label>
              <div className="flex gap-2 justify-center">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex-1">
                    <input
                      ref={inputRefs[index]}
                      type="text"
                      maxLength={1}
                      disabled={loading}
                      className={`w-full h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`otp${index + 1}`]
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                      placeholder="0"
                      {...register(`otp${index + 1}`)}
                      onChange={(e) => handleOtpInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                    />
                  </div>
                ))}
              </div>
              {(errors.otp1 || errors.otp2 || errors.otp3 || errors.otp4) && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid 4-digit OTP
                </p>
              )}
              {!errors.otp1 && !errors.otp2 && !errors.otp3 && !errors.otp4 && (
                <span className="text-xs text-gray-500 mt-0.5 block">
                  Enter the 4-digit verification code
                </span>
              )}
            </div>
          </div>
          {/* Submit Button - Using new UI component */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading || getFullOtp().length !== 4}
            className="w-full mb-2 sm:mb-3"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
          {/* Help Text */}
          <div className="mt-2 p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              <FaEnvelope className="inline mr-1 text-gray-400" />
              Can't find our email? Check spam folders or promotion tabs too!
            </p>
          </div>
          {/* Login Link - Using new UI component */}
          <div className="text-center mt-2 pt-2 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Already have an account?{" "}
              <Link
                to="/login"
                variant="primary"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <SignUpLayoutForLarge
      heading="Verify Your Email"
      subheading="Create an account to continue!"
      hideMobileIllustration={true}
    >
      <FormContent />
    </SignUpLayoutForLarge>
  );


}
