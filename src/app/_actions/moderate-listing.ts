"use server";

import { MODERATION_PROMPT } from "@/config/constants";
import type { ModerationResponse } from "@/config/types";
import { callGemini } from "@/lib/gemini"; // <-- create this to call Gemini
import prisma from "@/lib/prisma";
import { Listing, ListingStatus } from "@prisma/client";

export const moderateListingAction = async (listing: Listing) => {
  const prompt = MODERATION_PROMPT(listing);

  const response = await callGemini(prompt);
  if (!response.text) {
    // non ai moderator fallback TODO
    return;
  }
  const cleaned = response.text
    .replace(/```json\s*/g, "") // remove ```json
    .replace(/```/g, "") // remove closing ```
    .trim();

  const moderation: ModerationResponse = JSON.parse(cleaned);

  if (moderation.action === "manual_review") {
    return;
  }

  let newStatus: ListingStatus = "PENDING";
  if (moderation.action === "approve") {
    newStatus = "APPROVED";
  } else if (moderation.action === "reject") {
    newStatus = "REJECTED";
  }

  // Update listing in DB
  await prisma.listing.update({
    where: { id: listing.id },
    data: {
      status: newStatus,
      moderatedAt: new Date(),
      moderationReason: moderation.reason,
    },
  });

  //   return {
  //     action: moderation.action,
  //     reason: moderation.reason,
  //     newStatus,
  //   };
};
