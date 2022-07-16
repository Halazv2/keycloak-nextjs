import { useKeycloak } from "@react-keycloak/ssr";
import type { KeycloakInstance, KeycloakTokenParsed } from "keycloak-js";
import Link from "next/link";
import * as React from "react";
import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import { useEffect } from "react";
import * as jose from "jose";

type ParsedToken = KeycloakTokenParsed & {
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
};
export const Header: React.FC = () => {
  const { keycloak } = useKeycloak<KeycloakInstance>();
  const parsedToken: ParsedToken | undefined = keycloak?.tokenParsed;
  const isAdmin =
    keycloak?.authenticated && parsedToken?.roles?.includes("admin")
      ? true
      : false;
  const token = keycloak?.idToken;
  const refreshToken = keycloak?.refreshToken;
  useEffect(() => {
    if (keycloak?.authenticated) {
      setCookie("isAdmin", isAdmin);
      setCookie("token", token);
      setCookie("refreshToken", refreshToken);
    }
  }, [keycloak?.authenticated]);
  return (
    <header className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <Link href="/">
        <a className="my-0 mr-md-auto font-weight-bold text-dark">
          Next.js + Keycloak
        </a>
      </Link>
      <nav className="my-2 my-md-0 mr-md-3">
        <Link href="/">
          <a className="p-2 text-dark">Home</a>
        </Link>
        <Link href="/profile">
          <a className="p-2 text-dark">Profile</a>
        </Link>
        <Link href="/admin">
          <a className="p-2 text-dark">Admin</a>
        </Link>
      </nav>
      {keycloak?.authenticated ? (
        <>
          <button
            type="button"
            className="mx-2 btn btn-outline-primary"
            onClick={() => {
              if (keycloak) {
                window.location.href = keycloak.createAccountUrl();
              }
            }}
          >
            My Account
          </button>

          <button
            type="button"
            className="mx-2 btn btn-outline-danger"
            onClick={() => {
              if (keycloak) {
                window.location.href = keycloak.createLogoutUrl();
                var cookies = document.cookie.split(";");
                for (var i = 0; i < cookies.length; i++) {
                  var cookie = cookies[i];
                  var eqPos = cookie.indexOf("=");
                  var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                  document.cookie =
                    name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
              }
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="mx-2 btn btn-outline-primary"
            onClick={() => {
              if (keycloak) {
                window.location.href = keycloak.createRegisterUrl();
              }
              removeCookie("online");
            }}
          >
            Signup
          </button>

          <button
            type="button"
            className="mx-2 btn btn-outline-success"
            onClick={() => {
              if (keycloak) {
                window.location.href = keycloak.createLoginUrl();
              }
            }}
          >
            Login
          </button>
        </>
      )}
    </header>
  );
};
