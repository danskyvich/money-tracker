"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = [
  { name: "light", icon: <Sun size={20} /> },
  { name: "dark", icon: <Moon size={20} /> },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [ mounted, setMounted ] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex p-3 z-50 items-end gap-3 border border-(--color-border-default) rounded-xl shadow-sm">
      {THEMES.map((t) => (
        <div className="flex hover:bg-(--color-bg-secondary)">
          <button
            key={t.name}
            onClick={() => {
              setTheme(t.name);
            }}
            style={{
              color:
                theme === t.name
                  ? "var(--color-brand-green)"
                  : "var(--color-text-primary)",
            }}
            className="flex w-full items-center text-[1rem] transition-all duration-200 cursor-pointer"
          >
            <span>{t.icon}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
