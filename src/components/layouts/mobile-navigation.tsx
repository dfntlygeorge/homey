import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  MenuIcon,
  User,
  Heart,
  Settings,
  Plus,
  Shield,
  LogOut,
  Home,
  Building2,
} from "lucide-react";
import { navLinks } from "@/config/constants";
import { signInAction, signOutAction } from "@/app/_actions/shared/auth";

interface MobileNavigationProps {
  session: Session | null;
}

export const MobileNavigation = ({ session }: MobileNavigationProps) => {
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;
  const userId = session?.user?.id;

  const getNavIcon = (href: string) => {
    if (href.includes("home")) return <Home className="w-5 h-5" />;
    if (href.includes("listings")) return <Building2 className="w-5 h-5" />;
    return <Home className="w-5 h-5" />;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="text-primary h-6 w-6" />
          <SheetTitle className="sr-only">Toggle nav menu</SheetTitle>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-xs bg-white p-0">
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          {session ? (
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt={`${userName}'s avatar`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {userName}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border-b bg-gray-50">
              <form action={signInAction} className="w-full">
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  href={link.href}
                >
                  {getNavIcon(link.href)}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User Menu Items (only show if signed in) */}
            {session && (
              <>
                <Separator className="my-4" />
                <div className="space-y-1">
                  <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </div>

                  <Link
                    href={`/users/${userId}`}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  <Link
                    href="/favourites"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    Saved Listings
                  </Link>

                  <Link
                    href="/manage"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Manage Listings
                  </Link>

                  <Link
                    href="/listings/new"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Listing
                  </Link>

                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    Admin Login
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Sign Out Button (only show if signed in) */}
          {session && (
            <div className="p-4 border-t bg-gray-50">
              <form action={signOutAction} className="w-full">
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </form>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
