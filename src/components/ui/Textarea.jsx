import React from "react";

const Textarea = React.forwardRef(({
    label,
    error,
    className = "",
    size = "default", // "small", "default", "large"
    variant = "default", // "default", "error", "disabled"
    rows = 3,
    ...props
}, ref) => {
    const baseStyles = "w-full border rounded-md focus:outline-none transition-all duration-200 resize-vertical";

    const sizeStyles = {
        small: "px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs",
        default: "px-3 py-2 text-sm",
        large: "px-4 py-3 text-base"
    };

    const variantStyles = {
        default: "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:border-2",
        error: "border-red-500 bg-red-50 focus:border-red-500 focus:border-2",
        disabled: "border-gray-300 bg-gray-50 cursor-not-allowed"
    };

    const textareaClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

    return (
        <div className="mb-2 sm:mb-3">
            {label && (
                <label className="block text-gray-700 text-xs font-semibold mb-0.5 sm:mb-1">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={textareaClasses}
                {...props}
            />
            {error && (
                <span className="text-sm text-red-500 mt-1 block">
                    {error}
                </span>
            )}
        </div>
    );
});

Textarea.displayName = "Textarea";

export default Textarea; 