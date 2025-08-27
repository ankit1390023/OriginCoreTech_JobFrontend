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
 
const steps = [
  "Personal Info",
  "Education Info",
  "Your Skills",
  "Your Preferences",
];
 
// Validation schema for PersonalInfo step
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
 
// Validation schema for EducationInfo step
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
 
// Validation schema for Preferences step
const preferencesSchema = z.object({
  currently_looking_for: z.array(z.string()).optional(),
  work_mode: z.array(z.string()).optional(),
});
 
// Combined schema for all steps
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
 
  // Get user_id from Redux state
  const user_id = user?.id;
 
  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, [user, token, navigate]);
 
  const onNext = async () => {
    // Skip validation on Skills step (step 2) since it doesn't have registered fields
    if (step === 2) {
      setStep((s) => s + 1);
      return;
    }
 
    // Define fields to validate for each step
    const stepFields = {
      0: ["first_name", "last_name", "email", "phone", "dob", "current_location_id", "gender"],
      1: ["type"], // Basic validation for type, other fields are conditional
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
 
    setIsSubmitting(true);
    console.log("Setting isSubmitting to true");
 
    try {
      console.log("Getting form values...");
      const formData = methods.getValues();
      console.log("Raw form data:", formData);
 
      // Validate required fields before proceeding
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !formData.phone ||
        !formData.dob ||
        !formData.current_location_id ||
        !formData.gender
      ) {
        alert(
          "Please fill in all required fields: First Name, Last Name, Email, Phone, Date of Birth, Current Location, and Gender."
        );
        setIsSubmitting(false);
        return;
      }
 
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }
 
      // Validate phone format (basic validation)
      const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(formData.phone)) {
        alert("Please enter a valid phone number (at least 10 digits).");
        setIsSubmitting(false);
        return;
      }
 
      // Prepare the data structure for the API based on original backend structure
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
        // Add default values for optional fields
        languages: "",
        about_us: "",
        career_objective: "",
        resume: "",
        language: "",
        is_email_verified: false,
        is_phone_verified: false,
        is_gst_verified: false,
        user_profile_pic: "",
        aadhaarNumber: "",
        aadhaarCardFile: "",
        isAadhaarVerified: false,
      };
 
      // Add education fields based on user type
      if (formData.type === "School Student") {
        userData.educationStandard = formData.standard || "";
        // Validate required fields for school students
        if (!formData.standard) {
          alert("Please select your education standard.");
          setIsSubmitting(false);
          return;
        }
      } else if (
        formData.type === "College Student" ||
        formData.type === "Fresher"
      ) {
        // Validate required fields for college students/freshers
        if (!formData.course) {
          alert("Please select your course.");
          setIsSubmitting(false);
          return;
        }
 
        // Find course ID by name
        const selectedCourse = educationData?.courses?.find(
          (course) => course.name === formData.course
        );
        // Find specialization ID by name
        const selectedSpecialization = educationData?.specializations?.find(
          (spec) => spec.name === formData.specialization
        );
        // Find college ID by name
        const selectedCollege = educationData?.schoolColleges?.find(
          (college) => college.name === formData.college
        );
 
        // Only set IDs if they exist to avoid sending null/undefined values
        if (selectedCourse?.id) {
          userData.course_id = selectedCourse.id;
        } else {
          console.warn("Course ID not found for:", formData.course);
        }
 
        if (selectedSpecialization?.id) {
          userData.specialization_id = selectedSpecialization.id;
        } else if (formData.specialization) {
          console.warn(
            "Specialization ID not found for:",
            formData.specialization
          );
        }
 
        if (selectedCollege?.id) {
          userData.college_id = selectedCollege.id;
        } else if (formData.college) {
          console.warn("College ID not found for:", formData.college);
        }
 
        userData.course = formData.course || ""; // Keep name for backward compatibility
        userData.specialization = formData.specialization || ""; // Keep name for backward compatibility
        userData.college_name = formData.college || "";
        userData.start_year = formData.start_year || "";
        userData.end_year = formData.end_year || "";
      } else if (formData.type === "Working Professional") {
        // Add working professional specific fields
        userData.jobLocation = formData.current_location_id; // Using current_location_id as job location
        userData.salary_details = formData.salary || "";
 
        // Handle array fields from PreferencesForm properly
        if (
          Array.isArray(formData.currently_looking_for) &&
          formData.currently_looking_for.length > 0
        ) {
          userData.currently_looking_for =
            formData.currently_looking_for.join(", ");
        } else {
          userData.currently_looking_for = "";
        }
 
        if (
          Array.isArray(formData.work_mode) &&
          formData.work_mode.length > 0
        ) {
          userData.work_mode = formData.work_mode.join(", ");
        } else {
          userData.work_mode = "";
        }
 
        // Add experience data if available
        if (formData.company && formData.jobRole) {
          userData.experiences.push({
            current_job_role: formData.jobRole.trim(),
            current_company: formData.company.trim(),
            totalExperience: formData.experience || "1-2 years",
          });
        }
      }
 
      // Handle preferences for all user types
      if (
        Array.isArray(formData.currently_looking_for) &&
        formData.currently_looking_for.length > 0
      ) {
        userData.currently_looking_for =
          formData.currently_looking_for.join(", ");
      } else if (!userData.currently_looking_for) {
        userData.currently_looking_for = "";
      }
 
      if (Array.isArray(formData.work_mode) && formData.work_mode.length > 0) {
        userData.work_mode = formData.work_mode.join(", ");
      } else if (!userData.work_mode) {
        userData.work_mode = "";
      }
 
      // Remove any undefined or null values from userData
      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(
          ([key, value]) =>
            value !== undefined && value !== null && value !== ""
        )
      );
 
      // Ensure required fields are present
      const requiredFields = [
        "first_name",
        "last_name",
        "email",
        "phone",
        "dob",
        "current_location_id",
        "gender",
        "user_type",
      ];
      const missingFields = requiredFields.filter(
        (field) => !cleanUserData[field]
      );
 
      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(", ")}`);
        setIsSubmitting(false);
        return;
      }
 
      // Log the userData being sent for debugging
      console.log(
        "Form Data being sent:",
        JSON.stringify(cleanUserData, null, 2)
      );
      console.log("Education Data available:", educationData);
      console.log("User ID:", user_id);
      console.log("Token available:", !!token);
 
      // Check if user details already exist
      console.log("Checking if user details exist...");
      const { exists } = await userDetailsApi.checkUserDetailsExist(user_id);
      console.log("User details exist:", exists);
 
      let response;
      if (exists) {
        // Update existing user details
        console.log("Updating existing user details...");
        response = await userDetailsApi.updateUserDetails(
          user_id,
          cleanUserData,
          token
        );
      } else {
        // Create new user details
        console.log("Creating new user details...");
        response = await userDetailsApi.createUserDetails(cleanUserData, token);
      }
      console.log("API response:", response);
 
      alert("Form submitted successfully!");
      // Redirect to feed page after successful submission
      navigate("/feed");
    } catch (error) {
      // Log detailed error information for debugging
      console.error("Form submission error:", error);
      console.error(
        "Error response data:",
        JSON.stringify(error.response?.data, null, 2)
      );
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      console.error("Full error response:", error.response);
 
      // Show specific error message from backend
      let errorMessage = "Error submitting form. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = `Validation Error: ${error.response.data.error}`;
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
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
 
  // Show loading if user data is not available
  if (!user || !token) {
    return (
      <SignUpLayoutForLarge
        heading="Let's Get Started!"
        subheading="Create an account to continue!"
      >
        <div className="flex-1 w-full flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </SignUpLayoutForLarge>
    );
  }
 
  // Render different layouts based on device size
  return (
    <SignUpLayoutForLarge
      heading="Let's Get Started!"
      subheading="Create an account to continue!"
    >
      <FormContent />
    </SignUpLayoutForLarge>
  );
}