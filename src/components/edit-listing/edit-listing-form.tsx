"use client";

import {
  UpdateListingSchema,
  UpdateListingType,
} from "@/app/_schemas/form.schema";
import { FileSchema } from "@/app/_schemas/file.schema";
import { SearchBoxSuggestion } from "@/config/types/autocomplete-address.type";

import { ListingWithImages } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useTransition, useMemo, useCallback } from "react";
import { updateListingAction } from "@/app/_actions/update-listing";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { generateSessionToken } from "@/lib/utils";
import { FormFieldGroup } from "../ui/form-field-groups";
import { FormInput } from "../ui/form-input";
import { FormTextarea } from "../ui/form-textarea";
import { FormSelect } from "../ui/form-select";
import {
  CaretakerAvailability,
  CurfewPolicy,
  GenderPolicy,
  PetPolicy,
  KitchenAvailability,
  WifiAvailability,
  LaundryAvailability,
  UtilityInclusion,
  RoomType,
} from "@prisma/client";
import { AddressAutocomplete } from "../create-listing/address-autocomplete";
import { env } from "@/env";
import { EnumCheckboxField } from "../ui/enum-checkbox";
import { useImages } from "@/context/edit-listing/images-context";
import { ZodError } from "zod";
import { getChangedFields } from "@/lib/forms";

