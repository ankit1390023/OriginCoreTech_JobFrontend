import React from "react";
import { useFormContext } from "react-hook-form";

const lookingForOptions = ["Jobs", "Internship", "Project"];
const workModes = ["In-office", "Hybrid", "Work from home"];

export default function PreferencesForm() {
  const { watch, setValue, register } = useFormContext();
  const lookingFor = watch("currentlyLookingFor") || [];
  const workMode = watch("workMode") || [];

  const toggle = (field, value) => {
    const arr = watch(field) || [];
    if (arr.includes(value)) {
      setValue(
        field,
        arr.filter((v) => v !== value)
      );
    } else {
      setValue(field, [...arr, value]);
    }
  };

  return (
    <div>
      {/* Hidden inputs to register the fields with react-hook-form */}
      <input
        type="hidden"
        {...register("currentlyLookingFor")}
        value={lookingFor.join(",")}
      />
      <input
        type="hidden"
        {...register("workMode")}
        value={workMode.join(",")}
      />

      <div className="mb-6">
        <div className="font-semibold mb-2">Currently looking for:</div>
        <div className="flex flex-wrap gap-2">
          {lookingForOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`px-4 py-1 rounded-full border text-sm ${
                lookingFor.includes(option)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
              onClick={() => toggle("currentlyLookingFor", option)}
            >
              {option} +
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="font-semibold mb-2">Work mode</div>
        <div className="flex flex-wrap gap-2">
          {workModes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`px-4 py-1 rounded-full border text-sm ${
                workMode.includes(mode)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
              onClick={() => toggle("workMode", mode)}
            >
              {mode} +
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
