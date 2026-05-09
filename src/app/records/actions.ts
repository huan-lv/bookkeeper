"use server";
// 验证数据
import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserId } from "@/lib/auth";
const transactionSchema = z.object({
  amount: z
    .number()
    .positive("金额必须大于0")
    .max(99999999, "金额不能超过 9999 万"),
  type: z.enum(["income", "expense"]),
  categoryId: z.number().int().positive("请选择分类"),
  note: z.string().max(200, "备注最多200字").optional(),
});
export async function addTransaction(formData: FormData) {
  const userId = await getUserId();
  if (!userId) throw new Error("未登录");
  const result = transactionSchema.safeParse({
    amount: Number(formData.get("amount")),
    type: formData.get("type"),
    categoryId: Number(formData.get("categoryId")),
    note: formData.get("note") || undefined,
  });
  if (!result.success) {
    // 返回错误给前端显示
    return { error: result.error.flatten().fieldErrors };
  }
  // result.data 是类型安全的验证后数据
  await prisma.transaction.create({ data: { ...result.data, userId } });
  revalidatePath("/records");
}

export async function updateTransaction(id: number, formData: FormData) {
  const userId = await getUserId(); // ← 加这行
  if (!userId) throw new Error("未登录");

  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx || tx.userId !== userId) throw new Error("无权操作");
  const result = transactionSchema.safeParse({
    amount: Number(formData.get("amount")),
    type: formData.get("type"),
    categoryId: Number(formData.get("categoryId")),
    note: formData.get("note") || undefined,
  });
  if (!result.success) {
    // 返回错误给前端显示
    return { error: result.error.flatten().fieldErrors };
  }
  // result.data 是类型安全的验证后数据
  await prisma.transaction.update({ where: { id }, data: result.data });
  revalidatePath("/records");
  revalidatePath(`/records/${id}`);
}

export async function deleteTransaction(id: number) {
  const userId = await getUserId(); // ← 加这行
  if (!userId) throw new Error("未登录");
  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx || tx.userId !== userId) throw new Error("无权操作");
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/records");
}
