// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Clock,
  ChevronRight,
  Lock,
  FileText,
  Download,
  Eye,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

export default function StudentProgramDetail() {
  const { user } = useAuthStore();
  const { programId } = useParams();
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [examsMap, setExamsMap] = useState<{ [moduleId: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.objectId || !programId) return;
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const studentRes = await apiClient.get(
          `/students/user/${user.objectId}`,
        );
        const student = studentRes.data?.data;
        setStudentProfile(student);

        const progRes = await apiClient.get(`/programs/${programId}`);
        setProgram(progRes.data?.data);

        const modRes = await apiClient.get(`/programs/${programId}/modules`);
        // ── Fix: sort by order ──
        const mods = (modRes.data?.data || []).sort(
          (a: any, b: any) => a.order - b.order,
        );
        setModules(mods);

        const enrollRes = await apiClient
          .get(`/students/${student.id}/enrollments`)
          .catch(() => ({ data: { data: [] } }));
        const enrolls = enrollRes.data?.data || [];
        const currentEnroll = enrolls.find(
          (e: any) => e.programId === programId || e.program?.id === programId,
        );
        setEnrollment(currentEnroll);

        const examMap: any = {};
        await Promise.all(
          mods.map(async (mod: any) => {
            try {
              const examRes = await apiClient.get(`/modules/${mod.id}/exams`);
              examMap[mod.id] = examRes.data?.data || [];
            } catch {
              examMap[mod.id] = [];
            }
          }),
        );
        setExamsMap(examMap);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [user?.objectId, programId]);

  const handleDownload = async (moduleId: string, title: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/modules/${moduleId}/material/preview?download=1`,
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const ext = blob.type.includes("html") ? ".html" : ".pdf";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal download materi.");
    }
  };

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/student/program")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: "12px",
            cursor: "pointer",
            marginBottom: "12px",
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> Kembali ke Program
        </button>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
          {program?.title}
        </h1>
        {program?.subtitle && (
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              marginTop: "2px",
              fontStyle: "italic",
            }}
          >
            {program.subtitle}
          </p>
        )}
      </div>

      {/* Progress bar */}
      {enrollment && (
        <div
          style={{
            background: "#161b2e",
            border: "0.5px solid #1e2744",
            borderRadius: "10px",
            padding: "16px 20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>
              Progress Program
            </span>
            <span
              style={{ fontSize: "13px", fontWeight: 700, color: "#10b981" }}
            >
              {enrollment.progress || 0}%
            </span>
          </div>
          <div
            style={{
              height: "8px",
              background: "#1e2744",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #10b981, #059669)",
                borderRadius: "4px",
                width: `${enrollment.progress || 0}%`,
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>
      )}

      {/* Modules */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {modules.length === 0 ? (
          <div
            style={{
              background: "#161b2e",
              border: "0.5px solid #1e2744",
              borderRadius: "10px",
              padding: "40px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Belum ada modul di program ini.
          </div>
        ) : (
          modules.map((mod) => {
            const exams = examsMap[mod.id] || [];
            const publishedExams = exams.filter(
              (e: any) => e.status === "PUBLISHED",
            );
            const isLocked = mod.status !== "PUBLISHED";
            const hasMaterial = !!mod.materialUrl;
            const previewUrl = `${API_BASE}/modules/${mod.id}/material/preview`;

            return (
              <div
                key={mod.id}
                style={{
                  background: "#161b2e",
                  border: "0.5px solid #1e2744",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {/* Modul header */}
                <div
                  style={{
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isLocked
                        ? "rgba(100,116,139,0.2)"
                        : "rgba(16,185,129,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    {isLocked ? (
                      <Lock size={14} color="#64748b" />
                    ) : (
                      <BookOpen size={14} color="#10b981" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      <span style={{ fontSize: "10px", color: "#64748b" }}>
                        Modul {mod.order}
                      </span>
                      {isLocked && (
                        <span
                          style={{
                            fontSize: "9px",
                            padding: "1px 6px",
                            borderRadius: "3px",
                            background: "rgba(100,116,139,0.15)",
                            color: "#64748b",
                          }}
                        >
                          Belum tersedia
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: isLocked ? "#64748b" : "#fff",
                        marginBottom: "6px",
                      }}
                    >
                      {mod.title}
                    </div>

                    {/* Info jadwal */}
                    {!isLocked &&
                      (mod.scheduleDate ||
                        mod.location ||
                        mod.durationHour) && (
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          {mod.scheduleDate && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "10px",
                                color: "#64748b",
                              }}
                            >
                              <Calendar size={9} />
                              {new Date(mod.scheduleDate).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          )}
                          {mod.location && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "10px",
                                color: "#64748b",
                              }}
                            >
                              <MapPin size={9} /> {mod.location}
                            </span>
                          )}
                          {mod.durationHour && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "10px",
                                color: "#64748b",
                              }}
                            >
                              <Clock size={9} /> {mod.durationHour} jam
                            </span>
                          )}
                          {mod.maxParticipant && (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "10px",
                                color: "#64748b",
                              }}
                            >
                              <Users size={9} /> Maks {mod.maxParticipant}{" "}
                              peserta
                            </span>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Jumlah ujian */}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      flexShrink: 0,
                    }}
                  >
                    {publishedExams.length} ujian
                  </span>
                </div>

                {/* Materi modul */}
                {!isLocked && hasMaterial && (
                  <div
                    style={{
                      padding: "10px 16px 10px 60px",
                      borderTop: "0.5px solid #1e2744",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(16,185,129,0.03)",
                    }}
                  >
                    <FileText size={13} color="#10b981" />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#10b981",
                        fontWeight: 500,
                        flex: 1,
                      }}
                    >
                      Materi Tersedia
                    </span>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: "transparent",
                        border: "0.5px solid #2d3748",
                        color: "#94a3b8",
                        fontSize: "11px",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Eye size={11} /> Preview
                    </a>
                    <button
                      onClick={() => handleDownload(mod.id, mod.title)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: "rgba(16,185,129,0.1)",
                        border: "0.5px solid rgba(16,185,129,0.3)",
                        color: "#10b981",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      <Download size={11} /> Download
                    </button>
                  </div>
                )}

                {/* Exam list */}
                {!isLocked && publishedExams.length > 0 && (
                  <div style={{ borderTop: "0.5px solid #1e2744" }}>
                    {publishedExams.map((exam: any) => (
                      <div
                        key={exam.id}
                        onClick={() =>
                          navigate(
                            `/student/exam/${exam.id}?enrollmentId=${enrollment?.id}`,
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 16px 12px 60px",
                          cursor: "pointer",
                          borderBottom: "0.5px solid #1a2035",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(167,139,250,0.05)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <ClipboardList size={13} color="#a78bfa" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "12px", color: "#e2e8f0" }}>
                            {exam.title}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              marginTop: "2px",
                            }}
                          >
                            <span
                              style={{ fontSize: "10px", color: "#64748b" }}
                            >
                              <Clock
                                size={9}
                                style={{
                                  display: "inline",
                                  marginRight: "3px",
                                }}
                              />
                              {exam.duration} menit
                            </span>
                            <span
                              style={{ fontSize: "10px", color: "#64748b" }}
                            >
                              Nilai lulus: {exam.passingScore}
                            </span>
                            <span
                              style={{ fontSize: "10px", color: "#64748b" }}
                            >
                              {exam._count?.questions || 0} soal
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={14} color="#64748b" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tidak ada ujian */}
                {!isLocked && publishedExams.length === 0 && !hasMaterial && (
                  <div
                    style={{
                      padding: "10px 16px 10px 60px",
                      borderTop: "0.5px solid #1e2744",
                      fontSize: "11px",
                      color: "#4b5563",
                    }}
                  >
                    Belum ada ujian tersedia.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
