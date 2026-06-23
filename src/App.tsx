import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";

// Import Layout
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./Features/header/component/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import LectureLayout from "./layout/LectureLayout";
import StudentLayout from "./layout/StudentLayout";

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
import Awards from "./page/Awards";
import AwardsCategory from "./page/AwardsCategory";
import PerfumeProgram from "./page/PerfumeProgram";
import ProgramDetail from "./page/ProgramDetail";
import LectureDashboard from "./page/LectureDashboard";
import ProgramSaya from "./page/ProgramSaya";
import JadwalModul from "./page/JadwalModul";
import ModuleDetail from "./page/Moduledetail";
import MuridLecture from "./page/MuridLecture";
import AromaDetail from "./page/IrisFowerNicho";
import Absensi from "./page/Absensi";
import LectureSettings from "./page/Lecturesettings";
import ExamManager from "./page/ExamManager";
import AdminLaporan from "./page/AdminLaporan";

// Import Halaman Student
import StudentDashboard from "./page/StudentDashboard";
import StudentProgram from "./page/StudentProgram";
import StudentProgramDetail from "./page/StudentProgramDetail";
import StudentExam from "./page/StudentExam";
import StudentExamResult from "./page/StudentExamResult";
import StudentResults from "./page/StudentResults";
import StudentSettings from "./page/StudentSettings";

function App() {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Toaster position="top-center" containerStyle={{ zIndex: 999999 }} />

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
        <Route
          path="/admin/laporan"
          element={
            <AdminLayout>
              <AdminLaporan />
            </AdminLayout>
          }
        />

        {/* =========================================
            RUTE KHUSUS LECTURE
            ========================================= */}
        <Route path="/lecture" element={<LectureLayout />}>
          <Route index element={<LectureDashboard />} />
          <Route path="program" element={<ProgramSaya />} />
          <Route path="schedule" element={<JadwalModul />} />
          <Route path="modules/:id" element={<ModuleDetail />} />
          <Route path="murid" element={<MuridLecture />} />
          <Route path="absensi" element={<Absensi />} />
          <Route path="settings" element={<LectureSettings />} />
          <Route path="modules/:id/exams" element={<ExamManager />} />
        </Route>

        {/* =========================================
            RUTE KHUSUS STUDENT
            ========================================= */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="program" element={<StudentProgram />} />
          <Route path="program/:programId" element={<StudentProgramDetail />} />
          <Route path="exam/:examId" element={<StudentExam />} />
          <Route path="exam/:examId/result" element={<StudentExamResult />} />
          <Route path="exams" element={<StudentResults />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        {/* =========================================
            RUTE PUBLIK & PENGGUNA BIASA (MainLayout)
            ========================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/niche" element={<NicheGuide />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/awards/:category" element={<AwardsCategory />} />
          <Route path="/isolates/:slug" element={<AromaDetail />} />
          <Route path="/program" element={<PerfumeProgram />} />
          <Route path="/program/:slug" element={<ProgramDetail />} />
          <Route element={<AuthLayout />}>
            <Route path="/products" element={<Products />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ChatBot />
    </>
  );
}

export default App;
