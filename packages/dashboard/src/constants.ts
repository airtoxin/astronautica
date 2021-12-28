import { z } from "zod";

export const NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID = z
  .string()
  .parse(process.env.NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID);
