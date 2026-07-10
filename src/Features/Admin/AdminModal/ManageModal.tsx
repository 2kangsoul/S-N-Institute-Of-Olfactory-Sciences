// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import apiClient from "../../../config/api";

type ManageTab = "order" | "reset";

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
  const [activeTab, setActiveTab] = useState<ManageTab>("order");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

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
    if (activeTab === "order") fetchOrders();
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

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
      const userRes = await apiClient.get("/users", {
        params: { email: resetForm.email },
      });
      const users = userRes.data?.data;
      const found = Array.isArray(users) ? users[0] : users;
      if (!found) {
        setMsg({ type: "err", text: "User tidak ditemukan." });
        return;
      }
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
    { key: "order" as ManageTab, label: "📋 Create Order", active: "#06b6d4" },
    {
      key: "reset" as ManageTab,
      label: "🔑 Reset Password",
      active: "#ef4444",
    },
  ];

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
              Kelola order dan reset password
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
