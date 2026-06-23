// @ts-nocheck
/* eslint-disable */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Save,
  Upload,
  Trash2,
  FileText,
  Download,
  Eye,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
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
function toDatetimeLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const STATUS_CONFIG: any = {
  PUBLISHED: {
    label: "Tersedia",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    border: "rgba(16,185,129,0.3)",
  },
  DRAFT: {
    label: "Draft",
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    border: "rgba(100,116,139,0.3)",
  },
  ARCHIVED: {
    label: "Arsip",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
  },
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f1117",
  border: "0.5px solid #2d3748",
  borderRadius: "6px",
  padding: "7px 10px",
  fontSize: "12px",
  color: "#e2e8f0",
  outline: "none",
  boxSizing: "border-box",
};

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [module, setModule] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]); // ← ganti attendances → sessions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    scheduleDate: "",
    location: "",
    durationHour: "",
    maxParticipant: "",
  });

  const [savingSchedule, setSavingSchedule] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);
  const [deletingMaterial, setDeletingMaterial] = useState(false);
  const [cancellingSession, setCancellingSession] = useState<string | null>(
    null,
  );

  const [scheduleMsg, setScheduleMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [materialMsg, setMaterialMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const [modRes, sessRes] = await Promise.all([
          apiClient.get(`/modules/${id}`),
          apiClient.get(`/modules/${id}/sessions`), // ← ganti /attendances → /sessions
        ]);
        const mod = modRes.data?.data;
        setModule(mod);
        setSessions(sessRes.data?.data || []);
        setForm({
          scheduleDate: toDatetimeLocal(mod.scheduleDate),
          location: mod.location || "",
          durationHour: mod.durationHour ? String(mod.durationHour) : "",
          maxParticipant: mod.maxParticipant ? String(mod.maxParticipant) : "",
        });
      } catch (e: any) {
        setError(e.response?.data?.message || "Gagal memuat modul");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSaveSchedule = async () => {
    setSavingSchedule(true);
    setScheduleMsg(null);
    try {
      const payload = {
        scheduleDate: form.scheduleDate
          ? new Date(form.scheduleDate).toISOString()
          : null,
        location: form.location || null,
        durationHour: form.durationHour ? Number(form.durationHour) : null,
        maxParticipant: form.maxParticipant
          ? Number(form.maxParticipant)
          : null,
      };
      await apiClient.put(`/modules/${id}`, payload);
      setModule((prev: any) => ({ ...prev, ...payload }));
      setScheduleMsg({ type: "ok", text: "Jadwal berhasil disimpan!" });
    } catch (e: any) {
      setScheduleMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal menyimpan.",
      });
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!module) return;
    const newStatus = module.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setTogglingStatus(true);
    try {
      await apiClient.put(`/modules/${id}`, { status: newStatus });
      setModule((prev: any) => ({ ...prev, status: newStatus }));
    } catch {
      alert("Gagal mengubah status.");
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!["application/pdf", "text/html"].includes(file.type)) {
      setMaterialMsg({ type: "err", text: "Hanya PDF atau HTML." });
      return;
    }
    setUploadingMaterial(true);
    setMaterialMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiClient.put(`/modules/${id}/material`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModule((prev: any) => ({
        ...prev,
        materialUrl: res.data?.data?.materialUrl,
      }));
      setMaterialMsg({ type: "ok", text: "Materi berhasil diupload!" });
    } catch (e: any) {
      setMaterialMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal upload.",
      });
    } finally {
      setUploadingMaterial(false);
    }
  };

  const handleDeleteMaterial = async () => {
    if (!confirm("Hapus materi modul ini?")) return;
    setDeletingMaterial(true);
    try {
      await apiClient.delete(`/modules/${id}/material`);
      setModule((prev: any) => ({ ...prev, materialUrl: null }));
      setMaterialMsg({ type: "ok", text: "Materi dihapus." });
    } catch {
      setMaterialMsg({ type: "err", text: "Gagal menghapus." });
    } finally {
      setDeletingMaterial(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/modules/${id}/material/preview?download=1`,
      );
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const ext = blob.type.includes("html") ? ".html" : ".pdf";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${module?.title || "materi"}${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal download.");
    }
  };

  // ── Cancel / Restore sesi ─────────────────────────────────────────────────
  const handleToggleSession = async (
    sessionId: string,
    isCancelled: boolean,
  ) => {
    setCancellingSession(sessionId);
    try {
      const endpoint = isCancelled
        ? `/sessions/${sessionId}/restore`
        : `/sessions/${sessionId}/cancel`;
      await apiClient.put(endpoint);
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, isCancelled: !isCancelled } : s,
        ),
      );
    } catch {
      alert("Gagal mengubah status sesi.");
    } finally {
      setCancellingSession(null);
    }
  };

  // ── Stats dari sessions ───────────────────────────────────────────────────
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter((s) => !s.isCancelled).length;
  const totalAttendances = sessions.reduce(
    (sum, s) => sum + (s.attendances?.length || 0),
    0,
  );
  const totalPresent = sessions.reduce(
    (sum, s) =>
      sum + (s.attendances?.filter((a: any) => a.isPresent).length || 0),
    0,
  );
  const maxP = module?.maxParticipant ?? 0;

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
            width: "36px",
            height: "36px",
            border: "3px solid #1e2744",
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (error || !module)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: "12px",
        }}
      >
        <p style={{ color: "#ef4444", fontSize: "14px" }}>
          {error || "Modul tidak ditemukan"}
        </p>
        <button
          onClick={() => navigate("/lecture/schedule")}
          style={{
            fontSize: "12px",
            color: "#a78bfa",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Kembali ke Jadwal
        </button>
      </div>
    );

  const statusCfg = STATUS_CONFIG[module.status] || STATUS_CONFIG.DRAFT;
  const previewUrl = `${API_BASE}/modules/${id}/material/preview`;
  const card: React.CSSProperties = {
    background: "#161b2e",
    borderRadius: "10px",
    border: "0.5px solid #1e2744",
    padding: "20px",
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: "11px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "12px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/lecture/schedule")}
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
          <ArrowLeft size={14} /> Kembali ke Jadwal Modul
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  color: statusCfg.color,
                  background: statusCfg.bg,
                  border: `1px solid ${statusCfg.border}`,
                }}
              >
                {statusCfg.label}
              </span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Modul {module.order}
              </span>
            </div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#fff",
                margin: "0 0 4px",
              }}
            >
              {module.title}
            </h1>
            {module.description && (
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {module.description}
              </p>
            )}
          </div>
          <button
            onClick={handleToggleStatus}
            disabled={togglingStatus}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              flexShrink: 0,
              background:
                module.status === "PUBLISHED"
                  ? "rgba(239,68,68,0.15)"
                  : "rgba(16,185,129,0.15)",
              color: module.status === "PUBLISHED" ? "#ef4444" : "#10b981",
              opacity: togglingStatus ? 0.6 : 1,
            }}
          >
            {togglingStatus
              ? "..."
              : module.status === "PUBLISHED"
                ? "Jadikan Draft"
                : "Publish"}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "10px",
        }}
      >
        {[
          {
            icon: <CalendarDays size={14} color="#64748b" />,
            label: "Total Sesi",
            value: `${activeSessions} aktif`,
            sub: `${totalSessions} total`,
          },
          {
            icon: <Clock size={14} color="#64748b" />,
            label: "Durasi/Sesi",
            value: module.durationHour ? `${module.durationHour} jam` : "–",
          },
          {
            icon: <MapPin size={14} color="#64748b" />,
            label: "Lokasi",
            value: module.location || "–",
          },
          {
            icon: <Users size={14} color="#64748b" />,
            label: "Total Hadir",
            value: `${totalPresent}`,
            sub: `dari ${totalAttendances} tercatat`,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#161b2e",
              borderRadius: "10px",
              border: "0.5px solid #1e2744",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              {s.icon}
              <span
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </span>
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#fff",
                lineHeight: 1.3,
              }}
            >
              {s.value}
            </div>
            {s.sub && (
              <div
                style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}
              >
                {s.sub}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Materi + Edit Jadwal */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        {/* Materi */}
        <div style={card}>
          <p style={sectionLabel}>Materi</p>
          {module.materialUrl ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 12px",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "8px",
                }}
              >
                <FileText size={14} color="#10b981" />
                <span style={{ fontSize: "13px", color: "#10b981" }}>
                  Materi tersedia
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "0.5px solid #2d3748",
                    color: "#94a3b8",
                    fontSize: "12px",
                    textDecoration: "none",
                  }}
                >
                  <Eye size={12} /> Preview
                </a>
                <button
                  onClick={handleDownload}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "0.5px solid #2d3748",
                    background: "none",
                    color: "#94a3b8",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  <Download size={12} /> Download
                </button>
                <button
                  onClick={handleDeleteMaterial}
                  disabled={deletingMaterial}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "0.5px solid #374151",
                    background: "none",
                    color: "#ef4444",
                    fontSize: "12px",
                    cursor: "pointer",
                    opacity: deletingMaterial ? 0.6 : 1,
                  }}
                >
                  <Trash2 size={12} /> {deletingMaterial ? "..." : "Hapus"}
                </button>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "#7c3aed",
                    color: "#fff",
                    fontSize: "12px",
                    cursor: "pointer",
                    opacity: uploadingMaterial ? 0.6 : 1,
                  }}
                >
                  <Upload size={12} />{" "}
                  {uploadingMaterial ? "Uploading..." : "Ganti"}
                  <input
                    type="file"
                    accept="application/pdf,text/html"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          ) : (
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#7c3aed",
                color: "#fff",
                fontSize: "13px",
                cursor: uploadingMaterial ? "not-allowed" : "pointer",
                opacity: uploadingMaterial ? 0.6 : 1,
              }}
            >
              <Upload size={14} />{" "}
              {uploadingMaterial ? "Uploading..." : "Upload Materi (PDF/HTML)"}
              <input
                type="file"
                accept="application/pdf,text/html"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </label>
          )}
          {materialMsg && (
            <p
              style={{
                fontSize: "11px",
                color: materialMsg.type === "ok" ? "#10b981" : "#ef4444",
                marginTop: "8px",
                marginBottom: 0,
              }}
            >
              {materialMsg.text}
            </p>
          )}
        </div>

        {/* Edit Jadwal */}
        <div style={card}>
          <p style={sectionLabel}>Edit Jadwal Dasar</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "5px",
                }}
              >
                <CalendarDays size={11} /> Tanggal Mulai
              </label>
              <input
                type="datetime-local"
                value={form.scheduleDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, scheduleDate: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "5px",
                }}
              >
                <MapPin size={11} /> Lokasi
              </label>
              <input
                type="text"
                placeholder="Lab A, Zoom, dst."
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "5px",
                }}
              >
                <Clock size={11} /> Durasi/Sesi (jam)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                placeholder="cth: 2"
                value={form.durationHour}
                onChange={(e) =>
                  setForm((p) => ({ ...p, durationHour: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "5px",
                }}
              >
                <Users size={11} /> Max Peserta
              </label>
              <input
                type="number"
                min="1"
                placeholder="cth: 20"
                value={form.maxParticipant}
                onChange={(e) =>
                  setForm((p) => ({ ...p, maxParticipant: e.target.value }))
                }
                style={inputStyle}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={handleSaveSchedule}
              disabled={savingSchedule}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "6px",
                border: "none",
                background: "#7c3aed",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 500,
                cursor: savingSchedule ? "not-allowed" : "pointer",
                opacity: savingSchedule ? 0.6 : 1,
              }}
            >
              <Save size={13} /> {savingSchedule ? "Menyimpan..." : "Simpan"}
            </button>
            {scheduleMsg && (
              <span
                style={{
                  fontSize: "11px",
                  color: scheduleMsg.type === "ok" ? "#10b981" : "#ef4444",
                }}
              >
                {scheduleMsg.text}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Daftar Sesi + Absensi per Sesi ── */}
      <div style={card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "0.5px solid #1e2744",
          }}
        >
          <p style={{ ...sectionLabel, marginBottom: 0 }}>Sesi & Absensi</p>
          <span style={{ fontSize: "12px", color: "#64748b" }}>
            {totalSessions} sesi · {totalPresent} total hadir
          </span>
        </div>

        {sessions.length === 0 ? (
          <div
            style={{
              padding: "32px 0",
              textAlign: "center",
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            Belum ada sesi. Generate sesi di halaman Program Saya → expand modul
            → Jadwal Berulang.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "700px",
              }}
            >
              <thead>
                <tr>
                  {[
                    "Sesi",
                    "Tanggal",
                    "Jam",
                    "Hadir",
                    "Absen",
                    "Detail Murid",
                    "Aksi",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        textAlign: "left",
                        padding: "8px 12px",
                        borderBottom: "0.5px solid #1e2744",
                        fontWeight: 400,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((sess: any) => {
                  const hadirCount =
                    sess.attendances?.filter((a: any) => a.isPresent).length ||
                    0;
                  const totalAtt = sess.attendances?.length || 0;
                  const absenCount = totalAtt - hadirCount;
                  return (
                    <tr
                      key={sess.id}
                      style={{ opacity: sess.isCancelled ? 0.5 : 1 }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "0.5px solid #1a2035",
                          fontSize: "12px",
                          color: "#a78bfa",
                          fontWeight: 600,
                        }}
                      >
                        #{sess.order}
                        {sess.isCancelled && (
                          <span
                            style={{
                              marginLeft: "6px",
                              fontSize: "9px",
                              color: "#ef4444",
                              background: "rgba(239,68,68,0.1)",
                              padding: "1px 4px",
                              borderRadius: "3px",
                            }}
                          >
                            Batal
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "0.5px solid #1a2035",
                          fontSize: "12px",
                          color: "#e2e8f0",
                        }}
                      >
                        {formatDateShort(sess.sessionDate)}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "0.5px solid #1a2035",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        {sess.startTime}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "0.5px solid #1a2035",
                          fontSize: "13px",
                          color: "#10b981",
                          fontWeight: 600,
                        }}
                      >
                        {hadirCount}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "0.5px solid #1a2035",
                          fontSize: "13px",
                          color: absenCount > 0 ? "#ef4444" : "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        {absenCount}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "0.5px solid #1a2035",
                        }}
                      >
                        {sess.attendances?.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "4px",
                            }}
                          >
                            {sess.attendances.map((att: any, i: number) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  borderRadius: "3px",
                                  color: att.isPresent ? "#10b981" : "#ef4444",
                                  background: att.isPresent
                                    ? "rgba(16,185,129,0.1)"
                                    : "rgba(239,68,68,0.1)",
                                }}
                              >
                                {att.enrollment?.student?.user?.fullName || "?"}{" "}
                                {att.isPresent ? "✓" : "✗"}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: "11px", color: "#4b5563" }}>
                            Belum ada data
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "0.5px solid #1a2035",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleToggleSession(sess.id, sess.isCancelled)
                          }
                          disabled={cancellingSession === sess.id}
                          style={{
                            fontSize: "10px",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            border: "0.5px solid #374151",
                            background: "transparent",
                            color: sess.isCancelled ? "#10b981" : "#ef4444",
                            cursor: "pointer",
                            opacity: cancellingSession === sess.id ? 0.6 : 1,
                          }}
                        >
                          {cancellingSession === sess.id
                            ? "..."
                            : sess.isCancelled
                              ? "Restore"
                              : "Batalkan"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
