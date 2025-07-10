"use server";

import { MODERATION_PROMPT } from "@/config/constants";
import type { ModerationResponse } from "@/config/types";
import { callGemini } from "@/lib/gemini";
import prisma from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";
import { moderateImageFromS3 } from "./rekognition";
import { env } from "@/env";

export const moderateListingAction = async (listingId: number) => {
  // Prepare text moderation promise
  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      images: true,
      address: true,
    },
  });

  if (!listing) return;

  const textModerationPromise = (async () => {
    const prompt = MODERATION_PROMPT(listing);
    const response = await callGemini(prompt);

    if (!response.text) {
      // fallback if no text
      return { action: "manual_review", reason: "No AI response" };
    }

    const cleaned = response.text
      .replace(/```json\s*/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const moderation: ModerationResponse = JSON.parse(cleaned);
      return moderation;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return { action: "manual_review", reason: "Invalid AI response" };
    }
  })();

  // Prepare image moderation promise
  const imageModerationPromise = (async () => {
    const results = await Promise.all(
      listing.images.map(async (image) => {
        const keyName = new URL(image.url).pathname.slice(1);
        return await moderateImageFromS3(env.AWS_S3_BUCKET_NAME!, keyName, 50);
      })
    );

    // Check if any image is inappropriate
    const hasInappropriateImage = results.some((res) => res.isInappropriate);
    return {
      hasInappropriateImage,
      details: results,
    };
  })();

  // Run both in parallel
  const [textModeration, imageModeration] = await Promise.all([
    textModerationPromise,
    imageModerationPromise,
  ]);

  // Decide new status
  let newStatus: ListingStatus = "PENDING";

  if (
    textModeration.action === "reject" ||
    imageModeration.hasInappropriateImage
  ) {
    newStatus = "REJECTED";
  } else if (
    textModeration.action === "approve" &&
    !imageModeration.hasInappropriateImage
  ) {
    newStatus = "APPROVED";
  }

  // Update listing
  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: newStatus,
      moderatedAt: new Date(),
      moderationReason:
        textModeration.reason ??
        (imageModeration.hasInappropriateImage
          ? "Image moderation failed"
          : undefined),
    },
  });
};
