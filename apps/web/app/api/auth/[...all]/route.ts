import { auth } from "../../../../lib/auth";
import { toNextJsHandler } from "@acme/auth/better-auth-client";

export const { POST, GET } = toNextJsHandler(auth);
