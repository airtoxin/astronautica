import { inferRouterContext, ResponseMeta } from "@trpc/server";
import { AppRouter } from "../routes";
import cookie from "cookie";

export const responseMeta = ({
  ctx,
}: {
  ctx?: inferRouterContext<AppRouter>;
}): ResponseMeta => {
  if (ctx?.type === "loginIdToken") {
    return {
      headers: {
        "Set-Cookie": cookie.serialize(
          "astro.session",
          ctx.dashboardSession.id,
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
