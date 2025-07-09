"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getChangedFields } from "@/lib/forms";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface StepImagesProps<T extends FieldValues> {
  control: Control<T>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  originalValues?: T;
  formWatch?: () => T;
}

export const StepImages = <T extends FieldValues>({
  control,
  handleFileChange,
  originalValues,
  formWatch,
}: StepImagesProps<T>) => {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name={"images" as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="images">Upload Images</FormLabel>
            <FormControl>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    handleFileChange(e);
                    // Update the form field value to trigger validation
                    const filesArray = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    field.onChange(filesArray);
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="text-gray-400">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </div>
                </label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Debug info - only show in development */}
      {process.env.NODE_ENV === "development" &&
        originalValues &&
        formWatch && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
            <strong>Changed fields:</strong>
            <pre className="mt-2 overflow-auto">
              {JSON.stringify(
                getChangedFields(originalValues, formWatch()),
                null,
                2
              )}
            </pre>
          </div>
        )}
    </div>
  );
};
