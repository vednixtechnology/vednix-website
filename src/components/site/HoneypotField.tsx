import React from "react";

interface HoneypotFieldProps {
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * An accessible, visually hidden honeypot field.
 * Legitimate human users will not see or interact with this field.
 * Automated bots scraping DOM inputs will populate it, allowing the server to block the submission.
 */
export function HoneypotField({
  name = "website",
  value = "",
  onChange,
}: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <label htmlFor={`hp_${name}`}>Please leave this field empty</label>
      <input
        type="text"
        id={`hp_${name}`}
        name={name}
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
