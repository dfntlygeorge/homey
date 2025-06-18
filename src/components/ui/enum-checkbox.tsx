import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { formatEnumValue } from "@/lib/utils"; // Assuming this utility exists

interface EnumCheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  enumValues: Record<string, string>;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function EnumCheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  enumValues,
  description,
  disabled = false,
  className,
}: EnumCheckboxFieldProps<TFieldValues, TName>) {
  const options = Object.values(enumValues).map((value) => ({
    value,
    label: formatEnumValue(value),
  }));

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormControl>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${option.value}`}
                    checked={field.value === option.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange(option.value);
                      }
                    }}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`${name}-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Alternative version for multiple selections (if needed)
export function EnumMultiCheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  enumValues,
  description,
  disabled = false,
  className,
}: EnumCheckboxFieldProps<TFieldValues, TName>) {
  const options = Object.values(enumValues).map((value) => ({
    value,
    label: formatEnumValue(value),
  }));

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormControl>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${option.value}`}
                    checked={field.value?.includes(option.value) || false}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, option.value]);
                      } else {
                        field.onChange(
                          currentValue.filter(
                            (val: string) => val !== option.value
                          )
                        );
                      }
                    }}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`${name}-${option.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
