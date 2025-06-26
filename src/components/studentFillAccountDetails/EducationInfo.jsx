import React from "react";

export default function EducationInfo({ register, errors, watch }) {
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
            <input
              {...register("course", { required: "Course is required" })}
              className="w-full p-2 border rounded"
              placeholder="Eg. B.Tech, B.Com, etc."
            />
            {errors.course && (
              <p className="text-red-500 text-xs">{errors.course.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              College Name
            </label>
            <input
              {...register("college", { required: "College Name is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.college && (
              <p className="text-red-500 text-xs">{errors.college.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Specialization
            </label>
            <input
              {...register("specialization", {
                required: "Specialization is required",
              })}
              className="w-full p-2 border rounded"
              placeholder="Eg. Computer Science"
            />
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
    </div>
  );
}
