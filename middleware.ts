import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
import * as jose from "jose";
import jwt_decode from "jwt-decode";
import { promisify } from "util";
export function middleware(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get("token");
  const decoded = jwt_decode(token);
  // console.log(token);
  
  const url =
    "https://keycloaktest.ayouris.net/auth/realms/fm6/protocol/openid-connect/auth?client_id=sga-front&redirect_uri=http%3A%2F%2Flocalhost%3A3006%2F&state=2d31b974-7ad4-4269-8347-10e15503fcef&response_mode=fragment&response_type=code&scope=openid&nonce=7fb92aca-d4dd-4c5e-8997-6d79758ed5c4";
  if (req.url.includes("/admin") || req.url.includes("/profile")) {
    if (!token) {
      return NextResponse.redirect(url);
    } else if (token) {
      if (decoded.roles !== "admin") {
        console.log("not admin");
        return NextResponse.redirect('http://localhost:3006/404');
      } else {
        console.log(decoded);
        if (decoded.role === "admin") {
          return NextResponse.next();
        }
      }
    }
  }
}
