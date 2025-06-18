"use client";

import { usePhotos } from "@/context/edit-listing/images-context";
import { ImagePreviewCarousel } from "./image-preview-carousel";

export const ImagePreviewWrapper = () => {
  const { photos, existingImages, removePhoto, removeExistingImage } =
    usePhotos();

  return (
    <div className="w-1/2 p-4">
      <h2 className="mb-4 text-xl font-semibold">Preview Images</h2>
      {existingImages.length === 0 && photos.length === 0 ? (
        <div className="flex aspect-3/2 items-center justify-center rounded-md bg-gray-100">
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      ) : (
        <ImagePreviewCarousel
          existingImages={existingImages}
          newPhotos={photos}
          onRemoveExisting={removeExistingImage}
          onRemoveNew={removePhoto}
        />
      )}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Existing: {existingImages.length} | New: {photos.length}
        </p>
      </div>
    </div>
  );
};
