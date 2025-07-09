"use client";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  CaretakerAvailability,
  CurfewPolicy,
  GenderPolicy,
  PetPolicy,
  KitchenAvailability,
  WifiAvailability,
  LaundryAvailability,
  UtilityInclusion,
} from "@prisma/client";
import { EnumCheckboxField } from "@/components/ui/enum-checkbox";

interface StepPoliciesProps<T extends FieldValues> {
  control: Control<T>;
}

export function StepPolicies<T extends FieldValues>({
  control,
}: StepPoliciesProps<T>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EnumCheckboxField
        control={control}
        name={"genderPolicy" as FieldPath<T>}
        label="Gender Policy"
        enumValues={GenderPolicy}
      />
      <EnumCheckboxField
        control={control}
        name={"curfew" as FieldPath<T>}
        label="Curfew Policy"
        enumValues={CurfewPolicy}
      />
      <EnumCheckboxField
        control={control}
        name={"caretaker" as FieldPath<T>}
        label="Caretaker Availability"
        enumValues={CaretakerAvailability}
      />
      <EnumCheckboxField
        control={control}
        name={"pets" as FieldPath<T>}
        label="Pet Policy"
        enumValues={PetPolicy}
      />
      <EnumCheckboxField
        control={control}
        name={"kitchen" as FieldPath<T>}
        label="Kitchen Availability"
        enumValues={KitchenAvailability}
      />
      <EnumCheckboxField
        control={control}
        name={"wifi" as FieldPath<T>}
        label="Wi-Fi Availability"
        enumValues={WifiAvailability}
      />
      <EnumCheckboxField
        control={control}
        name={"laundry" as FieldPath<T>}
        label="Laundry Availability"
        enumValues={LaundryAvailability}
      />
      <EnumCheckboxField
        control={control}
        name={"utilities" as FieldPath<T>}
        label="Utilities Inclusion"
        enumValues={UtilityInclusion}
      />
    </div>
  );
}
