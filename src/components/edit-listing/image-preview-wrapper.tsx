"use client";

import { useImages } from "@/context/edit-listing/images-context";
import { ImagePreviewCarousel } from "./image-preview-carousel";

export const ImagePreviewWrapper = () => {
  const { images, existingImages, removeImage, removeExistingImage } =
    useImages();

  return (
    <div className="w-full lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
      <div className="sticky top-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Preview Images
          </h2>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {existingImages.length + images.length} total
          </div>
        </div>

        {existingImages.length === 0 && images.length === 0 ? (
          <div className="flex aspect-3/2 items-center justify-center rounded-lg bg-gray-50 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-500 font-medium">
                No images uploaded yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Upload images in the form to see them here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ImagePreviewCarousel
              existingImages={existingImages}
              newImages={images}
              onRemoveExisting={removeExistingImage}
              onRemoveNew={removeImage}
            />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">
                    Existing: {existingImages.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">New: {images.length}</span>
                </div>
              </div>
              <span className="text-gray-400">
                {existingImages.length + images.length}/10 max
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
