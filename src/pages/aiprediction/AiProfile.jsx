import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AiProfileIllustration from "../../assets/AiProfileIllustration.png";
import Ailayout from "../../components/layout/Ailayout";
import { Button, Link } from "../../components/ui";

const roles = [
  {
    label: "Job Specific Skills ",
    description: "Upskills According to the Job If You'r Interested",
    color: "red",
    value: "student",
  },
  {
    label: "Target Specific Skills ",
    description: "Upskills and work to Your Dream Company",
    color: "blue",
    value: "company",
  },
  {
    label: "Upskill ",
    description: "Upskills To find the Better oppertunity",
    color: "blue",
    value: "university",
  },
];

export default function AiProfile() {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const handleRoleSelect = (idx) => {
    setSelected(idx);
  };


  return (
    <Ailayout
      heading="Ai Prediction"
      subheading="Move one step closure to find your Dream job or Upskilling YourSelf "
      illustration={AiProfileIllustration}
      centerMobileContent={true}
    >
      {/* Main Content */}
      <div className="w-full px-0 sm:max-w-sm mx-auto flex flex-col items-center justify-center -mt-4 sm:-mt-2">
        <div className="bg-white rounded-lg shadow-none sm:shadow-md w-full p-4 sm:p-6">
          {/* Role Options */}
          <div className="w-full flex flex-col gap-3 mb-4">
            {roles.map((role, idx) => (
              <div
                key={role.label}
                onClick={() => handleRoleSelect(idx)}
                className={`w-full flex items-center justify-between rounded-lg border cursor-pointer transition-all duration-200 px-4 py-3 text-left ${idx === selected
                  ? "bg-red-50 border-red-400"
                  : "bg-gradient-to-r from-blue-50 to-white border-blue-300"}
                  ${idx === selected ? "shadow-md" : "hover:shadow-md"}`}
              >
                <div>
                  <div className={`font-semibold text-base ${idx === selected ? "text-red-600" : "text-blue-900"}`}>{role.label}</div>
                  <div className={`text-xs mt-1 ${idx === selected ? "text-red-400" : "text-blue-600"}`}>{role.description}</div>
                </div>
                {idx === selected && (
                  <FaCheckCircle className="text-red-500 text-lg ml-2" />
                )}
              </div>
            ))}
          </div>
         
        </div>
      </div>
    </Ailayout>
  );
}