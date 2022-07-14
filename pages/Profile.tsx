import { useKeycloak } from "@react-keycloak/ssr";
import type { KeycloakInstance, KeycloakTokenParsed } from "keycloak-js";
import type { NextPage } from "next";
import * as React from "react";
import { Layout } from "../components/Layout";
import { getCookie } from "cookies-next";
type ParsedToken = KeycloakTokenParsed & {
  email?: string;

  preferred_username?: string;

  given_name?: string;

  family_name?: string;
};

const ProfilePage: NextPage = () => {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const parsedToken: ParsedToken | undefined = keycloak?.tokenParsed;
  const isAdmin =
    keycloak?.authenticated && parsedToken?.roles?.includes("admin");
  const profile = keycloak?.authenticated ? (
    <ul>
      <h1 className="my-5">Profile informations</h1>
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
    </ul>
  ) : (
    <span>Please login to view profile.</span>
  );
  // get cookies from the browser
  const cookies = getCookie("isAdmin");
  const a = true;
  return (
    <Layout>
      <div></div>
      {getCookie("isAdmin") != true ? (
        <div className="bg-red-200 p-3 text-center">
          You can't access this if you're not the admin.
        </div>
      ) : (
        <div>{profile}</div>
      )}
    </Layout>
  );
};

export default ProfilePage;
