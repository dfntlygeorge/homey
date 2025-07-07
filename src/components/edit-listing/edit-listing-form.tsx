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
import { Form } from "../ui/form";
import { useTransition, useMemo, useCallback, useState } from "react";
import { updateListingAction } from "@/app/_actions/update-listing";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { toast } from "sonner";
import { generateSessionToken } from "@/lib/utils";
import { env } from "@/env";
import { useImages } from "@/context/edit-listing/images-context";
import { ZodError } from "zod";
import { getChangedFields } from "@/lib/forms";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { EDIT_LISTING_STEPS } from "@/config/constants";
import { StepBasicInfo } from "./step-basic-info";
import { StepPricingAddress } from "./step-pricing-address";
import { StepPolicies } from "./step-policies";
import { EditListingProgressHeader } from "./edit-listing-progress-header";
import { StepImages } from "./step-images";

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
    mode: "all",
    defaultValues: originalValues,
  });

  // make a custom hook for this
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
        return <StepBasicInfo control={form.control} />;
      case 1:
        return (
          <StepPricingAddress
            control={form.control}
            handleAddressSelect={handleAddressSelect}
          />
        );
      case 2:
        return <StepPolicies control={form.control} />;

      case 3:
        return (
          <StepImages
            control={form.control}
            handleFileChange={handleFileChange}
            originalValues={originalValues}
            formWatch={form.watch}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-1/2 p-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <EditListingProgressHeader currentStep={currentStep} />

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
