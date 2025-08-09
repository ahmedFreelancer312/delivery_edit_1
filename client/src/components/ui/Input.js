import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  className = "",
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? "is-invalid" : ""} ${className}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input;
