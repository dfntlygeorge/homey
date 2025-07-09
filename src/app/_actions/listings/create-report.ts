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

    const { data, success, error } = ReportFormSchema.safeParse(formData);

    if (!success) {
      console.error("Validation Failed", error.message);
      return {
        success: false,
        message: error.message,
      };
    }

    await prisma.report.create({
      data: {
        listingId,
        userId,
        ...data,
      },
    });
  } catch (error) {
    console.log({ error });
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Something went wrong" };
  }
}
