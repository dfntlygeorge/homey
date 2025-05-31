import { validateIdSchema } from "@/app/_schemas/id.schema";
import { routes } from "@/config/routes";
import { Favourites } from "@/config/types";
import { redis } from "@/lib/redis-store";
import { setSourceId } from "@/lib/source-id";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// this runs when a post request is sent to this api route.
export const POST = async (req: NextRequest) => {
  // NextRequest gives access to the request data.
  const body = await req.json(); // reads the request body and parsed/converts it to a javascript object

  const { data, error } = validateIdSchema.safeParse(body); // ensures the body matches the expected schema

  if (!data) {
    return NextResponse.json(
      {
        error: error?.message,
      },
      {
        status: 400,
      }
    );
  }

  if (typeof data.id !== "number") {
    return NextResponse.json(
      {
        error: "Invalid ID",
      },
      {
        status: 400,
      }
    );
  }

  // get the source id from cookies
  const sourceId = await setSourceId();

  //   retrieve existing favourites from redis
  const storedFavourites = await redis.get<Favourites>(sourceId);
  const favourites: Favourites = storedFavourites || { ids: [] };

  if (favourites.ids.includes(data.id)) {
    //  add or remove the ID based on the current presence in the favourites
    // remove the ID if it exists, otherwise add it
    favourites.ids = favourites.ids.filter((favId) => favId !== data.id);
  } else {
    favourites.ids.push(data.id);
  }

  //   store the updated favourites in redis. Initial storing.
  await redis.set(sourceId, favourites);

  //   revalidate the favourites page to ensure the changes are reflected immediately
  revalidatePath(routes.favourites);

  //   return the updated favourites as a json response.
  return NextResponse.json(
    {
      ids: favourites.ids,
    },
    {
      status: 200,
    }
  );
};
