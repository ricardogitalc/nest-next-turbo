import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const protectedRoutes = ["/perfil", "/curtidas", "/downloads"];

  // Deixa a rota /verify pública
  if (path === "/verify") {
    return NextResponse.next();
  }

  try {
    const response = await fetch("http://localhost:3001/auth/logged", {
      credentials: "include",
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });
    const data = await response.json();
    const isLoggedIn = data.isLoggedIn;

    if (path === "/login" && isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (protectedRoutes.includes(path) && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (error) {
    console.error("Erro ao verificar status de autenticação:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/", "/perfil", "/curtidas", "/downloads"],
};
