import { Outlet } from "react-router-dom";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Container from "@/components/common/Container";

import "./MainLayout.css";

export default function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="layout__main">
        <Header />

        <Container>
          <Outlet />
        </Container>
      </div>
    </div>
  );
}