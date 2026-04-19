"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";
const KEY = "lunara-theme";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeToggle({ ariaLabel }: { ariaLabel?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTheme(currentTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    setTheme(next);
  };

  // Avoid SSR/CSR mismatch flicker — render generic sun icon until mounted
  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel ?? (isDark ? "Világos mód" : "Sötét mód")}
      className="h-9 w-9 grid place-items-center hover:opacity-60 transition-opacity"
    >
      {isDark ? (
        <Sun size={18} strokeWidth={1.4} />
      ) : (
        <Moon size={18} strokeWidth={1.4} />
      )}
    </button>
  );
}
