// @ts-nocheck
/* eslint-disable */
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import apiClient from "../config/api";
import * as XLSX from "xlsx";
import {
  Users,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ProgressBar = ({
  pct,
  color = "#7c3aed",
}: {
  pct: number;
  color?: string;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <div
      style={{
        flex: 1,
        height: "6px",
        background: "#1e2744",
        borderRadius: "3px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(pct, 100)}%`,
          background: color,
          borderRadius: "3px",
          transition: "width 0.3s",
        }}
      />
    </div>
    <span
      style={{
        fontSize: "11px",
        color: "#64748b",
        flexShrink: 0,
        minWidth: "32px",
        textAlign: "right",
      }}
    >
      {pct}%
    </span>
  </div>
);

// ── Export Excel ──────────────────────────────────────────────────────────────
function exportToExcel(data: any) {
  const { program, studentRecap, recentSessions } = data;
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Rekap Per Murid ──────────────────────────────────────────────
  const modules = studentRecap[0]?.moduleRecap || [];
  const sheet1Header = [
    "No",
    "Nama Murid",
    "Email",
    ...modules.map((m: any) => `Modul ${m.moduleOrder} - ${m.moduleTitle}`),
    "Total Hadir",
    "Total Sesi",
    "Persentase (%)",
    "Keterangan",
  ];

  const sheet1Rows = studentRecap.map((s: any, i: number) => [
    i + 1,
    s.student.fullName,
    s.student.email,
    ...s.moduleRecap.map((mr: any) => `${mr.presentCount}/${mr.totalSessions}`),
    s.presentCount,
    s.totalSessions,
    `${s.pct}%`,
    s.needsAttention
      ? `⚠️ Absen ${s.consecutiveAbsent}x berturut`
      : s.pct === 100
        ? "✅ Sempurna"
        : "Normal",
  ]);

  const ws1 = XLSX.utils.aoa_to_sheet([
    [`LAPORAN ABSENSI - ${program.title}`],
    [
      `Dicetak: ${new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`,
    ],
    [],
    sheet1Header,
    ...sheet1Rows,
  ]);

  // Style kolom
  ws1["!cols"] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 30 },
    ...modules.map(() => ({ wch: 20 })),
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 25 },
  ];
  ws1["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: sheet1Header.length - 1 } },
  ];

  XLSX.utils.book_append_sheet(wb, ws1, "Rekap Per Murid");

  // ── Sheet 2: Detail Per Sesi ──────────────────────────────────────────────
  const students = studentRecap.map((s: any) => s.student.fullName);
  const sheet2Header = [
    "No",
    "Tanggal",
    "Hari",
    "Jam",
    "Modul",
    "Sesi ke-",
    ...students,
    "Total Hadir",
    "Total Absen",
  ];

  const sheet2Rows = recentSessions.map((sess: any, i: number) => {
    const d = new Date(sess.sessionDate);
    const studentCols = students.map((name: string) => {
      const att = sess.attendances?.find(
        (a: any) => a.enrollment?.student?.user?.fullName === name,
      );
      if (!att) return "-";
      return att.isPresent
        ? `✓ ${att.checkedInAt ? formatTimeRaw(att.checkedInAt) : "Hadir"}`
        : "✗ Absen";
    });

    const hadirCount =
      sess.attendances?.filter((a: any) => a.isPresent).length || 0;
    const absenCount = (sess.attendances?.length || 0) - hadirCount;

    return [
      i + 1,
      d.toLocaleDateString("id-ID"),
      d.toLocaleDateString("id-ID", { weekday: "long" }),
      sess.startTime,
      sess.moduleTitle,
      `Sesi #${sess.order}`,
      ...studentCols,
      hadirCount,
      absenCount,
    ];
  });

  const ws2 = XLSX.utils.aoa_to_sheet([
    [`DETAIL ABSENSI PER SESI - ${program.title}`],
    [],
    sheet2Header,
    ...sheet2Rows,
  ]);

  ws2["!cols"] = [
    { wch: 5 },
    { wch: 15 },
    { wch: 12 },
    { wch: 8 },
    { wch: 35 },
    { wch: 10 },
    ...students.map(() => ({ wch: 20 })),
    { wch: 12 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(wb, ws2, "Detail Per Sesi");

  // ── Download ──────────────────────────────────────────────────────────────
  const fileName = `Absensi_${program.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

function formatTimeRaw(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Absensi() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"murid" | "sesi">("murid");

  useEffect(() => {
    if (!user?.objectId) return;
    const fetch_ = async () => {
      try {
        setLoading(true);
        const lectureRes = await apiClient.get(
          `/lectures/user/${user.objectId}`,
        );
        const lecture = lectureRes.data?.data;
        if (!lecture?.id) {
          setLoading(false);
          return;
        }

        const res = await apiClient.get(`/lectures/${lecture.id}/absensi`);
        setData(res.data?.data);
      } catch (e: any) {
        setError(e.response?.data?.message || "Gagal memuat data absensi");
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [user?.objectId]);

  if (loading)
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
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          color: "#ef4444",
          fontSize: "14px",
        }}
      >
        {error}
      </div>
    );

  if (!data)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        Belum ada data absensi.
      </div>
    );

  const { stats, studentRecap, recentSessions, alerts } = data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
            Absensi
          </h1>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
            Rekap kehadiran murid per sesi dan per modul
          </p>
        </div>
        {data && (
          <button
            onClick={() => exportToExcel(data)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#10b981",
              border: "none",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Download size={14} /> Export Excel
          </button>
        )}
      </div>

      {/* ── Alert ── */}
      {alerts?.length > 0 && (
        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "0.5px solid rgba(245,158,11,0.3)",
            borderRadius: "10px",
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <AlertTriangle size={14} color="#f59e0b" />
            <span
              style={{ fontSize: "12px", fontWeight: 600, color: "#f59e0b" }}
            >
              Perhatian — Murid Sering Absen
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {alerts.map((alert: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#e2e8f0",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                    flexShrink: 0,
                  }}
                />
                <strong>{alert.student.fullName}</strong>
                <span style={{ color: "#64748b" }}>
                  absen {alert.consecutiveAbsent}x berturut-turut
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "10px",
        }}
      >
        {[
          {
            icon: <CalendarDays size={14} color="#7c3aed" />,
            label: "Total Sesi",
            value: stats.totalSessions,
            sub: `${stats.todaySessions} sesi hari ini`,
            color: "#a78bfa",
          },
          {
            icon: <TrendingUp size={14} color="#10b981" />,
            label: "Rata-rata Hadir",
            value: `${stats.avgAttendancePct}%`,
            sub: `${stats.totalPresent} dari ${stats.totalAttendanceRecords}`,
            color: "#10b981",
          },
          {
            icon: <Users size={14} color="#3b82f6" />,
            label: "Murid Aktif",
            value: stats.activeStudents,
            sub: "enrolled",
            color: "#60a5fa",
          },
          {
            icon: <AlertTriangle size={14} color="#f59e0b" />,
            label: "Perlu Perhatian",
            value: alerts?.length || 0,
            sub: "absen 3x berturut-turut",
            color: alerts?.length > 0 ? "#f59e0b" : "#64748b",
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#161b2e",
              borderRadius: "10px",
              border: "0.5px solid #1e2744",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "10px",
              }}
            >
              {s.icon}
              <span
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </span>
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: s.color,
                marginBottom: "4px",
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          {
            key: "murid",
            label: `👥 Rekap per Murid (${studentRecap?.length || 0})`,
          },
          {
            key: "sesi",
            label: `📅 Sesi Terbaru (${recentSessions?.length || 0})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: `1.5px solid ${activeTab === tab.key ? "#7c3aed" : "#1e2744"}`,
              background:
                activeTab === tab.key ? "rgba(124,58,237,0.15)" : "transparent",
              color: activeTab === tab.key ? "#a78bfa" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Rekap per Murid ── */}
      {activeTab === "murid" && (
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            border: "0.5px solid #1e2744",
            overflow: "hidden",
          }}
        >
          {studentRecap?.length === 0 ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Belum ada murid aktif.
            </div>
          ) : (
            <div>
              {/* Header tabel */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                  gap: "12px",
                  padding: "12px 16px",
                  borderBottom: "0.5px solid #1e2744",
                }}
              >
                {["Murid", "Kehadiran", "Progress", "Status", ""].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: "10px",
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {studentRecap.map((s: any) => {
                const isExpanded = expandedStudentId === s.enrollmentId;
                const pctColor =
                  s.pct >= 75 ? "#10b981" : s.pct >= 50 ? "#f59e0b" : "#ef4444";

                return (
                  <div key={s.enrollmentId}>
                    {/* Row murid */}
                    <div
                      onClick={() =>
                        setExpandedStudentId(isExpanded ? null : s.enrollmentId)
                      }
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                        gap: "12px",
                        padding: "14px 16px",
                        borderBottom: "0.5px solid #1a2035",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(124,58,237,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {/* Nama */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "rgba(124,58,237,0.2)",
                            border: "1px solid rgba(124,58,237,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#a78bfa",
                            flexShrink: 0,
                          }}
                        >
                          {s.student.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#fff",
                            }}
                          >
                            {s.student.fullName}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {s.student.email}
                          </div>
                        </div>
                      </div>

                      {/* Kehadiran */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: pctColor,
                          }}
                        >
                          {s.presentCount}/{s.totalSessions}
                        </span>
                        <span style={{ fontSize: "10px", color: "#64748b" }}>
                          sesi hadir
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <ProgressBar pct={s.pct} color={pctColor} />
                      </div>

                      {/* Status alert */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {s.needsAttention ? (
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              background: "rgba(245,158,11,0.1)",
                              color: "#f59e0b",
                              border: "0.5px solid rgba(245,158,11,0.3)",
                            }}
                          >
                            ⚠️ Absen {s.consecutiveAbsent}x
                          </span>
                        ) : s.pct === 100 ? (
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              background: "rgba(16,185,129,0.1)",
                              color: "#10b981",
                            }}
                          >
                            ✅ Sempurna
                          </span>
                        ) : (
                          <span style={{ fontSize: "10px", color: "#64748b" }}>
                            Normal
                          </span>
                        )}
                      </div>

                      {/* Expand */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {isExpanded ? (
                          <ChevronUp size={14} color="#64748b" />
                        ) : (
                          <ChevronDown size={14} color="#64748b" />
                        )}
                      </div>
                    </div>

                    {/* Expanded — rekap per modul */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "12px 16px 16px 58px",
                          background: "rgba(15,17,23,0.6)",
                          borderBottom: "0.5px solid #1a2035",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: "10px",
                          }}
                        >
                          Rekap per Modul
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {s.moduleRecap.map((mr: any) => (
                            <div
                              key={mr.moduleId}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 80px 1fr",
                                gap: "12px",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{ fontSize: "12px", color: "#e2e8f0" }}
                              >
                                <span
                                  style={{
                                    color: "#64748b",
                                    marginRight: "6px",
                                  }}
                                >
                                  #{mr.moduleOrder}
                                </span>
                                {mr.moduleTitle}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color:
                                    mr.pct >= 75
                                      ? "#10b981"
                                      : mr.pct >= 50
                                        ? "#f59e0b"
                                        : "#ef4444",
                                  fontWeight: 600,
                                }}
                              >
                                {mr.presentCount}/{mr.totalSessions}
                              </div>
                              <ProgressBar
                                pct={mr.pct}
                                color={
                                  mr.pct >= 75
                                    ? "#10b981"
                                    : mr.pct >= 50
                                      ? "#f59e0b"
                                      : "#ef4444"
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Sesi Terbaru ── */}
      {activeTab === "sesi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {recentSessions?.length === 0 ? (
            <div
              style={{
                background: "#161b2e",
                borderRadius: "10px",
                border: "0.5px solid #1e2744",
                padding: "40px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Belum ada sesi yang sudah berlangsung.
            </div>
          ) : (
            recentSessions.map((sess: any) => {
              const hadirCount =
                sess.attendances?.filter((a: any) => a.isPresent).length || 0;
              const totalCount = sess.attendances?.length || 0;
              const absenCount = totalCount - hadirCount;
              const pct =
                totalCount > 0
                  ? Math.round((hadirCount / totalCount) * 100)
                  : 0;

              return (
                <div
                  key={sess.id}
                  style={{
                    background: "#161b2e",
                    borderRadius: "10px",
                    border: "0.5px solid #1e2744",
                    overflow: "hidden",
                  }}
                >
                  {/* Session header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      borderBottom:
                        totalCount > 0 ? "0.5px solid #1e2744" : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(124,58,237,0.15)",
                          border: "0.5px solid rgba(124,58,237,0.3)",
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#a78bfa",
                        }}
                      >
                        Sesi #{sess.order}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#fff",
                          }}
                        >
                          {sess.moduleTitle}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#64748b",
                            marginTop: "2px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CalendarDays size={11} />
                          {formatDateShort(sess.sessionDate)}
                          <Clock size={11} />
                          {sess.startTime}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#10b981",
                          }}
                        >
                          {hadirCount}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>
                          Hadir
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: absenCount > 0 ? "#ef4444" : "#64748b",
                          }}
                        >
                          {absenCount}
                        </div>
                        <div style={{ fontSize: "10px", color: "#64748b" }}>
                          Absen
                        </div>
                      </div>
                      <div style={{ width: "80px" }}>
                        <ProgressBar
                          pct={pct}
                          color={
                            pct >= 75
                              ? "#10b981"
                              : pct >= 50
                                ? "#f59e0b"
                                : "#ef4444"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Attendance detail */}
                  {totalCount > 0 && (
                    <div
                      style={{
                        padding: "10px 16px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {sess.attendances.map((att: any, i: number) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            background: att.isPresent
                              ? "rgba(16,185,129,0.08)"
                              : "rgba(239,68,68,0.08)",
                            border: `0.5px solid ${att.isPresent ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                          }}
                        >
                          {att.isPresent ? (
                            <CheckCircle size={12} color="#10b981" />
                          ) : (
                            <XCircle size={12} color="#ef4444" />
                          )}
                          <span
                            style={{
                              fontSize: "11px",
                              color: att.isPresent ? "#10b981" : "#ef4444",
                              fontWeight: 500,
                            }}
                          >
                            {att.enrollment?.student?.user?.fullName || "?"}
                          </span>
                          {att.isPresent && att.checkedInAt && (
                            <span
                              style={{ fontSize: "10px", color: "#64748b" }}
                            >
                              {formatTime(att.checkedInAt)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
