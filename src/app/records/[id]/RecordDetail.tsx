"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { updateTransaction, deleteTransaction } from "../actions";

interface Props {
  transaction: {
    id: number;
    amount: number;
    type: string;
    note: string | null;
    date: string;
    category: { id: number; icon: string; name: string };
  };
  categories: { id: number; name: string; icon: string }[];
}

export default function RecordDetail({ transaction, categories }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  async function handleEdit(formData: FormData) {
    setErrors({});
    const result = await updateTransaction(transaction.id, formData);
    if (result?.error) setErrors(result.error);
    else setEditing(false);
  }

  async function handleDelete() {
    await deleteTransaction(transaction.id);
    router.push("/records");
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button onClick={() => router.back()} className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors">
        ← 返回
      </button>

      <div className="bg-white rounded-2xl border border-zinc-200/60 p-6 sm:p-8 text-center space-y-6">
        <span className="inline-flex text-4xl">{transaction.category.icon}</span>
        <div>
          <p className="text-sm text-zinc-500">{transaction.category.name}</p>
          <p className={`text-3xl font-bold mt-1 ${transaction.type === "expense" ? "text-red-500" : "text-emerald-600"}`}>
            {transaction.type === "expense" ? "-" : "+"}¥{transaction.amount.toFixed(2)}
          </p>
        </div>

        <div className="border-t border-zinc-100 pt-4 space-y-2 text-sm">
          <Row label="类型" value={transaction.type === "expense" ? "支出" : "收入"} />
          <Row label="日期" value={new Date(transaction.date).toLocaleDateString("zh-CN")} />
          {transaction.note && <Row label="备注" value={transaction.note} />}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => setEditing(true)}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors">
            编辑
          </button>
          <button onClick={() => setDeleting(true)}
            className="flex-1 py-2.5 text-sm font-medium rounded-xl text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
            删除
          </button>
        </div>
      </div>

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setEditing(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-zinc-900 mb-5">编辑账单</h2>
            <form action={handleEdit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-500">金额</label>
                <input name="amount" type="number" step="0.01" required defaultValue={transaction.amount} className="input mt-1.5" />
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount[0]}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">类型</label>
                <select name="type" required defaultValue={transaction.type} className="input mt-1.5">
                  <option value="expense">支出</option>
                  <option value="income">收入</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">分类</label>
                <select name="categoryId" required defaultValue={transaction.category.id} className="input mt-1.5">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId[0]}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">备注</label>
                <input name="note" defaultValue={transaction.note ?? ""} placeholder="可选" className="input mt-1.5" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors">
                  取消
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 删除确认 */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl text-center">
            <p className="font-semibold text-zinc-900 mb-1">确认删除？</p>
            <p className="text-sm text-zinc-500 mb-6">删除后无法恢复</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(false)}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors">
                取消
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400">{label}</span>
      <span className="font-medium text-zinc-700">{value}</span>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="flex-1 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50">
      {pending ? "保存中..." : "保存"}
    </button>
  );
}
