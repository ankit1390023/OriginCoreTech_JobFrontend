// components/ui/Input.jsx
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Input = React.forwardRef(({
  label,
  error,
  className = "",
  size = "default", // "small", "default", "large"
  variant = "default", // "default", "error", "disabled"
  type = "text", // Default to text
  ...props
}, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasValue, setHasValue] = useState(false);

  // Only show eye toggle if it's a password input
  const isPassword = type === "password";

  const baseStyles = "w-full border rounded-md focus:outline-none transition-all duration-200";

  const sizeStyles = {
    small: "px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs",
    default: "px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs",
    large: "px-3 py-2 text-sm"
  };

  const variantStyles = {
    default: "border-gray-300 hover:border-gray-400 focus:ring-1 focus:ring-blue-400 focus:border-transparent",
    error: "border-red-500 bg-red-50 focus:ring-1 focus:ring-red-400 focus:border-transparent",
    disabled: "border-gray-300 bg-gray-50 cursor-not-allowed"
  };

  const inputClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  // Determine actual input type
  const inputType = isPassword && isVisible ? "text" : type;

  return (
    <div className="mb-2 sm:mb-3">
      {label && (
        <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType} 
          className={inputClasses}
          {...props}
          onChange={(e) => {
            setHasValue(e.target.value.length > 0);
            if (props.onChange) props.onChange(e);
          }}
        />
        
        {/* Eye Toggle Button — Only for password inputs */}
        {isPassword && hasValue && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute p-1 text-gray-500 transform -translate-y-1/2 rounded-full right-3 top-1/2 focus:outline-none"
            aria-label={isVisible ? "Hide password" : "Show password"}
            tabIndex={-1} 
            onMouseDown={(e) => e.preventDefault()}
          >
            {isVisible ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-0.5 block">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;