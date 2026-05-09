"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
export default  function MonthChart(props: {
  monthData: { [month: string]: { income: number; expense: number } };
}) {
  const { monthData } = props;
  const chartData = Object.entries(monthData).map(([month, data]) => {
    return { month, 收入: data.income, 支出: data.expense };
  });
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="收入" fill="#22c55e" />
        <Bar dataKey="支出" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
