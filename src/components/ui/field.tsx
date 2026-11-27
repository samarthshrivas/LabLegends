"use client";

import { useId, type ChangeEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "w-full rounded-xl border border-line bg-panel-soft px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint/70 " +
  "transition-colors focus:border-primary focus:outline-none focus-visible:outline-none disabled:opacity-50";

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  footer?: ReactNode;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 4,
  maxLength = 600,
  required = false,
  disabled = false,
  error,
  className,
  footer,
}: TextAreaFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-1 text-negative">*</span> : null}
        </label>
        <span className="numeric text-[0.6875rem] text-ink-faint">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        aria-describedby={cn(hint && hintId, error && errorId) || undefined}
        aria-invalid={error ? true : undefined}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        className={cn(FIELD_BASE, "resize-y leading-relaxed", error && "border-negative")}
      />
      {hint ? (
        <p id={hintId} className="text-xs leading-relaxed text-ink-faint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-negative">
          {error}
        </p>
      ) : null}
      {footer}
    </div>
  );
}

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "search";
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
  disabled = false,
  className,
  autoComplete,
}: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_BASE}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
