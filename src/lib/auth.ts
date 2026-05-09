"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createToken, verifyToken } from "./jwt";

export { createToken, verifyToken };

export async function getUserId(): Promise<number | null> {
  const cookie = (await cookies()).get("token")?.value;
  if (!cookie) return null;
  return verifyToken(cookie);
}

export async function auth() {
  const userId = await getUserId();
  if (!userId) return null;
  const { default: prisma } = await import("./prisma");
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true },
  });
}

export async function logout() {
  (await cookies()).delete("token");
  redirect("/login");
}
