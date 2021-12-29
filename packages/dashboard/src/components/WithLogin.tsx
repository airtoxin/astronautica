import { FunctionComponent } from "react";
import { NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID } from "../constants";
import { GoogleLogin } from "react-google-login";
import { gql } from "@apollo/client";
import {
  useWithLoginMutationMutation,
  useWithLoginQueryQuery,
} from "../graphql-types.gen";

gql`
  query WithLoginQuery {
    viewer {
      id
    }
  }
  mutation WithLoginMutation($idToken: String!) {
    login(idToken: $idToken)
  }
`;

export const WithLogin: FunctionComponent = ({ children }) => {
  const queryResult = useWithLoginQueryQuery();
  const [login, mutationResult] = useWithLoginMutationMutation();

  if (queryResult.loading) return <div>LOADING</div>;
  return (
    <>
      {queryResult.data ? (
        children
      ) : (
        <GoogleLogin
          clientId={NEXT_PUBLIC_GOOGLE_LOGIN_CLIENT_ID}
          onSuccess={async () => {
            const idToken = window.gapi.auth2
              .getAuthInstance()
              .currentUser.get()
              .getAuthResponse().id_token;
            await login({ variables: { idToken } });
          }}
        />
      )}
    </>
  );
};
