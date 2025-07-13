import React from "react";
import { FaCheck } from "react-icons/fa";

const ACTIVE_GRADIENT = "bg-gradient-to-r from-blue-500 to-green-400";
const INACTIVE_COLOR = "bg-gray-300 border-gray-300 text-gray-400";
const COMPLETED_GRADIENT = "bg-gradient-to-r from-green-400 to-blue-500";
const LINE_ACTIVE = "bg-gradient-to-r from-green-400 to-blue-500";
const LINE_INACTIVE = "bg-gray-300";

export default function ProgressBar({ currentStep, steps }) {
  return (
    <div className="w-full flex flex-col items-center mb-2 sm:mb-3">
      <div className="relative flex items-center justify-center w-full max-w-lg">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-6 sm:h-6 md:w-10 md:h-10 flex items-center justify-center rounded-full border-2 sm:border-3 md:border-4 shadow-md sm:shadow-lg transition-all duration-500
                  ${idx < currentStep
                    ? `${COMPLETED_GRADIENT} border-green-400 text-white`
                    : idx === currentStep
                      ? `${ACTIVE_GRADIENT} border-blue-400 text-white animate-pulse`
                      : `${INACTIVE_COLOR} border-gray-300`
                  }
                `}
                style={{ fontSize: '0.75rem' }}
              >
                {idx < currentStep ? (
                  <FaCheck className="text-white text-xs sm:text-sm md:text-base" />
                ) : (
                  <span className="text-xs sm:text-sm md:text-base">{idx + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 sm:mt-2 md:mt-3 text-center w-16 sm:w-20 md:w-24 text-gray-700 font-semibold select-none">
                {step}
              </span>
            </div>
            {/* Connecting Line */}
            {idx < steps.length - 1 && (
              <div
                className={`transition-all duration-500 h-1 sm:h-1.5 md:h-2 rounded-full flex-1 mb-4 sm:mb-5 md:mb-6
                  ${idx < currentStep ? LINE_ACTIVE : LINE_INACTIVE}
                `}
                style={{
                  minWidth: '1.5rem',
                  marginLeft: "-1.60rem",
                  marginRight: "-1.60rem",
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
