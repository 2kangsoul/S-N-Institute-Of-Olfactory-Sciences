// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import apiClient from "../config/api";
import { BookOpen, Users, CalendarDays, TrendingUp } from "lucide-react";

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DaysUntil({ date }: { date: string }) {
  if (!date) return <span style={{ color: "#64748b" }}>-</span>;
  const diff = Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return <span style={{ color: "#64748b" }}>Sudah lewat</span>;
  if (diff === 0) return <span style={{ color: "#10b981" }}>Hari ini</span>;
  return <span style={{ color: "#a78bfa" }}>{diff} hari lagi</span>;
}

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    PUBLISHED: {
      label: "Tersedia",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.3)",
    },
    DRAFT: {
      label: "Draft",
      color: "#64748b",
      bg: "rgba(100,116,139,0.1)",
      border: "rgba(100,116,139,0.3)",
    },
    ARCHIVED: {
      label: "Arsip",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.3)",
    },
  };
  const s = config[status] || config.DRAFT;
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "4px",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.label}
    </span>
  );
};

export default function LectureDashboard() {
  const { user } = useAuthStore();
  const [lectureProfile, setLectureProfile] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.objectId) return;
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch lecture profile
        const lectureRes = await apiClient.get(
          `/lectures/user/${user.objectId}`,
        );
        const lecture = lectureRes.data?.data;
        setLectureProfile(lecture);

        // 2. Fetch program jika ada
        if (lecture?.program?.id) {
          const progRes = await apiClient.get(
            `/programs/${lecture.program.id}`,
          );
          const prog = progRes.data?.data;
          setProgram(prog);

          // 3. Fetch modules
          const modRes = await apiClient.get(
            `/programs/${lecture.program.id}/modules`,
          );
          setModules(modRes.data?.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [user?.objectId]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "500px",
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

  // Hitung stats
  const totalModules = modules.length;
  const publishedModules = modules.filter(
    (m) => m.status === "PUBLISHED",
  ).length;
  const nextModule = modules
    .filter((m) => m.scheduleDate && new Date(m.scheduleDate) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.scheduleDate).getTime() - new Date(b.scheduleDate).getTime(),
    )[0];
  const daysUntilNext = nextModule
    ? Math.ceil(
        (new Date(nextModule.scheduleDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const statCards = [
    {
      label: "Total Murid",
      value: enrollments.length || program?._count?.enrollments || 0,
      icon: Users,
      color: "#7c3aed",
    },
    {
      label: "Modul Aktif",
      value: publishedModules,
      icon: BookOpen,
      color: "#06b6d4",
    },
    {
      label: "Jadwal Terdekat",
      value: daysUntilNext !== null ? `${daysUntilNext} hari` : "-",
      icon: CalendarDays,
      color: "#10b981",
    },
    {
      label: "Total Modul",
      value: totalModules,
      icon: TrendingUp,
      color: "#f59e0b",
    },
  ];

  const levelConfig = {
    BEGINNER: {
      label: "Beginner",
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.3)",
    },
    ADVANCED: {
      label: "Advanced",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.3)",
    },
    EXPERT: {
      label: "Expert",
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      border: "rgba(139,92,246,0.3)",
    },
  };
  const level = program
    ? levelConfig[program.level] || levelConfig.BEGINNER
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* ── Topbar ── */}
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
          Selamat datang, {user?.name || "Lecture"} 👋
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
          {lectureProfile?.lectureCode || ""} ·{" "}
          {lectureProfile?.specialization ||
            "S&N Institute of Olfactory Sciences"}
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "#161b2e",
              borderRadius: "10px",
              padding: "14px 16px",
              border: "0.5px solid #1e2744",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                {card.label}
              </span>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  background: `${card.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <card.icon size={14} color={card.color} />
              </div>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 500, color: "#fff" }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Program + Modul ── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        {/* Program Info */}
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            padding: "16px",
            border: "0.5px solid #1e2744",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "14px",
              paddingBottom: "10px",
              borderBottom: "0.5px solid #1e2744",
            }}
          >
            Program yang Dipegang
          </div>
          {!program ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Belum ada program yang di-assign.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {level && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "2px 10px",
                    borderRadius: "4px",
                    color: level.color,
                    background: level.bg,
                    border: `1px solid ${level.border}`,
                    width: "fit-content",
                  }}
                >
                  {level.label}
                </span>
              )}
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#fff",
                  lineHeight: 1.4,
                }}
              >
                {program.title}
              </div>
              {program.subtitle && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontStyle: "italic",
                  }}
                >
                  {program.subtitle}
                </div>
              )}
              {program.description && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    lineHeight: 1.6,
                  }}
                >
                  {program.description}
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                {[
                  { label: "Total Modul", value: `${totalModules} Modul` },
                  {
                    label: "Modul Aktif",
                    value: `${publishedModules} Tersedia`,
                  },
                  {
                    label: "Harga",
                    value: program.price
                      ? `Rp ${Number(program.price).toLocaleString("id-ID")}`
                      : "-",
                  },
                  {
                    label: "Status",
                    value: program.isPublished ? "Published" : "Draft",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "#0f1117",
                      borderRadius: "6px",
                      padding: "8px 10px",
                      border: "0.5px solid #1e2744",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        marginBottom: "3px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#e2e8f0",
                        fontWeight: 500,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modul List */}
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            padding: "16px",
            border: "0.5px solid #1e2744",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "14px",
              paddingBottom: "10px",
              borderBottom: "0.5px solid #1e2744",
            }}
          >
            Daftar Modul
          </div>
          {modules.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Belum ada modul.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              {modules.map((mod, i) => (
                <div
                  key={mod.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "#0f1117",
                    borderRadius: "8px",
                    border: "0.5px solid #1e2744",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "3px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        Modul {mod.order}
                      </span>
                      <StatusBadge status={mod.status} />
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#e2e8f0",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {mod.title}
                    </div>
                    {mod.scheduleDate && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          marginTop: "2px",
                        }}
                      >
                        {formatDate(mod.scheduleDate)} ·{" "}
                        <DaysUntil date={mod.scheduleDate} />
                      </div>
                    )}
                  </div>
                  {mod.durationHour && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        border: "0.5px solid #1e2744",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        flexShrink: 0,
                        marginLeft: "8px",
                      }}
                    >
                      {mod.durationHour}j
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Jadwal Terdekat ── */}
      {nextModule && (
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            padding: "16px",
            border: "0.5px solid #1e2744",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "14px",
              paddingBottom: "10px",
              borderBottom: "0.5px solid #1e2744",
            }}
          >
            Jadwal Modul Terdekat
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
            }}
          >
            {[
              { label: "Modul", value: `Modul ${nextModule.order}` },
              { label: "Judul", value: nextModule.title },
              { label: "Tanggal", value: formatDate(nextModule.scheduleDate) },
              { label: "Lokasi", value: nextModule.location || "-" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#0f1117",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "0.5px solid #1e2744",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "6px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#e2e8f0",
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Profile Lecture ── */}
      <div
        style={{
          background: "#161b2e",
          borderRadius: "10px",
          padding: "16px",
          border: "0.5px solid #1e2744",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#fff",
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: "0.5px solid #1e2744",
          }}
        >
          Profil Lecture
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
          }}
        >
          {[
            {
              label: "Lecture Code",
              value: lectureProfile?.lectureCode || "-",
            },
            {
              label: "Spesialisasi",
              value: lectureProfile?.specialization || "-",
            },
            { label: "Bio", value: lectureProfile?.bio || "-" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#0f1117",
                borderRadius: "8px",
                padding: "12px",
                border: "0.5px solid #1e2744",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: 1.5 }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
