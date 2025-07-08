import prisma from "@/lib/prisma";

export async function checkExistingReview(addressId: number, userId: string) {
  try {
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
  } catch (error) {
    console.error("Error checking existing review:", error);
    return {
      success: false,
      error: "Failed to check existing review",
    };
  }
}
