import { useKeycloak } from "@react-keycloak/ssr";
import type { KeycloakInstance, KeycloakTokenParsed } from "keycloak-js";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import axios from "axios";
import { getCookie } from "typescript-cookie";


type ParsedToken = KeycloakTokenParsed & {
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
};

const IndexPage = () => {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const parsedToken: ParsedToken | undefined = keycloak?.tokenParsed;

  const loggedinState = keycloak?.authenticated ? (
    <span className="text-success">logged in</span>
  ) : (
    <span className="text-danger">NOT logged in</span>
  );
  console.log(keycloak);
  const welcomeMessage =
    keycloak?.authenticated || (keycloak && parsedToken)
      ? `Welcome back ${parsedToken?.preferred_username ?? ""}!`
      : "Welcome visitor. Please login to continue.";

  const profile = keycloak?.authenticated ? (
    <ul>
      <li>
        <span className="font-weight-bold mr-1">Email:</span>
        <span className="text-muted">{parsedToken?.email ?? ""}</span>
      </li>
      <li>
        <span className="font-weight-bold mr-1">Username:</span>
        <span className="text-muted">
          {parsedToken?.preferred_username ?? ""}
        </span>
      </li>
      <li>
        <span className="font-weight-bold mr-1">First Name:</span>
        <span className="text-muted">{parsedToken?.given_name ?? ""}</span>
      </li>
      <li>
        <span className="font-weight-bold mr-1">Last Name:</span>
        <span className="text-muted">{parsedToken?.family_name ?? ""}</span>
      </li>
      <li>
        <span className="font-weight-bold mr-1"> Token:</span>
        <span className="text-muted ">{keycloak.idToken ?? ""}</span>
      </li>
    </ul>
  ) : (
    <span>Please login to view profile.</span>
  );
  useEffect(() => {
    if (!keycloak?.authenticated) {
      axios
        .get("http://localhost:3000/api/profile", {
          headers: {
            Authorization: getCookie("token"),
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  });
  return (
    <Layout>
      <h1 className="mt-5">Hello 👋</h1>
      <p>You are: {loggedinState}</p>
      {keycloak.authenticated && (
        <div>
          <p>{welcomeMessage}</p>
          <h1 className="my-5">User Profile</h1>{" "}
        </div>
      )}
      {profile}
    </Layout>
  );
};

export default IndexPage;
