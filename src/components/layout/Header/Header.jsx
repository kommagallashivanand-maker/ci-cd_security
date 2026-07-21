import { LuMoon, LuSun } from "react-icons/lu";

import { useTheme } from "@/hooks/useTheme";

import "./Header.css";

/**
 * Header
 *
 * Top bar shown inside `MainLayout`. Hosts the app title and global
 * actions such as the light/dark theme toggle.
 *
 * @example
 * <Header />
 */
export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__left">
        <h2 className="header__title">DeskFlow</h2>
      </div>

      <div className="header__right">
        <button
          type="button"
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <LuMoon size={18} /> : <LuSun size={18} />}
        </button>

        <span className="header__user">Welcome</span>
      </div>
    </header>
  );
}
