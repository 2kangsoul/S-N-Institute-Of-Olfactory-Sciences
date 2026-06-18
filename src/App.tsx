import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";

// Import Layout
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./Features/header/component/MainLayout";
import AdminLayout from "./layout/AdminLayout";

// Import Halaman
import Home from "./Features/landingpages/components/Home";
import Products from "./page/Products";
import LoginPage from "./page/loginpage";
import Team from "./page/Team";
import Blog from "./page/Blog";
import ChatBot from "./Features/chatbot/Components/ChatBot";
import NicheGuide from "./page/niche";
import AboutUs from "./page/AboutUs";
import NotFound from "./page/NotFound";
import Dashboard from "../src/page/Dashboard";
import Awards from "./page/Awards"
import AwardsCategory from "./page/AwardsCategory";

function App() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          zIndex: 999999,
        }}
      />

      <Routes>
        {/* =========================================
            RUTE KHUSUS ADMIN
            ========================================= */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* =========================================
            RUTE PUBLIK & PENGGUNA BIASA (MainLayout)
            ========================================= */}
        <Route element={<MainLayout />}>
          {/* Rute Bebas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/niche" element={<NicheGuide />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/awards" element={<Awards />} /> {/* ✅ Tambahan baru */}
          <Route path="/awards/:category" element={<AwardsCategory />} /> {/* ✅ Tambahan baru */}

          {/* Rute Terlindungi (Wajib Login, dicegat oleh AuthLayout) */}
          <Route element={<AuthLayout />}>
            <Route path="/products" element={<Products />} />
          </Route>

          {/* RUTE FALLBACK */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ChatBot />
    </>
  );
}

export default App;