import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: User;
  }
}
