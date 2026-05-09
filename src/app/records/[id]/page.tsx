import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import RecordDetail from "./RecordDetail";

export default async function RecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(id) },
    include: { category: true },
  });

  if (!transaction) notFound();

  const categories = await prisma.category.findMany();

  return (
    <RecordDetail
      transaction={{
        ...transaction,
        amount: transaction.amount.toNumber(),
        date: transaction.date.toISOString(),
      }}
      categories={categories}
    />
  );
}
