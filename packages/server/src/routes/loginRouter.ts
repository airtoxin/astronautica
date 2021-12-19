import { createRouter } from "./helper";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.VITE_GOOGLE_LOGIN_CLIENT_ID);

export const loginRouter = createRouter().mutation("login", {
  resolve: async (req) => {
    client.verifyIdToken({
      idToken: req.ctx.apiKey ?? "",
      audience: process.env.VITE_GOOGLE_LOGIN_CLIENT_ID,
    });
  },
});
