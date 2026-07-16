import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUserCog,
  LuShieldCheck,
  LuHouse,
} from "react-icons/lu";

import { ROUTES } from "@/constants/routes";

import "./Sidebar.css";

/**
 * NAV_ITEMS
 * Single source of truth for the primary navigation links.
 * Each role has its own dashboard route; "Home" always returns
 * to the role-selection screen.
 */
const NAV_ITEMS = [
  { to: ROUTES.HOME, label: "Home", icon: LuHouse },
  { to: ROUTES.EMPLOYEE_DASHBOARD, label: "Employee", icon: LuLayoutDashboard },
  { to: ROUTES.AGENT_DASHBOARD, label: "Agent", icon: LuUserCog },
  { to: ROUTES.ADMIN_DASHBOARD, label: "Admin", icon: LuShieldCheck },
];

/**
 * Sidebar
 *
 * Primary application navigation shown inside `MainLayout`.
 * Highlights the active route via `NavLink`'s `isActive` state.
 *
 * @example
 * <Sidebar />
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <h1>DeskFlow</h1>
      </div>

      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ROUTES.HOME}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <Icon className="sidebar__link-icon" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
