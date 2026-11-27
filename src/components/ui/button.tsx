import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-ink shadow-[0_14px_36px_-18px_var(--primary)] hover:brightness-110 active:brightness-95",
  secondary:
    "bg-panel-strong text-ink border border-line hover:border-line-strong hover:bg-panel",
  outline:
    "border border-line-strong bg-transparent text-ink hover:bg-panel-soft hover:border-primary/60",
  ghost: "bg-transparent text-ink-soft hover:bg-panel-soft hover:text-ink",
  gold: "bg-gold text-gold-ink shadow-[0_14px_36px_-20px_var(--gold)] hover:brightness-105",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-[0.9375rem] gap-2.5",
};

export function buttonStyles(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex select-none items-center justify-center rounded-full font-medium tracking-tight transition-all duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary",
    "disabled:pointer-events-none disabled:opacity-45",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles(variant, size, className)} {...props} />;
}
