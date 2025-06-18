import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { UpdateListingType } from "@/app/_schemas/form.schema";

interface FormInputProps {
  control: Control;
  name: keyof UpdateListingType;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "tel";
  required?: boolean;
}

export const FormInput = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: FormInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel
            htmlFor={name}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              className="h-9 text-sm"
              // Convert string to number for number inputs
              onChange={(e) => {
                if (type === "number") {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(value);
                } else {
                  field.onChange(e.target.value);
                }
              }}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
