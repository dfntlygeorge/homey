"use client";
import { Control } from "react-hook-form";
import { RoomType } from "@prisma/client";
import { FormInput } from "@/components/ui/form-input";
import { FormTextarea } from "@/components/ui/form-textarea";
import { FormSelect } from "@/components/ui/form-select";
import { UpdateListingType } from "@/app/_schemas/form.schema";

export function StepBasicInfo({
  control,
}: {
  control: Control<UpdateListingType>;
}) {
  return (
    <div className="space-y-6">
      <FormInput
        control={control}
        name="title"
        label="Title"
        placeholder="Ex. Spacious Dorm Room"
        required
      />
      <FormTextarea
        control={control}
        name="description"
        label="Description"
        placeholder="Describe your property..."
        rows={4}
      />
      <FormSelect
        control={control}
        name="roomType"
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
