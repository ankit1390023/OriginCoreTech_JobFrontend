import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SignUpIllustration from "../../assets/SignUp_Illustration.png";
import StudentSignUpLayout from "../../components/student/studentFillAccountDetails/StudentSignUpLayout";

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
    <StudentSignUpLayout
      heading="Create a new account"
      subheading="Join us and find your dream job or recruit talented candidates."
      illustration={SignUpIllustration}
      centerMobileContent={true}
    >
      {/* Main Content */}
      <div className="w-full max-w-xs sm:max-w-sm mx-auto flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-md w-full p-4 sm:p-6">
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
          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-2 rounded-md font-semibold text-base mb-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg bg-[#f44336] text-white hover:bg-[#d32f2f]"
          >
            Continue
          </button>
          {/* Login Link */}
          <div className="text-center mt-2 text-gray-500 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-red-500 font-semibold hover:text-red-600 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </StudentSignUpLayout>
  );
}