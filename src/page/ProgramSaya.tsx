// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import {
  Upload,
  Trash2,
  FileText,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Save,
  Search,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function toDatetimeLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
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

const EnrollStatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    ACTIVE: { label: "Aktif", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    COMPLETED: {
      label: "Selesai",
      color: "#a78bfa",
      bg: "rgba(167,139,250,0.1)",
    },
    DROPPED: { label: "Berhenti", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    PENDING: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  };
  const s = config[status] || config.PENDING;
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "4px",
        color: s.color,
        background: s.bg,
      }}
    >
      {s.label}
    </span>
  );
};

const levelConfig: any = {
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

type ActiveSection = "modul" | "murid" | "absensi";

export default function ProgramSaya() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [moduleSessions, setModuleSessions] = useState<{
    [moduleId: string]: any[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>("modul");
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [savingScheduleId, setSavingScheduleId] = useState<string | null>(null);
  const [searchingLocationId, setSearchingLocationId] = useState<string | null>(
    null,
  );
  const [locationQuery, setLocationQuery] = useState<{
    [moduleId: string]: string;
  }>({});
  const [locationResults, setLocationResults] = useState<{
    [moduleId: string]: any[];
  }>({});
  const [msg, setMsg] = useState<{
    type: "ok" | "err";
    text: string;
    id: string;
  } | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [scheduleForm, setScheduleForm] = useState<{
    [moduleId: string]: {
      scheduleDate: string;
      location: string;
      durationHour: string;
      maxParticipant: string;
      latitude: string;
      longitude: string;
    };
  }>({});

  const [recurringForm, setRecurringForm] = useState<{
    [moduleId: string]: {
      recurringDay: string;
      recurringTime: string;
      totalSessions: string;
    };
  }>({});
  const [generatingSessionId, setGeneratingSessionId] = useState<string | null>(
    null,
  );
  const [sessionCounts, setSessionCounts] = useState<{
    [moduleId: string]: number;
  }>({});

  const fetchAll = async () => {
    if (!user?.objectId) return;
    setIsLoading(true);
    try {
      const lectureRes = await apiClient.get(`/lectures/user/${user.objectId}`);
      const lecture = lectureRes.data?.data;
      if (!lecture?.program?.id) {
        setIsLoading(false);
        return;
      }

      const programId = lecture.program.id;
      const [progRes, modRes, enrollRes] = await Promise.all([
        apiClient.get(`/programs/${programId}`),
        apiClient.get(`/programs/${programId}/modules`),
        apiClient.get(`/programs/${programId}/enrollments`),
      ]);

      setProgram(progRes.data?.data);
      const mods = modRes.data?.data || [];

      // Fetch sessions per modul (ganti attendances lama)
      const modsWithSessions = await Promise.all(
        mods.map(async (mod: any) => {
          try {
            const sessRes = await apiClient.get(`/modules/${mod.id}/sessions`);
            return { ...mod, sessions: sessRes.data?.data || [] };
          } catch {
            return { ...mod, sessions: [] };
          }
        }),
      );
      setModules(modsWithSessions);
      setEnrollments(enrollRes.data?.data || []);

      // Simpan sessions per modul untuk section absensi
      const sessMap: any = {};
      modsWithSessions.forEach((mod: any) => {
        sessMap[mod.id] = mod.sessions || [];
      });
      setModuleSessions(sessMap);

      // Init schedule form
      const initForms: any = {};
      mods.forEach((mod: any) => {
        initForms[mod.id] = {
          scheduleDate: toDatetimeLocal(mod.scheduleDate),
          location: mod.location || "",
          durationHour: mod.durationHour ? String(mod.durationHour) : "",
          maxParticipant: mod.maxParticipant ? String(mod.maxParticipant) : "",
          latitude: mod.latitude ? String(mod.latitude) : "",
          longitude: mod.longitude ? String(mod.longitude) : "",
        };
      });
      setScheduleForm(initForms);

      // Init recurring form
      const initRecurring: any = {};
      mods.forEach((mod: any) => {
        initRecurring[mod.id] = {
          recurringDay: mod.recurringDay || "MONDAY",
          recurringTime: mod.recurringTime || "09:00",
          totalSessions: mod.totalSessions ? String(mod.totalSessions) : "14",
        };
      });
      setRecurringForm(initRecurring);

      // Count sessions
      const counts: any = {};
      modsWithSessions.forEach((mod: any) => {
        counts[mod.id] = mod.sessions?.length || 0;
      });
      setSessionCounts(counts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [user?.objectId]);

  const handleSaveSchedule = async (moduleId: string) => {
    const form = scheduleForm[moduleId];
    if (!form) return;
    setSavingScheduleId(moduleId);
    setMsg(null);
    try {
      const payload: any = {
        location: form.location || null,
        durationHour: form.durationHour ? Number(form.durationHour) : null,
        maxParticipant: form.maxParticipant
          ? Number(form.maxParticipant)
          : null,
        scheduleDate: form.scheduleDate
          ? new Date(form.scheduleDate).toISOString()
          : null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      };
      await apiClient.put(`/modules/${moduleId}`, payload);
      setModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, ...payload } : m)),
      );
      setMsg({ type: "ok", text: "Jadwal berhasil disimpan!", id: moduleId });
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal menyimpan jadwal.",
        id: moduleId,
      });
    } finally {
      setSavingScheduleId(null);
    }
  };

  const handleGenerateSessions = async (moduleId: string) => {
    const form = recurringForm[moduleId];
    if (!form?.totalSessions || !form?.recurringDay || !form?.recurringTime) {
      setMsg({
        type: "err",
        text: "Lengkapi pengaturan jadwal berulang dulu.",
        id: moduleId,
      });
      return;
    }
    if (
      !confirm(
        `Generate ${form.totalSessions} sesi untuk modul ini? Sesi lama akan dihapus.`,
      )
    )
      return;
    setGeneratingSessionId(moduleId);
    setMsg(null);
    try {
      await apiClient.put(`/modules/${moduleId}`, {
        recurringDay: form.recurringDay,
        recurringTime: form.recurringTime,
        totalSessions: Number(form.totalSessions),
      });
      const res = await apiClient.post(
        `/modules/${moduleId}/sessions/generate`,
      );
      const count = res.data?.data?.created || 0;
      setSessionCounts((prev) => ({ ...prev, [moduleId]: count }));
      // Refresh sessions
      const sessRes = await apiClient.get(`/modules/${moduleId}/sessions`);
      const newSessions = sessRes.data?.data || [];
      setModuleSessions((prev) => ({ ...prev, [moduleId]: newSessions }));
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId ? { ...m, sessions: newSessions } : m,
        ),
      );
      setMsg({
        type: "ok",
        text: `${count} sesi berhasil digenerate! Skip tanggal merah & weekend otomatis.`,
        id: moduleId,
      });
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal generate sesi.",
        id: moduleId,
      });
    } finally {
      setGeneratingSessionId(null);
    }
  };

  const updateRecurringForm = (
    moduleId: string,
    field: string,
    value: string,
  ) => {
    setRecurringForm((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [field]: value },
    }));
  };

  const handleSearchLocation = async (moduleId: string) => {
    const query = locationQuery[moduleId];
    if (!query || query.trim().length < 3) {
      setMsg({ type: "err", text: "Ketik minimal 3 karakter.", id: moduleId });
      return;
    }
    setSearchingLocationId(moduleId);
    setLocationResults((prev) => ({ ...prev, [moduleId]: [] }));
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=id`,
        {
          headers: {
            "Accept-Language": "id",
            "User-Agent": "SaaFragranceApp/1.0",
          },
        },
      );
      const data = await res.json();
      setLocationResults((prev) => ({ ...prev, [moduleId]: data }));
      if (data.length === 0)
        setMsg({ type: "err", text: "Lokasi tidak ditemukan.", id: moduleId });
    } catch {
      setMsg({ type: "err", text: "Gagal mencari lokasi.", id: moduleId });
    } finally {
      setSearchingLocationId(null);
    }
  };

  const handleSelectLocation = (moduleId: string, result: any) => {
    setScheduleForm((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        latitude: result.lat,
        longitude: result.lon,
      },
    }));
    setLocationResults((prev) => ({ ...prev, [moduleId]: [] }));
    setLocationQuery((prev) => ({ ...prev, [moduleId]: result.display_name }));
    setMsg({
      type: "ok",
      text: `Koordinat diisi: ${Number(result.lat).toFixed(6)}, ${Number(result.lon).toFixed(6)}`,
      id: moduleId,
    });
  };

  const updateScheduleForm = (
    moduleId: string,
    field: string,
    value: string,
  ) => {
    setScheduleForm((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [field]: value },
    }));
  };

  const handleUpload = async (moduleId: string, file: File) => {
    if (!["application/pdf", "text/html"].includes(file.type)) {
      setMsg({ type: "err", text: "Hanya PDF atau HTML.", id: moduleId });
      return;
    }
    setUploadingId(moduleId);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiClient.put(`/modules/${moduleId}/material`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? { ...m, materialUrl: res.data?.data?.materialUrl }
            : m,
        ),
      );
      setMsg({ type: "ok", text: "Materi berhasil diupload!", id: moduleId });
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal upload.",
        id: moduleId,
      });
    } finally {
      setUploadingId(null);
    }
  };

  const handleDeleteMaterial = async (moduleId: string) => {
    if (!confirm("Hapus materi modul ini?")) return;
    setDeletingId(moduleId);
    try {
      await apiClient.delete(`/modules/${moduleId}/material`);
      setModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, materialUrl: null } : m)),
      );
      setMsg({ type: "ok", text: "Materi berhasil dihapus.", id: moduleId });
    } catch {
      setMsg({ type: "err", text: "Gagal menghapus.", id: moduleId });
    } finally {
      setDeletingId(null);
    }
  };

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

  const handleToggleStatus = async (
    moduleId: string,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setUpdatingStatusId(moduleId);
    try {
      await apiClient.put(`/modules/${moduleId}`, { status: newStatus });
      setModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, status: newStatus } : m)),
      );
      setMsg({
        type: "ok",
        text: `Status modul diubah ke ${newStatus}.`,
        id: moduleId,
      });
    } catch {
      setMsg({ type: "err", text: "Gagal update status.", id: moduleId });
    } finally {
      setUpdatingStatusId(null);
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
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (!program)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        Belum ada program yang di-assign ke akun Anda.
      </div>
    );

  const level = levelConfig[program.level] || levelConfig.BEGINNER;
  const publishedModules = modules.filter(
    (m) => m.status === "PUBLISHED",
  ).length;
  const sections: { key: ActiveSection; label: string }[] = [
    { key: "modul", label: `📚 Timeline Modul (${modules.length})` },
    { key: "murid", label: `👥 Murid Enrolled (${enrollments.length})` },
    { key: "absensi", label: "📋 Rekap Absensi" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
          Program Saya
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
          Kelola materi, modul, dan murid program Anda
        </p>
      </div>

      {/* Info Program */}
      <div
        style={{
          background: "#161b2e",
          borderRadius: "10px",
          padding: "20px",
          border: "0.5px solid #1e2744",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 10px",
                  borderRadius: "4px",
                  color: level.color,
                  background: level.bg,
                  border: `1px solid ${level.border}`,
                }}
              >
                {level.label}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: program.isPublished ? "#10b981" : "#64748b",
                }}
              >
                {program.isPublished ? "● Published" : "● Draft"}
              </span>
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "4px",
              }}
            >
              {program.title}
            </div>
            {program.subtitle && (
              <div
                style={{
                  fontSize: "13px",
                  color: "#94a3b8",
                  fontStyle: "italic",
                  marginBottom: "8px",
                }}
              >
                {program.subtitle}
              </div>
            )}
            {program.description && (
              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  lineHeight: 1.6,
                  maxWidth: "600px",
                }}
              >
                {program.description}
              </div>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {[
              { label: "Total Modul", value: modules.length },
              { label: "Modul Aktif", value: publishedModules },
              { label: "Murid", value: enrollments.length },
              {
                label: "Harga",
                value: program.price
                  ? `Rp ${Number(program.price).toLocaleString("id-ID")}`
                  : "-",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#0f1117",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  border: "0.5px solid #1e2744",
                  textAlign: "center",
                  minWidth: "90px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "#64748b",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#a78bfa",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              border: `1.5px solid ${activeSection === s.key ? "#7c3aed" : "#1e2744"}`,
              background:
                activeSection === s.key
                  ? "rgba(124,58,237,0.15)"
                  : "transparent",
              color: activeSection === s.key ? "#a78bfa" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── SECTION: Timeline Modul ── */}
      {activeSection === "modul" && (
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            padding: "20px",
            border: "0.5px solid #1e2744",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "0.5px solid #1e2744",
            }}
          >
            Timeline Modul & Materi
          </div>
          {modules.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Belum ada modul.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {modules.map((mod) => {
                const isExpanded = expandedModuleId === mod.id;
                const previewUrl = `${API_BASE}/modules/${mod.id}/material/preview`;
                const form = scheduleForm[mod.id] || {
                  scheduleDate: "",
                  location: "",
                  durationHour: "",
                  maxParticipant: "",
                  latitude: "",
                  longitude: "",
                };
                const currentLat = scheduleForm[mod.id]?.latitude || "";
                const currentLng = scheduleForm[mod.id]?.longitude || "";
                const hasCoords = currentLat && currentLng;

                return (
                  <div
                    key={mod.id}
                    style={{
                      background: "#0f1117",
                      borderRadius: "10px",
                      border: "0.5px solid #1e2744",
                      overflow: "hidden",
                    }}
                  >
                    {/* Row header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setExpandedModuleId(isExpanded ? null : mod.id)
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "rgba(124,58,237,0.2)",
                            border: "1px solid rgba(124,58,237,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#a78bfa",
                            flexShrink: 0,
                          }}
                        >
                          {mod.order}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "#fff",
                            }}
                          >
                            {mod.title}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "4px",
                            }}
                          >
                            <StatusBadge status={mod.status} />
                            {sessionCounts[mod.id] > 0 && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#10b981",
                                  background: "rgba(16,185,129,0.1)",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                }}
                              >
                                📅 {sessionCounts[mod.id]} sesi
                              </span>
                            )}
                            {mod.location && (
                              <span
                                style={{ fontSize: "11px", color: "#64748b" }}
                              >
                                📍 {mod.location}
                              </span>
                            )}
                            {mod.latitude && mod.longitude && (
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#7c3aed",
                                  background: "rgba(124,58,237,0.1)",
                                  padding: "1px 6px",
                                  borderRadius: "4px",
                                }}
                              >
                                🌐 GPS ✓
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lecture/modules/${mod.id}/exams`);
                          }}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "none",
                            background: "rgba(124,58,237,0.15)",
                            color: "#a78bfa",
                          }}
                        >
                          📝 Ujian
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(mod.id, mod.status);
                          }}
                          disabled={updatingStatusId === mod.id}
                          style={{
                            padding: "5px 10px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: "none",
                            background:
                              mod.status === "PUBLISHED"
                                ? "rgba(239,68,68,0.15)"
                                : "rgba(16,185,129,0.15)",
                            color:
                              mod.status === "PUBLISHED"
                                ? "#ef4444"
                                : "#10b981",
                            opacity: updatingStatusId === mod.id ? 0.6 : 1,
                          }}
                        >
                          {updatingStatusId === mod.id
                            ? "..."
                            : mod.status === "PUBLISHED"
                              ? "Jadikan Draft"
                              : "Publish"}
                        </button>
                        {isExpanded ? (
                          <ChevronUp size={16} color="#64748b" />
                        ) : (
                          <ChevronDown size={16} color="#64748b" />
                        )}
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div
                        style={{
                          padding: "0 16px 16px",
                          borderTop: "0.5px solid #1e2744",
                        }}
                      >
                        {/* Jadwal & Lokasi */}
                        <div
                          style={{ paddingTop: "14px", marginBottom: "16px" }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                              marginBottom: "10px",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Jadwal & Lokasi
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "10px",
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
                                <CalendarDays size={11} /> Tanggal Mulai Batch
                              </label>
                              <input
                                type="datetime-local"
                                value={form.scheduleDate}
                                onChange={(e) =>
                                  updateScheduleForm(
                                    mod.id,
                                    "scheduleDate",
                                    e.target.value,
                                  )
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
                                <MapPin size={11} /> Nama Lokasi
                              </label>
                              <input
                                type="text"
                                placeholder="cth: Lab A, The Breaze BSD"
                                value={form.location}
                                onChange={(e) =>
                                  updateScheduleForm(
                                    mod.id,
                                    "location",
                                    e.target.value,
                                  )
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
                                <Clock size={11} /> Durasi per Sesi (jam)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="24"
                                placeholder="cth: 2"
                                value={form.durationHour}
                                onChange={(e) =>
                                  updateScheduleForm(
                                    mod.id,
                                    "durationHour",
                                    e.target.value,
                                  )
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
                                  updateScheduleForm(
                                    mod.id,
                                    "maxParticipant",
                                    e.target.value,
                                  )
                                }
                                style={inputStyle}
                              />
                            </div>
                          </div>

                          {/* Koordinat via Nominatim */}
                          <div
                            style={{
                              marginTop: "10px",
                              padding: "12px",
                              background: "rgba(124,58,237,0.05)",
                              border: "0.5px solid rgba(124,58,237,0.2)",
                              borderRadius: "8px",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "11px",
                                color: "#a78bfa",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                marginBottom: "8px",
                              }}
                            >
                              🌐 Koordinat Lokasi Kelas{" "}
                              <span style={{ color: "#64748b" }}>
                                (untuk absensi WA bot)
                              </span>
                            </label>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                marginBottom: "8px",
                              }}
                            >
                              <input
                                type="text"
                                placeholder="Cari lokasi... cth: The Breaze BSD Tangerang"
                                value={locationQuery[mod.id] || ""}
                                onChange={(e) =>
                                  setLocationQuery((prev) => ({
                                    ...prev,
                                    [mod.id]: e.target.value,
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleSearchLocation(mod.id);
                                }}
                                style={{
                                  ...inputStyle,
                                  fontSize: "11px",
                                  flex: 1,
                                }}
                              />
                              <button
                                onClick={() => handleSearchLocation(mod.id)}
                                disabled={searchingLocationId === mod.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  background: "rgba(124,58,237,0.2)",
                                  border: "1px solid rgba(124,58,237,0.4)",
                                  color: "#a78bfa",
                                  fontSize: "11px",
                                  cursor: "pointer",
                                  whiteSpace: "nowrap",
                                  opacity:
                                    searchingLocationId === mod.id ? 0.6 : 1,
                                }}
                              >
                                <Search size={11} />{" "}
                                {searchingLocationId === mod.id
                                  ? "Mencari..."
                                  : "Cari"}
                              </button>
                            </div>
                            {locationResults[mod.id]?.length > 0 && (
                              <div
                                style={{
                                  background: "#0f1117",
                                  border: "0.5px solid #2d3748",
                                  borderRadius: "6px",
                                  marginBottom: "8px",
                                  overflow: "hidden",
                                }}
                              >
                                {locationResults[mod.id].map(
                                  (result: any, idx: number) => (
                                    <div
                                      key={idx}
                                      onClick={() =>
                                        handleSelectLocation(mod.id, result)
                                      }
                                      style={{
                                        padding: "8px 10px",
                                        fontSize: "11px",
                                        color: "#e2e8f0",
                                        cursor: "pointer",
                                        borderBottom:
                                          idx <
                                          locationResults[mod.id].length - 1
                                            ? "0.5px solid #1e2744"
                                            : "none",
                                      }}
                                      onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                          "rgba(124,58,237,0.1)")
                                      }
                                      onMouseLeave={(e) =>
                                        (e.currentTarget.style.background =
                                          "transparent")
                                      }
                                    >
                                      <span
                                        style={{
                                          color: "#a78bfa",
                                          marginRight: "6px",
                                        }}
                                      >
                                        📍
                                      </span>
                                      {result.display_name}
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                            {/* Input manual lat/lng */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "6px",
                                marginTop: "8px",
                              }}
                            >
                              <div>
                                <label
                                  style={{
                                    fontSize: "10px",
                                    color: "#64748b",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Latitude (manual)
                                </label>
                                <input
                                  type="number"
                                  step="any"
                                  placeholder="cth: -6.2088"
                                  value={form.latitude}
                                  onChange={(e) =>
                                    updateScheduleForm(
                                      mod.id,
                                      "latitude",
                                      e.target.value,
                                    )
                                  }
                                  style={{ ...inputStyle, fontSize: "11px" }}
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    fontSize: "10px",
                                    color: "#64748b",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Longitude (manual)
                                </label>
                                <input
                                  type="number"
                                  step="any"
                                  placeholder="cth: 106.8456"
                                  value={form.longitude}
                                  onChange={(e) =>
                                    updateScheduleForm(
                                      mod.id,
                                      "longitude",
                                      e.target.value,
                                    )
                                  }
                                  style={{ ...inputStyle, fontSize: "11px" }}
                                />
                              </div>
                            </div>
                            {hasCoords && (
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: "#10b981",
                                  margin: "6px 0 0",
                                }}
                              >
                                ✓ Koordinat: {Number(currentLat).toFixed(6)},{" "}
                                {Number(currentLng).toFixed(6)}
                              </p>
                            )}
                          </div>

                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <button
                              onClick={() => handleSaveSchedule(mod.id)}
                              disabled={savingScheduleId === mod.id}
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
                                cursor:
                                  savingScheduleId === mod.id
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: savingScheduleId === mod.id ? 0.6 : 1,
                              }}
                            >
                              <Save size={12} />{" "}
                              {savingScheduleId === mod.id
                                ? "Menyimpan..."
                                : "Simpan Jadwal"}
                            </button>
                            {msg?.id === mod.id && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  color:
                                    msg.type === "ok" ? "#10b981" : "#ef4444",
                                }}
                              >
                                {msg.text}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Divider */}
                        <div
                          style={{
                            borderTop: "0.5px solid #1e2744",
                            marginBottom: "14px",
                          }}
                        />

                        {/* Jadwal Berulang */}
                        <div style={{ marginBottom: "16px" }}>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                              marginBottom: "10px",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Jadwal Berulang (Recurring)
                          </div>
                          <div
                            style={{
                              padding: "12px",
                              background: "rgba(16,185,129,0.05)",
                              border: "0.5px solid rgba(16,185,129,0.2)",
                              borderRadius: "8px",
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <div>
                                <label
                                  style={{
                                    fontSize: "10px",
                                    color: "#94a3b8",
                                    display: "block",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Hari Kelas
                                </label>
                                <select
                                  value={
                                    recurringForm[mod.id]?.recurringDay ||
                                    "MONDAY"
                                  }
                                  onChange={(e) =>
                                    updateRecurringForm(
                                      mod.id,
                                      "recurringDay",
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    width: "100%",
                                    background: "#0f1117",
                                    border: "0.5px solid #2d3748",
                                    borderRadius: "6px",
                                    padding: "7px 10px",
                                    fontSize: "12px",
                                    color: "#e2e8f0",
                                    outline: "none",
                                    boxSizing: "border-box",
                                  }}
                                >
                                  <option value="MONDAY">Senin</option>
                                  <option value="TUESDAY">Selasa</option>
                                  <option value="WEDNESDAY">Rabu</option>
                                  <option value="THURSDAY">Kamis</option>
                                  <option value="FRIDAY">Jumat</option>
                                </select>
                              </div>
                              <div>
                                <label
                                  style={{
                                    fontSize: "10px",
                                    color: "#94a3b8",
                                    display: "block",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Jam Mulai
                                </label>
                                <input
                                  type="time"
                                  value={
                                    recurringForm[mod.id]?.recurringTime ||
                                    "09:00"
                                  }
                                  onChange={(e) =>
                                    updateRecurringForm(
                                      mod.id,
                                      "recurringTime",
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    width: "100%",
                                    background: "#0f1117",
                                    border: "0.5px solid #2d3748",
                                    borderRadius: "6px",
                                    padding: "7px 10px",
                                    fontSize: "12px",
                                    color: "#e2e8f0",
                                    outline: "none",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </div>
                              <div>
                                <label
                                  style={{
                                    fontSize: "10px",
                                    color: "#94a3b8",
                                    display: "block",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Total Pertemuan
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  placeholder="cth: 14"
                                  value={
                                    recurringForm[mod.id]?.totalSessions || ""
                                  }
                                  onChange={(e) =>
                                    updateRecurringForm(
                                      mod.id,
                                      "totalSessions",
                                      e.target.value,
                                    )
                                  }
                                  style={{
                                    width: "100%",
                                    background: "#0f1117",
                                    border: "0.5px solid #2d3748",
                                    borderRadius: "6px",
                                    padding: "7px 10px",
                                    fontSize: "12px",
                                    color: "#e2e8f0",
                                    outline: "none",
                                    boxSizing: "border-box",
                                  }}
                                />
                              </div>
                            </div>
                            {sessionCounts[mod.id] > 0 && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#10b981",
                                  marginBottom: "10px",
                                }}
                              >
                                ✓ {sessionCounts[mod.id]} sesi sudah digenerate
                              </div>
                            )}
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <button
                                onClick={() => handleGenerateSessions(mod.id)}
                                disabled={generatingSessionId === mod.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "7px 14px",
                                  borderRadius: "6px",
                                  border: "none",
                                  background: "#10b981",
                                  color: "#fff",
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  cursor:
                                    generatingSessionId === mod.id
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity:
                                    generatingSessionId === mod.id ? 0.6 : 1,
                                }}
                              >
                                {generatingSessionId === mod.id
                                  ? "⏳ Generating..."
                                  : "⚡ Generate Sesi Otomatis"}
                              </button>
                              <span
                                style={{ fontSize: "10px", color: "#64748b" }}
                              >
                                Skip tanggal merah & weekend otomatis
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Divider 2 */}
                        <div
                          style={{
                            borderTop: "0.5px solid #1e2744",
                            marginBottom: "14px",
                          }}
                        />

                        {/* Materi */}
                        <div>
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                              marginBottom: "10px",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Materi
                          </div>
                          {mod.materialUrl ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "rgba(16,185,129,0.1)",
                                  border: "1px solid rgba(16,185,129,0.3)",
                                  borderRadius: "6px",
                                  padding: "5px 10px",
                                }}
                              >
                                <FileText size={12} color="#10b981" />
                                <span
                                  style={{ fontSize: "11px", color: "#10b981" }}
                                >
                                  Materi Tersedia
                                </span>
                              </div>
                              <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  background: "transparent",
                                  border: "0.5px solid #2d3748",
                                  color: "#94a3b8",
                                  fontSize: "11px",
                                  textDecoration: "none",
                                }}
                              >
                                <Eye size={11} /> Preview
                              </a>
                              <button
                                onClick={() =>
                                  handleDownload(mod.id, mod.title)
                                }
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  background: "transparent",
                                  border: "0.5px solid #2d3748",
                                  color: "#94a3b8",
                                  fontSize: "11px",
                                  cursor: "pointer",
                                }}
                              >
                                <Download size={11} /> Download
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(mod.id)}
                                disabled={deletingId === mod.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  background: "transparent",
                                  border: "0.5px solid #374151",
                                  color: "#ef4444",
                                  fontSize: "11px",
                                  cursor: "pointer",
                                  opacity: deletingId === mod.id ? 0.6 : 1,
                                }}
                              >
                                <Trash2 size={11} />{" "}
                                {deletingId === mod.id ? "..." : "Hapus"}
                              </button>
                              <button
                                onClick={() =>
                                  fileInputRefs.current[mod.id]?.click()
                                }
                                disabled={uploadingId === mod.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  background: "#7c3aed",
                                  border: "none",
                                  color: "#fff",
                                  fontSize: "11px",
                                  cursor: "pointer",
                                  opacity: uploadingId === mod.id ? 0.6 : 1,
                                }}
                              >
                                <Upload size={11} />{" "}
                                {uploadingId === mod.id
                                  ? "Uploading..."
                                  : "Ganti"}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() =>
                                fileInputRefs.current[mod.id]?.click()
                              }
                              disabled={uploadingId === mod.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "8px 14px",
                                borderRadius: "8px",
                                background: "#7c3aed",
                                border: "none",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor:
                                  uploadingId === mod.id
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: uploadingId === mod.id ? 0.6 : 1,
                              }}
                            >
                              <Upload size={13} />{" "}
                              {uploadingId === mod.id
                                ? "Uploading..."
                                : "Upload Materi (PDF/HTML)"}
                            </button>
                          )}
                          <input
                            type="file"
                            accept="application/pdf,text/html"
                            ref={(el) => {
                              fileInputRefs.current[mod.id] = el;
                            }}
                            onChange={(e) => {
                              if (e.target.files?.[0])
                                handleUpload(mod.id, e.target.files[0]);
                              e.target.value = "";
                            }}
                            style={{ display: "none" }}
                          />
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

      {/* ── SECTION: Murid Enrolled ── */}
      {activeSection === "murid" && (
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            padding: "20px",
            border: "0.5px solid #1e2744",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "0.5px solid #1e2744",
            }}
          >
            Murid Enrolled
          </div>
          {enrollments.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Belum ada murid yang enrolled.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Nama", "Email", "Progress", "Status", "Enrolled"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          textAlign: "left",
                          padding: "8px 12px",
                          borderBottom: "0.5px solid #1e2744",
                          fontWeight: 400,
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enroll, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "0.5px solid #1a2035",
                        fontSize: "13px",
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    >
                      {enroll.student?.user?.fullName || "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "0.5px solid #1a2035",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {enroll.student?.user?.email || "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "0.5px solid #1a2035",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: "4px",
                            background: "#1e2744",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background: "#7c3aed",
                              borderRadius: "2px",
                              width: `${enroll.progress || 0}%`,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#64748b",
                            flexShrink: 0,
                          }}
                        >
                          {enroll.progress || 0}%
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "0.5px solid #1a2035",
                      }}
                    >
                      <EnrollStatusBadge status={enroll.status} />
                    </td>
                    <td
                      style={{
                        padding: "10px 12px",
                        borderBottom: "0.5px solid #1a2035",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {formatDate(enroll.enrolledAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── SECTION: Rekap Absensi per Sesi ── */}
      {activeSection === "absensi" && (
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            padding: "20px",
            border: "0.5px solid #1e2744",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "0.5px solid #1e2744",
            }}
          >
            Rekap Absensi per Sesi
          </div>
          {modules.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Belum ada modul.
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {modules.map((mod) => {
                const sessions = moduleSessions[mod.id] || [];
                return (
                  <div
                    key={mod.id}
                    style={{
                      background: "#0f1117",
                      borderRadius: "8px",
                      border: "0.5px solid #1e2744",
                      overflow: "hidden",
                    }}
                  >
                    {/* Modul header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        borderBottom:
                          sessions.length > 0 ? "0.5px solid #1e2744" : "none",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            fontWeight: 600,
                          }}
                        >
                          Modul {mod.order} ·{" "}
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#fff",
                            fontWeight: 500,
                          }}
                        >
                          {mod.title}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <StatusBadge status={mod.status} />
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          {sessions.length} sesi
                        </span>
                      </div>
                    </div>

                    {sessions.length === 0 ? (
                      <div
                        style={{
                          padding: "16px",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        Belum ada sesi. Generate sesi di tab Timeline Modul.
                      </div>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "600px",
                          }}
                        >
                          <thead>
                            <tr>
                              {[
                                "Sesi",
                                "Tanggal",
                                "Hadir",
                                "Absen",
                                "Total",
                                "Detail Murid",
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
                                sess.attendances?.filter(
                                  (a: any) => a.isPresent,
                                ).length || 0;
                              const totalAtt = sess.attendances?.length || 0;
                              const absenCount = totalAtt - hadirCount;
                              return (
                                <tr key={sess.id}>
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
                                    <span
                                      style={{
                                        color: "#64748b",
                                        marginLeft: "6px",
                                      }}
                                    >
                                      {sess.startTime}
                                    </span>
                                    {sess.isCancelled && (
                                      <span
                                        style={{
                                          marginLeft: "6px",
                                          fontSize: "10px",
                                          color: "#ef4444",
                                          background: "rgba(239,68,68,0.1)",
                                          padding: "1px 5px",
                                          borderRadius: "3px",
                                        }}
                                      >
                                        Dibatalkan
                                      </span>
                                    )}
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
                                      color:
                                        absenCount > 0 ? "#ef4444" : "#64748b",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {absenCount}
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 12px",
                                      borderBottom: "0.5px solid #1a2035",
                                      fontSize: "12px",
                                      color: "#64748b",
                                    }}
                                  >
                                    {totalAtt}
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
                                        {sess.attendances.map(
                                          (att: any, i: number) => (
                                            <span
                                              key={i}
                                              style={{
                                                fontSize: "10px",
                                                padding: "2px 6px",
                                                borderRadius: "3px",
                                                color: att.isPresent
                                                  ? "#10b981"
                                                  : "#ef4444",
                                                background: att.isPresent
                                                  ? "rgba(16,185,129,0.1)"
                                                  : "rgba(239,68,68,0.1)",
                                              }}
                                            >
                                              {att.enrollment?.student?.user
                                                ?.fullName || "?"}{" "}
                                              {att.isPresent ? "✓" : "✗"}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    ) : (
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "#4b5563",
                                        }}
                                      >
                                        Belum ada data
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
