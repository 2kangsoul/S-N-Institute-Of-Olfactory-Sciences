import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Package,
  CheckSquare,
  Sparkles,
  Users,
  DollarSign,
  Plug,
  Settings,
  LayoutGrid,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ icon: Icon, label, active = false }: any) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 10px",
      borderRadius: "8px",
      color: active ? "#fff" : "#94a3b8",
      background: active ? "#1e2130" : "transparent",
      cursor: "pointer",
      fontSize: "13px",
      marginBottom: "2px",
    }}
  >
    <Icon size={16} />
    {label}
  </div>
);

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // =========================================================================
  // ORIGINAL AUTH LOGIC & ALGORITHMS (UNCHANGED)
  // =========================================================================
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !user?.role) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid #1e2744", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (user?.role !== "admin" && user?.role !== "owner") {
    return <Navigate to="/" replace />;
  }
  // =========================================================================

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f1117",
        color: "#e2e8f0",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "13px",
      }}
    >
      {/* SIDEBAR (NEW LAYOUT) */}
      <div
        style={{
          width: "200px",
          minWidth: "200px",
          background: "#0f1117",
          borderRight: "0.5px solid #1e2130",
          padding: "16px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            fontWeight: 500,
            color: "#fff",
            padding: "0 16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              background: "#a78bfa",
              borderRadius: "50%",
            }}
          />
          Dashdark X
        </div>

        <div style={{ padding: "4px 8px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#4b5563",
              padding: "12px 10px 4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Main
          </div>
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={FileText} label="All pages" />
          <NavItem icon={BarChart2} label="Reports" />
          <NavItem icon={Package} label="Products" />
          <NavItem icon={CheckSquare} label="Task" />
        </div>

        <div style={{ padding: "4px 8px", marginTop: "8px" }}>
          <div
            style={{
              fontSize: "11px",
              color: "#4b5563",
              padding: "12px 10px 4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Other
          </div>
          <NavItem icon={Sparkles} label="Features" />
          <NavItem icon={Users} label="Users" />
          <NavItem icon={DollarSign} label="Pricing" />
          <NavItem icon={Plug} label="Integrations" />
        </div>

        <div style={{ marginTop: "auto", padding: "12px 8px 0" }}>
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={LayoutGrid} label="Template pages" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 10px 0",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "#7c3aed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: "#fff",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              JC
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#fff" }}>John Carter</div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>
                Account settings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;