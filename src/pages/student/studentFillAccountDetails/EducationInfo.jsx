import React, { useState, useEffect, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from 'react-select';
import { useMasterData } from "../../../hooks/master/useMasterData";
import {
  Loader,
  Input,
  Label,
  ErrorMessage,
} from "../../../components/ui";

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
    setValue,
    control,
    watch,
  } = useFormContext();

  const {
    data: { jobRoles, courses, specializationByCourse, schoolColleges, companies },
    loading,
    error,
    refetch,
    getSpecializationsForCourse,
  } = useMasterData();



  // Get specializations based on selected course
  const selectedCourse = watch("course");
  const courseSpecializations = useMemo(() => {
    console.log("Selected course ID:", selectedCourse);
    if (!selectedCourse) return [];
    const course = courses?.find(c => c.id == Number(selectedCourse)); // ✅ compare id
    return course ? getSpecializationsForCourse(course.id) : [];
  }, [selectedCourse, courses, getSpecializationsForCourse]);

  // State for showing all courses or limited courses
  const [showAll, setShowAll] = useState(false);

  // Logic to show limited or all courses
  const visibleCourses = showAll ? courses : courses?.slice(0, 5);

  const CustomErrorMessage = ({ message }) => (
    <div className="w-full p-3 text-xs text-red-500 border rounded bg-red-50">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={refetch}
          className="px-2 py-1 ml-2 text-xs text-white transition-colors bg-red-500 rounded hover:bg-red-600"
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
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <label
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
              watch("type") === "School Student"
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
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
              watch("type") === "College Student"
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
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
              watch("type") === "Fresher"
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
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
              watch("type") === "Working Professional"
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
        {errors.type && <ErrorMessage>{errors.type.message}</ErrorMessage>}
      </div>
      {watch("type") === "School Student" && (
        <div className="mb-2 sm:mb-3">
          <Label>Standard</Label>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <label
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
                watch("standard") === "Class XII"
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
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
                watch("standard") === "Class XI"
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
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
                watch("standard") === "Class X or below"
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
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {visibleCourses &&
                    visibleCourses.map((course, index) => (
                      <label
                        key={index}
                        className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${
                          watch("course") == course.id
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-100 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="radio"
                          value={course.id}
                          {...register("course", {
                            required: "Course is required",
                          })}
                          className="hidden"
                        />
                        {course.name}
                      </label>
                    ))}
                </div>

                {/* Toggle Button */}
                {courses?.length > 5 && (
                  <button
                    type="button"
                    onClick={() => setShowAll((prev) => !prev)}
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

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              College/University
            </label>
            <Controller
              name="college_id"
              control={control}
              rules={{ required: "Please select your college/university" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  ref={ref}
                  value={schoolColleges?.find(
                    (option) =>
                      option.id === value || option.id === Number(value)
                  )}
                  onChange={(selectedOption) => {
                    onChange(selectedOption ? selectedOption.id : null);
                  }}
                  onBlur={onBlur}
                  options={schoolColleges}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Select College/University"
                  className="w-full text-sm"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                />
              )}
            />
            {errors.college_id && (
              <ErrorMessage>{errors.college_id.message}</ErrorMessage>
            )}
          </div>

          {/* Specialization */}
          <div className="w-full mt-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Specialization
            </label>
            <Controller
              name="specialization"
              control={control}
              rules={{ required: "Specialization is required" }}
              render={({ field: { onChange, value, ref } }) => (
                <Select
                  ref={ref}
                  value={
                    courseSpecializations?.find(
                      (spec) => spec.id === Number(value) // ✅ match id not name
                    ) || null
                  }
                  onChange={
                    (selectedOption) =>
                      onChange(selectedOption ? selectedOption.id : null) // ✅ save id
                  }
                  options={courseSpecializations}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  placeholder="Select a specialization"
                  isDisabled={!selectedCourse}
                  isClearable
                  isSearchable
                  className="w-full text-sm"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.specialization && (
              <ErrorMessage>{errors.specialization.message}</ErrorMessage>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            {/* Start Year */}
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Start Year
              </label>
              <Controller
                name="start_year"
                control={control}
                rules={{ required: "Start Year is required" }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    value={
                      generateYearOptions().find((y) => y.value === value) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      onChange(selectedOption ? selectedOption.value : null)
                    }
                    options={generateYearOptions()}
                    placeholder="Choose year"
                    isClearable
                    isSearchable
                    className="w-full text-sm"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.start_year && (
                <ErrorMessage>{errors.start_year.message}</ErrorMessage>
              )}
            </div>

            {/* End Year */}
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                End Year
              </label>
              <Controller
                name="end_year"
                control={control}
                rules={{ required: "End Year is required" }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    value={
                      generateYearOptions().find((y) => y.value === value) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      onChange(selectedOption ? selectedOption.value : null)
                    }
                    options={generateYearOptions()}
                    placeholder="Choose year"
                    isClearable
                    isSearchable
                    className="w-full text-sm"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.end_year && (
                <ErrorMessage>{errors.end_year.message}</ErrorMessage>
              )}
            </div>
          </div>
        </>
      )}
      {watch("type") === "Working Professional" && (
        <>
          <div className="w-full mb-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <Controller
              name="experience_years"
              control={control}
              rules={{ required: "Experience is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={Array.from({ length: 41 }, (_, i) => ({
                    value: i,
                    label: `${i} ${i === 1 ? "year" : "years"}`,
                  }))}
                  placeholder="Select experience"
                  isClearable
                  isSearchable
                  className="w-full text-sm"
                  classNamePrefix="select"
                />
              )}
            />
            {errors.experience_years && (
              <ErrorMessage>{errors.experience_years.message}</ErrorMessage>
            )}
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Job Title/Designation
            </label>
            <Controller
              name="job_id"
              control={control}
              rules={{ required: "Job title is required" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  ref={ref}
                  value={
                    jobRoles?.find(
                      (option) =>
                        option.id === value || option.id === Number(value)
                    ) || null
                  }
                  onChange={(selectedOption) => {
                    console.log("Selected option:", selectedOption);
                    onChange(selectedOption ? selectedOption.id : null);
                  }}
                  onBlur={onBlur}
                  options={jobRoles}
                  getOptionLabel={(option) => option.title}
                  getOptionValue={(option) => option.id}
                  placeholder="Select Job Title/Designation"
                  className="w-full text-sm"
                  classNamePrefix="select"
                  isClearable
                  isSearchable
                  isLoading={loading}
                  loadingMessage={() => "Loading job roles..."}
                  noOptionsMessage={() => "No job roles found"}
                />
              )}
            />
            {errors.job_id && (
              <ErrorMessage>{errors.job_id.message}</ErrorMessage>
            )}
          </div>

          {/* Company Name */}
          <div className="w-full mb-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Company Name
            </label>
            <Controller
              name="company_name"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  placeholder="Enter company name"
                  className="w-full px-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                //to make searchable seclt of company name
                // <Select
                //   ref={ref}
                //   value={
                //     companies?.find(
                //       (option) =>
                //         option.id === value || option.id === Number(value)
                //     ) || null
                //   }
                //   onChange={(selectedOption) => {
                //     console.log("Selected option:", selectedOption);
                //     onChange(selectedOption ? selectedOption.id : null);
                //   }}
                //   onBlur={onBlur}
                //   options={companies}
                //   getOptionLabel={(option) => option.company_name}
                //   getOptionValue={(option) => option.id}
                //   placeholder="Select Company Name"
                //   className="w-full text-sm"
                //   classNamePrefix="select"
                //   isClearable
                //   isSearchable
                //   isLoading={loading}
                //   loadingMessage={() => "Loading job roles..."}
                //   noOptionsMessage={() => "No job roles found"}
                // />
              )}
            />
            {errors.company_name && (
              <ErrorMessage>{errors.company_name.message}</ErrorMessage>
            )}
          </div>
          <div className="flex gap-1 mb-2 sm:gap-2 sm:mb-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Start Year
              </label>
              <Controller
                name="start_year"
                control={control}
                rules={{ required: "Start Year is required" }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    value={
                      generateYearOptions().find((y) => y.value === value) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      onChange(selectedOption ? selectedOption.value : null)
                    }
                    options={generateYearOptions()}
                    placeholder="Choose year"
                    isClearable
                    isSearchable
                    className="w-full text-sm"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.start_year && (
                <ErrorMessage>{errors.start_year.message}</ErrorMessage>
              )}
            </div>

            {/* End Year */}
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                End Year
              </label>
              <Controller
                name="end_year"
                control={control}
                rules={{ required: "End Year is required" }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    value={
                      generateYearOptions().find((y) => y.value === value) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      onChange(selectedOption ? selectedOption.value : null)
                    }
                    options={generateYearOptions()}
                    placeholder="Choose year"
                    isClearable
                    isSearchable
                    className="w-full text-sm"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.end_year && (
                <ErrorMessage>{errors.end_year.message}</ErrorMessage>
              )}
            </div>
          </div>
          <div className="mb-2 sm:mb-3">
            <Label>Current or latest annual salary/CTC</Label>
            <span className="block mb-1 text-xs text-gray-500">
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