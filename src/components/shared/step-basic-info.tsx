"use client";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { RoomType } from "@prisma/client";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";

interface StepBasicInfoProps<T extends FieldValues> {
  control: Control<T>;
}

export function StepBasicInfo<T extends FieldValues>({
  control,
}: StepBasicInfoProps<T>) {
  return (
    <div className="space-y-6">
      <FormInput
        control={control}
        name={"title" as FieldPath<T>}
        label="Title"
        placeholder="Ex. Spacious Dorm Room"
        required
      />
      <FormTextarea
        control={control}
        name={"description" as FieldPath<T>}
        label="Description"
        placeholder="Describe your property..."
        rows={4}
      />
      <FormSelect
        control={control}
        name={"roomType" as FieldPath<T>}
        label="Room Type"
        options={Object.values(RoomType).map((type) => ({
          value: type,
          label: type,
        }))}
        required
      />
    </div>
  );
}
