// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Navigate, Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarDays,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import apiClient from "../config/api";

interface LectureLayoutProps {
  children?: React.ReactNode;
}

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

const LectureLayout = ({ children }: LectureLayoutProps) => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [lectureProfile, setLectureProfile] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!user?.objectId) return;
    apiClient
      .get(`/lectures/user/${user.objectId}`)
      .then((res) => {
        setLectureProfile(res.data?.data);
      })
      .catch(() => {
        setLectureProfile(null);
      })
      .finally(() => setIsChecking(false));
  }, [user?.objectId]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

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
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!lectureProfile) return <Navigate to="/" replace />;

  const displayName = user?.name || user?.fullName || "Lecture";
  const displayInitial = displayName[0]?.toUpperCase();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/lecture" },
    { icon: BookOpen, label: "Program Saya", to: "/lecture/program" },
    { icon: CalendarDays, label: "Jadwal Modul", to: "/lecture/schedule" }, // ← fix
    { icon: Users, label: "Murid", to: "/lecture/murid" },
    { icon: ClipboardList, label: "Absensi", to: "/lecture/absensi" },
  ];

  // active check: exact untuk /lecture, startsWith untuk sub-routes
  const isActive = (path: string) => {
    if (path === "/lecture") return location.pathname === "/lecture";
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
              background: "#a78bfa",
              borderRadius: "50%",
            }}
          />
          <Link to="/" className="flex-shrink-0">
            <img
              src="/SNN.jpeg"
              alt="SNN Logo"
              className="h-10 transition duration-300 hover:brightness-110 object-contain"
            />
          </Link>
        </div>

        {/* Lecture badge */}
        <div
          style={{
            margin: "0 8px 16px",
            padding: "8px 12px",
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#a78bfa",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "2px",
            }}
          >
            Lecture Portal
          </div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>
            {lectureProfile?.lectureCode || "SNN-Olfactory"}
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
            to="/lecture/settings"
            active={location.pathname === "/lecture/settings"}
          />
          <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />

          {/* User info */}
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
                border: "1.5px solid #7c3aed",
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
                    background: "#7c3aed",
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
              <div style={{ fontSize: "10px", color: "#64748b" }}>
                {lectureProfile?.specialization || "Lecture"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT — support nested routes (Outlet) & legacy children */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children ?? <Outlet />}
      </div>
    </div>
  );
};

export default LectureLayout;
