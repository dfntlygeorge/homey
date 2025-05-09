"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ListingStatus } from "@prisma/client";

export async function updateListingStatus(id: number, status: ListingStatus) {
  await prisma.listing.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
}
