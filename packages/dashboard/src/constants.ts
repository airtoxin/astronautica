import { z } from "zod";

export const DEV_MODE = !!process.env.DEV_MODE;

export const COOKIE_SESSION_KEY = "astronautica_session";

export const NEXT_PUBLIC_SERVING_URL = z
  .string()
  .parse(process.env.NEXT_PUBLIC_SERVING_URL);

export const NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID = z
  .string()
  .parse(process.env.NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID);
