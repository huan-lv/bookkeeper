"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { loginUser } from "./login";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleLogin(formData: FormData) {
    setError("");
    const result = await loginUser(formData);
    if (result?.error) setError(result.error);
  }

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/60 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">登录</h1>
          <p className="text-sm text-zinc-500 mt-1">欢迎回来</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 text-base leading-none">&times;</button>
          </div>
        )}

        <form action={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">用户名</label>
            <input name="username" type="text" required placeholder="输入用户名" className="input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">密码</label>
            <input name="password" type="password" required placeholder="输入密码" className="input" />
          </div>
          <LoginButton />
        </form>

        <p className="text-center text-sm text-zinc-400 mt-6">
          没有账号？
          <Link href="/register" className="text-zinc-900 hover:underline font-medium ml-1">注册</Link>
        </p>
      </div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="w-full py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50">
      {pending ? "登录中..." : "登录"}
    </button>
  );
}
