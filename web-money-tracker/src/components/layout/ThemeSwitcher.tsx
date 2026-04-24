"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = [
  { name: "light", label: "Light", icon: "☀️" },
  { name: "dark", label: "Dark", icon: "🌙" },
  { name: "system", label: "System", icon: "💻" },
];

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const[mounted, setMounted] = useState(false);
    const[open, setOpen] = useState(false);

    useEffect(()=> setMounted(true), []);

    if (!mounted) return null

    const current = THEMES.find((t)=>t.name === theme) ?? THEMES[2];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5rem",
      }}
    >
      {open && (
        <div
          style={{
            marginBottom: "0.5rem",
            width: "11rem",
            borderRadius: "1rem",
            border: "1px solid var(--color-border-default)",
            backgroundColor: "var(--color-bg-secondary)",
            padding: "0.5rem",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <p
            style={{
              padding: "0.25rem 0.5rem",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.25rem",
            }}
          >
            Theme
          </p>
          {THEMES.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setTheme(t.name);
                setOpen(false);
              }}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: "0.75rem",
                borderRadius: "0.75rem",
                padding: "0.5rem 0.75rem",
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                backgroundColor:
                  theme === t.name ? "var(--color-bg-overlay)" : "transparent",
                color:
                  theme === t.name
                    ? "var(--color-brand-green)"
                    : "var(--color-text-primary)",
                fontWeight: theme === t.name ? 600 : 400,
              }}
            >
              <span style={{ fontSize: "1rem" }}>{t.icon}</span>
              {t.label}
              {theme === t.name && (
                <span
                  style={{
                    marginLeft: "auto",
                    color: "var(--color-brand-green)",
                    fontSize: "0.75rem",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle theme switcher"
        style={{
          display: "flex",
          height: "3rem",
          width: "3rem",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          border: "1px solid var(--color-border-default)",
          backgroundColor: "var(--color-bg-secondary)",
          boxShadow: "var(--shadow-md)",
          cursor: "pointer",
          transition: "transform 0.15s, box-shadow 0.15s",
          fontSize: "1.25rem",
        }}
      >
        {current.icon}
      </button>
    </div>
  );
}
