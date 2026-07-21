import { createContext } from "react";

/**
 * ThemeContext
 *
 * Holds the current color theme ("light" | "dark") and a setter.
 * Consume it via the `useTheme` hook rather than importing this
 * context directly.
 */
export const ThemeContext = createContext(null);
