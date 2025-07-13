import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";
import EducationInfo from "./EducationInfo";
import ProgressBar from "./ProgressBar";
import StudentSignUpLayout from "./StudentSignUpLayout";
import SkillsForm from "./SkillsForm";
import PreferencesForm from "./PreferencesForm";
import { userDetailsApi } from "../../../api/userDetailsApi";
import { Button } from "../../../components/ui";

const steps = [
  "Personal Info",
  "Education Info",
  "Your Skills",
  "Your Preferences",
];

// Validation schema for PersonalInfo step
const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
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
  city: z.string().min(1, { message: "Current city is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
});

// Combined schema for all steps
const formSchema = z.object({
  ...personalInfoSchema.shape,
  // Add other step schemas here as needed
});

export default function StudentFillAccountDetails() {
  const methods = useForm({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
  });
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onNext = async () => {
    console.log("onNext called, current step:", step);
    // Skip validation on Skills step (step 3) since it doesn't have registered fields
    if (step === 3) {
      console.log("Skipping validation for Skills step");
      setStep((s) => s + 1);
      return;
    }

    // Define which fields to validate for each step
    const stepFields = {
      0: ["firstName", "lastName", "email", "phone", "dob", "city", "gender"], // PersonalInfo
      1: [], // EducationInfo - add fields when implemented
      2: [], // PreferencesForm - add fields when implemented
    };

    const fieldsToValidate = stepFields[step] || [];
    const valid = await methods.trigger(fieldsToValidate);
    console.log("Validation result:", valid);
    if (valid && step < steps.length - 1) setStep((s) => s + 1);
  };
  const onBack = () => setStep((s) => s - 1);

  const handleSubmitClick = async () => {
    console.log("Submit button clicked");
    setIsSubmitting(true);

    try {
      const formData = methods.getValues();
      console.log("Form data:", formData);

      // Get the current user ID from localStorage
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert("User not authenticated. Please log in again.");
        navigate("/login");
        return;
      }

      // Prepare the data structure for the API based on original backend structure
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        city: formData.city,
        gender: formData.gender,
        userType: formData.type || "Working Professional",
        experiences: [],
        // Add default values for optional fields
        languages: "",
        aboutus: "",
        careerObjective: "",
        resume: "",
        language: "",
        isEmailVerified: false,
        isPhoneVerified: false,
        isGstVerified: false,
        userprofilepic: "",
        aadhaarNumber: "",
        aadhaarCardFile: "",
        isAadhaarVerified: false,
      };

      // Add education fields based on user type
      if (formData.type === "School Student") {
        userData.educationStandard = formData.standard;
      } else if (formData.type === "College Student") {
        userData.course = formData.course;
        userData.specialization = formData.specialization;
        userData.collegeName = formData.college;
        userData.startYear = formData.startYear;
        userData.endYear = formData.endYear;
      } else if (formData.type === "Working Professional") {
        // Add working professional specific fields
        userData.jobLocation = formData.city; // Using city as job location
        userData.salaryDetails = formData.salary || "";
        userData.currentlyLookingFor = formData.currentlyLookingFor || "";
        userData.workMode = formData.workMode || "";

        // Add experience data if available
        if (formData.company && formData.startYear) {
          userData.experiences.push({
            currentJobRole: formData.jobRole || "Software Engineer",
            currentCompany: formData.company,
            totalExperience: formData.experience || "1-2 years",
          });
        }
      }

      // Handle array fields from PreferencesForm
      if (
        typeof formData.currentlyLookingFor === "string" &&
        formData.currentlyLookingFor
      ) {
        userData.currentlyLookingFor = formData.currentlyLookingFor
          .split(",")
          .filter((item) => item.trim())
          .join(", ");
      }
      if (typeof formData.workMode === "string" && formData.workMode) {
        userData.workMode = formData.workMode
          .split(",")
          .filter((item) => item.trim())
          .join(", ");
      }

      console.log("Sending data to API:", userData);

      // Check if user details already exist
      const { exists } = await userDetailsApi.checkUserDetailsExist(userId);

      let response;
      if (exists) {
        // Update existing user details
        console.log("User details exist, updating...");
        response = await userDetailsApi.updateUserDetails(userId, userData);
        console.log("Update response:", response);
      } else {
        // Create new user details
        console.log("User details don't exist, creating...");
        response = await userDetailsApi.createUserDetails(userData);
        console.log("Create response:", response);
      }

      alert("Form submitted successfully!");
      // Redirect to all-jobs page after successful submission
      navigate("/all-jobs");
    } catch (error) {
      console.error("Error submitting form:", error);

      // Show specific error message from backend
      let errorMessage = "Error submitting form. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    console.log("onSubmit called, current step:", step);
    // This function should not show the alert anymore
    // It will be called by react-hook-form validation
    return false;
  };

  return (
    <StudentSignUpLayout
      heading="Create a New Account"
      subheading="Join us and find your dream job or recruit talented candidates."
      hideMobileIllustration={true}
    >
      {/* Right Section */}
      <div className="flex-1 w-full flex justify-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 sm:p-8">
          <ProgressBar currentStep={step} steps={steps} />
          <FormProvider {...methods}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submit event prevented");
              }}
            >
              {step === 0 && (
                <PersonalInfo
                  register={methods.register}
                  errors={methods.formState.errors}
                />
              )}
              {step === 1 && (
                <EducationInfo
                  register={methods.register}
                  errors={methods.formState.errors}
                  watch={methods.watch}
                />
              )}
              {step === 2 && <SkillsForm />}
              {step === 3 && <PreferencesForm />}
              <div className="flex justify-between mt-8">
                {step > 0 ? (
                  <Button
                    variant="outline"
                    onClick={onBack}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {step < steps.length - 1 ? (
                  <Button
                    variant="secondary"
                    onClick={onNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={handleSubmitClick}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </StudentSignUpLayout>
  );
}
