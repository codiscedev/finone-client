"use client";

import * as React from "react";

export type Theme = "light" | "dark" | "system";
export type AccentColor = "blue" | "emerald" | "purple" | "indigo" | "gold" | "rose";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (accent: AccentColor) => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  accentColor: "blue",
  setAccentColor: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");
  const [accentColor, setAccentColorState] = React.useState<AccentColor>("blue");

  React.useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as Theme | null) || "system";
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    const savedAccent = (localStorage.getItem("accentColor") as AccentColor | null) || "blue";
    setAccentColorState(savedAccent);
    applyAccent(savedAccent);
  }, []);

  const applyTheme = (t: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (t === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(t);
    }
  };

  const applyAccent = (accent: AccentColor) => {
    const root = window.document.documentElement;
    root.classList.remove(
      "accent-blue",
      "accent-emerald",
      "accent-purple",
      "accent-indigo",
      "accent-gold",
      "accent-rose"
    );
    root.classList.add(`accent-${accent}`);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const setAccentColor = (newAccent: AccentColor) => {
    setAccentColorState(newAccent);
    localStorage.setItem("accentColor", newAccent);
    applyAccent(newAccent);
  };

  React.useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
