"use client";

import { Image as PrismaImage } from "@prisma/client";
import { createContext, useContext, useState } from "react";

export type UploadedImage = {
  file: File;
  previewUrl: string; // optional, for previewing locally
};

interface ImagesContextValue {
  images: UploadedImage[];
  existingImages: PrismaImage[];
  removedImageIds: number[];
  setImages: (files: UploadedImage[]) => void;
  setExistingImages: (images: PrismaImage[]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  removeExistingImage: (imageId: number) => void;
  restoreExistingImage: (imageId: number) => void;
  getKeptImageIds: () => number[];
  getNewImages: () => UploadedImage[];
  imagesChanged: () => boolean;
}

const ImagesContext = createContext<ImagesContextValue | null>(null);

export const ImagesProvider = ({
  children,
  initialImages = [],
}: {
  children: React.ReactNode;
  initialImages?: PrismaImage[];
}) => {
  const [images, setImagesState] = useState<UploadedImage[]>([]);
  const [existingImages, setExistingImagesState] =
    useState<PrismaImage[]>(initialImages);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  const setImages = (files: UploadedImage[]) => setImagesState(files);

  const setExistingImages = (images: PrismaImage[]) =>
    setExistingImagesState(images);

  const addImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImagesState((prev) => [...prev, { file, previewUrl }]);
  };

  const removeImage = (index: number) => {
    setImagesState((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const restoreExistingImage = (imageId: number) => {
    setRemovedImageIds((prev) => prev.filter((id) => id !== imageId));
  };

  const visibleExistingImages = existingImages.filter(
    (img) => !removedImageIds.includes(img.id)
  );

  const getKeptImageIds = () => {
    return existingImages
      .filter((img) => !removedImageIds.includes(img.id))
      .map((img) => img.id);
  };

  const getNewImages = () => images;

  const imagesChanged = () => {
    return removedImageIds.length > 0 || images.length > 0;
  };

  return (
    <ImagesContext.Provider
      value={{
        images,
        existingImages: visibleExistingImages,
        removedImageIds,
        setImages,
        setExistingImages,
        addImage,
        removeImage,
        removeExistingImage,
        restoreExistingImage,
        getKeptImageIds,
        getNewImages,
        imagesChanged,
      }}
    >
      {children}
    </ImagesContext.Provider>
  );
};

export const useImages = () => {
  const ctx = useContext(ImagesContext);
  if (!ctx) throw new Error("useImages must be used within an ImagesProvider");
  return ctx;
};
