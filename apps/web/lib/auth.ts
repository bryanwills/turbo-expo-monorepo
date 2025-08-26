import { createAuth } from "@acme/auth/better-auth";

export const auth = createAuth(process.env.DATABASE_URL || "");
