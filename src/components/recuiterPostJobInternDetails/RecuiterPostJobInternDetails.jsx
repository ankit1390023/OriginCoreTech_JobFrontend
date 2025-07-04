import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RecruiterPostJobInternLayout from "./RecruiterPostJobInternLayout";
import { jobPostApi } from "../../api/jobPostApi";

const formSchema = z.object({
  opportunityType: z.enum(["Internship", "Job", "Project"]),
  profile: z.string().optional(),
  skills: z.string().min(1, { message: "Skills are required" }),
  internshipType: z.enum(["In office", "Hybrid", "Remote"]).optional(),
  jobType: z.enum(["In office", "Hybrid", "Remote"]).optional(),
  partFullTime: z.enum(["Part-time", "Full-time"]),
  city: z.string().min(1, { message: "City is required" }),
  onlyThisCity: z.boolean().optional(),
  openings: z.string().optional(),
  startDateType: z.enum(["Immediately", "Custom"]).optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  inOfficeDays: z.string().optional(),
  jobTitle: z.string().optional(),
  duration: z.string().optional(),
  responsibilities: z.string().min(1, { message: "Responsibilities required" }),
  preferences: z.string().optional(),
  womenOnly: z.boolean().optional(),
  stipendType: z.enum(["Paid", "Unpaid", "Fixed"]),
  stipendMin: z.string().optional(),
  stipendMax: z.string().optional(),
  stipendMode: z.enum(["Month", "Lump sum"]).optional(),
  incentivesMin: z.string().optional(),
  incentivesMax: z.string().optional(),
  incentivesMode: z.enum(["Month", "Lump sum"]).optional(),
  perks: z.array(z.string()).optional(),
  ppo: z.string().optional(),
  screeningQuestions: z.string().optional(),
  alternatePhone: z.string().optional(),
  phoneContact: z.string().optional(),
  collegeName: z.string().optional(),
  course: z.string().optional(),
}).superRefine((data, ctx) => {
  // Common validation for all opportunity types
  if (!data.skills || data.skills.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Skills are required",
      path: ["skills"]
    });
  }

  if (!data.city || data.city.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "City is required",
      path: ["city"]
    });
  }

  if (!data.responsibilities || data.responsibilities.trim() === "") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Responsibilities are required",
      path: ["responsibilities"]
    });
  }

  if (!data.partFullTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select Part-time or Full-time",
      path: ["partFullTime"]
    });
  }

  // Conditional validation for internship fields
  if (data.opportunityType === "Internship") {
    if (!data.profile || data.profile.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Internship profile is required",
        path: ["profile"]
      });
    }
    if (!data.internshipType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Internship type is required",
        path: ["internshipType"]
      });
    }
    if (!data.startDateType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date type is required",
        path: ["startDateType"]
      });
    }
    if (!data.duration || data.duration.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Internship duration is required",
        path: ["duration"]
      });
    }
    if (!data.openings || data.openings.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Number of openings is required",
        path: ["openings"]
      });
    }

    // Validate custom date range
    if (data.startDateType === "Custom") {
      if (!data.startDateFrom || !data.startDateTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Custom date range is required",
          path: ["startDateFrom"]
        });
      }
      if (new Date(data.startDateFrom) > new Date(data.startDateTo)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date",
          path: ["startDateTo"]
        });
      }
    }

    // Validate stipend for internships
    if (data.stipendType === "Paid") {
      if (!data.stipendMin || !data.stipendMax || data.stipendMin.trim() === "" || data.stipendMax.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Stipend amount is required for paid internships",
          path: ["stipendMin"]
        });
      }
      if (parseInt(data.stipendMin) > parseInt(data.stipendMax)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum stipend must be greater than minimum",
          path: ["stipendMax"]
        });
      }
    }
  }

  // Conditional validation for job fields
  if (data.opportunityType === "Job") {
    if (!data.jobTitle || data.jobTitle.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Job title is required",
        path: ["jobTitle"]
      });
    }
    if (!data.jobType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Job type is required",
        path: ["jobType"]
      });
    }

    // Jobs have fixed pay (stipendMin/stipendMax), not stipend type
    if (!data.stipendMin || !data.stipendMax || data.stipendMin.trim() === "" || data.stipendMax.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fixed pay amount is required",
        path: ["stipendMin"]
      });
    }
    if (parseInt(data.stipendMin) > parseInt(data.stipendMax)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum pay must be greater than minimum",
        path: ["stipendMax"]
      });
    }
  }

  // Conditional validation for project fields
  if (data.opportunityType === "Project") {
    if (!data.jobTitle || data.jobTitle.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project title is required",
        path: ["jobTitle"]
      });
    }
    if (!data.jobType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project type is required",
        path: ["jobType"]
      });
    }
    if (!data.openings || data.openings.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Number of openings is required",
        path: ["openings"]
      });
    }
    if (!data.phoneContact || data.phoneContact.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone contact is required",
        path: ["phoneContact"]
      });
    }

    // Projects have budget (stipendMin/stipendMax)
    if (!data.stipendMin || !data.stipendMax || data.stipendMin.trim() === "" || data.stipendMax.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Project budget is required",
        path: ["stipendMin"]
      });
    }
    if (parseInt(data.stipendMin) > parseInt(data.stipendMax)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum budget must be greater than minimum",
        path: ["stipendMax"]
      });
    }
  }
});

