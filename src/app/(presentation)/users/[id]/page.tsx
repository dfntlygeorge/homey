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
          address: {
            include: {
              reviews: true,
            },
          },
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
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          listings: true,
        },
      },
    },
  });

  if (!user) {
    console.log("NOT FOUND");
    notFound();
  }

  let totalReviews = 0;
  let totalRatingSum = 0;

  user.listings.forEach((listing) => {
    const reviews = listing.address?.reviews || [];

    totalReviews += reviews.length;
    totalRatingSum += reviews.reduce((sum, review) => sum + review.rating, 0);
  });

  const averageRating = totalReviews > 0 ? totalRatingSum / totalReviews : 0;

  console.log("Total reviews received:", totalReviews);
  console.log("Average rating:", averageRating.toFixed(2));

  return (
    <UserProfileView
      user={user}
      totalReviews={totalReviews}
      averageRating={averageRating}
    />
  );
}
