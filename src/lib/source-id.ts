// handles unique user identification using cookies.
import { cookies } from "next/headers"; // read/write cookies in nextjs server components. Cookies are small pieces of user-related data in their browset.
import "server-only"; // ensures this file is only executed on the server.
import { v4 as uuid } from "uuid"; // generates a unique identifier for the user.

const SOURCE_ID_KEY = "sourceId"; // cookie key, ensures that we always refer to the same key when reading/writing cookies.

export const setSourceId = async () => {
  const cookieStore = await cookies(); // get cookies from the browser
  // we're getting the cookie based on the key SOURCE_ID_KEY
  let sourceId = cookieStore.get(SOURCE_ID_KEY)?.value; // Try to get 'sourceId' from the cookie

  if (!sourceId) {
    sourceId = uuid(); // if the cookie doesn't exist, generate a new unique identifier
    cookieStore.set(SOURCE_ID_KEY, sourceId, {
      path: "/", // the path on the server that the cookie is available to
    });
  }

  return sourceId;
};

// retrieves the sourceId from the cookie
export const getSourceId = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SOURCE_ID_KEY)?.value;
};
