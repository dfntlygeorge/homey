"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
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

    // Validate rating
    if (rating < 1 || rating > 5) {
      return {
        success: false,
        message: "Rating must be between 1 and 5 stars",
      };
    }

    // Validate comment
    if (!comment.trim()) {
      return {
        success: false,
        message: "Comment is required",
      };
    }

    if (comment.trim().length < 10) {
      return {
        success: false,
        message: "Comment must be at least 10 characters long",
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

    // Check if user has already reviewed this address
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

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        addressId,
        rating,
        comment: comment.trim(),
      },
    });

    // Optionally revalidate paths that might display reviews
    // revalidatePath(`/listings/${addressId}`);
    // revalidatePath("/");

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
