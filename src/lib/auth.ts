'use server'
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me",
);

//create
export async function createToken(userId: number) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}
export async function getUserId(): Promise<number | null> {
  const cookie = (await cookies()).get("token")?.value;
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie, secret);
    return payload.userId as number;
  } catch {
    return null;
  }
}
//验证已登录用户
export async function auth() {
  const userId = await getUserId();
  if (!userId) return null;

  const { default: prisma } = await import("./prisma");
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
    },
  });
}

//verify
export async function verifyToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as number;
  } catch {
    return null;
  }
}

//logout
export async function logout() {
  (await cookies()).delete("token");
  redirect("/login");
}