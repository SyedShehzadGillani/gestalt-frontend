import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type ThemeSetting = Theme | "system";

interface ThemeContextType {
  theme: Theme;
  setting: ThemeSetting;
  setTheme: (theme: ThemeSetting) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "gestalt-theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredSetting(): ThemeSetting {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light" || stored === "system") return stored;
  return "system";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [setting, setSetting] = useState<ThemeSetting>(() => readStoredSetting());
  const [theme, setResolved] = useState<Theme>(() => {
    const s = readStoredSetting();
    return s === "system" ? getSystemTheme() : s;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (setting === "system") {
      localStorage.removeItem(STORAGE_KEY);
      setResolved(getSystemTheme());
    } else {
      localStorage.setItem(STORAGE_KEY, setting);
      setResolved(setting);
    }
  }, [setting]);

  useEffect(() => {
    if (setting !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setResolved(e.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [setting]);

  const setTheme = (value: ThemeSetting) => setSetting(value);
  const toggleTheme = () => setSetting(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, setting, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
