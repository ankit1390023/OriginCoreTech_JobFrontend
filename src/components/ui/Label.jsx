import React from "react";

const Label = ({
    children,
    htmlFor,
    className = "",
    size = "default", // "small", "default", "large"
    required = false,
    ...props
}) => {
    const baseStyles = "block text-gray-700 font-semibold";

    const sizeStyles = {
        small: "text-xs mb-0.5 sm:mb-1",
        default: "text-xs mb-0.5 sm:mb-1",
        large: "text-sm mb-2"
    };

    const labelClasses = `${baseStyles} ${sizeStyles[size]} ${className}`;

    return (
        <label htmlFor={htmlFor} className={labelClasses} {...props}>
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

export default Label; 