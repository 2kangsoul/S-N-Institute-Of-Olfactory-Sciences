// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import { BookOpen, ChevronRight, Clock, Users } from "lucide-react";

export default function StudentProgram() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>Program Saya</h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Daftar program yang kamu ikuti</p>
      </div>

      {enrollments.length === 0 ? (
        <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "60px 20px", textAlign: "center" }}>
          <BookOpen size={40} color="#374151" style={{ marginBottom: "12px" }} />
          <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>Belum ada program</div>
          <button
            onClick={() => navigate("/program")}
            style={{ padding: "8px 20px", borderRadius: "8px", background: "#10b981", border: "none", color: "#fff", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}
          >
            Jelajahi Program
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {enrollments.map((enroll) => {
            const prog = enroll.program;
            return (
              <div
                key={enroll.id}
                style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", overflow: "hidden" }}
              >
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>{prog?.title}</div>
                      {prog?.subtitle && <div style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>{prog.subtitle}</div>}
                    </div>
                    <span style={{
                      fontSize: "10px", padding: "3px 10px", borderRadius: "4px", fontWeight: 600, flexShrink: 0,
                      color: enroll.status === "ACTIVE" ? "#10b981" : enroll.status === "COMPLETED" ? "#a78bfa" : "#64748b",
                      background: enroll.status === "ACTIVE" ? "rgba(16,185,129,0.1)" : enroll.status === "COMPLETED" ? "rgba(167,139,250,0.1)" : "rgba(100,116,139,0.1)",
                      border: `1px solid ${enroll.status === "ACTIVE" ? "rgba(16,185,129,0.3)" : enroll.status === "COMPLETED" ? "rgba(167,139,250,0.3)" : "rgba(100,116,139,0.3)"}`,
                    }}>
                      {enroll.status === "ACTIVE" ? "Aktif" : enroll.status === "COMPLETED" ? "Selesai" : enroll.status}
                    </span>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>Progress Keseluruhan</span>
                      <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 600 }}>{enroll.progress || 0}%</span>
                    </div>
                    <div style={{ height: "6px", background: "#1e2744", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: "3px", width: `${enroll.progress || 0}%`, transition: "width 0.5s" }} />
                    </div>
                  </div>

                  {/* Modul list */}
                  <button
                    onClick={() => navigate(`/student/program/${prog?.id}`)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "rgba(16,185,129,0.1)", border: "0.5px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                  >
                    <BookOpen size={13} /> Lihat Modul & Ujian <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
