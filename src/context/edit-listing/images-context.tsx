"use client";
// Using the actual shape of your Image type
type DatabaseImage = {
  id: number;
  url: string;
  listingId: number;
  createdAt: Date;
};
import { createContext, useContext, useState } from "react";

export type UploadedPhoto = {
  file: File;
  previewUrl: string; // optional, for previewing locally
};

interface PhotosContextValue {
  photos: UploadedPhoto[];
  existingImages: DatabaseImage[];
  removedImageIds: number[];
  setPhotos: (files: UploadedPhoto[]) => void;
  setExistingImages: (images: DatabaseImage[]) => void;
  addPhoto: (file: File) => void;
  removePhoto: (index: number) => void;
  removeExistingImage: (imageId: number) => void;
  restoreExistingImage: (imageId: number) => void;
  // Helper to get all images that should be kept (for form submission)
  getKeptImageIds: () => number[];
  // Helper to get all new photos (for form submission)
  getNewPhotos: () => UploadedPhoto[];
  imagesChanged: () => boolean;
}

const PhotosContext = createContext<PhotosContextValue | null>(null);

export const ImagesProvider = ({
  children,
  initialImages = [],
}: {
  children: React.ReactNode;
  initialImages?: DatabaseImage[];
}) => {
  const [photos, setPhotosState] = useState<UploadedPhoto[]>([]);
  const [existingImages, setExistingImagesState] =
    useState<DatabaseImage[]>(initialImages);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  const setPhotos = (files: UploadedPhoto[]) => setPhotosState(files);

  const setExistingImages = (images: DatabaseImage[]) =>
    setExistingImagesState(images);

  const addPhoto = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPhotosState((prev) => [...prev, { file, previewUrl }]);
  };

  const removePhoto = (index: number) => {
    setPhotosState((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const restoreExistingImage = (imageId: number) => {
    setRemovedImageIds((prev) => prev.filter((id) => id !== imageId));
  };

  // Filter out removed images from existing images
  const visibleExistingImages = existingImages.filter(
    (img) => !removedImageIds.includes(img.id)
  );

  // Helper functions for form submission
  const getKeptImageIds = () => {
    return existingImages
      .filter((img) => !removedImageIds.includes(img.id))
      .map((img) => img.id);
  };

  const getNewPhotos = () => photos;
  const imagesChanged = () => {
    return removedImageIds.length > 0 || photos.length > 0;
  };

  return (
    <PhotosContext.Provider
      value={{
        photos,
        existingImages: visibleExistingImages,
        removedImageIds,
        setPhotos,
        setExistingImages,
        addPhoto,
        removePhoto,
        removeExistingImage,
        restoreExistingImage,
        getKeptImageIds,
        getNewPhotos,
        imagesChanged,
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => {
  const ctx = useContext(PhotosContext);
  if (!ctx) throw new Error("usePhotos must be used within a PhotosProvider");
  return ctx;
};
