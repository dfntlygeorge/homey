"use client";

import { updateRole } from "@/app/_actions/onboarding";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function OnboardingPage() {
  const { data: session } = useSession();
  if (!session) return null;
  const id = session.user?.id as string;
  const role = session.user?.role;
  if (role) redirect(routes.listings);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center">
      <h1 className="text-2xl font-bold md:text-3xl">
        What would you like to do?
      </h1>
      <div className="flex gap-4">
        <Button
          onClick={() => updateRole(id, UserRole.STUDENT)}
          className="px-6 py-4 text-lg"
        >
          Browse rooms or apartments
        </Button>
        <Button
          onClick={() => updateRole(id, UserRole.LANDLORD)}
          variant="outline"
          className="px-6 py-4 text-lg"
        >
          List a property I’m managing
        </Button>
      </div>
    </section>
  );
}
