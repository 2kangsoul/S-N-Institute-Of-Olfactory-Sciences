// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import { BookOpen, Award, ClipboardList, TrendingUp, ChevronRight, Clock } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.objectId) return;
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const studentRes = await apiClient.get(`/students/user/${user.objectId}`);
        const student = studentRes.data?.data;
        setStudentProfile(student);

        if (student?.id) {
          // Fetch enrollments
          const enrollRes = await apiClient.get(`/students/${student.id}/enrollments`).catch(() => ({ data: { data: [] } }));
          setEnrollments(enrollRes.data?.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [user?.objectId]);

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid #1e2744", borderTop: "3px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const displayName = user?.name || user?.fullName || "Student";
  const totalEnrolled = enrollments.length;
  const totalCompleted = enrollments.filter(e => e.status === "COMPLETED").length;
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const stats = [
    { icon: BookOpen, label: "Program Diikuti", value: totalEnrolled, color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
    { icon: Award, label: "Program Selesai", value: totalCompleted, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    { icon: TrendingUp, label: "Rata-rata Progress", value: `${avgProgress}%`, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { icon: ClipboardList, label: "Total Ujian", value: "-", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
          Selamat datang, {displayName} 👋
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
          Pantau perkembangan belajar kamu di sini
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon size={16} color={stat.color} />
              </div>
              <span style={{ fontSize: "11px", color: "#64748b" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Program yang diikuti */}
      <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderBottom: "0.5px solid #1e2744" }}>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>Program Saya</div>
          <button
            onClick={() => navigate("/student/program")}
            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#10b981", background: "none", border: "none", cursor: "pointer" }}
          >
            Lihat semua <ChevronRight size={14} />
          </button>
        </div>

        {enrollments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#64748b", fontSize: "13px" }}>
            <BookOpen size={32} color="#374151" style={{ marginBottom: "8px" }} />
            <div>Kamu belum terdaftar di program manapun.</div>
            <button
              onClick={() => navigate("/program")}
              style={{ marginTop: "12px", padding: "8px 16px", borderRadius: "8px", background: "#10b981", border: "none", color: "#fff", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
            >
              Jelajahi Program
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {enrollments.slice(0, 3).map((enroll) => (
              <div
                key={enroll.id}
                onClick={() => navigate(`/student/program/${enroll.program?.id}`)}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", background: "#0f1117", borderRadius: "10px", border: "0.5px solid #1e2744", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#10b981"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2744"}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={18} color="#10b981" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff", marginBottom: "4px" }}>
                    {enroll.program?.title || "Program"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ flex: 1, height: "4px", background: "#1e2744", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#10b981", borderRadius: "2px", width: `${enroll.progress || 0}%` }} />
                    </div>
                    <span style={{ fontSize: "11px", color: "#64748b", flexShrink: 0 }}>{enroll.progress || 0}%</span>
                  </div>
                </div>
                <span style={{
                  fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600,
                  color: enroll.status === "ACTIVE" ? "#10b981" : enroll.status === "COMPLETED" ? "#a78bfa" : "#64748b",
                  background: enroll.status === "ACTIVE" ? "rgba(16,185,129,0.1)" : enroll.status === "COMPLETED" ? "rgba(167,139,250,0.1)" : "rgba(100,116,139,0.1)",
                }}>
                  {enroll.status === "ACTIVE" ? "Aktif" : enroll.status === "COMPLETED" ? "Selesai" : enroll.status}
                </span>
                <ChevronRight size={14} color="#64748b" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
