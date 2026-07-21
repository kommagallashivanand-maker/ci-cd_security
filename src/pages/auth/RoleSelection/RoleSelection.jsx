import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard, LuUserCog, LuShieldCheck } from "react-icons/lu";

import { ROUTES } from "@/constants/routes";
import Button from "@/components/ui/Button";

import "./RoleSelection.css";

const ROLES = [
  { label: "Employee", route: ROUTES.EMPLOYEE_DASHBOARD, icon: LuLayoutDashboard },
  { label: "Agent", route: ROUTES.AGENT_DASHBOARD, icon: LuUserCog },
  { label: "Admin", route: ROUTES.ADMIN_DASHBOARD, icon: LuShieldCheck },
];

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-selection">
      <h1 className="role-selection__title">DeskFlow</h1>
      <p className="role-selection__subtitle">Select your role to continue</p>

      <div className="role-selection__options">
        {ROLES.map(({ label, route, icon: Icon }) => (
          <Button
            key={route}
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => navigate(route)}
          >
            <Icon className="role-selection__icon" aria-hidden="true" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
