import { useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";

/**
 * useTheme
 *
 * Access the current theme ("light" | "dark") and a `toggleTheme`
 * function. Must be used within a `ThemeProvider`.
 *
 * @returns {{ theme: "light" | "dark", toggleTheme: () => void }}
 *
 * @example
 * const { theme, toggleTheme } = useTheme();
 * <button onClick={toggleTheme}>{theme === "dark" ? "☀️" : "🌙"}</button>
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
