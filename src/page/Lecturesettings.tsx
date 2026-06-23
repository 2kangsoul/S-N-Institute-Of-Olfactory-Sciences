// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import apiClient from "../config/api";
import {
  User,
  Phone,
  Shield,
  Save,
  Upload,
  Eye,
  EyeOff,
  Smartphone,
  RefreshCw,
} from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f1117",
  border: "1px solid #2d3748",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "13px",
  color: "#e2e8f0",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#94a3b8",
  display: "block",
  marginBottom: "5px",
};

type SettingsTab = "profil" | "keamanan" | "whatsapp";

export default function LectureSettings() {
  const { user, fetchCurrentUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<any>(null);

  const [lectureProfile, setLectureProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");

  // Profil form
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    no_handphone: "",
    specialization: "",
    bio: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // WA state
  const [waStatus, setWaStatus] = useState<any>(null);
  const [loadingWA, setLoadingWA] = useState(false);
  const [resettingWA, setResettingWA] = useState(false);
  const [waMsg, setWaMsg] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.objectId) return;
    const load = async () => {
      try {
        const [lectureRes, userRes] = await Promise.all([
          apiClient.get(`/lectures/user/${user.objectId}`),
          apiClient.get(`/users/${user.objectId}`),
        ]);
        const lecture = lectureRes.data?.data;
        const userData = userRes.data?.data || userRes.data;
        setLectureProfile(lecture);
        setProfileForm({
          fullName: userData?.fullName || user?.fullName || user?.name || "",
          no_handphone: userData?.no_handphone || user?.no_handphone || "",
          specialization: lecture?.specialization || "",
          bio: lecture?.bio || "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.objectId]);

  // ── WA Polling ─────────────────────────────────────────────────────────────
  const fetchWAStatus = async () => {
    try {
      const res = await apiClient.get("/wa/status");
      setWaStatus(res.data?.data);
    } catch {
      setWaStatus(null);
    }
  };

  useEffect(() => {
    if (activeTab !== "whatsapp") {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }
    setLoadingWA(true);
    fetchWAStatus().finally(() => setLoadingWA(false));
    pollingRef.current = setInterval(fetchWAStatus, 3000);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeTab]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await apiClient.put(`/users/${user.objectId}`, {
        fullName: profileForm.fullName,
        no_handphone: profileForm.no_handphone,
      });
      if (lectureProfile?.id) {
        await apiClient.put(`/lectures/${lectureProfile.id}`, {
          specialization: profileForm.specialization,
          bio: profileForm.bio,
        });
      }
      await fetchCurrentUser();
      setProfileMsg({ type: "ok", text: "Profil berhasil disimpan!" });
    } catch (e: any) {
      setProfileMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal menyimpan.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUploadPhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setProfileMsg({ type: "err", text: "Hanya file gambar yang diizinkan." });
      return;
    }
    setUploadingPhoto(true);
    setProfileMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await apiClient.post(`/users/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileUrl = uploadRes.data?.data?.fileUrl;
      if (!fileUrl) throw new Error("Gagal mendapat URL foto");
      await apiClient.put(`/users/${user.objectId}`, { profilePic: fileUrl });
      await fetchCurrentUser();
      setProfileMsg({ type: "ok", text: "Foto profil berhasil diupdate!" });
    } catch (e: any) {
      setProfileMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal upload foto.",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !pwForm.currentPassword ||
      !pwForm.newPassword ||
      !pwForm.confirmPassword
    ) {
      setPwMsg({ type: "err", text: "Semua field wajib diisi." });
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "err", text: "Password baru tidak cocok." });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: "err", text: "Password baru minimal 8 karakter." });
      return;
    }
    setSavingPw(true);
    setPwMsg(null);
    try {
      await apiClient.put(`/users/${user.objectId}`, {
        password: pwForm.newPassword,
      });
      setPwMsg({ type: "ok", text: "Password berhasil diubah!" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      setPwMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal mengubah password.",
      });
    } finally {
      setSavingPw(false);
    }
  };

  const handleResetWA = async () => {
    if (
      !confirm("Reset session WA? Bot akan disconnect dan QR baru akan muncul.")
    )
      return;
    setResettingWA(true);
    setWaMsg(null);
    try {
      await apiClient.post("/wa/reset");
      setWaMsg({
        type: "ok",
        text: "Session direset! QR baru akan muncul dalam beberapa detik...",
      });
      setWaStatus(null);
      setTimeout(fetchWAStatus, 3000);
    } catch (e: any) {
      setWaMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal reset session.",
      });
    } finally {
      setResettingWA(false);
    }
  };

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

  const displayName =
    profileForm.fullName || user?.fullName || user?.name || "Lecture";
  const displayInitial = displayName[0]?.toUpperCase();

  const tabs = [
    { key: "profil" as SettingsTab, label: "👤 Profil", active: "#7c3aed" },
    { key: "keamanan" as SettingsTab, label: "🔒 Keamanan", active: "#ef4444" },
    {
      key: "whatsapp" as SettingsTab,
      label: "📱 WhatsApp Bot",
      active: "#10b981",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
          Settings
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
          Kelola profil dan keamanan akun Anda
        </p>
      </div>

      {/* 2-panel layout — sama seperti ManageModal */}
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
        {/* ── LEFT — Tab nav + Form ── */}
        <div
          style={{
            background: "#161b2e",
            border: "1px solid #1e2744",
            borderRadius: "16px",
            padding: "24px",
            width: "380px",
            flexShrink: 0,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid #1e2744",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #7c3aed",
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#a78bfa",
                  }}
                >
                  {displayInitial}
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>
                {displayName}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {lectureProfile?.specialization || "Lecture"}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                style={{
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 10px",
                  borderRadius: "5px",
                  background: "rgba(124,58,237,0.15)",
                  border: "0.5px solid rgba(124,58,237,0.3)",
                  color: "#a78bfa",
                  fontSize: "11px",
                  cursor: "pointer",
                  opacity: uploadingPhoto ? 0.6 : 1,
                }}
              >
                <Upload size={11} />{" "}
                {uploadingPhoto ? "Uploading..." : "Ganti Foto"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.[0]) handleUploadPhoto(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </div>

          {/* Tab buttons */}
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
                  setProfileMsg(null);
                  setPwMsg(null);
                  setWaMsg(null);
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

          {/* Feedback msg */}
          {(profileMsg || pwMsg || waMsg) && (
            <div
              style={{
                marginBottom: "14px",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                background:
                  (profileMsg || pwMsg || waMsg)?.type === "ok"
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(239,68,68,0.15)",
                color:
                  (profileMsg || pwMsg || waMsg)?.type === "ok"
                    ? "#10b981"
                    : "#ef4444",
                border: `1px solid ${(profileMsg || pwMsg || waMsg)?.type === "ok" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}
            >
              {profileMsg?.text || pwMsg?.text || waMsg?.text}
            </div>
          )}

          {/* ── FORM: Profil ── */}
          {activeTab === "profil" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={labelStyle}>Nama Lengkap</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, fullName: e.target.value })
                  }
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label style={labelStyle}>No. HP (untuk WA bot)</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={profileForm.no_handphone}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      no_handphone: e.target.value,
                    })
                  }
                  placeholder="cth: 08123456789"
                />
              </div>
              <div>
                <label style={labelStyle}>Spesialisasi</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={profileForm.specialization}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      specialization: e.target.value,
                    })
                  }
                  placeholder="cth: Olfactory Design"
                />
              </div>
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  placeholder="Deskripsi singkat..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#7c3aed",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: savingProfile ? "not-allowed" : "pointer",
                  opacity: savingProfile ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Save size={13} />{" "}
                {savingProfile ? "Menyimpan..." : "Simpan Profil"}
              </button>
            </div>
          )}

          {/* ── FORM: Keamanan ── */}
          {activeTab === "keamanan" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {[
                {
                  key: "currentPassword",
                  label: "Password Saat Ini",
                  show: showPw.current,
                  toggle: () =>
                    setShowPw({ ...showPw, current: !showPw.current }),
                },
                {
                  key: "newPassword",
                  label: "Password Baru",
                  show: showPw.new,
                  toggle: () => setShowPw({ ...showPw, new: !showPw.new }),
                },
                {
                  key: "confirmPassword",
                  label: "Konfirmasi Password",
                  show: showPw.confirm,
                  toggle: () =>
                    setShowPw({ ...showPw, confirm: !showPw.confirm }),
                },
              ].map((field) => (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={field.show ? "text" : "password"}
                      value={pwForm[field.key as keyof typeof pwForm]}
                      onChange={(e) =>
                        setPwForm({ ...pwForm, [field.key]: e.target.value })
                      }
                      placeholder="••••••••"
                      style={{ ...inputStyle, paddingRight: "40px" }}
                    />
                    <button
                      onClick={field.toggle}
                      type="button"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#64748b",
                        cursor: "pointer",
                      }}
                    >
                      {field.show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              <div
                style={{
                  padding: "8px 12px",
                  background: "rgba(245,158,11,0.06)",
                  border: "0.5px solid rgba(245,158,11,0.2)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#94a3b8",
                }}
              >
                🔒 Password baru minimal{" "}
                <strong style={{ color: "#f59e0b" }}>8 karakter</strong>
              </div>
              <button
                onClick={handleChangePassword}
                disabled={savingPw}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#ef4444",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: savingPw ? "not-allowed" : "pointer",
                  opacity: savingPw ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <Shield size={13} />{" "}
                {savingPw ? "Menyimpan..." : "Ganti Password"}
              </button>
            </div>
          )}

          {/* ── FORM: WhatsApp ── */}
          {activeTab === "whatsapp" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  background: "rgba(16,185,129,0.06)",
                  border: "0.5px solid rgba(16,185,129,0.2)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#94a3b8",
                  lineHeight: 1.7,
                }}
              >
                📱 WA Bot digunakan untuk:
                <br />
                • Kirim notifikasi absensi saat sesi dimulai
                <br />
                • Kirim reminder sesi besok jam 20:00
                <br />• Validasi lokasi murid via token 6 digit
              </div>
              <button
                onClick={handleResetWA}
                disabled={resettingWA}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: resettingWA ? "not-allowed" : "pointer",
                  opacity: resettingWA ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <RefreshCw size={13} />{" "}
                {resettingWA ? "Mereset..." : "Reset & Generate QR Baru"}
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT — Info Panel ── */}
        <div
          style={{
            background: "#161b2e",
            border: "1px solid #1e2744",
            borderRadius: "16px",
            padding: "24px",
            flex: 1,
            minHeight: "400px",
          }}
        >
          {/* Profil — info akun */}
          {activeTab === "profil" && (
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
                Info Akun
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  { label: "Email", value: user?.email || "-" },
                  { label: "Username", value: user?.username || "-" },
                  { label: "Role", value: user?.role || "lecture" },
                  {
                    label: "Lecture Code",
                    value: lectureProfile?.lectureCode || "-",
                  },
                  { label: "No. HP", value: profileForm.no_handphone || "-" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: "12px",
                      background: "#0f1117",
                      borderRadius: "8px",
                      border: "1px solid #1e2744",
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
                        fontSize: "13px",
                        color: "#e2e8f0",
                        fontWeight: 500,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    padding: "10px 12px",
                    background: "rgba(124,58,237,0.06)",
                    border: "0.5px solid rgba(124,58,237,0.2)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#64748b",
                  }}
                >
                  📱 <strong style={{ color: "#a78bfa" }}>No. HP</strong>{" "}
                  digunakan WA bot untuk kirim notifikasi absensi dan reminder
                  sesi ke murid.
                </div>
              </div>
            </div>
          )}

          {/* Keamanan — tips */}
          {activeTab === "keamanan" && (
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
                Tips Keamanan
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
                    icon: "🔐",
                    title: "Password Kuat",
                    desc: "Gunakan kombinasi huruf besar, kecil, angka, dan simbol.",
                  },
                  {
                    icon: "🔄",
                    title: "Ganti Rutin",
                    desc: "Ganti password setiap 3 bulan sekali untuk keamanan optimal.",
                  },
                  {
                    icon: "🚫",
                    title: "Jangan Bagikan",
                    desc: "Jangan pernah bagikan password ke siapapun termasuk admin.",
                  },
                  {
                    icon: "📱",
                    title: "Logout Jika Perlu",
                    desc: "Selalu logout jika menggunakan perangkat bersama.",
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
              </div>
            </div>
          )}

          {/* WhatsApp — QR + Status */}
          {activeTab === "whatsapp" && (
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid #1e2744",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Status Koneksi WA Bot</span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: waStatus?.isConnected
                        ? "#10b981"
                        : waStatus?.status === "connecting"
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: waStatus?.isConnected
                        ? "#10b981"
                        : waStatus?.status === "connecting"
                          ? "#f59e0b"
                          : "#ef4444",
                    }}
                  >
                    {waStatus?.isConnected
                      ? "Terhubung"
                      : waStatus?.status === "connecting"
                        ? "Menghubungkan..."
                        : "Tidak Terhubung"}
                  </span>
                </div>
              </div>

              {loadingWA ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#64748b",
                  }}
                >
                  Memuat status...
                </div>
              ) : waStatus?.isConnected ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    ✅
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#10b981",
                      marginBottom: "8px",
                    }}
                  >
                    WhatsApp Bot Aktif
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                      lineHeight: 1.6,
                    }}
                  >
                    Bot siap mengirim notifikasi absensi
                    <br />
                    dan reminder sesi ke murid.
                  </div>
                </div>
              ) : waStatus?.hasQR && waStatus?.qrImage ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                    padding: "20px 0",
                  }}
                >
                  <div
                    style={{
                      padding: "14px",
                      background: "#fff",
                      borderRadius: "12px",
                    }}
                  >
                    <img
                      src={waStatus.qrImage}
                      alt="QR Code WA"
                      style={{
                        width: "200px",
                        height: "200px",
                        display: "block",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: "6px",
                      }}
                    >
                      Scan QR Code dengan WhatsApp
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        lineHeight: 1.7,
                      }}
                    >
                      HP → WhatsApp → ⋮ → Perangkat Tertaut
                      <br />→ Tautkan Perangkat
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px",
                      color: "#f59e0b",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#f59e0b",
                        animation: "pulse 1s infinite",
                      }}
                    />
                    QR refresh otomatis setiap 3 detik
                  </div>
                  <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    📵
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#ef4444",
                      marginBottom: "8px",
                    }}
                  >
                    Bot Tidak Terhubung
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "20px",
                      lineHeight: 1.6,
                    }}
                  >
                    Klik "Reset & Generate QR Baru" di panel kiri
                    <br />
                    untuk menyambungkan WhatsApp.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
