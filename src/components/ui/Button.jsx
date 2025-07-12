import React from "react";

const Button = ({
    children,
    variant = "primary", // "primary", "secondary", "outline", "danger"
    size = "default", // "small", "default", "large"
    loading = false,
    disabled = false,
    className = "",
    ...props
}) => {
    const baseStyles = "font-semibold rounded-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none active:outline-none";

    const sizeStyles = {
        small: "py-1 sm:py-1.5 text-xs",
        default: "py-1.5 sm:py-2 text-xs",
        large: "py-3 px-4 text-sm"
    };

    const variantStyles = {
        primary: "bg-[#f44336] text-white hover:bg-[#d32f2f]",
        secondary: "bg-blue-500 text-white hover:bg-blue-600",
        outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50",
        danger: "bg-red-500 text-white hover:bg-red-600"
    };

    const disabledStyles = "bg-gray-400 text-gray-600 cursor-not-allowed hover:scale-100";

    const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${disabled || loading ? disabledStyles : variantStyles[variant]
        } ${className}`;

    return (
        <button
            className={buttonClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center">
                    <svg
                        className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button; 