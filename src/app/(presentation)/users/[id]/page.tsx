import { UserProfileView } from "@/components/user-profile/user-profile-view";
import { PageProps } from "@/config/types";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function UserProfilePage(props: PageProps) {
  const params = await props?.params;
  const id = params?.id as string;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      listings: {
        include: {
          images: true,
          reviews: true,
        },
        where: {
          status: "APPROVED", // Only show approved listings
          isArchived: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      reviews: {
        include: {
          listing: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          listings: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return <UserProfileView user={user} />;
}
