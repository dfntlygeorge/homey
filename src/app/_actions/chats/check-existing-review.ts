"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function checkExistingReview(addressId: number, userId: string) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser || currentUser.id !== userId) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
    const existingReview = await prisma.review.findFirst({
      where: {
        addressId,
        userId,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
      },
    });

    return {
      success: true,
      hasReview: !!existingReview,
      review: existingReview,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      success: false,
      error: "Failed to check existing review",
    };
  }
}
