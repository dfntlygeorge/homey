"use client";

import { AwaitedPageProps, ListingFormStep } from "@/config/types";
import { useImages } from "@/context/create-listing/images-context";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  Check,
  AlertCircle,
  Home,
  MapPin,
  Shield,
  Wifi,
  Loader2,
} from "lucide-react";
import { formatEnumValue } from "@/lib/utils";
import { useTransition } from "react";
import { createListingAction } from "@/app/_actions/create-listing";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/config/routes";

export const ReviewSubmitStep = ({ searchParams }: AwaitedPageProps) => {
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();
  const router = useRouter();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", ListingFormStep.UPLOAD_IMAGES.toString());
      router.push(url.toString());
    });
  };

  // retrieve data from previous steps
  const { images, removeImage } = useImages();
  const title = decodeURIComponent(searchParams?.title as string) || "";
  const description =
    decodeURIComponent(searchParams?.description as string) || "";
  const roomType = decodeURIComponent(searchParams?.roomType as string) || "";
  const rent = Number(decodeURIComponent(searchParams?.rent as string));
  const slotsAvailable = Number(
    decodeURIComponent(searchParams?.slotsAvailable as string)
  );
  const address = decodeURIComponent(searchParams?.address as string) || "";
  const latitude = Number(decodeURIComponent(searchParams?.latitude as string));
  const longitude = Number(
    decodeURIComponent(searchParams?.longitude as string)
  );
  const contact = decodeURIComponent(searchParams?.contact as string) || "";
  const genderPolicy =
    decodeURIComponent(searchParams?.genderPolicy as string) || "";
  const curfew = decodeURIComponent(searchParams?.curfew as string) || "";
  const caretaker = decodeURIComponent(searchParams?.caretaker as string) || "";
  const pets = decodeURIComponent(searchParams?.pets as string) || "";
  const kitchen = decodeURIComponent(searchParams?.kitchen as string) || "";
  const wifi = decodeURIComponent(searchParams?.wifi as string) || "";
  const laundry = decodeURIComponent(searchParams?.laundry as string) || "";
  const utilities = decodeURIComponent(searchParams?.utilities as string) || "";
  const facebookProfile = decodeURIComponent(
    (searchParams?.facebookProfile as string) || ""
  );

  // Helper function to render feature badges
  const FeatureBadge = ({ value, label }: { value: string; label: string }) => (
    <div className="flex items-center bg-blue-50 rounded-full px-3 py-1 text-sm text-blue-800">
      <Check size={16} className="mr-1" />
      <span>
        {label}: {value}
      </span>
    </div>
  );

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        // Add all text fields to FormData
        formData.append("title", title);
        formData.append("description", description);
        formData.append("roomType", roomType);
        formData.append("rent", rent.toString());
        formData.append("slotsAvailable", slotsAvailable.toString());
        formData.append("address", address);
        formData.append("longitude", longitude.toString());
        formData.append("latitude", latitude.toString());
        formData.append("contact", contact);
        formData.append("genderPolicy", genderPolicy);
        formData.append("curfew", curfew);
        formData.append("caretaker", caretaker);
        formData.append("pets", pets);
        formData.append("kitchen", kitchen);
        formData.append("wifi", wifi);
        formData.append("laundry", laundry);
        formData.append("utilities", utilities);
        formData.append("facebookProfile", facebookProfile);

        images.forEach((image) => {
          formData.append("images", image.file);
        });

        // Call the server action
        const result = await createListingAction(formData);

        if (result?.success) {
          toast.success("Listing created successfully!", {
            description: "Your listing has been published.",
          });
          // Redirect to the listings page after successful submission

          router.push(routes.listings);
        } else {
          toast.error("Failed to create listing", {
            description: result?.message || "Please try again.",
          });
        }
      } catch (error) {
        toast.error("Error creating listing", {
          description: "An unexpected error occurred. Please try again.",
        });
        console.error("Error submitting listing:", error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Review Your Listing
        </h1>
        <p className="text-gray-500 mt-2">
          Please verify all the information before submitting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content - Left Side (2 cols) */}
        <div className="md:col-span-2 space-y-8">
          {/* Basic Info Section */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Home className="text-blue-600 mr-2" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">
                Property Details
              </h2>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium">
                  {roomType}
                </span>
                <span className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                  ₱{rent}/month
                </span>
                <span className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-medium">
                  {slotsAvailable} {slotsAvailable > 1 ? "slots" : "slot"}{" "}
                  available
                </span>
              </div>

              <div className="flex items-start mt-2">
                <MapPin
                  size={20}
                  className="text-gray-500 mt-1 mr-2 flex-shrink-0"
                />
                <p className="text-gray-700">{address}</p>
              </div>

              <div className="bg-white p-4 rounded-lg mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{description}</p>
              </div>
            </div>
          </section>

          {/* IMages Section */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={image.previewUrl}
                        alt={`Listing image ${index + 1}`}
                        layout="responsive"
                        width={400}
                        height={300}
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-gray-500">No images uploaded yet.</p>
              </div>
            )}
          </section>
        </div>

        {/* Sidebar - Right Side (1 col) */}
        <div className="space-y-6">
          {/* Contact Info */}
          <section className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Facebook Profile
            </h2>
            <p className="text-gray-700">{facebookProfile}</p>
          </section>
          <section className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Contact Information
            </h2>
            <p className="text-gray-700">{contact}</p>
          </section>

          {/* House Rules */}
          <section className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <Shield className="text-blue-600 mr-2" size={18} />
              <h2 className="text-lg font-semibold text-gray-800">
                House Rules
              </h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Gender Policy:</span>
                <span className="text-gray-800 font-medium">
                  {formatEnumValue(genderPolicy)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Curfew:</span>
                <span className="text-gray-800 font-medium">
                  {formatEnumValue(curfew)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Caregiver:</span>
                <span className="text-gray-800 font-medium">
                  {formatEnumValue(caretaker)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pets Allowed:</span>
                <span className="text-gray-800 font-medium">
                  {formatEnumValue(pets)}
                </span>
              </div>
            </div>
          </section>

          {/* Amenities */}
          <section className="bg-gray-50 p-5 rounded-lg">
            <div className="flex items-center mb-3">
              <Wifi className="text-blue-600 mr-2" size={18} />
              <h2 className="text-lg font-semibold text-gray-800">Amenities</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {kitchen && (
                <FeatureBadge
                  label="Kitchen"
                  value={formatEnumValue(kitchen)}
                />
              )}
              {wifi && (
                <FeatureBadge label="Wi-Fi" value={formatEnumValue(wifi)} />
              )}
              {laundry && (
                <FeatureBadge
                  label="Laundry"
                  value={formatEnumValue(laundry)}
                />
              )}
              {utilities && (
                <FeatureBadge
                  label="Utilities"
                  value={formatEnumValue(utilities)}
                />
              )}
            </div>
          </section>

          {/* Submit and Back Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSubmit()}
              disabled={isPending}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Listing"
              )}
            </Button>

            <Button
              onClick={prevStep}
              disabled={isPrevPending || isPending}
              variant="outline"
              className="w-full py-4 text-blue-600 font-medium rounded-lg transition"
            >
              {isPrevPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Going Back...
                </>
              ) : (
                "Back to Images"
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-2">
            By submitting, you agree to our terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
};
