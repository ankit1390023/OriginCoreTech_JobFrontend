import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import { Input, Button, Link, ErrorMessage } from "../../components/ui";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function SendOtpEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const navigate = useNavigate();

  // Get logged-in user's email from localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setValue("email", userEmail);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setOtpError("");
    try {
      const response = await axios.post(`${BASE_URL}/otp/send-otp`, {
        email: data.email,
      });
      console.log("OTP sent successfully:", response.data);
      alert("OTP sent successfully, please check your email");
      // You can redirect or show success message here
      navigate("/verify-otp-email");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log(error.response.data.message);
        setOtpError(error.response.data.message);
      } else {
        setOtpError("Network error");
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
      <div className="flex-1 w-full min-h-[14rem] flex justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-md p-2 sm:p-3 md:p-4 w-full max-w-xs sm:max-w-sm md:max-w-md"
        >
          {/* Email Input - Using new UI component */}
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            variant={errors.email ? "error" : "default"}
            size="small"
            {...register("email")}
          />

          {/* Error message display - Using new UI component */}
          {otpError && (
            <ErrorMessage size="small" className="mb-1 sm:mb-2">
              {otpError}
            </ErrorMessage>
          )}

          {/* Submit Button - Using new UI component */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            size="small"
            className="w-full mb-1 sm:mb-2"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
