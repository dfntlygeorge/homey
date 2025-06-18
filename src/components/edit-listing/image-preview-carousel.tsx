"use client";

import { Image as PrismaImage } from "@prisma/client";
import FsLightbox from "fslightbox-react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/virtual";
import { EffectFade, Navigation, Virtual, Thumbs } from "swiper/modules";
import { SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { SwiperButtons } from "../shared/swiper-buttons";
import { CarouselSkeleton } from "../properties/carousel-skeleton";
import { UploadedImage } from "@/context/edit-listing/images-context";
import { X } from "lucide-react";

// // Using the actual shape of your Image type
// type DatabaseImage = {
//   id: number;
//   url: string;
//   listingId: number;
//   createdAt: Date;
// };

interface PreviewImagesProps {
  existingImages: PrismaImage[];
  newImages: UploadedImage[];
  onRemoveExisting?: (imageId: number) => void;
  onRemoveNew?: (index: number) => void;
}

const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
});

const SwiperThumb = dynamic(
  () => import("swiper/react").then((mod) => mod.Swiper),
  {
    ssr: false,
    loading: () => <CarouselSkeleton />,
  }
);

export const ImagePreviewCarousel = ({
  existingImages,
  newImages,
  onRemoveExisting,
  onRemoveNew,
}: PreviewImagesProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    sourceIndex: 0,
  });

  const setSwiper = (swiper: SwiperType) => {
    setThumbsSwiper(swiper);
  };

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  }, []);

  const handleImageClick = useCallback(() => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      sourceIndex: activeIndex,
    });
  }, [lightboxController.toggler, activeIndex]);

  // Combine existing images and new photos for display
  const allImages = [
    ...existingImages.map((img) => ({
      id: img.id.toString(), // Convert to string for consistent handling
      numericId: img.id, // Keep numeric id for removal
      url: img.url,
      type: "existing" as const,
    })),
    ...newImages.map((image, index) => ({
      id: `new-${index}`,
      url: image.previewUrl,
      type: "new" as const,
      originalIndex: index,
    })),
  ];

  const sources = allImages.map((image) => image.url);

  const handleRemoveImage = (imageData: (typeof allImages)[0]) => {
    if (
      imageData.type === "existing" &&
      onRemoveExisting &&
      "numericId" in imageData
    ) {
      onRemoveExisting(imageData.numericId);
    } else if (
      imageData.type === "new" &&
      onRemoveNew &&
      "originalIndex" in imageData
    ) {
      onRemoveNew(imageData.originalIndex);
    }
  };

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-3/2 items-center justify-center rounded-md bg-gray-100">
        <p className="text-gray-500">No images to preview</p>
      </div>
    );
  }

  return (
    <>
      <FsLightbox
        toggler={lightboxController.toggler}
        sourceIndex={lightboxController.sourceIndex}
        sources={sources}
        type="image"
      />
      <div className="relative">
        <Swiper
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          effect="fade"
          spaceBetween={10}
          fadeEffect={{ crossFade: true }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[EffectFade, Navigation, Virtual, Thumbs]}
          virtual={{
            addSlidesAfter: 8,
            enabled: true,
          }}
          onSlideChange={handleSlideChange}
          className="aspect-3/2"
        >
          {allImages.map((imageData, index) => (
            <SwiperSlide key={imageData.id} virtualIndex={index}>
              <div className="relative">
                <Image
                  src={imageData.url}
                  alt={`Preview ${index + 1}`}
                  width={600}
                  height={400}
                  quality={45}
                  className="aspect-3/2 cursor-pointer rounded-md object-cover"
                  onClick={handleImageClick}
                />
                {(onRemoveExisting || onRemoveNew) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(imageData);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                )}
                {imageData.type === "new" && (
                  <div className="absolute bottom-2 left-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                    New
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <SwiperButtons
          prevClassName="left-4 bg-white"
          nextClassName="right-4 bg-white"
        />
      </div>
      <SwiperThumb
        onSwiper={setSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Navigation, Thumbs, EffectFade]}
      >
        {allImages.map((imageData) => (
          <SwiperSlide
            key={imageData.id}
            className="relative mt-2 h-fit w-full cursor-grab"
          >
            <div className="relative">
              <Image
                className="aspect-3/2 rounded-md object-cover"
                width={150}
                height={100}
                quality={1}
                src={imageData.url}
                alt={`Thumbnail ${imageData.id}`}
              />
              {(onRemoveExisting || onRemoveNew) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(imageData);
                  }}
                  className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              )}
              {imageData.type === "new" && (
                <div className="absolute bottom-1 left-1 rounded bg-blue-500 px-1 py-0.5 text-xs text-white">
                  New
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </SwiperThumb>
    </>
  );
};
