"use client";

import {
  CreateListingSchema,
  CreateListingType,
} from "@/app/_schemas/form.schema";
import { FileSchema } from "@/app/_schemas/file.schema";
import { SearchBoxSuggestion } from "@/config/types/autocomplete-address.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { useTransition, useCallback, useState, useEffect } from "react";
import { createListingAction } from "@/app/_actions/manage/create-listing";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { toast } from "sonner";
import { generateSessionToken } from "@/lib/utils";
import { env } from "@/env";
import { useImages } from "@/context/edit-listing/images-context";
import { ZodError } from "zod";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { EDIT_LISTING_STEPS as CREATE_LISTING_STEPS } from "@/config/constants";
import { StepBasicInfo } from "../shared/step-basic-info";
import { StepPricingAddress } from "../shared/step-pricing-address";
import { StepPolicies } from "../shared/step-policies";
import { StepImages } from "../shared/step-images";
import { CreateListingProgressHeader } from "./create-listing-progress-header";

export const CreateListingForm = () => {
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { addImage, getNewImages } = useImages();

  const defaultValues: CreateListingType = {
    title: "",
    description: "",
    roomType: "STUDIO",
    rent: 0,
    slotsAvailable: 1,
    address: "",
    longitude: 0,
    latitude: 0,
    contact: "",
    genderPolicy: "MIXED",
    curfew: "NO_CURFEW",
    caretaker: "NOT_AVAILABLE",
    pets: "NOT_ALLOWED",
    kitchen: "NOT_AVAILABLE",
    wifi: "NOT_AVAILABLE",
    laundry: "NOT_AVAILABLE",
    utilities: "NOT_INCLUDED",
    facebookProfile: "",
    images: [],
  };

  const form = useForm<CreateListingType>({
    resolver: zodResolver(CreateListingSchema),
    mode: "all",
    defaultValues,
  });

  // Update form images field whenever images context changes
  useEffect(() => {
    const newImages = getNewImages();
    form.setValue(
      "images",
      newImages.map((image) => image.file),
      { shouldValidate: true }
    );
  }, [getNewImages, form]);

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {}
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

    // This will be handled by the useEffect above
    e.target.value = "";
  };

  const onSubmit = (data: CreateListingType) => {
    startTransition(async () => {
      try {
        const newImages = getNewImages();

        // Add images to form data
        const formDataWithImages = {
          ...data,
          images: newImages.map((image) => image.file),
        };

        const result = await createListingAction(formDataWithImages);

        if (result.success) {
          toast.success("Listing created successfully!");
          router.push(routes.listings);
        } else {
          toast.error(result.message || "Failed to create listing");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("An error occurred while creating the listing");
      }
    });
  };

  // Get fields for each step
  const getStepFields = (step: number): (keyof CreateListingType)[] => {
    switch (step) {
      case 0:
        return ["title", "description", "roomType"];
      case 1:
        return ["rent", "slotsAvailable", "address", "contact"];
      case 2:
        return [
          "genderPolicy",
          "curfew",
          "caretaker",
          "pets",
          "kitchen",
          "wifi",
          "laundry",
          "utilities",
          "facebookProfile",
        ];
      case 3:
        return ["images"];
      default:
        return [];
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = async () => {
    const stepFields = getStepFields(currentStep);
    const isValid = await form.trigger(stepFields);
    return isValid;
  };

  const nextStep = async () => {
    if (currentStep < CREATE_LISTING_STEPS.length - 1) {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(currentStep + 1);
      } else {
        toast.error("Please fill in all required fields before proceeding");
      }
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
        return <StepBasicInfo<CreateListingType> control={form.control} />;
      case 1:
        return (
          <StepPricingAddress<CreateListingType>
            control={form.control}
            handleAddressSelect={handleAddressSelect}
          />
        );
      case 2:
        return <StepPolicies<CreateListingType> control={form.control} />;
      case 3:
        return (
          <StepImages<CreateListingType>
            control={form.control}
            handleFileChange={handleFileChange}
            formWatch={form.watch}
            originalValues={defaultValues}
          />
        );
      default:
        return null;
    }
  };

  // Check if current step is valid (for styling purposes)
  const isCurrentStepValid = () => {
    const stepFields = getStepFields(currentStep);
    const errors = form.formState.errors;
    return stepFields.every((field) => !errors[field]);
  };

  return (
    <div className="w-1/2 p-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <CreateListingProgressHeader currentStep={currentStep} />

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

              {currentStep === CREATE_LISTING_STEPS.length - 1 ? (
                <button
                  type="submit"
                  disabled={isPending || !isCurrentStepValid()}
                  className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isPending ? "Creating..." : "Create Listing"}
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
