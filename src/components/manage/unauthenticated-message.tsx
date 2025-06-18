import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";

export function UnauthenticatedMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <p className="text-lg mb-4">Sign in to manage your listings</p>
      <Link href={routes.signIn}>
        <Button variant="default">Sign In</Button>
      </Link>
    </div>
  );
}
