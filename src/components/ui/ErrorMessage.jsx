import React from "react";

const ErrorMessage = ({
    children,
    className = "",
    size = "default", // "small", "default", "large"
    showIcon = true,
    ...props
}) => {
    const baseStyles = "text-center bg-red-50 rounded-md flex items-center justify-center";

    const sizeStyles = {
        small: "text-xs p-1.5 sm:p-2",
        default: "text-xs p-2 sm:p-3",
        large: "text-sm p-3 sm:p-4"
    };

    const messageClasses = `${baseStyles} ${sizeStyles[size]} text-red-500 ${className}`;

    return (
        <div className={messageClasses} {...props}>
            {showIcon && (
                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
            {children}
        </div>
    );
};

export default ErrorMessage; 