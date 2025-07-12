import React from "react";
import { useEducationData } from "../../../hooks/useEducationData";
import LoadingSpinner from "../../shared/LoadingSpinner";

export default function EducationInfo({ register, errors, watch }) {
  const {
    data: { jobRoles, courses, specializations, colleges },
    loading,
    error,
    refetch,
  } = useEducationData();

  const ErrorMessage = ({ message }) => (
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
        <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Type</label>
        <div className="flex gap-1 sm:gap-2 flex-wrap">
          <label
            className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("type") === "School Student"
              ? "bg-[#f44336] text-white border-[#f44336]"
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
              ? "bg-[#f44336] text-white border-[#f44336]"
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
              ? "bg-[#f44336] text-white border-[#f44336]"
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
              ? "bg-[#f44336] text-white border-[#f44336]"
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
          <span className="text-xs text-red-500 mt-0.5 block">
            {errors.type.message}
          </span>
        )}
      </div>
      {watch("type") === "School Student" && (
        <div className="mb-2 sm:mb-3">
          <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Standard</label>
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <label
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("standard") === "Class XII"
                ? "bg-[#f44336] text-white border-[#f44336]"
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
                ? "bg-[#f44336] text-white border-[#f44336]"
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
                ? "bg-[#f44336] text-white border-[#f44336]"
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
            <span className="text-xs text-red-500 mt-0.5 block">
              {errors.standard.message}
            </span>
          )}
        </div>
      )}
      {watch("type") === "College Student" && (
        <>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Course</label>
            {loading ? (
              <LoadingSpinner message="Loading courses..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {courses.map((course, index) => (
                  <label
                    key={index}
                    className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("course") === course
                      ? "bg-[#f44336] text-white border-[#f44336]"
                      : "bg-gray-100 border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      value={course}
                      {...register("course", {
                        required: "Course is required",
                      })}
                      className="hidden"
                    />
                    {course}
                  </label>
                ))}
                <label
                  className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${courses.includes(watch("course")) || !watch("course")
                    ? "bg-gray-100 border-gray-300 hover:border-gray-400"
                    : "bg-[#f44336] text-white border-[#f44336]"
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
            )}
            {errors.course && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.course.message}
              </span>
            )}
          </div>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              College Name
            </label>
            {loading ? (
              <LoadingSpinner message="Loading colleges..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("college", {
                  required: "College Name is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select a college</option>
                {colleges.map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            )}
            {errors.college && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.college.message}
              </span>
            )}
          </div>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              Specialization
            </label>
            {loading ? (
              <LoadingSpinner message="Loading specializations..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select a specialization</option>
                {specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            )}
            {errors.specialization && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.specialization.message}
              </span>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex-1">
              <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register("startYear", {
                  required: "Start Year is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
                placeholder="Choose year"
              />
              {errors.startYear && (
                <span className="text-xs text-red-500 mt-0.5 block">
                  {errors.startYear.message}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">End Year</label>
              <input
                type="number"
                {...register("endYear", { required: "End Year is required" })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
                placeholder="Choose year"
              />
              {errors.endYear && (
                <span className="text-xs text-red-500 mt-0.5 block">
                  {errors.endYear.message}
                </span>
              )}
            </div>
          </div>
        </>
      )}
      {watch("type") === "Fresher" && (
        <>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">Course</label>
            {loading ? (
              <LoadingSpinner message="Loading courses..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                {courses.map((course, index) => (
                  <label
                    key={index}
                    className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${watch("course") === course
                      ? "bg-[#f44336] text-white border-[#f44336]"
                      : "bg-gray-100 border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <input
                      type="radio"
                      value={course}
                      {...register("course", {
                        required: "Course is required",
                      })}
                      className="hidden"
                    />
                    {course}
                  </label>
                ))}
                <label
                  className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border cursor-pointer text-xs transition-all duration-200 ${courses.includes(watch("course")) || !watch("course")
                    ? "bg-gray-100 border-gray-300 hover:border-gray-400"
                    : "bg-[#f44336] text-white border-[#f44336]"
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
            )}
            {errors.course && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.course.message}
              </span>
            )}
          </div>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              College Name
            </label>
            {loading ? (
              <LoadingSpinner message="Loading colleges..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("college", {
                  required: "College Name is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select a college</option>
                {colleges.map((college, index) => (
                  <option key={index} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            )}
            {errors.college && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.college.message}
              </span>
            )}
          </div>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              Specialization
            </label>
            {loading ? (
              <LoadingSpinner message="Loading specializations..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select a specialization</option>
                {specializations.map((specialization, index) => (
                  <option key={index} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            )}
            {errors.specialization && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.specialization.message}
              </span>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex-1">
              <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register("startYear", {
                  required: "Start Year is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
                placeholder="Choose year"
              />
              {errors.startYear && (
                <span className="text-xs text-red-500 mt-0.5 block">
                  {errors.startYear.message}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">End Year</label>
              <input
                type="number"
                {...register("endYear", { required: "End Year is required" })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
                placeholder="Choose year"
              />
              {errors.endYear && (
                <span className="text-xs text-red-500 mt-0.5 block">
                  {errors.endYear.message}
                </span>
              )}
            </div>
          </div>
        </>
      )}
      {watch("type") === "Working Professional" && (
        <>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              Total work experience<span className="text-red-500"> *</span>
            </label>
            {loading ? (
              <LoadingSpinner message="Loading experience options..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("experience", {
                  required: "Experience is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select experience</option>
                {/* Example experience options, replace with API data if available */}
                <option value="0-1">0-1 years</option>
                <option value="1-2">1-2 years</option>
                <option value="2-3">2-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            )}
            {errors.experience && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.experience.message}
              </span>
            )}
          </div>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              Current Job Role<span className="text-red-500"> *</span>
            </label>
            {loading ? (
              <LoadingSpinner message="Loading job roles..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("jobRole", { required: "Job Role is required" })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Job role</option>
                {jobRoles.map((jobRole, index) => (
                  <option key={index} value={jobRole}>
                    {jobRole}
                  </option>
                ))}
              </select>
            )}
            {errors.jobRole && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.jobRole.message}
              </span>
            )}
          </div>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              Current Company<span className="text-red-500"> *</span>
            </label>
            {loading ? (
              <LoadingSpinner message="Loading companies..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("company", {
                  required: "Company Name is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Company name</option>
                {/* Example companies, replace with API data if available */}
                <option value="TCS">TCS</option>
                <option value="Infosys">Infosys</option>
                <option value="Wipro">Wipro</option>
                <option value="Google">Google</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Other">Other</option>
              </select>
            )}
            {errors.company && (
              <span className="text-xs text-red-500 mt-0.5 block">
                {errors.company.message}
              </span>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex-1">
              <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register("startYear", {
                  required: "Start Year is required",
                })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
                placeholder="Choose year"
              />
              {errors.startYear && (
                <span className="text-xs text-red-500 mt-0.5 block">
                  {errors.startYear.message}
                </span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">End Year</label>
              <input
                type="number"
                {...register("endYear", { required: "End Year is required" })}
                className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
                placeholder="Choose year"
              />
              {errors.endYear && (
                <span className="text-xs text-red-500 mt-0.5 block">
                  {errors.endYear.message}
                </span>
              )}
            </div>
          </div>
          <div className="mb-2 sm:mb-3">
            <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
              Current or latest annual salary/CTC
            </label>
            <span className="block text-xs text-gray-500 mb-1">
              We will use this to find jobs matching/ exceeding your current
              salary range.
              <br />
              This information is not visible to employers.
            </span>
            <input
              type="text"
              {...register("salary")}
              className="w-full px-1.5 sm:px-2 py-1.5 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent text-xs transition-all duration-200 hover:border-gray-400"
              placeholder="Eg: 4,00,000"
            />
          </div>
        </>
      )}
    </div>
  );
}
