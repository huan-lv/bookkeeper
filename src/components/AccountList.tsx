import { Decimal } from "@prisma/client/runtime/client";
import Link from "next/link";

export default function AccountList({
  transaction,
}: {
  transaction: {
    id: number;
    type: string;
    category: { icon: string; name: string };
    date: Date;
    amount: Decimal;
    note: string | null;
  }[];
}) {
  return (
    <div className="divide-y divide-gray-100">
      {transaction.map((item) => (
        <Link
          href={`/records/${item.id}`}
          key={item.id}
          className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {/* 左侧：分类图标 + 信息 */}
          <div className="flex items-center gap-3">
            {/* 分类图标 */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                item.type === "expense"
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-500"
              }`}
            >
              {item.category.icon}
            </div>

            {/* 分类名和日期 */}
            <div>
              <p className="font-medium text-gray-800">
                {item.note
                  ? item.category.name + "—" + item.note
                  : item.category.name || "未分类"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(item.date).toLocaleDateString("zh-CN", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* 右侧：金额 + 类型标记 */}
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-semibold ${
                item.type === "expense" ? "text-red-500" : "text-green-500"
              }`}
            >
              {item.type === "expense" ? "-" : "+"}¥
              {item.amount.toNumber().toFixed(2)}
            </span>

            {/* 类型标记 */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.type === "expense"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {item.type === "expense" ? "支出" : "收入"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
