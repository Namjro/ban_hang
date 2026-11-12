import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-semibold text-ink">
          {label}
          {props.required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full min-h-[44px] bg-canvas border rounded-[4px] px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-dim transition-colors focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 ${
          error ? 'border-red-500' : 'border-line'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-[12px] text-red-600 font-medium">{error}</p>}
      {!error && hint && <p className="text-[12px] text-ink-dim">{hint}</p>}
    </div>
  );
}
