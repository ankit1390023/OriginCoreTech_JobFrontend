import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useEducationData } from "../../../hooks/useEducationData";
import { Loader, Input, Select, Label, ErrorMessage } from "../../../components/ui";

// Generate year options for dropdown
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear + 5; year >= 1990; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

export default function EducationInfo() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const {
    data: { jobRoles, courses, specializations, colleges},
    loading,
    error,
    refetch,
  } = useEducationData();

  // State for showing all courses or limited courses
  const [showAll, setShowAll] = useState(false);

  // Logic to show limited or all courses
  const visibleCourses = showAll ? courses : courses?.slice(0, 5);
  

  const CustomErrorMessage = ({ message }) => (
    <div className="w-full p-3 border rounded bg-red-50 text-red-500 text-xs">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={refetch}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="mb-2 sm:mb-3">
        <Label>Type</Label>
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <label
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("type") === "School Student"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-100 border-gray-300 hover:border-gray-400"
              }`}
          >
            <input
              type="radio"
              value="School Student"
              {...register("type", { required: "Type is required" })}
              className="hidden"
            />
            School Student
          </label>
          <label
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("type") === "College Student"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-100 border-gray-300 hover:border-gray-400"
              }`}
          >
            <input
              type="radio"
              value="College Student"
              {...register("type", { required: "Type is required" })}
              className="hidden"
            />
            College Student
          </label>
          <label
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("type") === "Fresher"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-100 border-gray-300 hover:border-gray-400"
              }`}
          >
            <input
              type="radio"
              value="Fresher"
              {...register("type", { required: "Type is required" })}
              className="hidden"
            />
            Fresher
          </label>
          <label
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("type") === "Working Professional"
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-100 border-gray-300 hover:border-gray-400"
              }`}
          >
            <input
              type="radio"
              value="Working Professional"
              {...register("type", { required: "Type is required" })}
              className="hidden"
            />
            Working Professional
          </label>
        </div>
        {errors.type && (
          <ErrorMessage>{errors.type.message}</ErrorMessage>
        )}
      </div>
      {watch("type") === "School Student" && (
        <div className="mb-2 sm:mb-3">
          <Label>Standard</Label>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <label
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("standard") === "Class XII"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 border-gray-300 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                value="Class XII"
                {...register("standard", { required: "Standard is required" })}
                className="hidden"
              />
              Class XII
            </label>
            <label
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("standard") === "Class XI"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 border-gray-300 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                value="Class XI"
                {...register("standard", { required: "Standard is required" })}
                className="hidden"
              />
              Class XI
            </label>
            <label
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("standard") === "Class X or below"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 border-gray-300 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                value="Class X or below"
                {...register("standard", { required: "Standard is required" })}
                className="hidden"
              />
              Class X or below
            </label>
          </div>
          {errors.standard && (
            <ErrorMessage>{errors.standard.message}</ErrorMessage>
          )}
        </div>
      )}
      {(watch("type") === "College Student" || watch("type") === "Fresher") && (
        <>
 
<div className="mb-2 sm:mb-3">
      <Label>Course</Label>
      {loading ? (
        <Loader message="Loading courses..." />
      ) : error ? (
        <CustomErrorMessage message={error} />
      ) : (
        <>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            {visibleCourses &&
              visibleCourses.map((course, index) => (
                <label
                  key={index}
                  className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
                    watch("course") === course.name
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    value={course.name}
                    {...register("course", {
                      required: "Course is required",
                    })}
                    className="hidden"
                  />
                  {course.name}
                </label>
              ))}

            <label
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
                (courses && courses.some(course => course.name === watch("course"))) || !watch("course")
                  ? "bg-gray-100 border-gray-300 hover:border-gray-400"
                  : "bg-blue-500 text-white border-blue-500"
              }`}
            >
              <input
                type="radio"
                value={watch("course")}
                {...register("course", { required: "Course is required" })}
                className="hidden"
              />
              Add your course +
            </label>
          </div>

          {/* Toggle Button */}
          {courses?.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAll(prev => !prev)}
              className="mt-2 text-sm text-blue-600 underline focus:outline-none"
            >
              {showAll ? "Show less" : "See more"}
            </button>
          )}
        </>
      )}
      {errors.course && (
        <ErrorMessage>{errors.course.message}</ErrorMessage>
      )}
    </div>



          <Select
            label="College Name"
            error={errors.college?.message}
            isLoading={loading}
            options={colleges?.map(college => ({
               value: college.name, 
               label: college.name 
            })) || []}
            placeholder="Select a college"
            {...register("college", {
              required: "College Name is required",
            })}
          />
          <Select
            label="Specialization"
            error={errors.specialization?.message}
            isLoading={loading}
            options={specializations?.map(specialization => ({
              value: specialization.name, 
              label: `${specialization.name} (${specialization.Course?.name || 'N/A'})` 
            })) || []}
            placeholder="Select a specialization"
            {...register("specialization", {
              required: "Specialization is required",
            })}
          />
          <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex-1">
              <Select
                label="Start Year"
                placeholder="Choose year"
                error={errors.startYear?.message}
                options={generateYearOptions()}
                {...register("startYear", {
                  required: "Start Year is required",
                })}
              />
            </div>
            <div className="flex-1">
              <Select
                label="End Year"
                placeholder="Choose year"
                error={errors.endYear?.message}
                options={generateYearOptions()}
                {...register("endYear", { required: "End Year is required" })}
              />
            </div>
          </div>
          
        </>
      )}
      {watch("type") === "Working Professional" && (
        <>
          <Select
            label="Total work experience"
            required
            error={errors.experience?.message}
            options={[
              { value: "0-1", label: "0-1 years" },
              { value: "1-2", label: "1-2 years" },
              { value: "2-3", label: "2-3 years" },
              { value: "3-5", label: "3-5 years" },
              { value: "5+", label: "5+ years" }
            ]}
            placeholder="Select experience"
            {...register("experience", {
              required: "Experience is required",
            })}
          />
          <Select
            label="Current Job Role"
            required
            error={errors.jobRole?.message}
            options={jobRoles.map(jobRole => ({ value: jobRole, label: jobRole }))}
            placeholder="Job role"
            {...register("jobRole", { required: "Job Role is required" })}
          />
          <Select
            label="Current Company"
            required
            error={errors.company?.message}
            options={[
              { value: "TCS", label: "TCS" },
              { value: "Infosys", label: "Infosys" },
              { value: "Wipro", label: "Wipro" },
              { value: "Google", label: "Google" },
              { value: "Microsoft", label: "Microsoft" },
              { value: "Other", label: "Other" }
            ]}
            placeholder="Company name"
            {...register("company", {
              required: "Company Name is required",
            })}
          />
           <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex-1">
              <Select
                label="Start Year"
                placeholder="Choose year"
                error={errors.startYear?.message}
                options={generateYearOptions()}
                {...register("startYear", {
                  required: "Start Year is required",
                })}
              />
            </div>
            <div className="flex-1">
              <Select
                label="End Year"
                placeholder="Choose year"
                error={errors.endYear?.message}
                options={generateYearOptions()}
                {...register("endYear", { required: "End Year is required" })}
              />
            </div>
          </div>
          <div className="mb-2 sm:mb-3">
            <Label>Current or latest annual salary/CTC</Label>
            <span className="block text-xs text-gray-500 mb-1">
              We will use this to find jobs matching/ exceeding your current
              salary range.
              <br />
              This information is not visible to employers.
            </span>
            <Input
              type="text"
              placeholder="Eg: 4,00,000"
              {...register("salary")}
            />
          </div>
        </>
      )}
    </div>
  );
}
