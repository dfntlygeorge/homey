"use client";

import { useImages } from "@/context/create-listing/images-context";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { AwaitedPageProps, ListingFormStep } from "@/config/types";
import { routes } from "@/config/routes";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileSchema,
  UploadPhotosSchema,
  UploadPhotosType,
} from "@/app/_schemas/form.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { z } from "zod";

export const UploadPhotos = ({ searchParams }: AwaitedPageProps) => {
  const { images, addImage, removeImage } = useImages();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const form = useForm<UploadPhotosType>({
    resolver: zodResolver(UploadPhotosSchema),
    mode: "onTouched",
    defaultValues: {
      photos: [],
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    for (const file of files) {
      try {
        await FileSchema.parseAsync(file);
        addImage(file); // ✅ only add if valid
      } catch (err) {
        const errorMessage =
          err instanceof z.ZodError ? err.errors[0]?.message : "Invalid file";
        form.setError("photos", {
          type: "manual",
          message: errorMessage,
        });
      }
    }

    // Reset the file input to allow uploading the same file again if needed
    e.target.value = "";
  };

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", ListingFormStep.HOUSE_RULES.toString());
      router.push(url.toString());
    });
  };

  const onNextStep: SubmitHandler<UploadPhotosType> = (data) => {
    startTransition(async () => {
      console.log(data);
      const valid = await form.trigger();
      if (!valid) return;

      await new Promise((resolve) => setTimeout(resolve, 500)); // Optional for loading effect

      const url = new URL(
        routes.createListing(ListingFormStep.REVIEW_SUBMIT),
        process.env.NEXT_PUBLIC_APP_URL
      );

      if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
          if (value) url.searchParams.set(key, value as string);
        });
      }

      url.searchParams.set("step", ListingFormStep.REVIEW_SUBMIT.toString()); // Next step

      router.push(url.toString());
    });
  };

  useEffect(() => {
    form.setValue(
      "photos",
      images.map((image) => image.file)
    );
  }, [images, form]);

  return (
    <Form {...form}>
      <form
        className="mx-auto flex flex-col gap-y-6 rounded-b-lg bg-white p-6 shadow-lg md:w-2/3"
        onSubmit={form.handleSubmit(onNextStep)}
      >
        <FormField
          control={form.control}
          name="photos"
          render={() => (
            <FormItem>
              <FormLabel htmlFor="photos">Upload Photos</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg border shadow-sm group"
              >
                <Image
                  src={image.previewUrl}
                  alt={`Photo ${index + 1}`}
                  width={300}
                  height={300}
                  className="aspect-square object-cover transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 rounded-full bg-red-600/90 text-white p-1 text-xs hover:bg-red-700 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-x-4">
          <Button
            type="button"
            onClick={prevStep}
            disabled={isPrevPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPrevPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Previous Step
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
