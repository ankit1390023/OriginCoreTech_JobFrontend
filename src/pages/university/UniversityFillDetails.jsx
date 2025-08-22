import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SignUpLayout from "../../components/layout/SignUpLayout";
import { FcGoogle } from "react-icons/fc";
import {
  Input,
  Textarea,
  Button,
  ErrorMessage,
  Link,
} from "../../components/ui";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const schema = z.object({
  college_name: z
    .string()
    .min(2, { message: "College name must be at least 2 characters" }),
  course: z.string().min(1, { message: "Course is required" }),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters" }),
  pincode: z
    .string()
    .length(6, { message: "Pincode must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "Pincode must contain only numbers" }),
  website_link: z.string().url({ message: "Please enter a valid website URL" }),
  about: z
    .string()
    .min(20, { message: "About section must be at least 20 characters" }),
  social_media_link: z
    .string()
    .url({ message: "Please enter a valid social media URL" })
    .optional()
    .or(z.literal("")),
});

export default function UniversityFillDetails() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Add state to track if device is small
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 1024); // lg breakpoint
    };
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/universitydetail`, {
        ...data,
        email_id_verified: true,
        adhar_verified: false,
        phone_verified: false,
      });

      console.log("University details saved:", response.data);
      // Redirect to home or dashboard after successful submission
      navigate("/");
    } catch (error) {
      console.error("Error saving university details:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to save university details. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const FormContent = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <ErrorMessage onClose={() => setError("")}>{error}</ErrorMessage>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="College/University Name"
          required
          placeholder="Enter your college/university name"
          error={errors.college_name?.message}
          {...register("college_name")}
        />

        <Input
          label="Course/Program"
          required
          placeholder="e.g., BTech, MTech, MBA, etc."
          error={errors.course?.message}
          {...register("course")}
        />

        <Textarea
          label="Address"
          required
          placeholder="Enter complete address"
          error={errors.address?.message}
          {...register("address")}
        />

        <Input
          label="Pincode"
          required
          placeholder="Enter 6-digit pincode"
          maxLength={6}
          error={errors.pincode?.message}
          {...register("pincode")}
        />

        <Input
          label="Website Link"
          required
          type="url"
          placeholder="https://www.youruniversity.edu"
          error={errors.website_link?.message}
          {...register("website_link")}
        />

        <Textarea
          label="About University"
          required
          placeholder="Tell us about your university, its mission, and what makes it special..."
          error={errors.about?.message}
          {...register("about")}
        />

        <Input
          label="Social Media Link (Optional)"
          type="url"
          placeholder="https://linkedin.com/company/youruniversity"
          error={errors.social_media_link?.message}
          {...register("social_media_link")}
        />

        <Button
          variant="secondary"
          loading={loading}
          disabled={loading}
          className="w-full"
          type="submit"
        >
          {loading ? "Saving..." : "Save University Details"}
        </Button>

        <div className="flex items-center my-4 sm:my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 sm:mx-4 text-gray-400 text-sm sm:text-base font-medium">
            Or
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <Button
          variant="outline"
          disabled={loading}
          className="w-full flex items-center justify-center"
          type="button"
        >
          <FcGoogle size={20} className="sm:w-6 sm:h-6 mr-2 sm:mr-3" />
          <span className="text-sm sm:text-base">Sign up with Google</span>
        </Button>

        <p className="text-center text-sm sm:text-base text-gray-600 mt-6 sm:mt-8">
          Already have an account?{" "}
          <Link to="/login" variant="primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );

  // Replace layout logic with SignUpLayout for all devices
  return (
    <SignUpLayout
      heading="University Details"
      subheading="Complete your university profile!"
      hideMobileIllustration={isSmallDevice}
      centerMobileContent={false}
    >
      <FormContent />
    </SignUpLayout>
  );
}
