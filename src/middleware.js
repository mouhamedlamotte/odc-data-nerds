// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const nid = request.cookies.get("NID");
  const token = request.cookies.get("token");

  if (!token) {
    if(nid) return NextResponse.next();
    return NextResponse.redirect(
      new URL(`/auth/login?next=${request.nextUrl.pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/"],
};