export const EditListingForm = ({
  listing,
}: {
  listing: ListingWithImages;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { addImage, imagesChanged, removedImageIds, getNewImages } =
    useImages();

  const {
    title,
    description,
    roomType,
    rent,
    slotsAvailable,
    address,
    longitude,
    latitude,
    contact,
    genderPolicy,
    curfew,
    caretaker,
    pets,
    kitchen,
    wifi,
    laundry,
    utilities,
    facebookProfile,
    id,
  } = listing;

  const originalValues: UpdateListingType = useMemo(
    () => ({
      title,
      description,
      roomType,
      rent,
      slotsAvailable,
      address,
      longitude,
      latitude,
      contact,
      genderPolicy,
      curfew,
      caretaker,
      pets,
      kitchen,
      wifi,
      laundry,
      utilities,
      ...(facebookProfile &&
        facebookProfile.trim() !== "" && { facebookProfile }),
    }),
    [
      title,
      description,
      roomType,
      rent,
      slotsAvailable,
      address,
      longitude,
      latitude,
      contact,
      genderPolicy,
      curfew,
      caretaker,
      pets,
      kitchen,
      wifi,
      laundry,
      utilities,
      facebookProfile,
    ]
  );

  const form = useForm<UpdateListingType>({
    resolver: zodResolver(UpdateListingSchema),
    mode: "onBlur",
    defaultValues: originalValues,
  });

  const handleAddressSelect = useCallback(
    async (suggestion: SearchBoxSuggestion) => {
      try {
        const accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        const sessionToken = generateSessionToken(); // You might want to use the same token
        const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?access_token=${accessToken}&session_token=${sessionToken}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          if (feature.geometry && feature.geometry.coordinates) {
            const [longitude, latitude] = feature.geometry.coordinates;
            // Update the form with coordinates
            form.setValue("longitude", longitude);
            form.setValue("latitude", latitude);
          }
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    },
    [form]
  );
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    for (const file of files) {
      try {
        await FileSchema.parseAsync(file);
        addImage(file); // ✅ only add if valid
      } catch (err) {
        const errorMessage =
          err instanceof ZodError ? err.errors[0]?.message : "Invalid file";
        form.setError("photos", {
          type: "manual",
          message: errorMessage,
        });
      }
    }

    // Reset the file input to allow uploading the same file again if needed
    e.target.value = "";
  };

  const onSubmit = (data: UpdateListingType) => {
    console.log("🔥 Submitting form with data:", data);

    startTransition(async () => {
      try {
        const changedFields = getChangedFields(originalValues, data);
        const newImages = getNewImages();
        const deletedImageIds = removedImageIds;

        const hasImageChanged = imagesChanged();
        console.log(
          `Did image changed? ${hasImageChanged ? "YESSSS" : "NOOOO"}`
        );

        if (Object.keys(changedFields).length === 0 && !hasImageChanged) {
          toast.info("No changes detected");
          return;
        }

        console.log("WOULD SEND THE FOLLOWING DETAILS TO THE SERVER: ");
        console.log("IMAGES TO UPLOAD(FILES): ");
        console.log("IMAGES TO DELETE(IDS): ", deletedImageIds);

        // Actually call the update action
        const result = await updateListingAction({
          listingId: id,
          formData: changedFields,
          deletedImageIds,
          imagesToUpload: newImages,
        });

        console.log("✅ Update result:", result);

        if (result.success) {
          toast.success("Listing updated successfully!");
          router.push(routes.singleProperty(id));
        } else {
          toast.error(result.message || "Failed to update listing");
        }
      } catch (error) {
        console.error("❌ Error updating listing:", error);
        toast.error("An error occurred while updating the listing");
      }
    });
  };

  return (
    <div className="h-full max-w-sm mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormFieldGroup title="Basic Information">
            <FormInput
              control={form.control}
              name="title"
              label="Title"
              placeholder="Ex. Spacious Dorm Room"
              required
            />

            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Describe your property..."
              rows={3}
            />

            <FormSelect
              control={form.control}
              name="roomType"
              label="Room Type"
              options={Object.values(RoomType).map((roomType) => ({
                value: roomType,
                label: roomType,
              }))}
              required
            />
          </FormFieldGroup>

          {/* Pricing & Availability */}
          <FormFieldGroup title="Pricing & Availability">
            <FormInput
              control={form.control}
              name="rent"
              label="Monthly Rent"
              placeholder="5000"
              type="number"
              required
            />

            <FormInput
              control={form.control}
              name="slotsAvailable"
              label="Available Slots"
              placeholder="2"
              type="number"
              required
            />
          </FormFieldGroup>

          <FormFieldGroup title="Location">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address">Complete Address</FormLabel>
                  <FormControl>
                    <AddressAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Start typing your address for suggestions..."
                      onSelect={handleAddressSelect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormInput
              control={form.control}
              name="contact"
              label="Contact Info"
              placeholder="09123456789"
              type="tel"
              required
            />

            <FormInput
              control={form.control}
              name="facebookProfile"
              label="Facebook Profile"
              placeholder="https://facebook.com/..."
            />
          </FormFieldGroup>

          <FormFieldGroup title="House rules">
            <EnumCheckboxField
              control={form.control}
              name="genderPolicy"
              label="Gender Policy"
              enumValues={GenderPolicy}
              description="Select the gender policy that applies"
            />

            <EnumCheckboxField
              control={form.control}
              name="curfew"
              label="Curfew Policy"
              enumValues={CurfewPolicy}
              description="Select the applicable curfew"
            />

            <EnumCheckboxField
              control={form.control}
              name="caretaker"
              label="Caretaker Availability"
              enumValues={CaretakerAvailability}
              description="Is a caretaker available?"
            />

            <EnumCheckboxField
              control={form.control}
              name="pets"
              label="Pet Policy"
              enumValues={PetPolicy}
              description="Are pets allowed?"
            />

            <EnumCheckboxField
              control={form.control}
              name="kitchen"
              label="Kitchen Availability"
              enumValues={KitchenAvailability}
              description="Is there access to a kitchen?"
            />

            <EnumCheckboxField
              control={form.control}
              name="wifi"
              label="Wi-Fi Availability"
              enumValues={WifiAvailability}
              description="Is Wi-Fi available?"
            />

            <EnumCheckboxField
              control={form.control}
              name="laundry"
              label="Laundry Availability"
              enumValues={LaundryAvailability}
              description="Is laundry available?"
            />

            <EnumCheckboxField
              control={form.control}
              name="utilities"
              label="Utilities Inclusion"
              enumValues={UtilityInclusion}
              description="Which utilities are included?"
            />
          </FormFieldGroup>

          <FormFieldGroup title="Photos">
            <FormField
              control={form.control}
              name="photos"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="photos">Upload Photos</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormFieldGroup>

          {/* Show changed fields for debugging */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <strong>Changed fields:</strong>
            <pre>
              {JSON.stringify(
                getChangedFields(originalValues, form.watch()),
                null,
                2
              )}
            </pre>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Listing"}
          </button>
        </form>
      </Form>
    </div>
  );
};
