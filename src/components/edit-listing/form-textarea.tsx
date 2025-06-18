import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { UpdateListingType } from "@/app/_schemas/form.schema";

interface FormTextareaProps {
  control: Control;
  name: keyof UpdateListingType;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export const FormTextarea = ({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  required = false,
}: FormTextareaProps) => {
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
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              rows={rows}
              className="text-sm resize-none"
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
