import React from "react";

const Badge = ({
    children,
    variant = "default", // "default", "primary", "secondary", "success", "warning", "danger", "info"
    size = "default", // "small", "default", "large"
    className = "",
    color = "", // Custom color classes
    text = "", // Custom text content
    ...props
}) => {
    const baseStyles = "inline-flex items-center font-medium rounded-full px-1.5 sm:px-2 py-0.5 text-xs border border-gray-200 flex items-center gap-1 transition-all duration-200";

    const sizeStyles = {
        small: "px-1.5 sm:px-2 py-0.5 text-xs",
        default: "px-2.5 py-1 text-sm",
        large: "px-3 py-1.5 text-base"
    };

    const variantStyles = {
        default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        primary: "bg-[#f44336] text-white hover:bg-[#d32f2f]",
        secondary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        success: "bg-green-100 text-green-800 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        danger: "bg-red-100 text-red-800 hover:bg-red-200",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200"
    };

    // Use custom color if provided, otherwise use variant styles
    const colorStyles = color || variantStyles[variant];
    const badgeClasses = `${baseStyles} ${colorStyles} ${className}`;

    return (
        <span
            className={badgeClasses}
            {...props}
        >
            {text || children}
        </span>
    );
};

export default Badge; 