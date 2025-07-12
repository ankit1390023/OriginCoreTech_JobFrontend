import React from "react";

const Select = React.forwardRef(({
    label,
    error,
    options = [],
    className = "",
    size = "default", // "small", "default", "large"
    variant = "default", // "default", "error", "disabled"
    placeholder = "Select an option",
    ...props
}, ref) => {
    const baseStyles = "w-full border rounded-md focus:outline-none transition-all duration-200 bg-white";

    const sizeStyles = {
        small: "px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs",
        default: "px-3 py-2 text-sm",
        large: "px-4 py-3 text-base"
    };

    const variantStyles = {
        default: "border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        error: "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-transparent",
        disabled: "border-gray-300 bg-gray-50 cursor-not-allowed"
    };

    const selectClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    return (
        <div className="mb-2 sm:mb-3">
            {label && (
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={selectClasses}
                {...props}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="text-sm text-red-500 mt-1 block">
                    {error}
                </span>
            )}
        </div>
    );
});

Select.displayName = "Select";

export default Select; 