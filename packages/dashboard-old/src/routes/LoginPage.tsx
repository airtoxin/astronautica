import { useEffect, VoidFunctionComponent } from "react";
import { GoogleLogin } from "react-google-login";
import { createTrpcClient, trpc } from "../trpc";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Breadcrumb } from "../state";

export const RedirectState = z.object({
  redirectTo: z.string(),
});

export const LoginPage: VoidFunctionComponent = () => {
  const { data } = trpc.useQuery(["auth.session"]);
  const location = useLocation();
  const navigate = useNavigate();
  const state = RedirectState.safeParse(location.state);
  const redirectTo = state.success ? state.data.redirectTo : "/";

  const setBreadcrumb = useSetRecoilState(Breadcrumb);
  useEffect(() => {
    setBreadcrumb([
      { path: "/", name: "Top" },
      { path: "/login", name: "Login" },
    ]);
  }, []);

  if (data) return <Navigate to={redirectTo} />;
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
          .then(() => {
            navigate(redirectTo, { replace: true });
          });
      }}
    />
  );
};
