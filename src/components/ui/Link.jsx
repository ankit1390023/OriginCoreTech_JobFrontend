import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Link = ({
    children,
    to,
    variant = "default", // "default", "primary", "secondary"
    className = "",
    external = false,
    ...props
}) => {
    const baseStyles = "transition-colors duration-200";

    const variantStyles = {
        default: "text-gray-600 hover:text-gray-800 hover:underline",
        primary: "text-red-500 hover:text-red-600 hover:underline font-medium",
        secondary: "text-blue-500 hover:text-blue-600 hover:underline"
    };

    const linkClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;

    if (external) {
        return (
            <a
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
                {...props}
            >
                {children}
            </a>
        );
    }

    return (
        <RouterLink
            to={to}
            className={linkClasses}
            {...props}
        >
            {children}
        </RouterLink>
    );
};

export default Link; 