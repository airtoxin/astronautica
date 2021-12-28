import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleLogin } from "react-google-login";
import { NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID } from "../constants";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleLogin
        clientId={NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID}
        onSuccess={async () => {
          const idToken = window.gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getAuthResponse().id_token;
          console.log("@idToken", idToken);
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
