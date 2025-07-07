"use client";

import {
  UpdateListingSchema,
  UpdateListingType,
} from "@/app/_schemas/form.schema";
import { FileSchema } from "@/app/_schemas/file.schema";
import { SearchBoxSuggestion } from "@/config/types/autocomplete-address.type";

import { ListingWithImagesAndAddress } from "@/config/types";
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
import { useTransition, useMemo, useCallback, useState } from "react";
import { updateListingAction } from "@/app/_actions/update-listing";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { generateSessionToken } from "@/lib/utils";
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
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { EDIT_LISTING_STEPS } from "@/config/constants";

export const EditListingForm = ({
  listing,
}: {
  listing: ListingWithImagesAndAddress;
}) => {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);
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
      address: address.formattedAddress,
      longitude: address.longitude,
      latitude: address.latitude,
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
    }),
    [
      title,
      description,
      roomType,
      rent,
      slotsAvailable,
      address,
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
        const sessionToken = generateSessionToken();
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
        addImage(file);
      } catch (err) {
        const errorMessage =
          err instanceof ZodError ? err.errors[0]?.message : "Invalid file";
        form.setError("images", {
          type: "manual",
          message: errorMessage,
        });
      }
    }

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

        const result = await updateListingAction({
          listingId: id,
          formData: changedFields,
          deletedImageIds,
          imagesToUpload: newImages,
        });

        console.log("✅ Update result:", result);

        if (result.success) {
          toast.success("Listing updated successfully!");
          router.push(routes.listing(id));
        } else {
          toast.error(result.message || "Failed to update listing");
        }
      } catch (error) {
        console.error("❌ Error updating listing:", error);
        toast.error("An error occurred while updating the listing");
      }
    });
  };

  const nextStep = () => {
    if (currentStep < EDIT_LISTING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
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
              rows={4}
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
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="images">Upload Images</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
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
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs">
                <strong>Changed fields:</strong>
                <pre className="mt-2 overflow-auto">
                  {JSON.stringify(
                    getChangedFields(originalValues, form.watch()),
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-1/2 p-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {EDIT_LISTING_STEPS.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < EDIT_LISTING_STEPS.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                {index < EDIT_LISTING_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {EDIT_LISTING_STEPS[currentStep].title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {EDIT_LISTING_STEPS[currentStep].description}
            </p>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="min-h-[400px]">{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevStep();
                }}
                disabled={currentStep === 0}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  currentStep === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep === EDIT_LISTING_STEPS.length - 1 ? (
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isPending ? "Updating..." : "Update Listing"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextStep();
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
