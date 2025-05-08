"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { ChangeEvent, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  selectClassName?: string;
  noDefault?: boolean;
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
    ...rest
  } = props;

  return (
    <div className={cn("mt-1", className)}>
      {label && <h4 className="text-sm font-semibold">{label}</h4>}
      <div className="mt-1">
        <select
          onChange={onChange} // call the setQueryStates function with the name and value of the selected option.
          value={value ?? ""}
          className={cn(
            selectClassName,
            "border-input custom-select w-full appearance-none rounded-md border bg-no-repeat px-3 py-2 pr-12 focus:outline-hidden disabled:!bg-gray-200"
          )}
          {...rest}
        >
          {noDefault && <option value="">Select</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
