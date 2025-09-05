import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import PersonalInfo from "./PersonalInfo";
import EducationInfo from "./EducationInfo";
import ProgressBar from "./ProgressBar";
import SkillsForm from "./SkillsForm";
import PreferencesForm from "./PreferencesForm";
import Button from "../../../components/ui/Button";
import SignUpLayoutForLarge from "../../../components/layout/SignUpLayoutForLarge";
import { useNavigate } from "react-router-dom";
import { useUserDetailsApi } from "../../../hooks/useUserDetailsApi";
import { userDetailsApi } from "../../../api/userDetailsApi";

const steps = ["Personal Info", "Education Info", "Your Skills", "Your Preferences"];

const personalInfoSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  last_name: z.string().min(1, { message: "Last Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^[+]?[\d\s\-()]+$/, { message: "Invalid phone number format" }),
  dob: z.string().min(1, { message: "Date of Birth is required" }),
  current_location_id: z.string().min(1, { message: "Current city is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
});

const educationInfoSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  standard: z.string().optional(), // School students
  course: z.string().optional(), // College/freshers
  specialization: z.number().optional(),
  college_id: z.number().optional(), // 👈 fixed
  start_year: z.string().optional(),
  end_year: z.string().optional(),
  experience_years: z.number().optional(), // 👈 fixed
  job_id: z.number().optional(), // 👈 fixed
  company_name: z.string().optional(), // 👈 fixed
  salary: z.string().optional(),
});

const preferencesSchema = z.object({
  currently_looking_for: z.array(z.string()).optional(),
  work_mode: z.array(z.string()).optional(),
});

const domainsSchema = z.object({
  domains: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z.string().optional(),
        // company: z.string().optional(),
        // authority_id: z.string().optional(),
        authority_id: z.union([z.string(), z.number()]).optional(),
        certificate: z.array(z.string().url()).optional(),
        certificateName: z.string().optional(),
        skills: z
          .array(
            z.object({
              skill_id: z.number(),
              skill_name: z.string().optional(),
            })
          )
          .min(1, {
            message: "Please select at least one skill for each domain",
          }),
      })
    )
    .min(1, { message: "Please add at least one domain" }),
});

// Combined schema
const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...educationInfoSchema.shape,
  ...preferencesSchema.shape,
  ...domainsSchema.shape,
});


