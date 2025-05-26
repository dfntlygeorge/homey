"use client";

import { AwaitedPageProps, ListingFormStep } from "@/config/types";
import { RoomType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";
import { Select } from "../ui/select";
import { BasicInfoSchema, BasicInfoType } from "@/app/_schemas/form.schema";

export const BasicInfo = (props: AwaitedPageProps) => {
  const { searchParams } = props;
  const title = (searchParams?.title as string) ?? undefined;
  const description = (searchParams?.description as string) ?? undefined;
  const roomType = (searchParams?.roomType as string) ?? undefined;
  const rent = (searchParams?.rent as string) ?? undefined;
  const slotsAvailable = (searchParams?.slotsAvailable as string) ?? undefined;

  const form = useForm<BasicInfoType>({
    resolver: zodResolver(BasicInfoSchema),
    mode: "onTouched",
    defaultValues: {
      title: title ? decodeURIComponent(title) : "",
      description: description ? decodeURIComponent(description) : "",
      roomType: roomType
        ? (decodeURIComponent(roomType) as RoomType)
        : RoomType.STUDIO, // pick a sensible default
      rent: rent ? Number(decodeURIComponent(rent)) : 0,
      slotsAvailable: slotsAvailable
        ? Number(decodeURIComponent(slotsAvailable))
        : 1,
    },
  });

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", ListingFormStep.WELCOME.toString());
      router.push(url.toString());
    });
  };

  const onNextStep: SubmitHandler<BasicInfoType> = (data) => {
    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;

      await new Promise((resolve) => setTimeout(resolve, 500)); // Optional for loading effect

      const url = new URL(
        routes.createListing(ListingFormStep.LOCATION_CONTACT),
        process.env.NEXT_PUBLIC_APP_URL
      );

      url.searchParams.set("step", ListingFormStep.LOCATION_CONTACT.toString()); // Next step

      url.searchParams.set("title", encodeURIComponent(data.title));
      url.searchParams.set("description", encodeURIComponent(data.description));
      url.searchParams.set("roomType", encodeURIComponent(data.roomType));
      url.searchParams.set("rent", encodeURIComponent(String(data.rent)));
      url.searchParams.set(
        "slotsAvailable",
        encodeURIComponent(String(data.slotsAvailable))
      );

      router.push(url.toString());
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto flex flex-col gap-y-6 rounded-b-lg bg-white p-6 shadow-lg md:w-2/3"
        onSubmit={form.handleSubmit(onNextStep)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input placeholder="Ex. Spacious Dorm Room" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the room, rules, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="roomType">Room Type</FormLabel>
              <FormControl>
                <Select
                  options={Object.values(RoomType).map((roomType) => ({
                    value: roomType,
                    label: roomType,
                  }))}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rent"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="rent">Rent (₱)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex. 3500"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? Number(e.target.value) : null
                    )
                  } // Set to null if empty
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slotsAvailable"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="slotsAvailable">Slots Available</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ex. 3"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-x-4">
          <Button
            type="button"
            onClick={prevStep}
            disabled={isPrevPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPrevPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Previous Step
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex w-full flex-1 gap-x-3 font-bold uppercase"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
