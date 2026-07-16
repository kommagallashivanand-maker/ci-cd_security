import { Routes, Route } from "react-router-dom";

import { ROUTES } from "@/constants/routes";

import MainLayout from "@/layouts/MainLayout";
import PublicLayout from "@/layouts/PublicLayout";

import RoleSelection from "@/pages/auth/RoleSelection";
import EmployeeDashboard from "@/pages/employee/Dashboard";
import AgentDashboard from "@/pages/agent/Dashboard";
import AdminDashboard from "@/pages/admin/Dashboard";
import NotFound from "@/pages/common/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}

      <Route
        path={ROUTES.HOME}
        element={
          <PublicLayout>
            <RoleSelection />
          </PublicLayout>
        }
      />

      {/* Application */}

      <Route element={<MainLayout />}>
        <Route
          path={ROUTES.EMPLOYEE_DASHBOARD}
          element={<EmployeeDashboard />}
        />

        <Route
          path={ROUTES.AGENT_DASHBOARD}
          element={<AgentDashboard />}
        />

        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={<AdminDashboard />}
        />
      </Route>

      {/* 404 */}

      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />

    </Routes>
  );
}