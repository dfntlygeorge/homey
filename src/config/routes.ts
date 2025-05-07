export const routes = {
  inventory: "/inventory",
  home: "/",
  favourites: "/favourites",
  admin: "/admin",
  signIn: "/auth/sign-in",
  singleProperty: (id: number) => `/inventory/${id}`,
  reserve: (id: number) => `/inventory/${id}/reserve`,
};
