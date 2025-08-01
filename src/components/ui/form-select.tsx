import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
}

export const FormSelect = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  required = false,
}: FormSelectProps<T>) => {
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
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-sm"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};
