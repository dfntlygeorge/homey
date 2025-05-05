import { Prisma } from "@prisma/client";

export type PropertyWithImages = Prisma.ListingGetPayload<{
  include: {
    images: true;
  };
}>;

type Params = {
  [x: string]: string | string[];
};

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};
