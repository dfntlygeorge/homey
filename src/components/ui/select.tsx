"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { ChangeEvent, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectClassName?: string;
  noDefault?: boolean;
  placeholder?: string;
}

export const Select = (props: SelectProps) => {
  const {
    label,
    value,
    options,
    onChange,
    className,
    selectClassName,
    noDefault = true,
    placeholder,
    ...rest
  } = props;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground/90">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          onChange={onChange}
          value={value ?? ""}
          className={cn(
            "w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm transition-colors",
            "hover:border-input/80 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            selectClassName
          )}
          {...rest}
        >
          {noDefault && (
            <option value="" className="text-muted-foreground">
              {placeholder ?? `Select ${label?.toLowerCase() || "option"}`}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-foreground"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
};
