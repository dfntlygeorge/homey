import { PropsWithChildren } from "react";
import { PublicHeader } from "./header";
export function PublicLayout({ children }: PropsWithChildren) {
  return (
    <>
      <PublicHeader />
      <main>{children}</main>
    </>
  );
}
