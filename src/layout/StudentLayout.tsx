// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Navigate, Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Settings,
  LogOut,
  Award,
} from "lucide-react";
import apiClient from "../config/api";

const NavItem = ({ icon: Icon, label, active = false, onClick, to }: any) => {
  const content = (
    <div
      onClick={onClick}
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
        transition: "all 0.2s",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#1e2130";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#94a3b8";
        }
      }}
    >
      <Icon size={16} />
      {label}
    </div>
  );

  if (to)
    return (
      <Link to={to} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  return content;
};

const StudentLayout = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!user?.objectId) return;
    apiClient
      .get(`/students/user/${user.objectId}`)
      .then((res) => setStudentProfile(res.data?.data))
      .catch(() => setStudentProfile(null))
      .finally(() => setIsChecking(false));
  }, [user?.objectId]);

  // ── 1. Belum login ────────────────────────────────────────────────────────
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ── 2. Role sedang dimuat ─────────────────────────────────────────────────
  if (isAuthenticated && !user?.role) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #1e2744",
            borderTop: "3px solid #10b981",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── 3. Role salah → redirect sesuai role ──────────────────────────────────
  if (user?.role === "admin" || user?.role === "owner") {
    return <Navigate to="/admin" replace />;
  }
  if (user?.role === "lecture") {
    return <Navigate to="/lecture" replace />;
  }

  // ── 4. Sedang fetch student profile ──────────────────────────────────────
  if (isChecking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1117",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #1e2744",
            borderTop: "3px solid #10b981",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── 5. Tidak punya StudentProfile ────────────────────────────────────────
  if (!studentProfile) return <Navigate to="/" replace />;

  const displayName = user?.name || user?.fullName || "Student";
  const displayInitial = displayName[0]?.toUpperCase();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/student" },
    { icon: BookOpen, label: "Program Saya", to: "/student/program" },
    { icon: ClipboardList, label: "Ujian Saya", to: "/student/exams" },
    { icon: Award, label: "Hasil Ujian", to: "/student/results" },
  ];

  const isActive = (path: string) => {
    if (path === "/student") return location.pathname === "/student";
    return location.pathname.startsWith(path);
  };

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
      {/* SIDEBAR */}
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
        {/* Logo */}
        <div
          style={{
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
              background: "#10b981",
              borderRadius: "50%",
            }}
          />
          <Link to="/" style={{ flexShrink: 0 }}>
            <img
              src="/SNN.jpeg"
              alt="SNN Logo"
              style={{ height: "40px", objectFit: "contain" }}
            />
          </Link>
        </div>

        {/* Student badge */}
        <div
          style={{
            margin: "0 8px 16px",
            padding: "8px 12px",
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#10b981",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "2px",
            }}
          >
            Student Portal
          </div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            {studentProfile?.studentCode || "SNN-Student"}
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "4px 8px", flex: 1 }}>
          <div
            style={{
              fontSize: "11px",
              color: "#4b5563",
              padding: "12px 10px 4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Menu
          </div>
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={isActive(item.to)}
            />
          ))}
        </div>

        {/* Bottom */}
        <div style={{ padding: "12px 8px 0" }}>
          <NavItem
            icon={Settings}
            label="Settings"
            to="/student/settings"
            active={location.pathname === "/student/settings"}
          />
          <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 10px 0",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                border: "1.5px solid #10b981",
              }}
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {displayInitial}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: "12px", color: "#fff" }}>
                {displayName}
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>Student</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
