import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { jobPostApi } from "../../api/jobPostApi";
import { domainApi } from "../../api/domainApi";
import { useEducationData } from "../../hooks/useEducationData";
import {
  Input,
  Button,
  Textarea,
  Select,
  SuccessMessage,
  ErrorMessage,
  Label,
} from "../../components/ui";
import SignUpLayout from "../../components/layout/SignUpLayout";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import { useSelector } from "react-redux";

const formSchema = z
  .object({
    opportunity_type: z.enum(["Internship", "Job", "Project"]),
    profile: z.string().optional(),
    skills: z.string().min(1, { message: "Skills are required" }),
    internshipType: z.enum(["In office", "Hybrid", "Remote"]).optional(),
    job_type: z.enum(["In office", "Hybrid", "Remote"]).optional(),
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
    responsibilities: z
      .string()
      .min(1, { message: "Responsibilities required" }),
    preferences: z.string().optional(),
    womenOnly: z.boolean().optional(),
    stipend_type: z.enum(["Paid", "Unpaid", "Fixed"]),
    stipend_min: z.string().optional(),
    stipend_max: z.string().optional(),
    stipendMode: z.enum(["Month", "Lump sum"]).optional(),
    incentivesMin: z.string().optional(),
    incentivesMax: z.string().optional(),
    incentivesMode: z.enum(["Month", "Lump sum"]).optional(),
    perks: z.array(z.string()).optional(),
    ppo: z.string().optional(),
    screening_questions: z.string().optional(),
    alternatePhone: z.string().optional(),
    phone_contact: z.string().optional(),
    college_name: z.string().optional(),
    course: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Common validation for all opportunity types
    if (!data.skills || data.skills.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Skills are required",
        path: ["skills"],
      });
    }

    if (!data.city || data.city.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required",
        path: ["city"],
      });
    }

    if (!data.responsibilities || data.responsibilities.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Responsibilities are required",
        path: ["responsibilities"],
      });
    }

    if (!data.partFullTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select Part-time or Full-time",
        path: ["partFullTime"],
      });
    }

    // Conditional validation for internship fields
    if (data.opportunity_type === "Internship") {
      if (!data.profile || data.profile.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internship profile is required",
          path: ["profile"],
        });
      }
      if (!data.internshipType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internship type is required",
          path: ["internshipType"],
        });
      }
      if (!data.startDateType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start date type is required",
          path: ["startDateType"],
        });
      }
      if (!data.duration || data.duration.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internship duration is required",
          path: ["duration"],
        });
      }
      if (!data.openings || data.openings.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number of openings is required",
          path: ["openings"],
        });
      }

      // Validate custom date range
      if (data.startDateType === "Custom") {
        if (!data.startDateFrom || !data.startDateTo) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Custom date range is required",
            path: ["startDateFrom"],
          });
        }
        if (new Date(data.startDateFrom) > new Date(data.startDateTo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after start date",
            path: ["startDateTo"],
          });
        }
      }

      // Validate stipend for internships
      if (data.stipend_type === "Paid") {
        if (
          !data.stipend_min ||
          !data.stipend_max ||
          data.stipend_min.trim() === "" ||
          data.stipend_max.trim() === ""
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Stipend amount is required for paid internships",
            path: ["stipend_min"],
          });
        }
        if (parseInt(data.stipend_min) > parseInt(data.stipend_max)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Maximum stipend must be greater than minimum",
            path: ["stipend_max"],
          });
        }
      }
    }

    // Conditional validation for job fields
    if (data.opportunity_type === "Job") {
      if (!data.jobTitle || data.jobTitle.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Job title is required",
          path: ["jobTitle"],
        });
      }
      if (!data.job_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Job type is required",
          path: ["job_type"],
        });
      }

      // Jobs have fixed pay (stipend_min/stipend_max), not stipend type
      if (
        !data.stipend_min ||
        !data.stipend_max ||
        data.stipend_min.trim() === "" ||
        data.stipend_max.trim() === ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Fixed pay amount is required",
          path: ["stipend_min"],
        });
      }
      if (parseInt(data.stipend_min) > parseInt(data.stipend_max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum pay must be greater than minimum",
          path: ["stipend_max"],
        });
      }
    }

    // Conditional validation for project fields
    if (data.opportunity_type === "Project") {
      if (!data.jobTitle || data.jobTitle.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Project title is required",
          path: ["jobTitle"],
        });
      }
      if (!data.job_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Project type is required",
          path: ["job_type"],
        });
      }
      if (!data.openings || data.openings.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number of openings is required",
          path: ["openings"],
        });
      }
      if (!data.phone_contact || data.phone_contact.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone contact is required",
          path: ["phone_contact"],
        });
      }

      // Projects have budget (stipend_min/stipend_max)
      if (
        !data.stipend_min ||
        !data.stipend_max ||
        data.stipend_min.trim() === "" ||
        data.stipend_max.trim() === ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Project budget is required",
          path: ["stipend_min"],
        });
      }
      if (parseInt(data.stipend_min) > parseInt(data.stipend_max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum budget must be greater than minimum",
          path: ["stipend_max"],
        });
      }
    }
  });

