import { inferRouterContext, ResponseMeta } from "@trpc/server";
import { AppRouter } from "../routes";
import cookie from "cookie";
import { COOKIE_SESSION_KEY } from "../constants";

export const responseMeta = ({
  ctx,
}: {
  ctx?: inferRouterContext<AppRouter>;
}): ResponseMeta => {
  if (ctx?.auth.type === "authorizeByGoogleLogin") {
    return {
      headers: {
        "Set-Cookie": cookie.serialize(
          COOKIE_SESSION_KEY,
          ctx.auth.dashboardSession.id,
          {
            domain: "localhost",
            path: "/",
            sameSite: "lax",
            secure: true,
            httpOnly: true,
          }
        ),
      },
    };
  }
  return {
    headers: {
      "Set-Cookie": cookie.serialize("key", "value", {}),
    },
  };
};
