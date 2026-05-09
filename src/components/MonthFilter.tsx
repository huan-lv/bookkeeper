"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function MonthFilter({ months }: { months: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("month") ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    router.push(value ? `/reports?month=${value}` : "/reports");
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="input max-w-[180px]"
    >
      <option value="">全部时间</option>
      {months.map((m) => (
        <option key={m} value={m}>
          {m.replace("-", "年")}月
        </option>
      ))}
    </select>
  );
}
