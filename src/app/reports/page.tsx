import prisma from "@/lib/prisma";
import MonthChart from "./MonthChart";
import CategoryChart from "./CategoryChart";
import MonthFilter from "@/components/MonthFilter";
import { getUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "报表 - 记账本",
  description: "月度收支统计与分类分析",
};
export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const { month } = await searchParams;

  const allTransactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
  });

  const filteredTransactions = month
    ? allTransactions.filter((t) => t.date.toISOString().slice(0, 7) === month)
    : allTransactions;

  // 月度汇总
  const monthData: Record<string, { income: number; expense: number }> = {};
  allTransactions.forEach((item) => {
    const m = item.date.toISOString().slice(0, 7);
    if (!monthData[m]) monthData[m] = { income: 0, expense: 0 };
    if (item.type === "income") monthData[m].income += item.amount.toNumber();
    else monthData[m].expense += item.amount.toNumber();
  });

  const availableMonths = Object.keys(monthData).sort().reverse();

  // 分类汇总
  const categorySum: Record<string, number> = {};
  filteredTransactions.forEach((item) => {
    const name = item.category.name;
    categorySum[name] = (categorySum[name] || 0) + item.amount.toNumber();
  });

  const totalIncome = Object.values(monthData).reduce(
    (s, d) => s + d.income,
    0,
  );
  const totalExpense = Object.values(monthData).reduce(
    (s, d) => s + d.expense,
    0,
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">报表</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {month ? `${month.replace("-", "年")}月` : "全部时间"}
          </p>
        </div>
        <MonthFilter months={availableMonths} />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="总收入" value={totalIncome} color="text-emerald-600" />
        <StatCard label="总支出" value={totalExpense} color="text-red-500" />
        <StatCard label="结余" value={totalIncome - totalExpense} color="" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl border border-zinc-200/60 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4">月度收支</h2>
          <MonthChart monthData={monthData} />
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200/60 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-zinc-700 mb-4">分类占比</h2>
          <CategoryChart categorySum={categorySum} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const display = color || (value >= 0 ? "text-blue-600" : "text-red-500");
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/60 hover:shadow-md transition-shadow">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className={`text-lg sm:text-xl font-semibold ${display}`}>
        ¥{value.toFixed(2)}
      </p>
    </div>
  );
}