export default function RecruiterPostJobInternDetails() {
  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      opportunityType: "Internship",
      internshipType: "In office",
      jobType: "In office",
      partFullTime: "Part-time",
      startDateType: "Immediately",
      stipendType: "Paid",
      stipendMin: "",
      stipendMax: "",
      stipendMode: "Month",
      incentivesMin: "",
      incentivesMax: "",
      incentivesMode: "Month",
      city: "",
      onlyThisCity: false,
      startDateFrom: "",
      startDateTo: "",
      inOfficeDays: "",
      jobTitle: "",
      profile: "",
      skills: "",
      duration: "",
      responsibilities: "",
      openings: "",
      phoneContact: "",
      alternatePhone: "",
      collegeName: "",
      course: "",
      preferences: "",
      womenOnly: false,
      perks: [],
      screeningQuestions: "",
      ppo: "",
    },
  });

  // State for related skills
  const [relatedSkills, setRelatedSkills] = useState([
    "React.js",
    "Node.js",
    "MongoDB",
    "Express.js",
    "JavaScript"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Dummy skills for suggestions
  const dummySkills = [
    "Python", "Java", "C++", "TypeScript", "Angular", "Vue.js",
    "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS",
    "Git", "REST API", "GraphQL", "Redux", "Next.js", "Tailwind CSS"
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !relatedSkills.includes(newSkill.trim())) {
      const updatedSkills = [...relatedSkills, newSkill.trim()];
      setRelatedSkills(updatedSkills);
      setNewSkill("");
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = relatedSkills.filter(skill => skill !== skillToRemove);
    setRelatedSkills(updatedSkills);
  };

  const handleSuggestionClick = (skill) => {
    if (!relatedSkills.includes(skill)) {
      const updatedSkills = [...relatedSkills, skill];
      setRelatedSkills(updatedSkills);
    }
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const onSubmit = async (data) => {
    try {
      // Check if form is valid before submission
      const isValid = await methods.trigger();


      if (!isValid) {
        // Get specific error messages
        const errorMessages = Object.values(methods.formState.errors)
          .map(error => error?.message)
          .filter(Boolean);


        setErrorMessage(errorMessages.length > 0
          ? errorMessages.join(", ")
          : "Please fill in all required fields correctly.");
        return;
      }


      setIsSubmitting(true);

      // Transform form data to match the exact backend API structure
      const jobPostData = {
        opportunityType: data.opportunityType,
        jobProfile: data.opportunityType === "Internship" ? data.profile : data.jobTitle,
        skillsRequired: data.skills,
        skillRequiredNote: relatedSkills.join(', '), // Convert related skills array to string
        jobType: data.opportunityType === "Internship" ? data.internshipType : data.jobType,
        daysInOffice: data.inOfficeDays ? parseInt(data.inOfficeDays) : null,
        jobTime: data.partFullTime,
        cityChoice: data.city,
        numberOfOpenings: data.openings ? parseInt(data.openings) : null,
        jobDescription: data.responsibilities,
        candidatePreferences: data.preferences || null,
        womenPreferred: data.womenOnly || false,
        stipendType: data.opportunityType === "Job" ? "Fixed" : data.stipendType,
        stipendMin: data.stipendMin ? parseInt(data.stipendMin) : null,
        stipendMax: data.stipendMax ? parseInt(data.stipendMax) : null,
        incentivePerYear: data.incentivesMin && data.incentivesMax ?
          `${data.incentivesMin}-${data.incentivesMax} ${data.incentivesMode || 'Month'}` : null,
        perks: data.perks ? (Array.isArray(data.perks) ? data.perks.join(', ') : data.perks) : null,
        screeningQuestions: data.screeningQuestions || null,
        phoneContact: data.phoneContact || null,
        alternatePhoneNumber: data.alternatePhone || null,
        // Only include internship-specific fields for Internship opportunity type
        ...(data.opportunityType === "Internship" && {
          internshipDuration: data.duration,
          internshipStartDate: data.startDateType === "Immediately" ? "Immediately" : null,
          internshipFromDate: data.startDateType === "Custom" ? data.startDateFrom : null,
          internshipToDate: data.startDateType === "Custom" ? data.startDateTo : null,
          isCustomInternshipDate: data.startDateType === "Custom",
          collegeName: data.collegeName || null,
          course: data.course || null,
        }),
      };
   
      // Get authentication token
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorMessage("Authentication token not found. Please log in again.");
        return;
      }

      // Call the API
      const response = await jobPostApi.createJobPost(jobPostData);

      setSuccessMessage(`${data.opportunityType} posted successfully!`);

      // Reset form after successful submission
      methods.reset();
      setRelatedSkills(["React.js", "Node.js", "MongoDB", "Express.js", "JavaScript"]);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (error) {

      // Handle different types of errors
      if (error.response) {
        const status = error.response.status;
        let errorMessage = "Error posting internship/job";

        if (status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (status === 400) {
          errorMessage = error.response.data?.message || "Invalid data provided. Please check your inputs.";
        } else if (status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = error.response.data?.message || "Error posting internship/job";
        }

        setErrorMessage(errorMessage);
      } else if (error.request) {
        console.error("=== NETWORK ERROR ===");
        setErrorMessage("Network error. Please check your connection and ensure the backend server is running.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Common input styles
  const inputStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const textareaStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical";
  const selectStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white";
  const radioStyles = "w-4 h-4 text-blue-600 border-gray-300 focus:outline-none focus:ring-0";
  const checkboxStyles = "w-4 h-4 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-0";
  const radioContainerStyles = "flex gap-6 p-4 border border-gray-300 rounded-lg bg-white";
  const numberInputStyles = "w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const phoneInputStyles = "flex-1 px-4 py-3 text-base border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const labelStyles = "block text-sm font-semibold text-gray-700 mb-2";
  const errorStyles = "text-red-500 text-sm mt-1";

  // Watch startDateType for conditional rendering
  const startDateType = methods.watch("startDateType");
  // Watch stipendType for conditional rendering
  const stipendType = methods.watch("stipendType");
  // Watch internshipType for conditional rendering
  const internshipType = methods.watch("internshipType");
  // Watch opportunityType for conditional rendering
  const opportunityType = methods.watch("opportunityType");
  // Watch jobType for conditional rendering
  const jobType = methods.watch("jobType");

  // Clear validation errors when opportunity type changes
  const handleOpportunityTypeChange = (e) => {
    const newType = e.target.value;
    methods.setValue("opportunityType", newType);

    // Clear any existing validation errors
    methods.clearErrors();

    // Clear success and error messages
    setSuccessMessage("");
    setErrorMessage("");
  };



  return (
    <RecruiterPostJobInternLayout
      heading="Post Internship/Job"
      subheading="Post your internship/job to attract the best candidates."
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto bg-white rounded-xl"
        >
          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    type="button"
                    onClick={() => setSuccessMessage("")}
                    className="inline-flex text-green-400 hover:text-green-600 focus:outline-none"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    type="button"
                    onClick={() => setErrorMessage("")}
                    className="inline-flex text-red-400 hover:text-red-600 focus:outline-none"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Opportunity Type */}
          <div>
            <label className={labelStyles}>Opportunity type</label>
            <div className={radioContainerStyles}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Internship"
                  className={radioStyles}
                  checked={opportunityType === "Internship"}
                  onChange={handleOpportunityTypeChange}
                />
                <span className="text-base text-gray-700">Internship</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Job"
                  className={radioStyles}
                  checked={opportunityType === "Job"}
                  onChange={handleOpportunityTypeChange}
                />
                <span className="text-base text-gray-700">Job</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Project"
                  className={radioStyles}
                  checked={opportunityType === "Project"}
                  onChange={handleOpportunityTypeChange}
                />
                <span className="text-base text-gray-700">Project</span>
              </label>
            </div>
            <p className={errorStyles}>
              {methods.formState.errors.opportunityType?.message}
            </p>
          </div>

          {/* Job title (only for Job and Project) */}
          {(opportunityType === "Job" || opportunityType === "Project") && (
            <div>
              <label className={labelStyles}>{opportunityType === "Job" ? "Job title" : "Project title"}</label>
              <input
                type="text"
                className={inputStyles}
                placeholder={opportunityType === "Job" ? "e.g. Digital Marketing" : "e.g. Web Development Project"}
                {...methods.register("jobTitle")}
              />
              <p className={errorStyles}>
                {methods.formState.errors.jobTitle?.message}
              </p>
            </div>
          )}

          {/* Internship Profile (only for Internship) */}
          {opportunityType === "Internship" && (
            <div>
              <label className={labelStyles}>
                Internship profile
              </label>
              <input
                type="text"
                className={inputStyles}
                placeholder="e.g. Digital Marketing"
                {...methods.register("profile")}
              />
              <p className={errorStyles}>
                {methods.formState.errors.profile?.message}
              </p>
            </div>
          )}

          {/* Skills Required */}
          <div>
            <label className={labelStyles}>Skills required</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="e.g. SEO, Social Media Marketing, Content Writing"
              {...methods.register("skills")}
            />
            <p className={errorStyles}>
              {methods.formState.errors.skills?.message}
            </p>
          </div>
          {/* related skills you might may know */}
          <div>
            <label className={labelStyles}>Related skills you might may know</label>

            {/* Display existing skills as circular badges */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
              {relatedSkills.map((skill) => (
                <div
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-600 text-lg font-bold leading-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:text-blue-800 hover:outline-none active:outline-none border-none bg-transparent ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Add More button */}
              <button
                type="button"
                onClick={() => setShowAddSkill(true)}
                className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 hover:text-gray-800 transition-colors"
              >
                <span className="text-lg">+</span>
                Add More
              </button>
            </div>

            {/* Add skill input and suggestions */}
            {showAddSkill && (
              <div className="space-y-2 sm:space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill name"
                    className={inputStyles}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto font-medium"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddSkill(false);
                      setNewSkill("");
                    }}
                    className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors w-full sm:w-auto font-medium"
                  >
                    Cancel
                  </button>
                </div>

                {/* Skill suggestions */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {dummySkills
                      .filter(skill => !relatedSkills.includes(skill))
                      .slice(0, 8)
                      .map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleSuggestionClick(skill)}
                          className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Internship Type */}
          {opportunityType === "Internship" && (
            <>
              <div>
                <label className={labelStyles}>Internship type</label>
                <div className={radioContainerStyles}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="In office"
                      className={radioStyles}
                      {...methods.register("internshipType")}
                    />
                    <span className="text-base text-gray-700">In office</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Hybrid"
                      className={radioStyles}
                      {...methods.register("internshipType")}
                    />
                    <span className="text-base text-gray-700">Hybrid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Remote"
                      className={radioStyles}
                      {...methods.register("internshipType")}
                    />
                    <span className="text-base text-gray-700">Remote</span>
                  </label>
                </div>
                <p className={errorStyles}>
                  {methods.formState.errors.internshipType?.message}
                </p>
              </div>
              {/* No. of in-office days in a week (for Hybrid) */}
              {internshipType === "Hybrid" && (
                <div className="my-4">
                  <label className={labelStyles}>No. of in-office days in a week:</label>
                  <div className="flex gap-2 sm:gap-4 md:gap-10">
                    {[1, 2, 3, 4, 5].map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={`w-12 h-12 rounded-full border text-lg font-semibold flex items-center justify-center
                          ${methods.getValues("inOfficeDays") === String(day)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300"}
                          hover:border-blue-400 transition`}
                        onClick={() => methods.setValue("inOfficeDays", String(day), { shouldValidate: true })}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className={errorStyles}>
                    {methods.formState.errors.inOfficeDays?.message}
                  </p>
                </div>
              )}

              {/* Internship start date (only for Internship) */}
              <div>
                <label className={labelStyles}>
                  Internship start date
                </label>
                <div className={radioContainerStyles}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Immediately"
                      className={radioStyles}
                      {...methods.register("startDateType")}
                    />
                    <span className="text-base text-gray-700">Immediately (within 30 days)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Custom"
                      className={radioStyles}
                      {...methods.register("startDateType")}
                    />
                    <span className="text-base text-gray-700">Custom</span>
                  </label>
                </div>
                <p className={errorStyles}>
                  {methods.formState.errors.startDateType?.message}
                </p>
              </div>

              {/* Show date pickers if Custom is selected */}
              {startDateType === "Custom" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                  <div className="flex-1">
                    <label className={labelStyles}>From</label>
                    <input
                      type="date"
                      className={inputStyles}
                      {...methods.register("startDateFrom")}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={labelStyles}>To</label>
                    <input
                      type="date"
                      className={inputStyles}
                      {...methods.register("startDateTo")}
                    />
                  </div>
                </div>
              )}

              {/* Internship duration (only for Internship) */}
              <div>
                <label className={labelStyles}>
                  Internship duration
                </label>
                <input
                  type="text"
                  className={inputStyles}
                  placeholder="e.g. 6 months"
                  {...methods.register("duration")}
                />
                <p className={errorStyles}>
                  {methods.formState.errors.duration?.message}
                </p>
              </div>

              {/* Intern's responsibility (only for Internship) */}
              <div>
                <label className={labelStyles}>
                  Intern's responsibility
                </label>
                <textarea
                  className={textareaStyles}
                  rows={4}
                  placeholder="Selected intern day-to-day responsibilities include..."
                  {...methods.register("responsibilities")}
                />
                <p className={errorStyles}>
                  {methods.formState.errors.responsibilities?.message}
                </p>
              </div>
            </>
          )}

          {/* Job type (only for Job) */}
          {opportunityType === "Job" && (
            <>
              <div>
                <label className={labelStyles}>Job type</label>
                <div className={radioContainerStyles}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="In office"
                      className={radioStyles}
                      {...methods.register("jobType")}
                    />
                    <span className="text-base text-gray-700">In office</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Hybrid"
                      className={radioStyles}
                      {...methods.register("jobType")}
                    />
                    <span className="text-base text-gray-700">Hybrid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Remote"
                      className={radioStyles}
                      {...methods.register("jobType")}
                    />
                    <span className="text-base text-gray-700">Remote</span>
                  </label>
                </div>
                <p className={errorStyles}>
                  {methods.formState.errors.jobType?.message}
                </p>
              </div>



              {/* Job description */}
              <div>
                <label className={labelStyles}>Job description</label>
                <textarea
                  className={textareaStyles}
                  rows={4}
                  placeholder={"Key responsibilities:\n1.\n2.\n3."}
                  {...methods.register("responsibilities")}
                />
                <p className={errorStyles}>
                  {methods.formState.errors.responsibilities?.message}
                </p>
              </div>

              {/* Additional candidate preferences */}
              <div>
                <label className={labelStyles}>Additional candidate preferences</label>
                <textarea
                  className={textareaStyles}
                  rows={3}
                  placeholder="e.g. Candidates pursuing B.Tech. preferred"
                  {...methods.register("preferences")}
                />
              </div>

              {/* Women only checkbox */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  className={checkboxStyles}
                  {...methods.register("womenOnly")}
                />
                <span className="text-base text-gray-700">
                  Allow applications from women who are willing to start/restart their career.
                </span>
              </div>

              {/* Fixed pay (per year) */}
              <div>
                <label className={labelStyles}>Fixed pay (per year)</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Min"
                    min="0"
                    {...methods.register("stipendMin")}
                  />
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Max"
                    min="0"
                    {...methods.register("stipendMax")}
                  />
                </div>
              </div>

              {/* Variables/Incentives (per year) */}
              <div>
                <label className={labelStyles}>Variables/ Incentives (per year)</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Min"
                    min="0"
                    {...methods.register("incentivesMin")}
                  />
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Max"
                    min="0"
                    {...methods.register("incentivesMax")}
                  />
                </div>
              </div>

              {/* Perks (Job-specific) */}
              <div>
                <label className={labelStyles}>Perks: (Select all that apply)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
                  {["5 days a week", "Health Insurance", "Life Insurance"].map((perk) => (
                    <label key={perk} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={perk}
                        className={checkboxStyles}
                        {...methods.register("perks")}
                      />
                      <span className="text-base text-gray-700">{perk}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Screening Questions */}
              <div>
                <label className={labelStyles}>Screening Questions</label>
                <textarea
                  className={textareaStyles}
                  rows={3}
                  placeholder="Add screening questions (optional)"
                  defaultValue={"Please confirm your availability for this job. If not available immediately, how early would you be able to join?"}
                  {...methods.register("screeningQuestions")}
                />
                {/* Add more questions (Optional) - UI only, not functional */}
                <button type="button" className="text-blue-600 mt-2 text-sm">+ Add more questions (Optional)</button>
              </div>

              {/* Primary phone number */}
              <div>
                <label className={labelStyles}>Primary phone number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-base">
                    <img
                      src="https://flagcdn.com/in.svg"
                      alt="IN"
                      className="w-5 h-5 mr-1"
                    />
                    +91
                  </span>
                  <input
                    type="tel"
                    className={phoneInputStyles}
                    placeholder="9812345678"
                    {...methods.register("phoneContact")}
                  />
                </div>
                <p className={errorStyles}>
                  {methods.formState.errors.phoneContact?.message}
                </p>
              </div>

              {/* Alternate phone number */}
              <div>
                <label className={labelStyles}>Alternate phone number for this listing (Optional)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-base">
                    <img
                      src="https://flagcdn.com/in.svg"
                      alt="IN"
                      className="w-5 h-5 mr-1"
                    />
                    +91
                  </span>
                  <input
                    type="tel"
                    className={phoneInputStyles}
                    placeholder="9876543210"
                    {...methods.register("alternatePhone")}
                  />
                </div>
              </div>
            </>
          )}

          {/* Project type (only for Project) */}
          {opportunityType === "Project" && (
            <>
              <div>
                <label className={labelStyles}>Project type</label>
                <div className={radioContainerStyles}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="In office"
                      className={radioStyles}
                      {...methods.register("jobType")}
                    />
                    <span className="text-base text-gray-700">In office</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Hybrid"
                      className={radioStyles}
                      {...methods.register("jobType")}
                    />
                    <span className="text-base text-gray-700">Hybrid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Remote"
                      className={radioStyles}
                      {...methods.register("jobType")}
                    />
                    <span className="text-base text-gray-700">Remote</span>
                  </label>
                </div>
                <p className={errorStyles}>
                  {methods.formState.errors.jobType?.message}
                </p>
              </div>



              {/* Project description */}
              <div>
                <label className={labelStyles}>Project description</label>
                <textarea
                  className={textareaStyles}
                  rows={4}
                  placeholder={"Project requirements:\n1.\n2.\n3."}
                  {...methods.register("responsibilities")}
                />
                <p className={errorStyles}>
                  {methods.formState.errors.responsibilities?.message}
                </p>
              </div>

              {/* Additional candidate preferences */}
              <div>
                <label className={labelStyles}>Additional candidate preferences</label>
                <textarea
                  className={textareaStyles}
                  rows={3}
                  placeholder="e.g. Experience with similar projects preferred"
                  {...methods.register("preferences")}
                />
              </div>

              {/* Women only checkbox */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  className={checkboxStyles}
                  {...methods.register("womenOnly")}
                />
                <span className="text-base text-gray-700">
                  Allow applications from women who are willing to start/restart their career.
                </span>
              </div>

              {/* Project budget */}
              <div>
                <label className={labelStyles}>Project budget</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Min"
                    min="0"
                    {...methods.register("stipendMin")}
                  />
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Max"
                    min="0"
                    {...methods.register("stipendMax")}
                  />
                </div>
              </div>

              {/* Screening Questions */}
              <div>
                <label className={labelStyles}>Screening Questions</label>
                <textarea
                  className={textareaStyles}
                  rows={3}
                  placeholder="Add screening questions (optional)"
                  defaultValue={"Please confirm your availability for this project. Share your relevant project experience."}
                  {...methods.register("screeningQuestions")}
                />
                <button type="button" className="text-blue-600 mt-2 text-sm">+ Add more questions (Optional)</button>
              </div>

              {/* Primary phone number */}
              <div>
                <label className={labelStyles}>Primary phone number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-base">
                    <img
                      src="https://flagcdn.com/in.svg"
                      alt="IN"
                      className="w-5 h-5 mr-1"
                    />
                    +91
                  </span>
                  <input
                    type="tel"
                    className={phoneInputStyles}
                    placeholder="9812345678"
                    {...methods.register("phoneContact")}
                  />
                </div>
                <p className={errorStyles}>
                  {methods.formState.errors.phoneContact?.message}
                </p>
              </div>

              {/* Alternate phone number */}
              <div>
                <label className={labelStyles}>Alternate phone number for this listing (Optional)</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-base">
                    <img
                      src="https://flagcdn.com/in.svg"
                      alt="IN"
                      className="w-5 h-5 mr-1"
                    />
                    +91
                  </span>
                  <input
                    type="tel"
                    className={phoneInputStyles}
                    placeholder="9876543210"
                    {...methods.register("alternatePhone")}
                  />
                </div>
              </div>

              {/* Number of openings for Project */}
              <div>
                <label className={labelStyles}>
                  Number of openings
                </label>
                <input
                  type="number"
                  className={inputStyles}
                  placeholder="e.g. 2"
                  min="1"
                  {...methods.register("openings")}
                />
                <p className={errorStyles}>
                  {methods.formState.errors.openings?.message}
                </p>
              </div>
            </>
          )}

          {/* City/Cities */}
          <div>
            <label className={labelStyles}>City/Cities</label>
            <input
              type="text"
              className={inputStyles}
              placeholder="e.g. Mumbai"
              {...methods.register("city")}
            />
            <p className={errorStyles}>
              {methods.formState.errors.city?.message}
            </p>
          </div>

          {/* Only this city checkbox */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              className={checkboxStyles}
              {...methods.register("onlyThisCity")}
            />
            <span className="text-base text-gray-700">
              Candidates from ONLY the above city should be allowed to apply.
            </span>
          </div>

          {/* Part-time/Full-time (Common for all opportunity types) */}
          <div>
            <label className={labelStyles}>
              Part-time/ Full-time
            </label>
            <div className={radioContainerStyles}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Part-time"
                  className={radioStyles}
                  {...methods.register("partFullTime")}
                />
                <span className="text-base text-gray-700">Part-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Full-time"
                  className={radioStyles}
                  {...methods.register("partFullTime")}
                />
                <span className="text-base text-gray-700">Full-time</span>
              </label>
            </div>
            <p className={errorStyles}>
              {methods.formState.errors.partFullTime?.message}
            </p>
          </div>

          {/* Number of openings */}
          {opportunityType === "Internship" && (
            <div>
              <label className={labelStyles}>
                Number of openings
              </label>
              <input
                type="number"
                className={inputStyles}
                placeholder="e.g. 4"
                min="1"
                {...methods.register("openings")}
              />
              <p className={errorStyles}>
                {methods.formState.errors.openings?.message}
              </p>
            </div>
          )}

          {/* Stipend */}
          {opportunityType !== "Job" && opportunityType !== "Project" && (
            <div>
              <label className={labelStyles}>Stipend</label>
              <div className={radioContainerStyles}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Paid"
                    className={radioStyles}
                    {...methods.register("stipendType")}
                  />
                  <span className="text-base text-gray-700">Paid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Unpaid"
                    className={radioStyles}
                    {...methods.register("stipendType")}
                  />
                  <span className="text-base text-gray-700">Unpaid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Fixed"
                    className={radioStyles}
                    {...methods.register("stipendType")}
                  />
                  <span className="text-base text-gray-700">Fixed</span>
                </label>
              </div>
              {stipendType === "Paid" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Min"
                    min="0"
                    {...methods.register("stipendMin")}
                  />
                  <input
                    type="number"
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="₹ Max"
                    min="0"
                    {...methods.register("stipendMax")}
                  />
                  <select
                    className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    {...methods.register("stipendMode")}
                  >
                    <option value="Month">Month</option>
                    <option value="Lump sum">Lump sum</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* College Name & Course (Internship only, below stipend) */}
          {opportunityType === "Internship" && (
            <div className="mt-6">
              <label className={labelStyles}>
                College Name
                <span className="ml-2 align-middle inline-block px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-300">PRO Plan</span>
              </label>
              <input
                type="text"
                className={inputStyles}
                placeholder="e.g. University Institute of Engineering and Technology, Kanpur"
                {...methods.register("collegeName")}
              />
              <div className="flex items-center mt-2 mb-4">
                <input
                  type="checkbox"
                  className={checkboxStyles}
                  id="onlyThisCollege"
                />
                <label htmlFor="onlyThisCollege" className="ml-2 text-gray-500 text-sm">
                  Candidates from ONLY the above college should be allowed to apply.
                </label>
              </div>
              <div className="mb-2 font-semibold text-gray-700 text-sm">Course</div>
              <input
                type="text"
                className={inputStyles}
                placeholder="e.g. B.Tech Computer Science"
                {...methods.register("course")}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {['B.Tech', 'BE', 'B.Com', 'MBA', 'BA', 'B.Sc', 'M.Tech', 'MCA', 'Diploma'].map(course => (
                  <button
                    key={course}
                    type="button"
                    onClick={() => methods.setValue("course", course, { shouldValidate: true })}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-colors ${methods.getValues("course") === course
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                  >
                    {course}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Incentives */}
          {opportunityType !== "Job" && opportunityType !== "Project" && stipendType === "Paid" && (
            <div>
              <label className={labelStyles}>Incentives</label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="number"
                  className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="₹ Min"
                  min="0"
                  {...methods.register("incentivesMin")}
                />
                <input
                  type="number"
                  className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="₹ Max"
                  min="0"
                  {...methods.register("incentivesMax")}
                />
                <select
                  className="w-full sm:w-32 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  {...methods.register("incentivesMode")}
                >
                  <option value="Month">Month</option>
                  <option value="Lump sum">Lump sum</option>
                </select>
              </div>
            </div>
          )}

          {/* Perks */}
          {opportunityType !== "Job" && opportunityType !== "Project" && (
            <div>
              <label className={labelStyles}>
                Perks (Select all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-4 bg-gray-50 rounded-lg">
                {[
                  "Certificate of completion",
                  "Letter of recommendation",
                  "Flexible work hours",
                  "5 days a week",
                  "Informal dress code",
                  "Free snacks & beverages",
                  "Pre-placement offer (PPO)",
                ].map((perk) => (
                  <label key={perk} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={perk}
                      className={checkboxStyles}
                      {...methods.register("perks")}
                    />
                    <span className="text-base text-gray-700">{perk}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PPO Question */}
          {opportunityType === "Internship" && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="radio"
                value="Yes"
                className={radioStyles}
                {...methods.register("ppo")}
              />
              <span className="text-base font-semibold text-blue-700">
                Does this internship come with a pre-placement offer (PPO)?
              </span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200"
              onClick={() => alert("Draft saved (not implemented)")}
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${isSubmitting
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
            >
              {isSubmitting ? "Posting..." : `Post ${opportunityType}`}
            </button>
          </div>
        </form>
      </FormProvider>
    </RecruiterPostJobInternLayout>
  );
}
