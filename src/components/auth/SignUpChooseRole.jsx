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
      heading="Create a New Account"
      subheading="Join us and find your dream job or recruit talented candidates."
      illustration={SignUpIllustration}
    >
      {/* Right Section */}
      <div className="flex-1 w-full flex justify-center">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8">
            {roles.map((role, idx) => (
              <div
                key={role.label}
                onClick={() => handleRoleSelect(idx)}
                className={`flex items-center justify-between mb-4 last:mb-0 rounded-lg border cursor-pointer transition-all p-4 hover:shadow-md ${idx === selected
                    ? "bg-red-50 border-red-300"
                    : "bg-gradient-to-r from-blue-50 to-white border-blue-300"
                  }`}
              >
                <div>
                  <div
                    className={`font-semibold text-base sm:text-lg ${idx === selected ? "text-red-600" : "text-blue-900"
                      }`}
                  >
                    {role.label}
                  </div>
                  <div
                    className={`text-sm mt-1 ${idx === selected ? "text-red-400" : "text-blue-600"
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
      </StudentSignUpLayout>
  );
}