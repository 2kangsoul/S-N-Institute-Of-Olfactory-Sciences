import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { Navigate } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Users,
  Settings,
  X,
  Search,
  Bell,
  User,
  Home,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "owner")) {
    return <Navigate to="/" replace />;
  }

  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { title: "Users", icon: <Users size={20} /> },
    { title: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-64 bg-white shadow-md z-50
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between p-6">
          <h1 className="text-xl font-bold text-blue-600">MY ADMIN</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.title}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition mb-2"
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative w-full min-h-screen">
        <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-r from-blue-600 to-indigo-700 z-0"></div>

        <header className="relative z-10 h-16 flex items-center justify-between px-6 text-white">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2
              className="text-lg font-semibold flex items-center gap-2 cursor-pointer hover:text-gray-200 transition"
              onClick={() => (window.location.href = "/")}
            >
              <Home size={18} /> Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-white/20 rounded-full px-4 py-1 items-center border border-white/20">
              <Search size={16} className="text-white mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm placeholder-white/70 w-32"
              />
            </div>
            <button className="hover:text-gray-200">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2 bg-white/20 p-1.5 rounded-full pl-3">
              <span className="text-sm font-medium">Admin</span>
              <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
