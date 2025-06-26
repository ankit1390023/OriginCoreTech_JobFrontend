import React, { useState } from "react";

const lookingForOptions = ["Jobs", "Internship", "Project"];
const workModes = ["In-office", "Hybrid", "Work from home"];

export default function PreferencesForm() {
  const [lookingFor, setLookingFor] = useState([]);
  const [workMode, setWorkMode] = useState([]);

  const toggle = (arr, setArr, value) => {
    setArr(
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    );
  };

  return (
    <div>
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
              onClick={() => toggle(lookingFor, setLookingFor, option)}
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
              onClick={() => toggle(workMode, setWorkMode, mode)}
            >
              {mode} +
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
