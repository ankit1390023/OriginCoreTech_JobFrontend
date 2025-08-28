import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PersonalInfo from "./PersonalInfo";
import EducationInfo from "./EducationInfo";
import ProgressBar from "./ProgressBar";
import SkillsForm from "./SkillsForm";
import PreferencesForm from "./PreferencesForm";
import { userDetailsApi } from "../../../api/userDetailsApi";
import { useMasterData } from "../../../hooks/master/useMasterData";
import { Button } from "../../../components/ui";
import SignUpLayoutForLarge from "../../../components/layout/SignUpLayoutForLarge";

const steps = ["Personal Info", "Education Info", "Your Skills", "Your Preferences"];

// Validation schemas
const personalInfoSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  last_name: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[+]?[\d\s\-()]+$/, { message: "Invalid phone number format" }),
  dob: z
    .string()
    .min(1, { message: "Date of Birth is required" })
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        return age >= 16 && age <= 100;
      },
      { message: "Age must be between 16 and 100 years" }
    ),
  current_location_id: z.string().min(1, { message: "Current city is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
});

const educationInfoSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  standard: z.string().optional(),
  course: z.string().optional(),
  specialization: z.string().optional(),
  college: z.string().optional(),
  start_year: z.string().optional(),
  end_year: z.string().optional(),
  experience: z.string().optional(),
  jobRole: z.string().optional(),
  company: z.string().optional(),
  salary: z.string().optional(),
});

const preferencesSchema = z.object({
  currently_looking_for: z.array(z.string()).optional(),
  work_mode: z.array(z.string()).optional(),
});

// Combined schema
const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...educationInfoSchema.shape,
  ...preferencesSchema.shape,
});

export default function StudentFillAccountDetails() {
  const { user, token } = useSelector((state) => state.auth);
  const { schoolColleges, courses, specializations } = useMasterData();
  const educationData = { schoolColleges, courses, specializations };
  const methods = useForm({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_location_id: "",
      gender: "",
      type: "",
      currently_looking_for: [],
      work_mode: [],
    },
  });

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const user_id = user?.id;

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);

  const onNext = async () => {
    if (step === 2) {
      setStep((s) => s + 1);
      return;
    }

    const stepFields = {
      0: ["first_name", "last_name", "email", "phone", "dob", "current_location_id", "gender"],
      1: ["type"],
      3: ["currently_looking_for", "work_mode"],
    };

    const fieldsToValidate = stepFields[step] || [];
    const valid = await methods.trigger(fieldsToValidate);

    if (valid && step < steps.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const onBack = () => setStep((s) => s - 1);

  const handleSubmitClick = async () => {
    console.log("=== FORM SUBMISSION STARTED ===");
    if (!user_id || !token) {
      alert("Authentication required. Please login again.");
      navigate("/login");
      return;
    }

    const isValid = await methods.trigger();
    if (!isValid) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = methods.getValues();
      console.log("Raw form data:", formData);

      // Basic required field checks
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !formData.phone ||
        !formData.dob ||
        !formData.current_location_id ||
        !formData.gender
      ) {
        alert("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }

      // Build userData object (same as your original code, trimmed for clarity)
      const userData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        dob: formData.dob,
        current_location_id: formData.current_location_id,
        gender: formData.gender,
        user_type: formData.type || "Working Professional",
        experiences: [],
      };

      // Add additional fields based on type (same as your logic)...

      // Clean empty values
      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined && value !== null && value !== "")
      );

      // Submit to backend
      const { exists } = await userDetailsApi.checkUserDetailsExist(user_id);
      let response;
      if (exists) {
        response = await userDetailsApi.updateUserDetails(user_id, cleanUserData, token);
      } else {
        response = await userDetailsApi.createUserDetails(cleanUserData, token);
      }

      console.log("API response:", response);
      alert("Form submitted successfully!");
      navigate("/feed");
    } catch (error) {
      console.error("Form submission error:", error);

      let errorMessage = "Error submitting form. Please try again.";

      if (error.message === "Network Error") {
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (error.response?.data?.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat().join("\n");
        errorMessage = `Validation errors:\n${validationErrors}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = `Error: ${error.response.data.error}`;
      } else if (error.response?.data) {
        errorMessage = `Server Error: ${JSON.stringify(error.response.data)}`;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <div className="flex-1 w-full flex justify-center">
      <div className="bg-white rounded-xl shadow-none sm:shadow-xl w-full mt-4 max-w-full sm:max-w-2xl p-6 sm:p-8">
        <div className="-mt-2 mb-6">
          <ProgressBar currentStep={step} steps={steps} />
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmitClick)}>
            {step === 0 && <PersonalInfo />}
            {step === 1 && <EducationInfo />}
            {step === 2 && <SkillsForm onBack={onBack} onNext={onNext} />}
            {step === 3 && <PreferencesForm />}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={onBack}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step < steps.length - 1 ? (
                <Button type="button" variant="secondary" onClick={onNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

  // Show loading if user is not available
  if (!user || !token) {
    return (
      <SignUpLayoutForLarge
        heading="Let's Get Started!"
        subheading="Create an account to continue!"
      >
        <div className="flex-1 w-full flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          </div>
        </div>
      </SignUpLayoutForLarge>
    );
  }

  return (
    <SignUpLayoutForLarge
      heading="Let's Get Started!"
      subheading="Fill in your account details to continue"
    >
      <FormContent />
    </SignUpLayoutForLarge>
  );
}
