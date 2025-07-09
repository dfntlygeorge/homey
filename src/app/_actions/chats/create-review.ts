"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { reviewRatelimit } from "@/lib/rate-limit";

export const submitReviewAction = async (
  addressId: number,
  rating: number,
  comment: string
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "You must be logged in to submit a review",
      };
    }

    // Rate limiting
    const { success } = await reviewRatelimit.limit(userId);
    if (!success) {
      return {
        success: false,
        message: "You can only submit one review per minute. Please wait.",
      };
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Rating must be between 1 and 5 stars",
      };
    }

    // Validate and sanitize comment
    const cleanedComment = comment.trim().replace(/\s+/g, " ");
    if (cleanedComment.length < 10) {
      return {
        success: false,
        message: "Comment must be at least 10 characters long",
      };
    }
    if (/http|www|\.com|\.net/i.test(cleanedComment)) {
      return {
        success: false,
        message: "Links are not allowed in comments",
      };
    }

    // Check if address exists
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return {
        success: false,
        message: "Address not found",
      };
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        addressId,
      },
    });

    if (existingReview) {
      return {
        success: false,
        message: "You have already reviewed this property",
      };
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId,
        addressId,
        rating,
        comment: cleanedComment,
      },
    });

    return {
      success: true,
      message: "Review submitted successfully",
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      },
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      success: false,
      message: "Failed to submit review. Please try again.",
    };
  }
};
