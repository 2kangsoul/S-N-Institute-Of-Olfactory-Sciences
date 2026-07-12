// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  Package,
  Sparkles,
  Users,
  DollarSign,
  ClipboardList,
  Settings,
  Home,
  Menu,
  X,
} from "lucide-react";
import AdminSidebarModal from "../Features/Admin/AdminModal/AdminSidebarModal";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ icon: Icon, label, active = false, onClick }: any) => (
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
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = "#1e2130";
        e.currentTarget.style.color = "#fff";
      }
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

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, isAuthLoading, user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Hindari mismatch SSR: evaluasi auth setelah mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const denied =
    !isAuthenticated ||
    (!!user?.role && user?.role !== "admin" && user?.role !== "owner");

  useEffect(() => {
    // Tunggu isAuthLoading selesai (verifikasi cookie ke /auth/me) sebelum redirect,
    // supaya admin yang sesinya masih valid tidak kelempar keluar karena race condition.
    if (mounted && !isAuthLoading && denied) router.replace("/");
  }, [mounted, isAuthLoading, denied, router]);

  if (!mounted || isAuthLoading) return null;

  if (!isAuthenticated) return null; // sedang redirect ke "/"

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
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (user?.role !== "admin" && user?.role !== "owner") return null; // sedang redirect ke "/"

  const displayName = user?.name || user?.fullName || "Admin";
  const displayInitial = displayName[0].toUpperCase();

  const mainNav = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: BookOpen, label: "Program", path: "/program" },
    { icon: BarChart2, label: "Laporan", path: "/admin/laporan" },
    { icon: Package, label: "Produk", path: "/products" },
  ];

  const otherNav = [
    { icon: Sparkles, label: "Perfume", path: "/awards" },
    { icon: Users, label: "Users", path: "/admin" },
    { icon: DollarSign, label: "Expenses", path: "/admin" },
    { icon: ClipboardList, label: "Orders", path: "/admin" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className="portal-layout"
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f1117",
        color: "#e2e8f0",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        fontSize: "13px",
      }}
    >
      <AdminSidebarModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <style>{`
        .portal-mobile-bar { display: none; }
        .portal-overlay { display: none; }
        .portal-sidebar-close { display: none; }

        @media (max-width: 768px) {
          .portal-layout { display: block !important; }
          .portal-mobile-bar {
            display: flex;
            position: sticky;
            top: 0;
            z-index: 40;
            align-items: center;
            justify-content: space-between;
            height: 56px;
            padding: 0 14px;
            background: rgba(15, 17, 23, 0.96);
            border-bottom: 0.5px solid #1e2130;
            backdrop-filter: blur(12px);
          }
          .portal-sidebar {
            position: fixed;
            z-index: 60;
            inset: 0 auto 0 0;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 20px 0 60px rgba(0, 0, 0, 0.35);
          }
          .portal-sidebar.open { transform: translateX(0); }
          .portal-overlay.open {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 50;
            background: rgba(0, 0, 0, 0.55);
          }
          .portal-sidebar-close {
            display: flex;
            position: absolute;
            top: 12px;
            right: 10px;
            width: 30px;
            height: 30px;
            align-items: center;
            justify-content: center;
            border: 1px solid #1e2744;
            border-radius: 8px;
            background: #161b2e;
            color: #e2e8f0;
          }
          .portal-content { padding: 14px !important; }
        }
      `}</style>

      <div className="portal-mobile-bar">
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/SNN.jpeg"
            alt="SNN Logo"
            style={{ height: "34px", objectFit: "contain" }}
          />
        </Link>
        <button
          type="button"
          onClick={() => setShowSidebar(true)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            border: "1px solid #1e2744",
            background: "#161b2e",
            color: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      </div>

      <div
        className={`portal-overlay ${showSidebar ? "open" : ""}`}
        onClick={() => setShowSidebar(false)}
      />

      {/* SIDEBAR */}
      <div
        className={`portal-sidebar ${showSidebar ? "open" : ""}`}
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
        <button
          type="button"
          className="portal-sidebar-close"
          onClick={() => setShowSidebar(false)}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
        {/* Logo */}
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
          <Link href="/" className="flex-shrink-0">
            <img
              src="/SNN.jpeg"
              alt="SNN Logo"
              className="h-10 transition duration-300 hover:brightness-110 object-contain"
            />
          </Link>
        </div>

        {/* Main nav */}
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
          {mainNav.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={isActive(item.path)}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>

        {/* Other nav */}
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
          {otherNav.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={isActive(item.path)}
              onClick={() => router.push(item.path)}
            />
          ))}
        </div>

        {/* Bottom */}
        <div style={{ marginTop: "auto", padding: "12px 8px 0" }}>
          <NavItem
            icon={Settings}
            label="Settings"
            active={false}
            onClick={() => router.push("/admin")}
          />
          <NavItem
            icon={Home}
            label="Ke Beranda"
            active={false}
            onClick={() => router.push("/")}
          />

          {/* User profile */}
          <div
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 10px 0",
              cursor: "pointer",
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
                Account settings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        className="portal-content"
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