export default function RecruiterPostJobInternDetails() {
  const methods = useForm({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      opportunity_type: "Internship",
      internshipType: "In office",
      job_type: "In office",
      partFullTime: "Part-time",
      startDateType: "Immediately",
      stipend_type: "Paid",
      stipend_min: "",
      stipend_max: "",
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
      phone_contact: "",
      alternatePhone: "",
      college_name: "",
      course: "",
      preferences: "",
      womenOnly: false,
      perks: [],
      screening_questions: "",
      ppo: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // New state for domain-based skill selection
  const [allDomains, setAllDomains] = useState([]);
  const [domainSkills, setDomainSkills] = useState({});
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [domainError, setDomainError] = useState("");
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [showAllDomains, setShowAllDomains] = useState(false);
  // Add state to track if device is small
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

  // Debug token state
  useEffect(() => {
    console.log("Auth state - user:", !!user, "token:", !!token);
  }, [user, token]);

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsSmallDevice(window.innerWidth < 1024); // lg breakpoint
    };
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  // Education data hook for cities
  const {
    data: educationData,
    loading: educationLoading,
    error: educationError,
  } = useEducationData();

  // Fetch all domains on component mount
  useEffect(() => {
    if (token) {
      fetchAllDomains(token);
    } else {
      setDomainError("Authentication required. Please log in again.");
    }
  }, [token]);

  const fetchAllDomains = async (authToken) => {
    try {
      setDomainsLoading(true);
      setDomainError("");
      if (!authToken) throw new Error("No authentication token available");
      // Use domainApi.getAllDomains to fetch domains from backend
      const domainsData = await domainApi.getAllDomains(authToken);
      setAllDomains(domainsData);
    } catch (error) {
      if (error.response?.status === 401) {
        setDomainError("Authentication expired. Please log in again.");
      } else {
        setDomainError("Failed to load domains. Please try again.");
      }
    } finally {
      setDomainsLoading(false);
    }
  };

  const handleDomainClick = async (domain_name) => {
    try {
      setSelectedDomain(domain_name);
      // Find the domain object by name
      const domainObj = allDomains.find(
        (d) => (typeof d === "string" ? d : d.name) === domain_name
      );
      const domain_id =
        typeof domainObj === "string"
          ? domainObj
          : domainObj?.id || domainObj?.name;
      // Only fetch if not already loaded
      if (!domainSkills[domain_name]) {
        setSkillsLoading(true);
        if (!token) throw new Error("No authentication token available");
        // Use domainApi.getSkillsByDomain to fetch skills from backend
        const skills = await domainApi.getSkillsByDomain(domain_id, token); // <-- CORRECT
        setDomainSkills((prev) => ({
          ...prev,
          [domain_name]: skills,
        }));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setDomainError("Authentication expired. Please log in again.");
      } else {
        setDomainError("Failed to load skills for this domain.");
      }
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSelectAllSkills = () => {
    if (selectedDomain && domainSkills[selectedDomain]) {
      const skills = domainSkills[selectedDomain];
      const currentSkills = methods.getValues("skills");
      const skillsText = skills.join(", ");

      if (currentSkills) {
        const updatedSkills =
          currentSkills +
          (currentSkills.endsWith(",") ? " " : ", ") +
          skillsText;
        methods.setValue("skills", updatedSkills);
      } else {
        methods.setValue("skills", skillsText);
      }
    }
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const onSubmit = async (data) => {
    console.log("data received onSubmit", data);
    const isValid = await methods.trigger();

    if (!isValid) {
      // Get specific error messages
      const errorMessages = Object.values(methods.formState.errors)
        .map((error) => error?.message)
        .filter(Boolean);

      setErrorMessage(
        errorMessages.length > 0
          ? errorMessages.join(", ")
          : "Please fill in all required fields correctly."
      );
      return;
    }

    setIsSubmitting(true);

    // Transform form data to match the exact backend API structure
    const jobPostData = {
      opportunity_type: data.opportunity_type,
      jobProfile:
        data.opportunity_type === "Internship" ? data.profile : data.jobTitle,
      skillsRequired: data.skills.id,
      skill_required_note: data.skills.id ? null : data.skills, // Use the skills field directly
      job_type:
        data.opportunity_type === "Internship"
          ? data.internshipType
          : data.job_type,
      days_in_office: data.inOfficeDays ? parseInt(data.inOfficeDays) : null,
      job_time: data.partFullTime,
      cityChoice: data.city,
      number_of_openings: data.openings ? parseInt(data.openings) : null,
      job_description: data.responsibilities,
      candidate_preferences: data.preferences || null,
      women_preferred: data.womenOnly || false,
      stipend_type:
        data.opportunity_type === "Job" ? "Fixed" : data.stipend_type,
      stipend_min: data.stipend_min ? parseInt(data.stipend_min) : null,
      stipend_max: data.stipend_max ? parseInt(data.stipend_max) : null,
      incentive_per_year:
        data.incentivesMin && data.incentivesMax
          ? `${data.incentivesMin}-${data.incentivesMax} ${
              data.incentivesMode || "Month"
            }`
          : null,
      perks: data.perks
        ? Array.isArray(data.perks)
          ? data.perks.join(", ")
          : data.perks
        : null,
      screening_questions: data.screening_questions || null,
      phone_contact: data.phone_contact || null,
      alternate_phone_number: data.alternatePhone || null,
      // Only include internship-specific fields for Internship opportunity type
      ...(data.opportunity_type === "Internship" && {
        internshipDuration: data.duration,
        internship_start_date:
          data.startDateType === "Immediately" ? "Immediately" : null,
        internship_from_date:
          data.startDateType === "Custom" ? data.startDateFrom : null,
        internship_to_date:
          data.startDateType === "Custom" ? data.startDateTo : null,
        is_custom_internship_date: data.startDateType === "Custom",
        college_name: data.college_name || null,
        course: data.course || null,
      }),
    };

    // Get authentication token

    if (!token) {
      setErrorMessage("Authentication token not found. Please log in again.");
      return;
    }

    // Call the API
    const response = await jobPostApi.createJobPost(jobPostData, token);
    console.log(
      "rersponse in recruiterPostJonInternzdetails page is",
      response
    );
    setSuccessMessage(`${data.opportunity_type} posted successfully!`);

    // Reset form after successful submission
    methods.reset();
    setSelectedDomain(null);
    setDomainSkills({});
    setShowAllDomains(false);

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  // Common input styles
  const radioStyles =
    "w-3 h-3 text-blue-600 border-gray-300 focus:outline-none focus:ring-0";
  const checkboxStyles =
    "w-3 h-3 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-0";
  const radioContainerStyles =
    "flex gap-3 p-2 border border-gray-300 rounded-lg bg-white";

  // Watch startDateType for conditional rendering
  const startDateType = methods.watch("startDateType");
  // Watch stipend_type for conditional rendering
  const stipend_type = methods.watch("stipend_type");
  // Watch internshipType for conditional rendering
  const internshipType = methods.watch("internshipType");
  // Watch opportunity_type for conditional rendering
  const opportunity_type = methods.watch("opportunity_type");
  // Watch job_type for conditional rendering
  const job_type = methods.watch("job_type");

  // Clear validation errors when opportunity type changes
  const handleOpportunityTypeChange = (e) => {
    const newType = e.target.value;
    methods.setValue("opportunity_type", newType);

    // Clear any existing validation errors
    methods.clearErrors();

    // Clear success and error messages
    setSuccessMessage("");
    setErrorMessage("");

    // Clear domain-related state
    setSelectedDomain(null);
    setDomainError("");
    setShowAllDomains(false);
  };

  const FormContent = () => {
    return (
      <div className="bg-white rounded-xl shadow-none sm:shadow-xl w-full mt-4 max-w-full sm:max-w-2xl p-6 sm:p-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {/* Success Message */}
            {successMessage && (
              <div className="relative">
                <SuccessMessage size="large">{successMessage}</SuccessMessage>
                <button
                  type="button"
                  onClick={() => setSuccessMessage("")}
                  className="absolute top-2 right-2 text-green-600 hover:text-green-800 focus:outline-none"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="relative">
                <ErrorMessage size="large">{errorMessage}</ErrorMessage>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Opportunity Type */}
            <div>
              <Label htmlFor="opportunity_type">Opportunity type</Label>
              <div className={radioContainerStyles}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Internship"
                    className={radioStyles}
                    checked={opportunity_type === "Internship"}
                    onChange={handleOpportunityTypeChange}
                  />
                  <span className="text-sm text-gray-700">Internship</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Job"
                    className={radioStyles}
                    checked={opportunity_type === "Job"}
                    onChange={handleOpportunityTypeChange}
                  />
                  <span className="text-sm text-gray-700">Job</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Project"
                    className={radioStyles}
                    checked={opportunity_type === "Project"}
                    onChange={handleOpportunityTypeChange}
                  />
                  <span className="text-sm text-gray-700">Project</span>
                </label>
              </div>
            </div>

            {/* Job title (only for Job and Project) */}
            {(opportunity_type === "Job" || opportunity_type === "Project") && (
              <Input
                label={
                  opportunity_type === "Job" ? "Job title" : "Project title"
                }
                type="text"
                placeholder={
                  opportunity_type === "Job"
                    ? "e.g. Digital Marketing"
                    : "e.g. Web Development Project"
                }
                error={methods.formState.errors.jobTitle?.message}
                {...methods.register("jobTitle")}
              />
            )}

            {/* Internship Profile (only for Internship) */}
            {opportunity_type === "Internship" && (
              <Input
                label="Internship profile"
                type="text"
                placeholder="e.g. Digital Marketing"
                error={methods.formState.errors.profile?.message}
                {...methods.register("profile")}
              />
            )}

            {/* Skills Required */}
            <Input
              label="Skills required"
              type="text"
              placeholder="e.g. SEO, Social Media Marketing, Content Writing"
              error={methods.formState.errors.skills?.message}
              {...methods.register("skills")}
            />

            {/* Domain-based Skill Selection */}
            <div>
              <Label htmlFor="domainSkills">Select skills by domain</Label>

              {domainError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg mb-2">
                  <p className="text-xs text-red-800">{domainError}</p>
                  <button
                    type="button"
                    onClick={() => fetchAllDomains(token)}
                    className="text-xs text-red-600 hover:text-red-800 underline mt-1"
                  >
                    Retry
                  </button>
                </div>
              )}

              {domainsLoading ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">Loading domains...</p>
                </div>
              ) : allDomains.length === 0 ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    No domains available at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Domain Selection */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">
                      Click on a domain to see related skills:
                    </p>

                    {/* Display domains as rounded badges */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                      {(showAllDomains
                        ? allDomains
                        : allDomains.slice(0, 4)
                      ).map((domain) => {
                        const domain_name =
                          typeof domain === "string" ? domain : domain.name;
                        const domainKey =
                          typeof domain === "string"
                            ? domain
                            : domain.id || domain.name;
                        return (
                          <button
                            key={domainKey}
                            type="button"
                            onClick={() => handleDomainClick(domain_name)}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              selectedDomain === domain_name
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 hover:text-gray-800"
                            }`}
                          >
                            {domain_name}
                          </button>
                        );
                      })}

                      {/* Show More/Less button */}
                      {allDomains.length > 4 && (
                        <button
                          type="button"
                          onClick={() => setShowAllDomains(!showAllDomains)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-blue-800 rounded-full text-xs font-medium hover:bg-gray-200 hover:text-gray-800 transition-colors"
                        >
                          <span>
                            {showAllDomains ? "Show Less" : "Show More"}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Select All button for selected domain */}
                    {selectedDomain && domainSkills[selectedDomain] && (
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={handleSelectAllSkills}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          <span className="text-sm">+</span>
                          Add All Skills from {selectedDomain}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Internship Type */}
            {opportunity_type === "Internship" && (
              <>
                <div>
                  <Label htmlFor="internshipType">Internship type</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="In office"
                        className={radioStyles}
                        {...methods.register("internshipType")}
                      />
                      <span className="text-sm text-gray-700">In office</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Hybrid"
                        className={radioStyles}
                        {...methods.register("internshipType")}
                      />
                      <span className="text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Remote"
                        className={radioStyles}
                        {...methods.register("internshipType")}
                      />
                      <span className="text-sm text-gray-700">Remote</span>
                    </label>
                  </div>
                </div>
                {/* No. of in-office days in a week (for Hybrid) */}
                {internshipType === "Hybrid" && (
                  <div className="my-3">
                    <Label htmlFor="inOfficeDays">
                      No. of in-office days in a week:
                    </Label>
                    <div className="flex gap-1 sm:gap-3 md:gap-8">
                      {[1, 2, 3, 4, 5].map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={`w-10 h-10 rounded-full border text-sm font-semibold flex items-center justify-center
                              ${
                                methods.getValues("inOfficeDays") ===
                                String(day)
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-gray-700 border-gray-300"
                              }
                              hover:border-blue-400 transition`}
                          onClick={() =>
                            methods.setValue("inOfficeDays", String(day), {
                              shouldValidate: true,
                            })
                          }
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internship start date (only for Internship) */}
                <div>
                  <Label htmlFor="startDateType">Internship start date</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Immediately"
                        className={radioStyles}
                        {...methods.register("startDateType")}
                      />
                      <span className="text-sm text-gray-700">
                        Immediately (within 30 days)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Custom"
                        className={radioStyles}
                        {...methods.register("startDateType")}
                      />
                      <span className="text-sm text-gray-700">Custom</span>
                    </label>
                  </div>
                </div>

                {/* Show date pickers if Custom is selected */}
                {startDateType === "Custom" && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3">
                    <div className="flex-1">
                      <Input
                        label="From"
                        type="date"
                        {...methods.register("startDateFrom")}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        label="To"
                        type="date"
                        {...methods.register("startDateTo")}
                      />
                    </div>
                  </div>
                )}

                {/* Internship duration (only for Internship) */}
                <Input
                  label="Internship duration"
                  type="text"
                  placeholder="e.g. 6 months"
                  error={methods.formState.errors.duration?.message}
                  {...methods.register("duration")}
                />

                {/* Intern's responsibility (only for Internship) */}
                <Textarea
                  label="Intern's responsibility"
                  rows={4}
                  placeholder="Selected intern day-to-day responsibilities include..."
                  error={methods.formState.errors.responsibilities?.message}
                  {...methods.register("responsibilities")}
                />
              </>
            )}

            {/* Job type (only for Job) */}
            {opportunity_type === "Job" && (
              <>
                <div>
                  <Label htmlFor="job_type">Job type</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="In office"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">In office</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Hybrid"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Remote"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Remote</span>
                    </label>
                  </div>
                </div>

                {/* Job description */}
                <Textarea
                  label="Job description"
                  rows={4}
                  placeholder={"Key responsibilities:\n1.\n2.\n3."}
                  error={methods.formState.errors.responsibilities?.message}
                  {...methods.register("responsibilities")}
                />

                {/* Additional candidate preferences */}
                <Textarea
                  label="Additional candidate preferences"
                  rows={3}
                  placeholder="e.g. Candidates pursuing B.Tech. preferred"
                  {...methods.register("preferences")}
                />

                {/* Women only checkbox */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    className={checkboxStyles}
                    {...methods.register("womenOnly")}
                  />
                  <span className="text-sm text-gray-700">
                    Allow applications from women who are willing to
                    start/restart their career.
                  </span>
                </div>

                {/* Fixed pay (per year) */}
                <div>
                  <Label htmlFor="stipend_min">Fixed pay (per year)</Label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("stipend_min")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("stipend_max")}
                    />
                  </div>
                </div>

                {/* Variables/Incentives (per year) */}
                <div>
                  <Label htmlFor="incentivesMin">
                    Variables/ Incentives (per year)
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("incentivesMin")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("incentivesMax")}
                    />
                  </div>
                </div>

                {/* Perks (Job-specific) */}
                <div>
                  <Label htmlFor="perks">Perks: (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                    {[
                      "5 days a week",
                      "Health Insurance",
                      "Life Insurance",
                    ].map((perk) => (
                      <label
                        key={perk}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={perk}
                          className={checkboxStyles}
                          {...methods.register("perks")}
                        />
                        <span className="text-sm text-gray-700">{perk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Screening Questions */}
                <div>
                  <Label htmlFor="screening_questions">
                    Screening Questions
                  </Label>
                  <Textarea
                    rows={3}
                    placeholder="Add screening questions (optional)"
                    defaultValue={
                      "Please confirm your availability for this job. If not available immediately, how early would you be able to join?"
                    }
                    {...methods.register("screening_questions")}
                  />
                  {/* Add more questions (Optional) - UI only, not functional */}
                  <button type="button" className="text-blue-600 mt-2 text-xs">
                    + Add more questions (Optional)
                  </button>
                </div>

                {/* Primary phone number */}
                <div>
                  <Label htmlFor="phone_contact">Primary phone number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-sm">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="9812345678"
                      error={methods.formState.errors.phone_contact?.message}
                      {...methods.register("phone_contact")}
                    />
                  </div>
                </div>

                {/* Alternate phone number */}
                <div>
                  <Label htmlFor="alternatePhone">
                    Alternate phone number for this listing (Optional)
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-sm">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      {...methods.register("alternatePhone")}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Project type (only for Project) */}
            {opportunity_type === "Project" && (
              <>
                <div>
                  <Label htmlFor="job_type">Project type</Label>
                  <div className={radioContainerStyles}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="In office"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">In office</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Hybrid"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Hybrid</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="Remote"
                        className={radioStyles}
                        {...methods.register("job_type")}
                      />
                      <span className="text-sm text-gray-700">Remote</span>
                    </label>
                  </div>
                </div>

                {/* Project description */}
                <Textarea
                  label="Project description"
                  rows={4}
                  placeholder={"Project requirements:\n1.\n2.\n3."}
                  error={methods.formState.errors.responsibilities?.message}
                  {...methods.register("responsibilities")}
                />

                {/* Additional candidate preferences */}
                <Textarea
                  label="Additional candidate preferences"
                  rows={3}
                  placeholder="e.g. Experience with similar projects preferred"
                  {...methods.register("preferences")}
                />

                {/* Women only checkbox */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    className={checkboxStyles}
                    {...methods.register("womenOnly")}
                  />
                  <span className="text-sm text-gray-700">
                    Allow applications from women who are willing to
                    start/restart their career.
                  </span>
                </div>

                {/* Project budget */}
                <div>
                  <Label htmlFor="stipend_min">Project budget</Label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("stipend_min")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("stipend_max")}
                    />
                  </div>
                </div>

                {/* Screening Questions */}
                <div>
                  <Label htmlFor="screening_questions">
                    Screening Questions
                  </Label>
                  <Textarea
                    rows={3}
                    placeholder="Add screening questions (optional)"
                    defaultValue={
                      "Please confirm your availability for this project. Share your relevant project experience."
                    }
                    {...methods.register("screening_questions")}
                  />
                  <button type="button" className="text-blue-600 mt-2 text-xs">
                    + Add more questions (Optional)
                  </button>
                </div>

                {/* Primary phone number */}
                <div>
                  <Label htmlFor="phone_contact">Primary phone number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-sm">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="9812345678"
                      error={methods.formState.errors.phone_contact?.message}
                      {...methods.register("phone_contact")}
                    />
                  </div>
                </div>

                {/* Alternate phone number */}
                <div>
                  <Label htmlFor="alternatePhone">
                    Alternate phone number for this listing (Optional)
                  </Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 py-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg text-gray-600 text-sm">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="IN"
                        className="w-4 h-4 mr-1"
                      />
                      +91
                    </span>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      {...methods.register("alternatePhone")}
                    />
                  </div>
                </div>

                {/* Number of openings for Project */}
                <Input
                  label="Number of openings"
                  type="number"
                  placeholder="e.g. 2"
                  min="1"
                  error={methods.formState.errors.openings?.message}
                  {...methods.register("openings")}
                />
              </>
            )}

            {/* City/Cities */}
            {educationLoading ? (
              <div className="p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Loading cities...</p>
              </div>
            ) : educationError ? (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-xs">{educationError}</p>
              </div>
            ) : (
              <Select
                label="City/Cities"
                placeholder="Select a city"
                error={methods.formState.errors.city?.message}
                options={
                  educationData.locations
                    ? educationData.locations.map((location) => ({
                        value:
                          typeof location === "string"
                            ? location
                            : location.name,
                        label:
                          typeof location === "string"
                            ? location
                            : location.name,
                      }))
                    : []
                }
                {...methods.register("city")}
              />
            )}

            {/* Only this city checkbox */}
            <div className="flex items-center gap-3 p-2 mt-[10px] rounded-lg">
              <input
                type="checkbox"
                className={checkboxStyles}
                {...methods.register("onlyThisCity")}
              />
              <span className="text-sm text-gray-700">
                Candidates from ONLY the above city should be allowed to apply.
              </span>
            </div>

            {/* Part-time/Full-time (Common for all opportunity types) */}
            <div>
              <Label htmlFor="partFullTime">Part-time/ Full-time</Label>
              <div className={radioContainerStyles}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Part-time"
                    className={radioStyles}
                    {...methods.register("partFullTime")}
                  />
                  <span className="text-sm text-gray-700">Part-time</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Full-time"
                    className={radioStyles}
                    {...methods.register("partFullTime")}
                  />
                  <span className="text-sm text-gray-700">Full-time</span>
                </label>
              </div>
            </div>

            {/* Number of openings */}
            {opportunity_type === "Internship" && (
              <Input
                label="Number of openings"
                type="number"
                placeholder="e.g. 4"
                min="1"
                error={methods.formState.errors.openings?.message}
                {...methods.register("openings")}
              />
            )}

            {/* Stipend */}
            {opportunity_type !== "Job" && opportunity_type !== "Project" && (
              <div>
                <Label htmlFor="stipend_type">Stipend</Label>
                <div className={radioContainerStyles}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Paid"
                      className={radioStyles}
                      {...methods.register("stipend_type")}
                    />
                    <span className="text-sm text-gray-700">Paid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Unpaid"
                      className={radioStyles}
                      {...methods.register("stipend_type")}
                    />
                    <span className="text-sm text-gray-700">Unpaid</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="Fixed"
                      className={radioStyles}
                      {...methods.register("stipend_type")}
                    />
                    <span className="text-sm text-gray-700">Fixed</span>
                  </label>
                </div>
                {stipend_type === "Paid" && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("stipend_min")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("stipend_max")}
                    />
                    <select
                      className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      {...methods.register("stipendMode")}
                    >
                      <option value="Month" className="text-sm">
                        Month
                      </option>
                      <option value="Lump sum" className="text-sm">
                        Lump sum
                      </option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* College Name & Course (Internship only, below stipend) */}
            {opportunity_type === "Internship" && (
              <div className="mt-6">
                <div className="flex items-center mb-2">
                  <Label htmlFor="college_name">College Name</Label>
                  <span className="ml-2 align-middle inline-block px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full border border-green-300">
                    PRO Plan
                  </span>
                </div>
                {educationLoading ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Loading colleges...</p>
                  </div>
                ) : educationError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{educationError}</p>
                  </div>
                ) : (
                  <Select
                    placeholder="Select a college"
                    options={
                      educationData.colleges
                        ? educationData.colleges.map((college) => ({
                            value:
                              typeof college === "string"
                                ? college
                                : college.name,
                            label:
                              typeof college === "string"
                                ? college
                                : college.name,
                          }))
                        : []
                    }
                    {...methods.register("college_name")}
                  />
                )}
                <div className="flex items-center mt-2 mb-4">
                  <input
                    type="checkbox"
                    className={checkboxStyles}
                    id="onlyThisCollege"
                  />
                  <label
                    htmlFor="onlyThisCollege"
                    className="ml-2 text-gray-500 text-sm"
                  >
                    Candidates from ONLY the above college should be allowed to
                    apply.
                  </label>
                </div>

                {educationLoading ? (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Loading courses...</p>
                  </div>
                ) : educationError ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{educationError}</p>
                  </div>
                ) : (
                  <Select
                    label="Course"
                    placeholder="Select a course"
                    options={
                      educationData.courses
                        ? educationData.courses.map((course) => ({
                            value:
                              typeof course === "string" ? course : course.name,
                            label:
                              typeof course === "string" ? course : course.name,
                          }))
                        : []
                    }
                    {...methods.register("course")}
                  />
                )}
              </div>
            )}

            {/* Incentives */}
            {opportunity_type !== "Job" &&
              opportunity_type !== "Project" &&
              stipend_type === "Paid" && (
                <div>
                  <Label htmlFor="incentivesMin">Incentives</Label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Input
                      type="number"
                      placeholder="₹ Min"
                      min="0"
                      {...methods.register("incentivesMin")}
                    />
                    <Input
                      type="number"
                      placeholder="₹ Max"
                      min="0"
                      {...methods.register("incentivesMax")}
                    />
                    <select
                      className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      {...methods.register("incentivesMode")}
                    >
                      <option value="Month" className="text-sm">
                        Month
                      </option>
                      <option value="Lump sum" className="text-sm">
                        Lump sum
                      </option>
                    </select>
                  </div>
                </div>
              )}

            {/* Perks */}
            {opportunity_type !== "Job" && opportunity_type !== "Project" && (
              <div>
                <Label htmlFor="perks">Perks (Select all that apply)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                  {[
                    "Certificate of completion",
                    "Letter of recommendation",
                    "Flexible work hours",
                    "5 days a week",
                    "Informal dress code",
                    "Free snacks & beverages",
                    "Pre-placement offer (PPO)",
                  ].map((perk) => (
                    <label
                      key={perk}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={perk}
                        className={checkboxStyles}
                        {...methods.register("perks")}
                      />
                      <span className="text-sm text-gray-700">{perk}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* PPO Question */}
            {opportunity_type === "Internship" && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="radio"
                  value="Yes"
                  className={radioStyles}
                  {...methods.register("ppo")}
                />
                <span className="text-sm font-semibold text-blue-700">
                  Does this internship come with a pre-placement offer (PPO)?
                </span>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-row justify-between gap-2 sm:gap-4 mt-6 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => alert("Draft saved (not implemented)")}
              >
                Save Draft
              </Button>
              <Button type="submit" loading={isSubmitting} variant="primary">
                {isSubmitting ? "Posting..." : `Post ${opportunity_type}`}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  };

  // Replace layout logic with SignUpLayout for all devices
  return (
    <SignUpLayout
      heading="Post Internship/Job"
      subheading="Post your internship/job to attract the best candidates."
      hideMobileIllustration={true}
    >
      <div className="w-full min-h-screen flex md:items-center md:justify-center overflow-hidden relative">
        {/* Form */}
        <div className="flex-1 w-full flex justify-center mt-6 md:mt-0">
          <FormContent />
        </div>
      </div>
    </SignUpLayout>
  );
}
