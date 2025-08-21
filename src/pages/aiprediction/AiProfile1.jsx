import React from "react";
import { useNavigate } from "react-router-dom";
import AiProfileIllustration1 from "../../assets/AiProfileIllustration1.png";
import Ailayout1 from "../../components/layout/Ailayout1";
import { Button } from "../../components/ui";

export default function AiProfile1() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/signup", {
      state: {
        selectedRole: "JOB_SPECIFIC_SKILLSET",
        roleLabel: "Job Specific Skillset",
      },
    });
  };

  return (
    <Ailayout1
      heading="Ai Prediction"
      subheading="Move one step closure to find your Dream job or Upskilling YourSelf "
      illustration={AiProfileIllustration1}
      centerMobileContent={true}
    >
      {/* Main Content */}
      <div className="w-full px-0 sm:max-w-sm mx-auto flex flex-col items-center justify-center -mt-4 sm:-mt-2">
        <div className="bg-white rounded-lg shadow-md w-full p-6 text-center">
          {/* Card Content */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Job Specific Skillset
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Move one step closer to finding your dream job or upskilling yourself.
          </p>
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-md"
            onClick={handleContinue}
          >
            Get Started
          </Button>
        </div>
      </div>
    </Ailayout1>
  );
}
