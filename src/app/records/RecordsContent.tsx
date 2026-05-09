"use client";

import { useState, useOptimistic, useRef } from "react";
import { useFormStatus } from "react-dom";
import { addTransaction } from "./actions";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Transaction {
  id: number;
  type: string;
  category: { icon: string; name: string };
  date: string;
  amount: number;
  note: string | null;
}

export default function RecordsContent({
  categories,
  transactions,
}: {
  categories: Category[];
  transactions: Transaction[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticTransactions, addOptimistic] = useOptimistic(
    transactions,
    (state, newTx: Transaction) => [newTx, ...state]
  );

  async function handleSubmit(formData: FormData) {
    setErrors({});
    const optimistic = {
      id: Date.now(),
      type: formData.get("type") as string,
      category: categories.find((c) => c.id === Number(formData.get("categoryId")))!,
      date: new Date().toISOString(),
      amount: Number(formData.get("amount")),
      note: (formData.get("note") as string) || null,
    };
    addOptimistic(optimistic);
    const result = await addTransaction(formData);
    if (result?.error) {
      setErrors(result.error);
    } else {
      setShowForm(false);
      formRef.current?.reset();
    }
  }

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors shadow-sm"
      >
        <span className="text-lg leading-none">+</span> 记一笔
      </button>

      {/* 弹窗表单 */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-zinc-900 mb-5">记一笔</h2>
            <form action={handleSubmit} ref={formRef} className="space-y-4">
              <Field label="金额">
                <input name="amount" type="number" step="0.01" required placeholder="0.00" className="input" />
                {errors.amount && <Error>{errors.amount[0]}</Error>}
              </Field>

              <Field label="类型">
                <select name="type" required defaultValue="expense" className="input">
                  <option value="expense">支出</option>
                  <option value="income">收入</option>
                </select>
              </Field>

              <Field label="分类">
                <select name="categoryId" required className="input">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <Error>{errors.categoryId[0]}</Error>}
              </Field>

              <Field label="备注">
                <input name="note" placeholder="可选" className="input" />
                {errors.note && <Error>{errors.note[0]}</Error>}
              </Field>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                >
                  取消
                </button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 列表 */}
      <div className="mt-6 bg-white rounded-2xl border border-zinc-200/60 overflow-hidden">
        {optimisticTransactions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-4xl mb-3 opacity-60">📝</p>
            <p className="text-zinc-500">还没有账单</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {optimisticTransactions.map((item) => (
              <a
                key={item.id}
                href={`/records/${item.id}`}
                className={`flex items-center justify-between px-4 sm:px-6 py-3.5 hover:bg-zinc-50/70 transition-colors ${
                  item.id > 1000000000 ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">{item.category?.icon || "💰"}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-800 text-sm truncate">
                      {item.note ? `${item.category?.name} · ${item.note}` : item.category?.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {new Date(item.date).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-semibold text-sm flex-shrink-0 ml-4 ${item.type === "expense" ? "text-red-500" : "text-emerald-600"}`}
                >
                  {item.type === "expense" ? "-" : "+"}¥{item.amount.toFixed(2)}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Error({ children }: { children: string }) {
  return <p className="text-red-500 text-xs mt-1">{children}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50"
    >
      {pending ? "保存中..." : "保存"}
    </button>
  );
}
