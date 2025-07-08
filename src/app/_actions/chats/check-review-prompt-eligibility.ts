import prisma from "@/lib/prisma";

export async function checkReviewPromptEligibility(
  listingId: number,
  userId: string
) {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        userId,
        status: "ACCEPTED",
      },
      select: {
        id: true,
        acceptedAt: true,
      },
    });

    if (!reservation || !reservation.acceptedAt) {
      return {
        success: true,
        showPrompt: false,
      };
    }

    // Check if a month has passed since acceptance
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const showPrompt = reservation.acceptedAt <= oneMonthAgo;

    return {
      success: true,
      showPrompt,
      reservationId: reservation.id,
    };
  } catch (error) {
    console.error("Error checking review prompt eligibility:", error);
    return {
      success: false,
      error: "Failed to check review prompt eligibility",
    };
  }
}
