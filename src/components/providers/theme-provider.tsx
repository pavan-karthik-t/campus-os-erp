"use client";

import { createContext, useContext, useEffect } from "react";

// Dark-mode only — theme toggle is intentionally disabled.
const ThemeContext = createContext<{ theme: "dark"; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always enforce dark mode
    document.documentElement.classList.add("dark");
    localStorage.setItem("campusos-theme", "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
