import { signIn, signOut } from "@/auth";
import { Session } from "next-auth";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SignButtonProps {
  session: Session | null;
  className: string;
}

export default function SignButton(props: SignButtonProps) {
  const { session, className } = props;
  if (session) {
    const userName = session.user?.name || "User";
    const userImage = session.user?.image;

    return (
      <div className="flex items-center gap-2">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
          className="inline"
        >
          <button type="submit" className={className}>
            Sign Out
          </button>
        </form>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={32}
                  height={32}
                  className="rounded-full hidden md:block"
                />
              ) : (
                <span className="text-sm font-medium">
                  Hi, {userName.split(" ")[0]} 🙀
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {/* TODO: fix the type mismatch of session in the dev or client vs in the db */}
              <p>
                Signed in as {session.user?.name?.split(" ")[0]} (
                {session.user?.role})
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
      className="inline"
    >
      <button type="submit" className={className}>
        Sign In
      </button>
    </form>
  );
}
