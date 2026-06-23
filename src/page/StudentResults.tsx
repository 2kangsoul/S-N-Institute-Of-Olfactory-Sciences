// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import { Award, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

export default function StudentResults() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.objectId) return;
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const studentRes = await apiClient.get(`/students/user/${user.objectId}`);
        const student = studentRes.data?.data;
        setStudentProfile(student);

        const enrollRes = await apiClient.get(`/students/${student.id}/enrollments`).catch(() => ({ data: { data: [] } }));
        const enrolls = enrollRes.data?.data || [];
        setEnrollments(enrolls);

        // Ambil semua submission dari setiap enrollment
        const allSubs: any[] = [];
        await Promise.all(
          enrolls.map(async (enroll: any) => {
            try {
              const subRes = await apiClient.get(`/submissions?enrollmentId=${enroll.id}`);
              const subs = subRes.data?.data || [];
              subs.forEach((s: any) => allSubs.push({ ...s, programTitle: enroll.program?.title }));
            } catch {}
          })
        );
        allSubs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSubmissions(allSubs);
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

  const passed = submissions.filter(s => s.isPassed === true).length;
  const failed = submissions.filter(s => s.isPassed === false).length;
  const pending = submissions.filter(s => s.isPassed === null && s.submittedAt).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>Hasil Ujian</h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Riwayat semua ujian yang sudah dikerjakan</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[
          { label: "Lulus", value: passed, color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: CheckCircle },
          { label: "Tidak Lulus", value: failed, color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: XCircle },
          { label: "Menunggu Nilai", value: pending, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
        ].map((s, i) => (
          <div key={i} style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* List submissions */}
      <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #1e2744", fontSize: "13px", fontWeight: 500, color: "#fff" }}>
          Riwayat Ujian ({submissions.length})
        </div>

        {submissions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
            Belum ada ujian yang dikerjakan.
          </div>
        ) : (
          submissions.map((sub) => {
            const isPassed = sub.isPassed === true;
            const isFailed = sub.isPassed === false;
            const isPending = sub.isPassed === null;
            return (
              <div
                key={sub.id}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", borderBottom: "0.5px solid #1a2035", cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                onClick={() => navigate(`/student/exam/${sub.examId}/result?submissionId=${sub.id}`)}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: isPassed ? "rgba(16,185,129,0.1)" : isFailed ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)" }}>
                  {isPassed ? <CheckCircle size={18} color="#10b981" /> : isFailed ? <XCircle size={18} color="#ef4444" /> : <Clock size={18} color="#f59e0b" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff", marginBottom: "2px" }}>{sub.exam?.title}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {sub.programTitle} · Percobaan #{sub.attemptNo} ·{" "}
                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Belum selesai"}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {sub.score !== null ? (
                    <div style={{ fontSize: "18px", fontWeight: 700, color: isPassed ? "#10b981" : "#ef4444" }}>{sub.score}</div>
                  ) : (
                    <div style={{ fontSize: "11px", color: "#f59e0b" }}>Menunggu</div>
                  )}
                  <div style={{ fontSize: "10px", color: "#64748b" }}>/ 100</div>
                </div>
                <ChevronRight size={14} color="#64748b" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
