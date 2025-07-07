import { ListingFormStep } from "./types";

export const routes = {
  listings: "/listings",
  home: "/",
  favourites: "/favourites",
  admin: "/admin",
  signIn: "/auth/sign-in",
  listing: (id: number) => `/listings/${id}`,
  reserve: (id: number) => `/listings/${id}/reserve`,
  createListing: (step: ListingFormStep) => `/listings/new?step=${step}`,
  contactOwner: (listingId: number) => `/chats?listingId=${listingId}`,
  manage: "/manage",
  editListing: (listingId: number) => `/manage/${listingId}/edit`,
  chat: (conversationId: number) => `/chats?id=${conversationId}`,
  profilePage: (userId: string) => `/users/${userId}`,
};
