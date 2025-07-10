import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { signInAction, signOutAction } from "@/app/_actions/shared/auth";
import { User, Heart, Settings, Plus, Shield, LogOut } from "lucide-react";
import { routes } from "@/config/routes";

interface UserAvatarDropdownProps {
  session: Session | null;
  className: string;
}

export default function UserAvatarDropdown(props: UserAvatarDropdownProps) {
  const { session, className } = props;

  if (session) {
    const userName = session.user?.name || "User";
    const userImage = session.user?.image;
    const userId = session.user?.id;

    if (!userId) return;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`${className} rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt={`${userName}'s avatar`}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{userName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2 text-sm">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={`${userName}'s avatar`}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="font-medium truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={routes.profilePage(userId)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={routes.favourites}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              Saved Listings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={routes.manage}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Manage Listings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={routes.createListing}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Listing
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={routes.admin}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => signOutAction()}>
            <div className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer">
              <LogOut className="w-4 h-4" />
              Sign Out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <form action={signInAction} className="inline">
      <button type="submit" className={className}>
        Sign In
      </button>
    </form>
  );
}
