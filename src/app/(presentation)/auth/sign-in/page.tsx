import { auth } from "@/auth";
import { SignInForm } from "@/components/auth/sign-in-form";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();
  if (session) redirect(routes.listings);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
