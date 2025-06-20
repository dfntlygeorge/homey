"use server";

import { signIn, signOut } from "@/auth";

export async function SignInAction() {
  await signIn();
}

export async function signOutAction() {
  await signOut();
}
