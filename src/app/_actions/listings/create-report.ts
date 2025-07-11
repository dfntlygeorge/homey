"use server";

import { auth } from "@/auth";
import { ReportFormData, ReportFormSchema } from "../../_schemas/report.schema";
import prisma from "@/lib/prisma";
import { reportRatelimit } from "@/lib/rate-limit";

export async function createReportAction(
  formData: ReportFormData,
  listingId: number
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId)
      return {
        success: false,
        message: "You need an account to report a listing",
      };

    // Check rate limit
    const { success: successRateLimit } = await reportRatelimit.limit(userId);
    if (!successRateLimit) {
      return {
        success: false,
        message:
          "You have reached the maximum number of reports allowed today. Please try again tomorrow.",
      };
    }

    // Check if user has already reported this listing
    const existingReport = await prisma.report.findFirst({
      where: {
        userId,
        listingId,
      },
    });

    if (existingReport) {
      return {
        success: false,
        message: "You have already reported this listing.",
      };
    }

    // Validate form data
    const { data, success, error } = ReportFormSchema.safeParse(formData);

    if (!success) {
      return {
        success: false,
        message: error.message,
      };
    }

    console.log("DID VALIDATION FAILED? ", "NO");

    // Create report
    await prisma.report.create({
      data: {
        listingId,
        userId,
        ...data,
      },
    });

    return {
      success: true,
      message: "Submitted successfully",
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
}
