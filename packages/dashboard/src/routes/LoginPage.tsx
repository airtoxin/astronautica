import { VoidFunctionComponent } from "react";
import { GoogleLogin } from "react-google-login";
import { createTrpcClient } from "../trpc";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";

export const RedirectState = z.object({
  redirectTo: z.string(),
});

export const LoginPage: VoidFunctionComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = RedirectState.safeParse(location.state);
  const redirectTo = state.success ? state.data.redirectTo : "/";

  return (
    <GoogleLogin
      clientId={import.meta.env.VITE_GOOGLE_LOGIN_CLIENT_ID}
      onSuccess={async () => {
        const idToken = window.gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getAuthResponse().id_token;
        await createTrpcClient({ "Id-Token": idToken })
          .mutation("auth.login")
          .then((account) => {
            console.log("@account", account);
            navigate(redirectTo, { replace: true });
          });
      }}
    />
  );
};