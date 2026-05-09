"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";

const links = [
  { href: "/records", label: "账单" },
  { href: "/reports", label: "报表" },
];

export default function Navbar({ isLoggedIn }: { isLoggedIn: number | null }) {
  const path = usePathname();
  if (path === "/login" || path === "/register") return null;

  const base = "relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors";
  const active = "text-blue-600 bg-blue-50";
  const inactive = "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100";

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-zinc-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-lg font-bold text-zinc-900 tracking-tight mr-2">
            记账本
          </Link>
          {isLoggedIn && links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${base} ${path.startsWith(l.href) ? active : inactive}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors px-3 py-1.5"
            >
              退出
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors px-3 py-1.5"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg px-4 py-1.5 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
