// 中间件
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";
// 需要登录的路径
const protectedPaths = ["/records", "/reports"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (protectedPaths.some((p) => path.startsWith(p))) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const userId = token ? await verifyToken(token) : null;
    if (!userId) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}
