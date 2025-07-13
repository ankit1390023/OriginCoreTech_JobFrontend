import React from "react";

const PhoneInput = React.forwardRef(({
    label = "Phone Number",
    error,
    className = "",
    size = "default", // "small", "default", "large"
    variant = "default", // "default", "error", "disabled"
    countryCode = "+91",
    flagUrl = "https://flagcdn.com/in.svg",
    flagAlt = "IN",
    placeholder = "9876543210",
    ...props
}, ref) => {
    const baseStyles = "w-full border border-l-0 rounded-r-md focus:outline-none transition-all duration-200";

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

    return (
        <div className="mb-2 sm:mb-3">
            {label && (
                <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
                    {label}
                </label>
            )}
            <div className="flex">
                <span className="inline-flex items-center px-1.5 sm:px-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md text-gray-600 text-xs">
                    <img
                        src={flagUrl}
                        alt={flagAlt}
                        className="w-3 h-3 mr-1"
                    />
                    {countryCode}
                </span>
                <input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    className={inputClasses}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-red-500 mt-0.5 block">
                    {error}
                </span>
            )}
        </div>
    );
});

PhoneInput.displayName = "PhoneInput";

export default PhoneInput; 