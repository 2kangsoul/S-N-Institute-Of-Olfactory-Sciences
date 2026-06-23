// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import apiClient from "../config/api";
import { User, Shield, Save, Upload, Eye, EyeOff } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#0f1117", border: "1px solid #2d3748",
  borderRadius: "8px", padding: "8px 12px", fontSize: "13px",
  color: "#e2e8f0", outline: "none", boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "5px",
};

export default function StudentSettings() {
  const { user, fetchCurrentUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"profil" | "keamanan">("profil");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [profileForm, setProfileForm] = useState({ fullName: "", no_handphone: "", address: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [previewPic, setPreviewPic] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.objectId) return;
    apiClient.get(`/users/${user.objectId}`)
      .then(res => {
        const d = res.data;
        setProfileForm({
          fullName: d.fullName || "",
          no_handphone: d.no_handphone || "",
          address: d.address || "",
        });
        setPreviewPic(d.profilePic || null);
      })
      .finally(() => setLoading(false));
  }, [user?.objectId]);

  const handleSaveProfil = async () => {
    setSaving(true); setMsg(null);
    try {
      await apiClient.put(`/users/${user.objectId}`, {
        fullName: profileForm.fullName,
        no_handphone: profileForm.no_handphone,
        address: profileForm.address,
      });
      await fetchCurrentUser();
      setMsg({ type: "ok", text: "Profil berhasil disimpan!" });
    } catch (e: any) {
      setMsg({ type: "err", text: e.response?.data?.message || "Gagal menyimpan profil." });
    } finally { setSaving(false); }
  };

  // Upload foto sama persis seperti LectureSettings
  const handleUploadPhoto = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMsg({ type: "err", text: "Hanya file gambar yang diizinkan." });
      return;
    }
    setUploadingPhoto(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await apiClient.post(`/users/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileUrl = uploadRes.data?.data?.fileUrl;
      if (!fileUrl) throw new Error("Gagal mendapat URL foto");
      await apiClient.put(`/users/${user.objectId}`, { profilePic: fileUrl });
      setPreviewPic(fileUrl);
      await fetchCurrentUser();
      setMsg({ type: "ok", text: "Foto profil berhasil diupdate!" });
    } catch (e: any) {
      setMsg({ type: "err", text: e.response?.data?.message || "Gagal upload foto." });
    } finally { setUploadingPhoto(false); }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwMsg({ type: "err", text: "Semua field wajib diisi." }); return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: "err", text: "Password baru tidak cocok." }); return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: "err", text: "Password baru minimal 8 karakter." }); return;
    }
    setSaving(true); setPwMsg(null);
    try {
      // Pakai PUT /users/:id dengan field password (sama seperti LectureSettings)
      await apiClient.put(`/users/${user.objectId}`, {
        password: pwForm.newPassword,
      });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg({ type: "ok", text: "Password berhasil diubah!" });
    } catch (e: any) {
      setPwMsg({ type: "err", text: e.response?.data?.message || "Gagal mengubah password." });
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid #1e2744", borderTop: "3px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const tabs = [
    { key: "profil", label: "👤 Profil" },
    { key: "keamanan", label: "🔒 Keamanan" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>Settings</h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Kelola akun dan keamanan</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key as any); setMsg(null); setPwMsg(null); }}
            style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: `1.5px solid ${activeTab === tab.key ? "#10b981" : "#1e2744"}`, background: activeTab === tab.key ? "rgba(16,185,129,0.1)" : "transparent", color: activeTab === tab.key ? "#10b981" : "#64748b" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Profil */}
      {activeTab === "profil" && (
        <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Foto profil */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", border: "2px solid #10b981", flexShrink: 0 }}>
              {previewPic ? (
                <img src={previewPic} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff", fontWeight: 700 }}>
                  {(user?.name || user?.fullName || "S")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "6px", background: "rgba(16,185,129,0.15)", border: "0.5px solid rgba(16,185,129,0.3)", color: "#10b981", fontSize: "12px", cursor: "pointer", fontWeight: 500, opacity: uploadingPhoto ? 0.6 : 1 }}>
                <Upload size={12} /> {uploadingPhoto ? "Uploading..." : "Ganti Foto"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => { if (e.target.files?.[0]) handleUploadPhoto(e.target.files[0]); e.target.value = ""; }} />
              <div style={{ fontSize: "10px", color: "#64748b", marginTop: "4px" }}>JPG, PNG max 2MB</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={labelStyle}>Nama Lengkap</label>
              <input style={inputStyle} type="text" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>No. HP</label>
              <input style={inputStyle} type="text" value={profileForm.no_handphone} onChange={e => setProfileForm({ ...profileForm, no_handphone: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Alamat</label>
              <textarea style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" } as any} rows={3} value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} />
            </div>
          </div>

          {msg && <div style={{ fontSize: "12px", color: msg.type === "ok" ? "#10b981" : "#ef4444" }}>{msg.text}</div>}
          <button onClick={handleSaveProfil} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "8px", background: "#10b981", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, alignSelf: "flex-start" }}>
            <Save size={13} /> {saving ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      )}

      {/* Tab Keamanan */}
      {activeTab === "keamanan" && (
        <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { key: "currentPassword", label: "Password Saat Ini", show: showPw.current, toggle: () => setShowPw(p => ({ ...p, current: !p.current })) },
            { key: "newPassword", label: "Password Baru", show: showPw.new, toggle: () => setShowPw(p => ({ ...p, new: !p.new })) },
            { key: "confirmPassword", label: "Konfirmasi Password Baru", show: showPw.confirm, toggle: () => setShowPw(p => ({ ...p, confirm: !p.confirm })) },
          ].map(field => (
            <div key={field.key}>
              <label style={labelStyle}>{field.label}</label>
              <div style={{ position: "relative" }}>
                <input style={{ ...inputStyle, paddingRight: "36px" }}
                  type={field.show ? "text" : "password"}
                  value={(pwForm as any)[field.key]}
                  onChange={e => setPwForm({ ...pwForm, [field.key]: e.target.value })} />
                <button onClick={field.toggle} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}>
                  {field.show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          {pwMsg && <div style={{ fontSize: "12px", color: pwMsg.type === "ok" ? "#10b981" : "#ef4444" }}>{pwMsg.text}</div>}
          <button onClick={handleChangePassword} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "8px", background: "#ef4444", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, alignSelf: "flex-start" }}>
            <Shield size={13} /> {saving ? "Menyimpan..." : "Ganti Password"}
          </button>
        </div>
      )}
    </div>
  );
}
