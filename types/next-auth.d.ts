// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    createdAt?: Date | null;
  }
}
