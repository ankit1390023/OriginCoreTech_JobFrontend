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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <div className="flex gap-2 flex-wrap">
          <label
            className={`px-3 py-1 rounded border cursor-pointer ${
              watch("type") === "School Student"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
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
            className={`px-3 py-1 rounded border cursor-pointer ${
              watch("type") === "College Student"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
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
            className={`px-3 py-1 rounded border cursor-pointer ${
              watch("type") === "Fresher"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
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
            className={`px-3 py-1 rounded border cursor-pointer ${
              watch("type") === "Working Professional"
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
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
          <p className="text-red-500 text-xs">{errors.type.message}</p>
        )}
      </div>
      {watch("type") === "School Student" && (
        <div>
          <label className="block text-sm font-medium mb-1">Standard</label>
          <div className="flex gap-2 flex-wrap">
            <label
              className={`px-3 py-1 rounded border cursor-pointer ${
                watch("standard") === "Class XII"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
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
              className={`px-3 py-1 rounded border cursor-pointer ${
                watch("standard") === "Class XI"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
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
              className={`px-3 py-1 rounded border cursor-pointer ${
                watch("standard") === "Class X or below"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
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
            <p className="text-red-500 text-xs">{errors.standard.message}</p>
          )}
        </div>
      )}
      {watch("type") === "College Student" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            {loading ? (
              <LoadingSpinner message="Loading courses..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <div className="flex gap-2 flex-wrap">
                {courses.map((course, index) => (
                  <label
                    key={index}
                    className={`px-3 py-1 rounded border cursor-pointer ${
                      watch("course") === course
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
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
                  className={`px-3 py-1 rounded border cursor-pointer ${
                    courses.includes(watch("course")) || !watch("course")
                      ? "bg-gray-100"
                      : "bg-blue-600 text-white"
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
              <p className="text-red-500 text-xs">{errors.course.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
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
                className="w-full p-2 border rounded"
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
              <p className="text-red-500 text-xs">{errors.college.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
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
                className="w-full p-2 border rounded"
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
              <p className="text-red-500 text-xs">
                {errors.specialization.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register("startYear", {
                  required: "Start Year is required",
                })}
                className="w-full p-2 border rounded"
                placeholder="Choose year"
              />
              {errors.startYear && (
                <p className="text-red-500 text-xs">
                  {errors.startYear.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Year</label>
              <input
                type="number"
                {...register("endYear", { required: "End Year is required" })}
                className="w-full p-2 border rounded"
                placeholder="Choose year"
              />
              {errors.endYear && (
                <p className="text-red-500 text-xs">{errors.endYear.message}</p>
              )}
            </div>
          </div>
        </>
      )}
      {watch("type") === "Fresher" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            {loading ? (
              <LoadingSpinner message="Loading courses..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <div className="flex gap-2 flex-wrap">
                {courses.map((course, index) => (
                  <label
                    key={index}
                    className={`px-3 py-1 rounded border cursor-pointer ${
                      watch("course") === course
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
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
                  className={`px-3 py-1 rounded border cursor-pointer ${
                    courses.includes(watch("course")) || !watch("course")
                      ? "bg-gray-100"
                      : "bg-blue-600 text-white"
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
              <p className="text-red-500 text-xs">{errors.course.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
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
                className="w-full p-2 border rounded"
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
              <p className="text-red-500 text-xs">{errors.college.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
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
                className="w-full p-2 border rounded"
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
              <p className="text-red-500 text-xs">
                {errors.specialization.message}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register("startYear", {
                  required: "Start Year is required",
                })}
                className="w-full p-2 border rounded"
                placeholder="Choose year"
              />
              {errors.startYear && (
                <p className="text-red-500 text-xs">
                  {errors.startYear.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Year</label>
              <input
                type="number"
                {...register("endYear", { required: "End Year is required" })}
                className="w-full p-2 border rounded"
                placeholder="Choose year"
              />
              {errors.endYear && (
                <p className="text-red-500 text-xs">{errors.endYear.message}</p>
              )}
            </div>
          </div>
        </>
      )}
      {watch("type") === "Working Professional" && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1">
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
                className="w-full p-2 border rounded"
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
              <p className="text-red-500 text-xs">
                {errors.experience.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Current Job Role<span className="text-red-500"> *</span>
            </label>
            {loading ? (
              <LoadingSpinner message="Loading job roles..." />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <select
                {...register("jobRole", { required: "Job Role is required" })}
                className="w-full p-2 border rounded"
              >
              <option value="">Job role</option>
                {jobRoles.map((jobRole, index) => (
                  <option key={index} value={jobRole}>
                    {jobRole}
                  </option>
                ))  }
              </select>
            )}
            {errors.jobRole && (
              <p className="text-red-500 text-xs">{errors.jobRole.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
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
                className="w-full p-2 border rounded"
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
              <p className="text-red-500 text-xs">{errors.company.message}</p>
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Start Year
              </label>
              <input
                type="number"
                {...register("startYear", {
                  required: "Start Year is required",
                })}
                className="w-full p-2 border rounded"
                placeholder="Choose year"
              />
              {errors.startYear && (
                <p className="text-red-500 text-xs">
                  {errors.startYear.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">End Year</label>
              <input
                type="number"
                {...register("endYear", { required: "End Year is required" })}
                className="w-full p-2 border rounded"
                placeholder="Choose year"
              />
              {errors.endYear && (
                <p className="text-red-500 text-xs">{errors.endYear.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
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
              className="w-full p-2 border rounded"
              placeholder="Eg: 4,00,000"
            />
          </div>
        </>
      )}
    </div>
  );
}
