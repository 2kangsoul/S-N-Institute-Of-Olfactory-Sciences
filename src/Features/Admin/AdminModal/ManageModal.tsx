// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import apiClient from "../../../config/api";

type ManageTab = "lecture" | "assign" | "student" | "order" | "reset";

interface ManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export default function ManageModal({
  isOpen,
  onClose,
  onOrderSuccess,
}: ManageModalProps) {
  const [activeTab, setActiveTab] = useState<ManageTab>("lecture");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  // ── Lecture state ──────────────────────────────────────────────────────────
  const [lectures, setLectures] = useState<any[]>([]);
  const [isFetchingLectures, setIsFetchingLectures] = useState(false);
  const [lectureForm, setLectureForm] = useState({
    email: "",
    bio: "",
    specialization: "",
  });
  const [isSubmittingLecture, setIsSubmittingLecture] = useState(false);

  // ── Assign Program state ───────────────────────────────────────────────────
  const [programs, setPrograms] = useState<any[]>([]);
  const [isFetchingPrograms, setIsFetchingPrograms] = useState(false);
  const [assignForm, setAssignForm] = useState({
    lectureId: "",
    programId: "",
  });
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);

  // ── Student state ──────────────────────────────────────────────────────────
  const [students, setStudents] = useState<any[]>([]);
  const [isFetchingStudents, setIsFetchingStudents] = useState(false);
  const [studentForm, setStudentForm] = useState({
    email: "",
    bio: "",
    studentCode: "",
  });
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);

  // ── Reset Password state ──────────────────────────────────────────────────
  const [resetForm, setResetForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // ── Order state ────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<any[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);
  const [orderForm, setOrderForm] = useState({
    orderNumber: "",
    totalAmount: "",
    profitAmount: "",
    note: "",
    status: "Pending",
    userId: "",
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // ── Fetch helpers ──────────────────────────────────────────────────────────
  const fetchLectures = async () => {
    setIsFetchingLectures(true);
    try {
      const res = await apiClient.get("/lectures");
      setLectures(res.data?.data || []);
    } catch {
      setLectures([]);
    } finally {
      setIsFetchingLectures(false);
    }
  };

  const fetchPrograms = async () => {
    setIsFetchingPrograms(true);
    try {
      const res = await apiClient.get("/programs");
      setPrograms(res.data?.data || []);
    } catch {
      setPrograms([]);
    } finally {
      setIsFetchingPrograms(false);
    }
  };

  const fetchStudents = async () => {
    setIsFetchingStudents(true);
    try {
      const res = await apiClient.get("/students");
      setStudents(res.data?.data || []);
    } catch {
      setStudents([]);
    } finally {
      setIsFetchingStudents(false);
    }
  };

  const fetchOrders = async () => {
    setIsFetchingOrders(true);
    try {
      const res = await apiClient.get("/orders/recent");
      setOrders(res.data?.data || []);
    } catch {
      setOrders([]);
    } finally {
      setIsFetchingOrders(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setMsg(null);
    if (activeTab === "lecture") fetchLectures();
    if (activeTab === "assign") {
      fetchLectures();
      fetchPrograms();
    }
    if (activeTab === "student") fetchStudents();
    if (activeTab === "order") fetchOrders();
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // ── Jadikan Lecture ────────────────────────────────────────────────────────
  const handleJadikanLecture = async (e: any) => {
    e.preventDefault();
    if (!lectureForm.email) {
      setMsg({ type: "err", text: "Email wajib diisi." });
      return;
    }
    setIsSubmittingLecture(true);
    setMsg(null);
    try {
      const userRes = await apiClient.get("/users", {
        params: { email: lectureForm.email },
      });
      const users = userRes.data?.data;
      const found = Array.isArray(users) ? users[0] : users;
      if (!found) {
        setMsg({ type: "err", text: "User tidak ditemukan." });
        return;
      }
      try {
        await apiClient.post("/lectures", {
          userId: found.id,
          bio: lectureForm.bio || undefined,
          specialization: lectureForm.specialization || undefined,
        });
      } catch {
        const existRes = await apiClient.get(`/lectures/user/${found.id}`);
        const existing = existRes.data?.data;
        if (existing)
          await apiClient.put(`/lectures/${existing.id}`, {
            bio: lectureForm.bio || undefined,
            specialization: lectureForm.specialization || undefined,
          });
      }
      setMsg({
        type: "ok",
        text: `${found.fullName} berhasil dijadikan/diperbarui sebagai lecture!`,
      });
      setLectureForm({ email: "", bio: "", specialization: "" });
      fetchLectures();
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal memproses.",
      });
    } finally {
      setIsSubmittingLecture(false);
    }
  };

  const handleDeleteLecture = async (id: string, name: string) => {
    if (!confirm(`Hapus lecture profile untuk ${name}?`)) return;
    try {
      await apiClient.delete(`/lectures/${id}`);
      setLectures((prev) => prev.filter((l) => l.id !== id));
      setMsg({ type: "ok", text: `Lecture profile ${name} telah dihapus.` });
    } catch {
      setMsg({ type: "err", text: "Gagal menghapus lecture profile." });
    }
  };

  // ── Assign Program ─────────────────────────────────────────────────────────
  const handleAssignProgram = async (e: any) => {
    e.preventDefault();
    if (!assignForm.lectureId || !assignForm.programId) {
      setMsg({ type: "err", text: "Pilih lecture dan program." });
      return;
    }
    setIsSubmittingAssign(true);
    setMsg(null);
    try {
      await apiClient.put(`/programs/${assignForm.programId}`, {
        lectureId: assignForm.lectureId,
      });
      setMsg({ type: "ok", text: "Program berhasil di-assign ke lecture!" });
      setAssignForm({ lectureId: "", programId: "" });
      fetchPrograms();
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal assign program.",
      });
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  // ── Create Student Profile ─────────────────────────────────────────────────
  const handleCreateStudent = async (e: any) => {
    e.preventDefault();
    if (!studentForm.email) {
      setMsg({ type: "err", text: "Email wajib diisi." });
      return;
    }
    setIsSubmittingStudent(true);
    setMsg(null);
    try {
      // Cari user by email
      const userRes = await apiClient.get("/users", {
        params: { email: studentForm.email },
      });
      const users = userRes.data?.data;
      const found = Array.isArray(users) ? users[0] : users;
      if (!found) {
        setMsg({
          type: "err",
          text: "User tidak ditemukan. Pastikan user sudah register.",
        });
        return;
      }

      // Buat student profile
      await apiClient.post("/students", {
        userId: found.id,
        bio: studentForm.bio || undefined,
        studentCode: studentForm.studentCode || undefined,
      });

      setMsg({
        type: "ok",
        text: `Student profile untuk ${found.fullName} berhasil dibuat!`,
      });
      setStudentForm({ email: "", bio: "", studentCode: "" });
      fetchStudents();
    } catch (e: any) {
      const errMsg =
        e.response?.data?.message || "Gagal membuat student profile.";
      // Kalau sudah ada student profile
      if (
        errMsg.toLowerCase().includes("already") ||
        errMsg.toLowerCase().includes("sudah")
      ) {
        setMsg({
          type: "err",
          text: "User ini sudah memiliki student profile.",
        });
      } else {
        setMsg({ type: "err", text: errMsg });
      }
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Hapus student profile untuk ${name}?`)) return;
    try {
      await apiClient.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setMsg({ type: "ok", text: `Student profile ${name} telah dihapus.` });
    } catch {
      setMsg({ type: "err", text: "Gagal menghapus student profile." });
    }
  };

  // ── Reset Password ────────────────────────────────────────────────────────
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (!resetForm.email) {
      setMsg({ type: "err", text: "Email wajib diisi." });
      return;
    }
    if (!resetForm.newPassword) {
      setMsg({ type: "err", text: "Password baru wajib diisi." });
      return;
    }
    if (resetForm.newPassword.length < 8) {
      setMsg({ type: "err", text: "Password minimal 8 karakter." });
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setMsg({ type: "err", text: "Konfirmasi password tidak cocok." });
      return;
    }
    setIsSubmittingReset(true);
    setMsg(null);
    try {
      // Cari user by email
      const userRes = await apiClient.get("/users", {
        params: { email: resetForm.email },
      });
      const users = userRes.data?.data;
      const found = Array.isArray(users) ? users[0] : users;
      if (!found) {
        setMsg({ type: "err", text: "User tidak ditemukan." });
        return;
      }
      // Reset password via PUT /users/:id
      await apiClient.put(`/users/${found.id}`, {
        password: resetForm.newPassword,
      });
      setMsg({
        type: "ok",
        text: `Password ${found.fullName} berhasil direset!`,
      });
      setResetForm({ email: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal reset password.",
      });
    } finally {
      setIsSubmittingReset(false);
    }
  };

  // ── Create Order ───────────────────────────────────────────────────────────
  const handleCreateOrder = async (e: any) => {
    e.preventDefault();
    if (
      !orderForm.orderNumber ||
      !orderForm.totalAmount ||
      !orderForm.profitAmount ||
      !orderForm.userId
    ) {
      setMsg({ type: "err", text: "Semua field wajib diisi." });
      return;
    }
    setIsSubmittingOrder(true);
    setMsg(null);
    try {
      await apiClient.post("/orders", {
        orderNumber: orderForm.orderNumber,
        totalAmount: parseFloat(orderForm.totalAmount),
        profitAmount: parseFloat(orderForm.profitAmount),
        status: orderForm.status,
        userId: orderForm.userId,
        note: orderForm.note,
        items: [],
      });
      setMsg({ type: "ok", text: "Order berhasil dibuat!" });
      setOrderForm({
        orderNumber: "",
        totalAmount: "",
        profitAmount: "",
        note: "",
        status: "Pending",
        userId: "",
      });
      onOrderSuccess();
      fetchOrders();
    } catch {
      setMsg({ type: "err", text: "Gagal membuat order." });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const inputCls = {
    width: "100%",
    background: "#0f1117",
    border: "1px solid #2d3748",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "13px",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box" as const,
  };
  const labelCls = {
    fontSize: "11px",
    color: "#94a3b8",
    display: "block",
    marginBottom: "5px",
  };

  const tabs = [
    {
      key: "lecture" as ManageTab,
      label: "🎓 Jadikan Lecture",
      active: "#16a34a",
    },
    {
      key: "assign" as ManageTab,
      label: "🔗 Assign Program",
      active: "#f59e0b",
    },
    {
      key: "student" as ManageTab,
      label: "👤 Create Student",
      active: "#7c3aed",
    },
    { key: "order" as ManageTab, label: "📋 Create Order", active: "#06b6d4" },
    {
      key: "reset" as ManageTab,
      label: "🔑 Reset Password",
      active: "#ef4444",
    },
  ];

  const levelConfig: any = {
    BEGINNER: { label: "Beginner", color: "#10b981" },
    ADVANCED: { label: "Advanced", color: "#f59e0b" },
    EXPERT: { label: "Expert", color: "#8b5cf6" },
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          maxWidth: "920px",
          margin: "0 16px",
          maxHeight: "90vh",
        }}
      >
        {/* ── LEFT ── */}
        <div
          style={{
            background: "#161b2e",
            border: "1px solid #1e2744",
            borderRadius: "16px",
            padding: "24px",
            width: "400px",
            flexShrink: 0,
            overflowY: "auto",
            maxHeight: "90vh",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
            }}
          >
            ✕
          </button>

          <div
            style={{
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid #1e2744",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff" }}>
              Manage
            </div>
            <div
              style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}
            >
              Kelola lecture, program, student, dan order
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setActiveTab(t.key);
                  setMsg(null);
                }}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  border: `1.5px solid ${activeTab === t.key ? t.active : "#1e2744"}`,
                  background:
                    activeTab === t.key ? `${t.active}18` : "transparent",
                  color: activeTab === t.key ? "#fff" : "#64748b",
                  transition: "all 0.2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {msg && (
            <div
              style={{
                marginBottom: "14px",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                background:
                  msg.type === "ok"
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(239,68,68,0.15)",
                color: msg.type === "ok" ? "#10b981" : "#ef4444",
                border: `1px solid ${msg.type === "ok" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}
            >
              {msg.text}
            </div>
          )}

          {/* ── FORM: Jadikan Lecture ── */}
          {activeTab === "lecture" && (
            <form
              onSubmit={handleJadikanLecture}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={labelCls}>
                  Email Pengguna <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="email"
                  value={lectureForm.email}
                  onChange={(e) =>
                    setLectureForm({ ...lectureForm, email: e.target.value })
                  }
                  placeholder="user@email.com"
                />
              </div>
              <div>
                <label style={labelCls}>Spesialisasi</label>
                <input
                  style={inputCls}
                  type="text"
                  value={lectureForm.specialization}
                  onChange={(e) =>
                    setLectureForm({
                      ...lectureForm,
                      specialization: e.target.value,
                    })
                  }
                  placeholder="Contoh: Olfactory Design"
                />
              </div>
              <div>
                <label style={labelCls}>Bio</label>
                <textarea
                  value={lectureForm.bio}
                  onChange={(e) =>
                    setLectureForm({ ...lectureForm, bio: e.target.value })
                  }
                  placeholder="Deskripsi singkat..."
                  rows={3}
                  style={{
                    ...inputCls,
                    resize: "vertical" as const,
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingLecture}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#16a34a",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSubmittingLecture ? "not-allowed" : "pointer",
                  opacity: isSubmittingLecture ? 0.6 : 1,
                }}
              >
                {isSubmittingLecture ? "Memproses..." : "🎓 Jadikan Lecture"}
              </button>
            </form>
          )}

          {/* ── FORM: Assign Program ── */}
          {activeTab === "assign" && (
            <form
              onSubmit={handleAssignProgram}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={labelCls}>
                  Pilih Lecture <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={assignForm.lectureId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, lectureId: e.target.value })
                  }
                  style={{ ...inputCls, appearance: "none" as const }}
                >
                  <option value="">-- Pilih Lecture --</option>
                  {lectures.map((lec) => (
                    <option key={lec.id} value={lec.id}>
                      {lec.user?.fullName || "-"}{" "}
                      {lec.specialization ? `· ${lec.specialization}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelCls}>
                  Pilih Program <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select
                  value={assignForm.programId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, programId: e.target.value })
                  }
                  style={{ ...inputCls, appearance: "none" as const }}
                >
                  <option value="">-- Pilih Program --</option>
                  {programs.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.title} ·{" "}
                      {levelConfig[prog.level]?.label || prog.level}
                      {prog.lecture
                        ? ` (sudah: ${prog.lecture?.user?.fullName || "ada lecture"})`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmittingAssign}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#f59e0b",
                  border: "none",
                  color: "#000",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSubmittingAssign ? "not-allowed" : "pointer",
                  opacity: isSubmittingAssign ? 0.6 : 1,
                }}
              >
                {isSubmittingAssign ? "Memproses..." : "🔗 Assign Program"}
              </button>
            </form>
          )}

          {/* ── FORM: Create Student ── */}
          {activeTab === "student" && (
            <form
              onSubmit={handleCreateStudent}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: "rgba(124,58,237,0.08)",
                  border: "0.5px solid rgba(124,58,237,0.2)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#a78bfa",
                }}
              >
                💡 User harus sudah register dulu. Student profile memungkinkan
                user untuk di-enroll ke program.
              </div>
              <div>
                <label style={labelCls}>
                  Email Pengguna <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="email"
                  value={studentForm.email}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, email: e.target.value })
                  }
                  placeholder="user@email.com"
                />
              </div>
              <div>
                <label style={labelCls}>Kode Murid (opsional)</label>
                <input
                  style={inputCls}
                  type="text"
                  value={studentForm.studentCode}
                  onChange={(e) =>
                    setStudentForm({
                      ...studentForm,
                      studentCode: e.target.value,
                    })
                  }
                  placeholder="cth: STD-001"
                />
              </div>
              <div>
                <label style={labelCls}>Bio (opsional)</label>
                <textarea
                  value={studentForm.bio}
                  onChange={(e) =>
                    setStudentForm({ ...studentForm, bio: e.target.value })
                  }
                  placeholder="Catatan tentang murid..."
                  rows={3}
                  style={{
                    ...inputCls,
                    resize: "vertical" as const,
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingStudent}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#7c3aed",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSubmittingStudent ? "not-allowed" : "pointer",
                  opacity: isSubmittingStudent ? 0.6 : 1,
                }}
              >
                {isSubmittingStudent
                  ? "Memproses..."
                  : "👤 Buat Student Profile"}
              </button>
            </form>
          )}

          {/* ── FORM: Reset Password ── */}
          {activeTab === "reset" && (
            <form
              onSubmit={handleResetPassword}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: "rgba(239,68,68,0.08)",
                  border: "0.5px solid rgba(239,68,68,0.2)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#fca5a5",
                }}
              >
                ⚠️ Fitur ini untuk admin reset password user yang lupa password.
              </div>
              <div>
                <label style={labelCls}>
                  Email Pengguna <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="email"
                  value={resetForm.email}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, email: e.target.value })
                  }
                  placeholder="user@email.com"
                />
              </div>
              <div>
                <label style={labelCls}>
                  Password Baru <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="password"
                  value={resetForm.newPassword}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, newPassword: e.target.value })
                  }
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <div>
                <label style={labelCls}>
                  Konfirmasi Password{" "}
                  <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="password"
                  value={resetForm.confirmPassword}
                  onChange={(e) =>
                    setResetForm({
                      ...resetForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Ulangi password baru"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReset}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#ef4444",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSubmittingReset ? "not-allowed" : "pointer",
                  opacity: isSubmittingReset ? 0.6 : 1,
                }}
              >
                {isSubmittingReset ? "Memproses..." : "🔑 Reset Password"}
              </button>
            </form>
          )}

          {/* ── FORM: Create Order ── */}
          {activeTab === "order" && (
            <form
              onSubmit={handleCreateOrder}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={labelCls}>
                  Order Number <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="text"
                  value={orderForm.orderNumber}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, orderNumber: e.target.value })
                  }
                  placeholder="#INV-002"
                />
              </div>
              <div>
                <label style={labelCls}>
                  Total Amount <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="number"
                  value={orderForm.totalAmount}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, totalAmount: e.target.value })
                  }
                  placeholder="100000"
                />
              </div>
              <div>
                <label style={labelCls}>
                  Profit Amount <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="number"
                  value={orderForm.profitAmount}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, profitAmount: e.target.value })
                  }
                  placeholder="30000"
                />
              </div>
              <div>
                <label style={labelCls}>
                  User ID <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="text"
                  value={orderForm.userId}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, userId: e.target.value })
                  }
                  placeholder="uuid user..."
                />
              </div>
              <div>
                <label style={labelCls}>Status</label>
                <select
                  value={orderForm.status}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, status: e.target.value })
                  }
                  style={{ ...inputCls, appearance: "none" as const }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              <div>
                <label style={labelCls}>Note</label>
                <input
                  style={inputCls}
                  type="text"
                  value={orderForm.note}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, note: e.target.value })
                  }
                  placeholder="Catatan order (opsional)"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingOrder}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#06b6d4",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSubmittingOrder ? "not-allowed" : "pointer",
                  opacity: isSubmittingOrder ? 0.6 : 1,
                }}
              >
                {isSubmittingOrder ? "Menyimpan..." : "📋 Save Order"}
              </button>
            </form>
          )}
        </div>

        {/* ── GAP ── */}
        <div style={{ width: "20px", flexShrink: 0 }} />

        {/* ── RIGHT ── */}
        <div
          style={{
            background: "#161b2e",
            border: "1px solid #1e2744",
            borderRadius: "16px",
            padding: "24px",
            flex: 1,
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          {/* Daftar Lecture */}
          {activeTab === "lecture" && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #1e2744",
                }}
              >
                Daftar Lecture Terdaftar
              </div>
              {isFetchingLectures ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Memuat data...
                </div>
              ) : lectures.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Belum ada lecture yang terdaftar.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {lectures.map((lec) => (
                    <div
                      key={lec.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px",
                        background: "#0f1117",
                        borderRadius: "8px",
                        border: "1px solid #1e2744",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1.5px solid #16a34a",
                          }}
                        >
                          {lec.user?.profilePic ? (
                            <img
                              src={lec.user.profilePic}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                background: "#166534",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "14px",
                                fontWeight: 700,
                              }}
                            >
                              {(lec.user?.fullName || "L")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#fff",
                              fontWeight: 500,
                            }}
                          >
                            {lec.user?.fullName || "-"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {lec.user?.email || "-"}
                          </div>
                          {lec.specialization && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#16a34a",
                                marginTop: "2px",
                              }}
                            >
                              {lec.specialization}
                            </div>
                          )}
                          {lec.program && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#f59e0b",
                                marginTop: "2px",
                              }}
                            >
                              📚 {lec.program.title}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteLecture(
                            lec.id,
                            lec.user?.fullName || "lecture",
                          )
                        }
                        style={{
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: "transparent",
                          border: "1px solid #374151",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "11px",
                        }}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assign Program */}
          {activeTab === "assign" && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #1e2744",
                }}
              >
                Status Assign Program
              </div>
              {isFetchingPrograms ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Memuat data...
                </div>
              ) : programs.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Belum ada program.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {programs.map((prog) => {
                    const lvl = levelConfig[prog.level];
                    return (
                      <div
                        key={prog.id}
                        style={{
                          padding: "12px",
                          background: "#0f1117",
                          borderRadius: "8px",
                          border: "1px solid #1e2744",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: 600,
                                padding: "1px 6px",
                                borderRadius: "3px",
                                color: lvl?.color || "#fff",
                                background: `${lvl?.color}20`,
                                marginRight: "6px",
                              }}
                            >
                              {lvl?.label || prog.level}
                            </span>
                            <span
                              style={{
                                fontSize: "13px",
                                color: "#fff",
                                fontWeight: 500,
                              }}
                            >
                              {prog.title}
                            </span>
                          </div>
                          {prog.lecture ? (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "#10b981",
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.3)",
                                borderRadius: "6px",
                                padding: "4px 8px",
                              }}
                            >
                              ✓ {prog.lecture.user?.fullName || "Assigned"}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#64748b",
                                border: "1px solid #374151",
                                padding: "3px 8px",
                                borderRadius: "4px",
                              }}
                            >
                              Belum diassign
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Daftar Student */}
          {activeTab === "student" && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #1e2744",
                }}
              >
                Daftar Student Profile ({students.length})
              </div>
              {isFetchingStudents ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Memuat data...
                </div>
              ) : students.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Belum ada student profile.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {students.map((stu) => (
                    <div
                      key={stu.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px",
                        background: "#0f1117",
                        borderRadius: "8px",
                        border: "1px solid #1e2744",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1.5px solid #7c3aed",
                          }}
                        >
                          {stu.user?.profilePic ? (
                            <img
                              src={stu.user.profilePic}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                background: "rgba(124,58,237,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#a78bfa",
                                fontSize: "14px",
                                fontWeight: 700,
                              }}
                            >
                              {(stu.user?.fullName || "S")[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#fff",
                              fontWeight: 500,
                            }}
                          >
                            {stu.user?.fullName || "-"}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {stu.user?.email || "-"}
                          </div>
                          {stu.studentCode && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#a78bfa",
                                marginTop: "2px",
                              }}
                            >
                              #{stu.studentCode}
                            </div>
                          )}
                          {stu.enrollments?.length > 0 && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#10b981",
                                marginTop: "2px",
                              }}
                            >
                              📚 {stu.enrollments.length} program enrolled
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteStudent(
                            stu.id,
                            stu.user?.fullName || "student",
                          )
                        }
                        style={{
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: "transparent",
                          border: "1px solid #374151",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "11px",
                        }}
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reset Password — info panel */}
          {activeTab === "reset" && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #1e2744",
                }}
              >
                Panduan Reset Password
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  {
                    icon: "1️⃣",
                    title: "Cari Email",
                    desc: "Minta user konfirmasi email yang terdaftar di sistem.",
                  },
                  {
                    icon: "2️⃣",
                    title: "Set Password Sementara",
                    desc: "Buat password sementara yang mudah diingat, minimal 8 karakter.",
                  },
                  {
                    icon: "3️⃣",
                    title: "Beritahu User",
                    desc: "Sampaikan password baru ke user via WhatsApp atau langsung.",
                  },
                  {
                    icon: "4️⃣",
                    title: "User Ganti Password",
                    desc: "Minta user segera ganti password di halaman Settings setelah login.",
                  },
                ].map((tip) => (
                  <div
                    key={tip.title}
                    style={{
                      padding: "12px",
                      background: "#0f1117",
                      borderRadius: "8px",
                      border: "1px solid #1e2744",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span>{tip.icon}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {tip.title}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        paddingLeft: "24px",
                      }}
                    >
                      {tip.desc}
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    padding: "10px 12px",
                    background: "rgba(239,68,68,0.06)",
                    border: "0.5px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  🔒 Password di-hash otomatis menggunakan{" "}
                  <strong style={{ color: "#ef4444" }}>bcrypt</strong> sebelum
                  disimpan ke database.
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders */}
          {activeTab === "order" && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #1e2744",
                }}
              >
                Recent Orders
              </div>
              {isFetchingOrders ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Memuat data...
                </div>
              ) : orders.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Belum ada order.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {orders.map((order, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px",
                        background: "#0f1117",
                        borderRadius: "8px",
                        border: "1px solid #1e2744",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        >
                          {order.orderNumber}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background:
                              order.status?.toLowerCase() === "paid"
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(251,191,36,0.15)",
                            color:
                              order.status?.toLowerCase() === "paid"
                                ? "#10b981"
                                : "#fbbf24",
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          {new Date(order.createdAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#06b6d4",
                            fontWeight: 500,
                          }}
                        >
                          $
                          {Number(order.totalAmount).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      {order.note && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#4b5563",
                            marginTop: "4px",
                          }}
                        >
                          {order.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
