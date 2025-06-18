import { ReactNode } from "react";

interface FormFieldGroupProps {
  title: string;
  children: ReactNode;
  description?: string;
}

export const FormFieldGroup = ({
  title,
  children,
  description,
}: FormFieldGroupProps) => {
  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
};
