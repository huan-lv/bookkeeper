"use server";

import { createToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "用户名和密码不能为空" };
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { error: "用户名或密码错误" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "用户名或密码错误" };
  }

  const token = await createToken(user.id);
  (await cookies()).set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/");
}
