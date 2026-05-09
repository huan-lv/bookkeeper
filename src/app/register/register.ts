"use server";

import { createToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "用户名和密码不能为空" };
  }

  if (password.length < 6) {
    return { error: "密码至少 6 位" };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { error: "用户名已被注册" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  const token = await createToken(user.id);
  (await cookies()).set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/");
}
