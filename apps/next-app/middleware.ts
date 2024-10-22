import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedRoutes = ["/perfil", "/curtidas", "/downloads"];

  try {
    if (path === "/auth/logout") {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("jwt");
      return response;
    }

    const response = await fetch("http://localhost:3001/auth/status", {
      credentials: "include",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });
    const data = await response.json();
    const isLoggedIn = data.isLoggedIn;
    const user = data.user;

    if (path === "/login" && isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (protectedRoutes.includes(path) && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-data", JSON.stringify({ isLoggedIn, user }));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/login", "/", "/perfil", "/curtidas", "/downloads", "/auth/logout"],
};
