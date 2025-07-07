"use client";
import { Control } from "react-hook-form";
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
import { UpdateListingType } from "@/app/_schemas/form.schema";

export function StepPolicies({
  control,
}: {
  control: Control<UpdateListingType>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EnumCheckboxField
        control={control}
        name="genderPolicy"
        label="Gender Policy"
        enumValues={GenderPolicy}
      />
      <EnumCheckboxField
        control={control}
        name="curfew"
        label="Curfew Policy"
        enumValues={CurfewPolicy}
      />
      <EnumCheckboxField
        control={control}
        name="caretaker"
        label="Caretaker Availability"
        enumValues={CaretakerAvailability}
      />
      <EnumCheckboxField
        control={control}
        name="pets"
        label="Pet Policy"
        enumValues={PetPolicy}
      />
      <EnumCheckboxField
        control={control}
        name="kitchen"
        label="Kitchen Availability"
        enumValues={KitchenAvailability}
      />
      <EnumCheckboxField
        control={control}
        name="wifi"
        label="Wi-Fi Availability"
        enumValues={WifiAvailability}
      />
      <EnumCheckboxField
        control={control}
        name="laundry"
        label="Laundry Availability"
        enumValues={LaundryAvailability}
      />
      <EnumCheckboxField
        control={control}
        name="utilities"
        label="Utilities Inclusion"
        enumValues={UtilityInclusion}
      />
    </div>
  );
}
