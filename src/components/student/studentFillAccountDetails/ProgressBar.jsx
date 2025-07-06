import React from "react";
import { FaCheck } from "react-icons/fa";

const ACTIVE_GRADIENT = "bg-gradient-to-r from-blue-500 to-green-400";
const INACTIVE_COLOR = "bg-gray-300 border-gray-300 text-gray-400";
const COMPLETED_GRADIENT = "bg-gradient-to-r from-green-400 to-blue-500";
const LINE_ACTIVE = "bg-gradient-to-r from-green-400 to-blue-500";
const LINE_INACTIVE = "bg-gray-300";

export default function ProgressBar({ currentStep, steps }) {
  return (
    <div className="w-full flex flex-col items-center mb-10">
      <div className="relative flex items-center justify-center w-full max-w-lg">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full border-4 shadow-lg transition-all duration-500
                  ${
                    idx < currentStep
                      ? `${COMPLETED_GRADIENT} border-green-400 text-white`
                      : idx === currentStep
                      ? `${ACTIVE_GRADIENT} border-blue-400 text-white animate-pulse`
                      : `${INACTIVE_COLOR} border-gray-300`
                  }
                `}
                style={{ fontSize: 22 }}
              >
                {idx < currentStep ? (
                  <FaCheck className="text-white text-xl" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className="text-xs mt-3 text-center w-24 text-gray-700 font-semibold select-none">
                {step}
              </span>
            </div>
            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div
                className={`transition-all duration-500 h-2 rounded-full flex-1 mb-6
                  ${idx < currentStep ? LINE_ACTIVE : LINE_INACTIVE}
                `}
                style={{
                  minWidth: 40,
                  marginLeft: "-28px",
                  marginRight: "-28px",
                  zIndex: 1,
                }}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
