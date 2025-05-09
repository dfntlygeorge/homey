"use server";

import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function updateRole(id: string, role: UserRole) {
  await prisma.user.update({
    where: { id },
    data: { role },
  });
}
