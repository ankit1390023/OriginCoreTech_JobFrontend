import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RecruiterPostJobInternLayout from "./RecruiterPostJobInternLayout";

const formSchema = z.object({
  opportunityType: z.enum(["Internship", "Job", "Project"]),
  profile: z.string().min(1, { message: "Profile is required" }),
  skills: z.string().min(1, { message: "Skills are required" }),
  internshipType: z.enum(["In office", "Hybrid", "Remote"]),
  jobType: z.enum(["In office", "Hybrid", "Remote"]).optional(),
  partFullTime: z.enum(["Part-time", "Full-time"]),
  city: z.string().min(1, { message: "City is required" }),
  onlyThisCity: z.boolean().optional(),
  openings: z.string().min(1, { message: "Number of openings required" }),
  startDateType: z.enum(["Immediately", "Custom"]),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  inOfficeDays: z.string().optional(),
  jobTitle: z.string().optional(),
  duration: z.string().min(1, { message: "Duration required" }),
  responsibilities: z.string().min(1, { message: "Responsibilities required" }),
  preferences: z.string().optional(),
  womenOnly: z.boolean().optional(),
  stipendType: z.enum(["Paid", "Unpaid"]),
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
});

export default function RecruiterPostJobInternDetails() {
  const methods = useForm({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      opportunityType: "Internship",
      internshipType: "In office",
      jobType: "In office",
      partFullTime: "Part-time",
      startDateType: "Immediately",
      stipendType: "Paid",
      city: "",
      onlyThisCity: false,
      startDateFrom: "",
      startDateTo: "",
      inOfficeDays: "",
      jobTitle: "",
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

  // Dummy skills for suggestions
  const dummySkills = [
    "Python", "Java", "C++", "TypeScript", "Angular", "Vue.js",
    "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS",
    "Git", "REST API", "GraphQL", "Redux", "Next.js", "Tailwind CSS"
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !relatedSkills.includes(newSkill.trim())) {
      setRelatedSkills([...relatedSkills, newSkill.trim()]);
      setNewSkill("");
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setRelatedSkills(relatedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSuggestionClick = (skill) => {
    if (!relatedSkills.includes(skill)) {
      setRelatedSkills([...relatedSkills, skill]);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // TODO: Replace with actual API call
      console.log("Form data submitted:", data);
      alert("Internship/Job posted successfully!");
    } catch (error) {
      alert("Error posting internship/job");
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
          {/* Opportunity Type */}
          <div>
            <label className={labelStyles}>Opportunity type</label>
            <div className={radioContainerStyles}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Internship"
                  className={radioStyles}
                  {...methods.register("opportunityType")}
                />
                <span className="text-base text-gray-700">Internship</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Job"
                  className={radioStyles}
                  {...methods.register("opportunityType")}
                />
                <span className="text-base text-gray-700">Job</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Project"
                  className={radioStyles}
                  {...methods.register("opportunityType")}
                />
                <span className="text-base text-gray-700">Project</span>
              </label>
            </div>
            <p className={errorStyles}>
              {methods.formState.errors.opportunityType?.message}
            </p>
          </div>

          {/* Job title (only for Job) */}
          {opportunityType === "Job" && (
            <div>
              <label className={labelStyles}>Job title</label>
              <input
                type="text"
                className={inputStyles}
                placeholder="e.g. Digital Marketing"
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

              {/* Part-time/Full-time (for all types) */}
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

          {/* Number of openings */}
          {opportunityType !== "Job" && (
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
          {opportunityType !== "Job" && (
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

          {/* Incentives */}
          {opportunityType !== "Job" && stipendType === "Paid" && (
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
          {opportunityType !== "Job" && (
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
          {opportunityType !== "Job" && (
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
              {isSubmitting ? "Posting..." : "Post Internship"}
            </button>
          </div>
        </form>
      </FormProvider>
    </RecruiterPostJobInternLayout>
  );
}
