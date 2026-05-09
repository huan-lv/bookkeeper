import prisma from "@/lib/prisma";
import RecordsContent from "./RecordsContent";
import { getUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "账单 - 记账本",
  description: "查看和管理所有账单记录",
};
export default async function RecordsPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const categories = await prisma.category.findMany();
  const rawTransactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { id: "desc" },
  });

  const transactions = rawTransactions.map((t) => ({
    id: t.id,
    type: t.type,
    amount: t.amount.toNumber(),
    category: t.category,
    date: t.date.toISOString(),
    note: t.note,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">账单</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {transactions.length} 条记录
          </p>
        </div>
        <RecordsContent categories={categories} transactions={transactions} />
      </div>
    </div>
  );
}
