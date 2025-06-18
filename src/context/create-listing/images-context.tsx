"use client";
import { createContext, useContext, useState } from "react";

type UploadedImage = {
  file: File;
  previewUrl: string; // optional, for previewing locally
};

interface ImagesContextValue {
  images: UploadedImage[];
  setImages: (files: UploadedImage[]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
}

const ImagesContext = createContext<ImagesContextValue | null>(null);

export const ImagesProvider = ({ children }: { children: React.ReactNode }) => {
  const [images, setImagesState] = useState<UploadedImage[]>([]);

  const setImages = (files: UploadedImage[]) => setImagesState(files);

  const addImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImagesState((prev) => [...prev, { file, previewUrl }]);
  };

  const removeImage = (index: number) => {
    setImagesState((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ImagesContext.Provider
      value={{ images, setImages, addImage, removeImage }}
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
