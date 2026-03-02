"use client";

import type { Brand } from "@/app/contexts/BrandContext";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "theme-preference";

export type ThemePreference = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resolvedTheme: ResolvedTheme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system")
      return stored;
  } catch {
    // ignore
  }
  return "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Provides theme state (light | dark | system) with localStorage persistence.
 * When brand is hipages, resolved theme is forced to light (caller must pass brand or use BrandContext).
 * Use useTheme() in children. Apply resolvedTheme to <html> via ThemeScript or effect.
 */
export function ThemeProvider({
  children,
  forceLight,
  forceDark,
}: {
  children: React.ReactNode;
  /** When true (e.g. hipages brand), resolvedTheme is always "light". */
  forceLight?: boolean;
  /** When true (e.g. Mav's Digital Workshop brand), resolvedTheme is always "dark". */
  forceDark?: boolean;
}) {
  const [theme, setThemeState] = useState<ThemePreference>("system");
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(readStoredTheme());
    setSystemTheme(getSystemTheme());
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemTheme(mq.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((value: ThemePreference) => {
    setThemeState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  }, []);

  const resolvedTheme: ResolvedTheme =
    forceLight === true
      ? "light"
      : forceDark === true
        ? "dark"
        : theme === "system"
          ? systemTheme
          : theme;

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mounted, resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: mounted ? theme : "system",
      setTheme,
      resolvedTheme: forceLight
        ? "light"
        : forceDark
          ? "dark"
          : mounted
            ? resolvedTheme
            : "light",
    }),
    [mounted, theme, setTheme, resolvedTheme, forceLight, forceDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
