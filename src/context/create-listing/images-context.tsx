"use client";
import { createContext, useContext, useState } from "react";

type UploadedPhoto = {
  file: File;
  previewUrl: string; // optional, for previewing locally
};

interface PhotosContextValue {
  photos: UploadedPhoto[];
  setPhotos: (files: UploadedPhoto[]) => void;
  addPhoto: (file: File) => void;
  removePhoto: (index: number) => void;
}

const PhotosContext = createContext<PhotosContextValue | null>(null);

export const PhotosProvider = ({ children }: { children: React.ReactNode }) => {
  const [photos, setPhotosState] = useState<UploadedPhoto[]>([]);

  const setPhotos = (files: UploadedPhoto[]) => setPhotosState(files);

  const addPhoto = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setPhotosState((prev) => [...prev, { file, previewUrl }]);
  };

  const removePhoto = (index: number) => {
    setPhotosState((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <PhotosContext.Provider
      value={{ photos, setPhotos, addPhoto, removePhoto }}
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
