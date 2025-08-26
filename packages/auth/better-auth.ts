import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { Pool } from "pg";

export const createAuth = (databaseUrl: string) => {
  return betterAuth({
    database: new Pool({
      connectionString: databaseUrl,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [expo()],
    trustedOrigins: ["expo://", "mobile://", "exp://", "http://localhost:3000"],
  });
};
