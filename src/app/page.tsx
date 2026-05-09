import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    take: 10,
    orderBy: { date: "desc" },
  });

  const thisMonth = new Date().toISOString().slice(0, 7);
  let monthIncome = 0;
  let monthExpense = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let totalIncome = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let totalExpense = 0;
  transactions.forEach((item) => {
    const amount = item.amount.toNumber();
    const isThisMonth = item.date.toISOString().slice(0, 7) === thisMonth;
    if (item.type === "income") {
      totalIncome += amount;
      if (isThisMonth) monthIncome += amount;
    } else {
      totalExpense += amount;
      if (isThisMonth) monthExpense += amount;
    }
  });

  const allTransactions = await prisma.transaction.count({ where: { userId } });

  const stats = [
    { label: "本月收入", value: monthIncome, color: "text-emerald-600" },
    { label: "本月支出", value: monthExpense, color: "text-red-500" },
    { label: "本月结余", value: monthIncome - monthExpense, color: "" },
    { label: "全部账单", value: `${allTransactions} 笔`, color: "text-zinc-700", isText: true },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">概览</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/60 hover:shadow-md transition-shadow"
          >
            <p className="text-xs text-zinc-400 mb-1">{s.label}</p>
            <p className={`text-xl sm:text-2xl font-semibold ${s.color || (Number(s.value) >= 0 ? "text-blue-600" : "text-red-500")}`}>
              {s.isText ? s.value : `¥${Number(s.value).toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-100">
          <h2 className="font-semibold text-zinc-800">最近账单</h2>
          {transactions.length > 0 && (
            <Link href="/records" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              查看全部 →
            </Link>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 sm:py-16 px-4">
            <p className="text-4xl mb-3 opacity-60">📝</p>
            <p className="text-zinc-500 mb-4">还没有账单</p>
            <Link
              href="/records"
              className="inline-flex px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors"
            >
              开始记录
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {transactions.map((item) => (
              <Link
                key={item.id}
                href={`/records/${item.id}`}
                className="flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-zinc-50/70 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">{item.category.icon}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-800 text-sm truncate">
                      {item.note ? `${item.category.name} · ${item.note}` : item.category.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {new Date(item.date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-semibold text-sm flex-shrink-0 ml-4 ${item.type === "expense" ? "text-red-500" : "text-emerald-600"}`}
                >
                  {item.type === "expense" ? "-" : "+"}¥{item.amount.toNumber().toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
