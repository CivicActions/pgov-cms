import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/index"],
};

export function middleware(req: NextRequest) {
  // Getting the Pup IP from the request
  const { ip } = req;
  // console.log("Middleware IP:", ip);
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  // Bypass the basic auth on a certain env variable and Pub IP
  if (
    process.env.LOCAL_URL === "http://localhost:3000"
  ) {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");

      const validUser = process.env.BASIC_AUTH_USER;
      const validPassWord = process.env.BASIC_AUTH_PASSWORD;

      if (user === validUser && pwd === validPassWord) {
        return NextResponse.next();
      }
    }
    url.pathname = "/api/basicauth";

    return NextResponse.rewrite(url);
  }
}
