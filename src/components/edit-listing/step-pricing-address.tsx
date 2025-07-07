"use client";
import { Control } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { AddressAutocomplete } from "../create-listing/address-autocomplete";
import { UpdateListingType } from "@/app/_schemas/form.schema";
import { SearchBoxSuggestion } from "@/config/types/autocomplete-address.type";

export function StepPricingAddress({
  control,
  handleAddressSelect,
}: {
  control: Control<UpdateListingType>;
  handleAddressSelect: (suggestion: SearchBoxSuggestion) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="rent"
          label="Monthly Rent"
          placeholder="5000"
          type="number"
          required
        />
        <FormInput
          control={control}
          name="slotsAvailable"
          label="Available Slots"
          placeholder="2"
          type="number"
          required
        />
      </div>

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="address">Complete Address</FormLabel>
            <FormControl>
              <AddressAutocomplete
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Start typing your address..."
                onSelect={handleAddressSelect}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormInput
        control={control}
        name="contact"
        label="Contact Info"
        placeholder="09123456789"
        type="tel"
        required
      />
      <FormInput
        control={control}
        name="facebookProfile"
        label="Facebook Profile"
        placeholder="https://facebook.com/..."
      />
    </div>
  );
}
