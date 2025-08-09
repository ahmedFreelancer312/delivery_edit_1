import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass =
    size === "small" ? "btn-sm" : size === "large" ? "btn-lg" : "";

  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
