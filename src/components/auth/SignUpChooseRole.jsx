import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";

const roles = [
  {
    label: "Sign up as a Student/Professional",
    description: "Apply for Jobs, Learn",
    color: "red",
    value: "student",
  },
  {
    label: "Sign up as a Company",
    description: "Hire talent, Offer career opportunities",
    color: "blue",
    value: "company",
  },
  {
    label: "Sign up as a University",
    description: "Find best placements for students",
    color: "blue",
    value: "university",
  },
];

export default function SignUpChooseRole() {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const handleRoleSelect = (idx) => {
    setSelected(idx);
  };

  const handleContinue = () => {
    // Navigate to signup page with selected role
    navigate("/signup", {
      state: {
        selectedRole: roles[selected].value.toUpperCase(),
        roleLabel: roles[selected].label,
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-20">
        <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          YourLogo
        </span>
      </div>
      {/* Top Decorative Section */}
      <div className="absolute top-0 left-0 w-full h-[50%] bg-[#6EB5DD66] z-0" />
      {/* SVG Divider */}
      <div className="absolute top-1/2 left-0 w-full z-10 -translate-y-1/2">
        <svg
          viewBox="0 0 1440 80"
          className="w-full h-20"
          preserveAspectRatio="none"
        >
          <path d="M0,0 Q720,100 1440,0 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>
      {/* Main Content */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto px-4 sm:px-4 lg:px-6 py-16 gap-y-10 gap-x-6 mt-28">
        {/* Left Section */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            Create a New Account
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 max-w-md">
            Join us and find your dream job or recruit talented candidates.
          </p>
          <img
            src={SignUpIllustration}
            alt="Sign Up Illustration"
            className="w-52 sm:w-64 md:w-72 lg:w-80 mt-4"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 w-full flex justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8">
            {roles.map((role, idx) => (
              <div
                key={role.label}
                onClick={() => handleRoleSelect(idx)}
                className={`flex items-center justify-between mb-4 last:mb-0 rounded-lg border cursor-pointer transition-all p-4 hover:shadow-md ${
                  idx === selected
                    ? "bg-red-50 border-red-300"
                    : "bg-gradient-to-r from-blue-50 to-white border-blue-300"
                }`}
              >
                <div>
                  <div
                    className={`font-semibold text-base sm:text-lg ${
                      idx === selected ? "text-red-600" : "text-blue-900"
                    }`}
                  >
                    {role.label}
                  </div>
                  <div
                    className={`text-sm mt-1 ${
                      idx === selected ? "text-red-400" : "text-blue-600"
                    }`}
                  >
                    {role.description}
                  </div>
                </div>
                {idx === selected && (
                  <FaCheckCircle className="text-red-500 text-xl ml-4" />
                )}
              </div>
            ))}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-[#f44336] text-white py-3 rounded-lg font-semibold text-lg mb-4 hover:bg-[#d32f2f] transition"
            >
              Continue
            </button>

            <div className="text-center mt-6 text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