export default function StudentFillAccountDetails() {
  const { createUserDetails } = useUserDetailsApi();
  const { user } = useSelector((state) => state.auth);

  const methods = useForm({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_location_id: "",
      gender: "",
      type: "",
      currently_looking_for: [],
      work_mode: [],
      domains: [],
    },
  });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // const handleSubmitClick = async () => {
  //   setIsSubmitting(true);
  //   setSubmitError(null);

  //   try {
  //     console.log("=== FORM SUBMISSION STARTED ===");
  //     let formData = methods.getValues();
  //     formData = {
  //       ...formData,
  //       domains: formData.domains.map(({ certificateName, ...rest }) => rest),
  //     };
  //     // Ensure schema validation runs
  //     const isValid = await methods.trigger();
  //     if (!isValid) {
  //       console.warn("Validation failed. Fix errors before submitting.");
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     console.log("Final form data:", JSON.stringify(formData, null, 2));

     
   
  //     let response;
  //     response = await createUserDetails(formData, user.token);

  //     console.log("API response:", response);
  //     alert("Form submitted successfully!");
  //     navigate("/all-jobs");
  //   } catch (error) {
  //     console.error("Form submission error:", error);

  //     let errorMessage = "Error submitting form. Please try again.";
  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.response?.data?.error) {
  //       errorMessage = `Validation Error: ${error.response.data.error}`;
  //     } else if (error.response?.data) {
  //       errorMessage = `Server Error: ${JSON.stringify(error.response.data)}`;
  //     }

  //     setSubmitError(errorMessage);
  //     alert(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };



// const handleSubmitClick = async () => {
//   setIsSubmitting(true);
//   setSubmitError(null);

//   try {
//     console.log("=== FORM SUBMISSION STARTED ===");
//     let formData = methods.getValues();
    
//     // Validate that each domain has authority_id
//     const domainsWithMissingAuthority = formData.domains?.filter(domain => 
//       !domain.authority_id || domain.authority_id === ""
//     );
    
//     if (domainsWithMissingAuthority?.length > 0) {
//       setSubmitError("Please select a company/authority for all domains");
//       setIsSubmitting(false);
//       return;
//     }
    
//     // Transform domains into skills array for backend
//     const skills = [];
//     if (formData.domains) {
//       formData.domains.forEach(domain => {
//         if (domain.skills && domain.authority_id) {
//           domain.skills.forEach(skill => {
//             skills.push({
//               authority_id: domain.authority_id,
//               skill_id: skill.skill_id
//             });
//           });
//         }
//       });
//     }
    
//     // Add skills array to formData
//     formData = {
//       ...formData,
//       skills: skills,
//       domains: formData.domains.map(({ certificateName, ...rest }) => rest),
//     };
    
//     // Ensure schema validation runs
//     const isValid = await methods.trigger();
//     if (!isValid) {
//       console.warn("Validation failed. Fix errors before submitting.");
//       setIsSubmitting(false);
//       return;
//     }

//     console.log("Final form data:", JSON.stringify(formData, null, 2));

//     let response;
//     response = await createUserDetails(formData, user.token);

//     console.log("API response:", response);
//     alert("Form submitted successfully!");
//     navigate("/all-jobs");
//   } catch (error) {
//     console.error("Form submission error:", error);

//     let errorMessage = "Error submitting form. Please try again.";
//     if (error.response?.data?.message) {
//       errorMessage = error.response.data.message;
//     } else if (error.response?.data?.error) {
//       errorMessage = `Validation Error: ${error.response.data.error}`;
//     } else if (error.response?.data) {
//       errorMessage = `Server Error: ${JSON.stringify(error.response.data)}`;
//     }

//     setSubmitError(errorMessage);
//     alert(errorMessage);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


const handleSubmitClick = async () => {
  setIsSubmitting(true);
  setSubmitError(null);

  try {
    console.log("=== FORM SUBMISSION STARTED ===");
    let formData = methods.getValues();

    // Validate that each domain has authority_id
    const domainsWithMissingAuthority = formData.domains?.filter(
      (domain) =>
        domain.authority_id === null ||
        domain.authority_id === undefined ||
        domain.authority_id === ""
    );

    if (domainsWithMissingAuthority?.length > 0) {
      setSubmitError("Please select a company/authority for all domains");
      setIsSubmitting(false);
      return;
    }

    // Transform domains into skills array for backend
    const skills = [];
    if (formData.domains) {
      formData.domains.forEach((domain) => {
        if (domain.skills && domain.authority_id) {
          domain.skills.forEach((skill) => {
            skills.push({
              authority_id: Number(domain.authority_id), // ✅ Ensure it's a number
              skill_id: skill.skill_id,
            });
          });
        }
      });
    }

    // Add skills array to formData
    formData = {
      ...formData,
      skills: skills, // ✅ Flat skills array at root level
      domains: formData.domains.map(
        ({ certificateName, authority_id, ...rest }) => rest
      ), // ✅ Remove authority_id from domains
    };

    // Ensure schema validation runs
    const isValid = await methods.trigger();
    if (!isValid) {
      console.warn("Validation failed. Fix errors before submitting.");
      setIsSubmitting(false);
      return;
    }

    console.log("Final form data:", JSON.stringify(formData, null, 2));

    let response;
    response = await createUserDetails(formData, user.token);

    console.log("API response:", response);
    alert("Form submitted successfully!");
    navigate("/all-jobs");
  } catch (error) {
    console.error("Form submission error:", error);

    let errorMessage = "Error submitting form. Please try again.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = `Validation Error: ${error.response.data.error}`;
    } else if (error.response?.data) {
      errorMessage = `Server Error: ${JSON.stringify(error.response.data)}`;
    }

    setSubmitError(errorMessage);
    alert(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};







  const onSubmit = async () => {
    return handleSubmitClick();
  };

  const [step, setStep] = useState(0);

  const onNext = async () => {
    const formData = methods.getValues();

    const stepFields = {
      0: ["first_name", "last_name", "email", "phone", "dob", "current_location_id", "gender"],
      1: ["type"],
      2: ["domains"],
      3: ["currently_looking_for", "work_mode"],
    };

    // Add dynamic validation for Education Info
    if (step === 1) {
      const type = formData.type;
      if (type === "School Student") {
        stepFields[1].push("standard");
      } else if (type === "College Student" || type === "Fresher") {
        stepFields[1].push("course", "college_id", "specialization", "start_year", "end_year");
      } else if (type === "Working Professional") {
        stepFields[1].push("experience_years", "job_id", "company_name", "start_year", "end_year");
      }
    }

    const valid = await methods.trigger(stepFields[step] || []);
    if (!valid) return;

    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onBack = () => setStep((s) => s - 1);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      console.log("Form data updated:", value);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const FormContent = () => (
    <div className="flex-1 w-full flex justify-center">
      <div className="bg-white rounded-xl shadow-none sm:shadow-xl w-full mt-4 max-w-full sm:max-w-2xl p-6 sm:p-8">
        <div className="-mt-2 mb-6">
          <ProgressBar currentStep={step} steps={steps} />
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {step === 0 && <PersonalInfo />}
            {step === 1 && <EducationInfo />}
            {step === 2 && <SkillsForm />}
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
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

  return (
    <SignUpLayoutForLarge
      heading="Let's Get Started!"
      subheading="Fill in your account details to continue"
    >
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      <FormContent />
    </SignUpLayoutForLarge>
  );
}