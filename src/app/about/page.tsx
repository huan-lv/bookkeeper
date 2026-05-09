import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 - 记账本",
  description: "关于记账本应用",
};
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">关于</h1>
        <p className="text-sm text-zinc-500 mt-1">简洁高效的记账工具</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {[
          { icon: "📝", title: "快速记录", desc: "一笔录入收支" },
          { icon: "📊", title: "数据报表", desc: "月度趋势图表" },
          { icon: "🏷️", title: "分类管理", desc: "灵活分类标签" },
          { icon: "🔒", title: "账户隔离", desc: "每人独立数据" },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl p-4 border border-zinc-200/60 flex gap-3 items-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="font-medium text-sm text-zinc-800">{f.title}</p>
              <p className="text-xs text-zinc-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/60 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-zinc-700 mb-3">技术栈</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js 16",
            "TypeScript",
            "Tailwind CSS",
            "Prisma",
            "MySQL",
            "Recharts",
            "JWT",
            "Zod",
          ].map((t) => (
            <span
              key={t}
              className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-xs font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
