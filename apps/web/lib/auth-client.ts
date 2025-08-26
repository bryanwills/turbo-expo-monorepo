import { createAuthClient } from "@acme/auth/better-auth-client";

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient(
  {
    baseURL: "http://localhost:3000",
  }
);
