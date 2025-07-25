import React from "react";
import { useFormContext } from "react-hook-form";
import { Label, Badge } from "../../../components/ui";

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

      <div className="mb-2 sm:mb-3">
        <Label>Currently looking for:</Label>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {lookingForOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border text-xs transition-all duration-200 ${lookingFor.includes(option)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              onClick={() => toggle("currentlyLookingFor", option)}
            >
              {option} +
            </button>
          ))}
        </div>
      </div>
      <div className="mb-2 sm:mb-3">
        <Label>Work mode</Label>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {workModes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={`px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-md border text-xs transition-all duration-200 ${workMode.includes(mode)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400"
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
