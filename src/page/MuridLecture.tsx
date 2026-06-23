// @ts-nocheck
/* eslint-disable */
import { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import apiClient from "../config/api";
import { Search, UserPlus, UserMinus, X, Users } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Student {
  id: string;
  user: { id: string; fullName: string; email: string; profilePic?: string };
}

interface Enrollment {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "DROPPED" | "PENDING";
  progress: number;
  enrolledAt: string;
  student: {
    id: string;
    user: { fullName: string; email: string; profilePic?: string };
  };
  attendances: { isPresent: boolean }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: any = {
  ACTIVE:    { label: "Aktif",    color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  COMPLETED: { label: "Selesai",  color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  DROPPED:   { label: "Berhenti", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  PENDING:   { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const AVATAR_COLORS = ["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];
function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MuridLecture() {
  const { user } = useAuthStore();

  const [programId, setProgramId]         = useState<string | null>(null);
  const [totalModules, setTotalModules]   = useState(0);
  const [enrollments, setEnrollments]     = useState<Enrollment[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // Enroll modal
  const [showModal, setShowModal]         = useState(false);
  const [availableStudents, setAvailable] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [enrollingId, setEnrollingId]     = useState<string | null>(null);
  const [droppingId, setDroppingId]       = useState<string | null>(null);
  const [modalSearch, setModalSearch]     = useState("");

  // Filter
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("ALL");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.objectId) return;
    const load = async () => {
      try {
        setLoading(true);
        const lectureRes = await apiClient.get(`/lectures/user/${user.objectId}`);
        const pid = lectureRes.data?.data?.program?.id;
        if (!pid) { setLoading(false); return; }
        setProgramId(pid);

        const [enrollRes, modRes] = await Promise.all([
          apiClient.get(`/programs/${pid}/enrollments`),
          apiClient.get(`/programs/${pid}/modules`),
        ]);
        setEnrollments(enrollRes.data?.data || []);
        setTotalModules((modRes.data?.data || []).length);
      } catch (e: any) {
        setError(e.response?.data?.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.objectId]);

  // ── Open modal enroll ──────────────────────────────────────────────────────
  const openEnrollModal = async () => {
    if (!programId) return;
    setShowModal(true);
    setLoadingStudents(true);
    setModalSearch("");
    try {
      const res = await apiClient.get(`/students/not-enrolled/${programId}`);
      setAvailable(res.data?.data || []);
    } catch {
      setAvailable([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // ── Enroll student ─────────────────────────────────────────────────────────
  const handleEnroll = async (studentId: string) => {
    if (!programId) return;
    setEnrollingId(studentId);
    try {
      const res = await apiClient.post(`/programs/${programId}/enrollments`, { studentId });
      const newEnrollment = res.data?.data;
      setEnrollments((prev) => [newEnrollment, ...prev]);
      setAvailable((prev) => prev.filter((s) => s.id !== studentId));
    } catch (e: any) {
      alert(e.response?.data?.message || "Gagal enroll student.");
    } finally {
      setEnrollingId(null);
    }
  };

  // ── Drop student ───────────────────────────────────────────────────────────
  const handleDrop = async (studentId: string, name: string) => {
    if (!programId) return;
    if (!confirm(`Drop ${name} dari program ini?`)) return;
    setDroppingId(studentId);
    try {
      await apiClient.delete(`/programs/${programId}/enrollments`, { data: { studentId } });
      setEnrollments((prev) =>
        prev.map((e) => e.student.id === studentId ? { ...e, status: "DROPPED" } : e)
      );
    } catch (e: any) {
      alert(e.response?.data?.message || "Gagal drop student.");
    } finally {
      setDroppingId(null);
    }
  };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     enrollments.length,
    active:    enrollments.filter((e) => e.status === "ACTIVE").length,
    completed: enrollments.filter((e) => e.status === "COMPLETED").length,
    dropped:   enrollments.filter((e) => e.status === "DROPPED").length,
  }), [enrollments]);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return enrollments.filter((e) => {
      const name  = e.student?.user?.fullName?.toLowerCase() || "";
      const email = e.student?.user?.email?.toLowerCase() || "";
      if (search && !name.includes(search.toLowerCase()) && !email.includes(search.toLowerCase())) return false;
      if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
      return true;
    });
  }, [enrollments, search, statusFilter]);

  const modalFiltered = useMemo(() => {
    if (!modalSearch) return availableStudents;
    return availableStudents.filter((s) =>
      s.user.fullName.toLowerCase().includes(modalSearch.toLowerCase()) ||
      s.user.email.toLowerCase().includes(modalSearch.toLowerCase())
    );
  }, [availableStudents, modalSearch]);

  // ── Styles ─────────────────────────────────────────────────────────────────
  const card: React.CSSProperties = { background: "#161b2e", borderRadius: "10px", border: "0.5px solid #1e2744" };

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid #1e2744", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#ef4444", fontSize: "14px" }}>{error}</div>
  );

  if (!programId) return (
    <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b", fontSize: "14px" }}>
      Belum ada program yang di-assign ke akun Anda.
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff", margin: 0 }}>Murid</h1>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px", marginBottom: 0 }}>
            Kelola peserta batch program Anda
          </p>
        </div>
        <button
          onClick={openEnrollModal}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "#7c3aed", border: "none", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
        >
          <UserPlus size={14} /> Enroll Murid
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
        {[
          { label: "Total Murid",  value: stats.total,     color: "#fff" },
          { label: "Aktif",        value: stats.active,    color: "#10b981" },
          { label: "Selesai",      value: stats.completed, color: "#a78bfa" },
          { label: "Berhenti",     value: stats.dropped,   color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} style={{ ...card, padding: "14px 16px" }}>
            <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 600, color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "8px", padding: "8px 10px 8px 32px", fontSize: "13px", color: "#e2e8f0", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#e2e8f0", outline: "none" }}
        >
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="COMPLETED">Selesai</option>
          <option value="DROPPED">Berhenti</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div style={card}>
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center" }}>
            <Users size={28} color="#374151" style={{ marginBottom: "10px" }} />
            <p style={{ color: "#64748b", fontSize: "13px", margin: 0 }}>
              {enrollments.length === 0 ? "Belum ada murid yang enrolled." : "Tidak ada murid yang cocok dengan filter."}
            </p>
            {enrollments.length === 0 && (
              <button onClick={openEnrollModal} style={{ marginTop: "12px", fontSize: "12px", color: "#a78bfa", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                Enroll murid pertama
              </button>
            )}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Murid", "Progress", "Kehadiran", "Status", "Enrolled", ""].map((h) => (
                  <th key={h} style={{ fontSize: "11px", color: "#64748b", textAlign: "left", padding: "10px 14px", borderBottom: "0.5px solid #1e2744", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((enroll) => {
                const name    = enroll.student?.user?.fullName || "–";
                const email   = enroll.student?.user?.email || "–";
                const pic     = enroll.student?.user?.profilePic;
                const hadir   = enroll.attendances?.filter((a) => a.isPresent).length ?? 0;
                const statusCfg = STATUS_CONFIG[enroll.status] || STATUS_CONFIG.PENDING;
                const progress  = Math.round(enroll.progress || 0);
                const isDropped = enroll.status === "DROPPED";

                return (
                  <tr key={enroll.id} style={{ opacity: isDropped ? 0.5 : 1 }}>
                    {/* Murid */}
                    <td style={{ padding: "12px 14px", borderBottom: "0.5px solid #1a2035" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {pic ? (
                          <img src={pic} alt={name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: avatarColor(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                            {getInitials(name)}
                          </div>
                        )}
                        <div>
                          <p style={{ margin: 0, fontSize: "13px", color: "#fff", fontWeight: 500 }}>{name}</p>
                          <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>{email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Progress */}
                    <td style={{ padding: "12px 14px", borderBottom: "0.5px solid #1a2035", minWidth: "120px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ height: "100%", background: progress === 100 ? "#10b981" : "#7c3aed", borderRadius: "2px", width: `${progress}%`, transition: "width 0.3s" }} />
                        </div>
                        <span style={{ fontSize: "11px", color: "#64748b", flexShrink: 0, minWidth: "28px" }}>{progress}%</span>
                      </div>
                    </td>

                    {/* Kehadiran */}
                    <td style={{ padding: "12px 14px", borderBottom: "0.5px solid #1a2035" }}>
                      <span style={{ fontSize: "13px", color: "#e2e8f0" }}>
                        {hadir}
                        <span style={{ color: "#64748b" }}> / {totalModules} modul</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 14px", borderBottom: "0.5px solid #1a2035" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", color: statusCfg.color, background: statusCfg.bg }}>
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Enrolled */}
                    <td style={{ padding: "12px 14px", borderBottom: "0.5px solid #1a2035", fontSize: "12px", color: "#64748b" }}>
                      {formatDate(enroll.enrolledAt)}
                    </td>

                    {/* Action */}
                    <td style={{ padding: "12px 14px", borderBottom: "0.5px solid #1a2035" }}>
                      {!isDropped && (
                        <button
                          onClick={() => handleDrop(enroll.student.id, name)}
                          disabled={droppingId === enroll.student.id}
                          title="Drop murid"
                          style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "6px", background: "transparent", border: "0.5px solid #374151", color: "#ef4444", fontSize: "11px", cursor: "pointer", opacity: droppingId === enroll.student.id ? 0.6 : 1 }}
                        >
                          <UserMinus size={12} />
                          {droppingId === enroll.student.id ? "..." : "Drop"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {filtered.length > 0 && (
          <p style={{ fontSize: "11px", color: "#4b5563", textAlign: "right", padding: "8px 14px", margin: 0 }}>
            {filtered.length} dari {enrollments.length} murid
          </p>
        )}
      </div>

      {/* ── Enroll Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "12px", width: "480px", maxWidth: "90vw", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
            {/* Modal header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "0.5px solid #1e2744" }}>
              <div>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: 500, color: "#fff" }}>Enroll Murid</p>
                <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Pilih student untuk ditambahkan ke batch ini</p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}>
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: "12px 20px", borderBottom: "0.5px solid #1e2744" }}>
              <div style={{ position: "relative" }}>
                <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  style={{ width: "100%", background: "#0f1117", border: "0.5px solid #2d3748", borderRadius: "6px", padding: "7px 10px 7px 30px", fontSize: "13px", color: "#e2e8f0", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Student list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {loadingStudents ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>Memuat...</div>
              ) : modalFiltered.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                  {availableStudents.length === 0 ? "Semua student sudah terdaftar." : "Tidak ada yang cocok."}
                </div>
              ) : (
                modalFiltered.map((student) => {
                  const name = student.user.fullName;
                  const pic  = student.user.profilePic;
                  return (
                    <div key={student.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        {pic ? (
                          <img src={pic} alt={name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: avatarColor(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff" }}>
                            {getInitials(name)}
                          </div>
                        )}
                        <div>
                          <p style={{ margin: 0, fontSize: "13px", color: "#fff", fontWeight: 500 }}>{name}</p>
                          <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>{student.user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEnroll(student.id)}
                        disabled={enrollingId === student.id}
                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "6px", background: "#7c3aed", border: "none", color: "#fff", fontSize: "12px", cursor: "pointer", opacity: enrollingId === student.id ? 0.6 : 1, flexShrink: 0 }}
                      >
                        <UserPlus size={12} />
                        {enrollingId === student.id ? "..." : "Enroll"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal footer */}
            <div style={{ padding: "12px 20px", borderTop: "0.5px solid #1e2744", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowModal(false)} style={{ padding: "7px 16px", borderRadius: "6px", background: "transparent", border: "0.5px solid #2d3748", color: "#94a3b8", fontSize: "13px", cursor: "pointer" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}