// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import apiClient from "../../../config/api";

type Tab = "account" | "add-admin" | "make-admin";

interface Country {
  name: string;
  iso2: string;
  unicodeFlag: string;
}
interface Province {
  id: string;
  name: string;
}
interface Regency {
  id: string;
  name: string;
}
interface District {
  id: string;
  name: string;
}
interface Village {
  id: string;
  name: string;
}

// ─── Admin API helpers ────────────────────────────────────────────────────────
const fetchAdminsApi = async () => {
  const res = await apiClient.get("/users", { params: { role: "admin" } });
  return res.data.data || [];
};
const registerAdminApi = async (payload: any) => {
  const res = await apiClient.post("/auth/register", payload);
  return res.data;
};
const findUserByEmailApi = async (email: string) => {
  const res = await apiClient.get("/users", { params: { email } });
  return res.data.data;
};
const updateUserRoleApi = async (id: string, payload: any) => {
  const res = await apiClient.put(`/users/${id}`, payload);
  return res.data.data;
};
const deleteUserApi = async (id: string) => {
  const res = await apiClient.put(`/users/${id}`, {
    role: "user",
    adminDuration: null,
  });
  return res.data;
};

export default function AdminSidebarModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("account");

  // ── User data from DB ─────────────────────────────────────────────────────
  const [userData, setUserData] = useState<any>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  // ── Account form state ────────────────────────────────────────────────────
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [foreignAddress, setForeignAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ── Location state ────────────────────────────────────────────────────────
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  // ── Admin state ───────────────────────────────────────────────────────────
  const [admins, setAdmins] = useState<any[]>([]);
  const [isFetchingAdmins, setIsFetchingAdmins] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addForm, setAddForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [makeForm, setMakeForm] = useState({ email: "", duration: "30 hari" });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const isIndonesia = selectedCountry?.iso2 === "ID";
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  // ── Fetch user from DB when modal opens ──────────────────────────────────
  useEffect(() => {
    if (!isOpen || !user) return;
    const userId = user?.objectId || user?.id;
    if (!userId) return;
    setIsFetchingUser(true);
    // Fetch dari /auth/me untuk dapat data lengkap termasuk country
    apiClient
      .get(`/auth/me`)
      .then((res) => {
        const u = res.data?.data || res.data;
        setUserData(u);
        setPhone(u?.no_handphone || "");
      })
      .catch(() => {
        // Fallback ke /users/:id
        apiClient
          .get(`/users/${userId}`)
          .then((res) => {
            const u = res.data?.data || res.data;
            setUserData(u);
            setPhone(u?.no_handphone || "");
          })
          .catch(() => {
            setPhone(user?.no_handphone || "");
          });
      })
      .finally(() => setIsFetchingUser(false));
    setPassword("");
    setProfilePic(null);
    setMsg(null);
    setStreetAddress("");
    setForeignAddress("");
    setSelectedCountry(null);
    setCountrySearch("");
  }, [isOpen]);

  // ── Fetch countries ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    fetch("http://localhost:8000/api/countries")
      .then((r) => r.json())
      .then((res) => {
        const arr = Array.isArray(res.data) ? res.data : [];
        const sorted = arr
          .filter((c: any) => c?.iso2)
          .filter(
            (c: any, i: number, self: any[]) =>
              self.findIndex((t) => t.iso2 === c.iso2) === i,
          )
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(sorted);
      })
      .catch(console.error);
  }, [isOpen]);

  // ── Fetch provinces when Indonesia selected ───────────────────────────────
  useEffect(() => {
    if (!isIndonesia) return;
    fetch("http://localhost:8000/api/provinces")
      .then((r) => r.json())
      .then(setProvinces)
      .catch(console.error);
  }, [isIndonesia]);

  useEffect(() => {
    if (!selectedProvince) return;
    fetch(`http://localhost:8000/api/regencies/${selectedProvince}`)
      .then((r) => r.json())
      .then(setRegencies)
      .catch(console.error);
    setSelectedRegency("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setDistricts([]);
    setVillages([]);
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedRegency) return;
    fetch(`http://localhost:8000/api/districts/${selectedRegency}`)
      .then((r) => r.json())
      .then(setDistricts)
      .catch(console.error);
    setSelectedDistrict("");
    setSelectedVillage("");
    setVillages([]);
  }, [selectedRegency]);

  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(`http://localhost:8000/api/villages/${selectedDistrict}`)
      .then((r) => r.json())
      .then(setVillages)
      .catch(console.error);
    setSelectedVillage("");
  }, [selectedDistrict]);

  // ── Fetch admins when tab changes ─────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || activeTab === "account") return;
    setIsFetchingAdmins(true);
    fetchAdminsApi()
      .then(setAdmins)
      .catch(() => setAdmins([]))
      .finally(() => setIsFetchingAdmins(false));
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const handleCountryChange = (iso2: string) => {
    const c = countries.find((x) => x.iso2 === iso2);
    if (c) {
      setSelectedCountry(c);
      setSelectedProvince("");
      setSelectedRegency("");
      setSelectedDistrict("");
      setSelectedVillage("");
      setForeignAddress("");
      setStreetAddress("");
    }
  };

  const getFullAddress = () => {
    if (isIndonesia) {
      const v = villages.find((x) => x.id === selectedVillage)?.name || "";
      const d = districts.find((x) => x.id === selectedDistrict)?.name || "";
      const r = regencies.find((x) => x.id === selectedRegency)?.name || "";
      const p = provinces.find((x) => x.id === selectedProvince)?.name || "";
      return [streetAddress, v, d, r, p].filter(Boolean).join(", ");
    }
    return streetAddress
      ? `${streetAddress}, ${foreignAddress}`
      : foreignAddress || "";
  };

  // ── Save account ──────────────────────────────────────────────────────────
  const handleSaveAccount = async () => {
    if (!phone) {
      setMsg({ type: "err", text: "Nomor HP wajib diisi." });
      return;
    }
    setIsSaving(true);
    setMsg(null);
    try {
      const userId = user?.objectId || user?.id;
      let profilePicUrl = userData?.profilePic || user?.profilePic || "";
      if (profilePic) {
        const fd = new FormData();
        fd.append("file", profilePic);
        const up = await apiClient.post("users/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profilePicUrl =
          up.data?.data?.fileUrl ||
          up.data?.fileUrl ||
          up.data?.url ||
          profilePicUrl;
      }
      const payload: any = {
        no_handphone: phone,
        profilePic: profilePicUrl,
        country: selectedCountry?.name || userData?.country || "",
        address: getFullAddress() || userData?.address || "",
      };
      if (password.trim()) payload.password = password;
      await apiClient.put(`/users/${userId}`, payload);

      // Update localStorage
      const stored = localStorage.getItem("auth-storage");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.user) {
            parsed.state.user.profilePic = profilePicUrl;
            parsed.state.user.no_handphone = phone;
            localStorage.setItem("auth-storage", JSON.stringify(parsed));
          }
        } catch {}
      }
      // Refresh userData dari /auth/me untuk dapat country terbaru
      const refreshed = await apiClient.get(`/auth/me`);
      const updatedUser = refreshed.data?.data || refreshed.data;
      setUserData(updatedUser);

      // ← tambah ini: update auth store agar sidebar langsung berubah
      const { setAuth } = useAuthStore.getState();
      setAuth({
        ...user,
        profilePic: profilePicUrl,
        no_handphone: phone,
      });

      setMsg({ type: "ok", text: "Profil berhasil diperbarui!" });
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal memperbarui profil.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── Add admin ─────────────────────────────────────────────────────────────
  const handleAddAdmin = async (e: any) => {
    e.preventDefault();
    if (!addForm.fullName || !addForm.email || !addForm.password) {
      setMsg({ type: "err", text: "Semua field wajib diisi." });
      return;
    }
    setIsLoading(true);
    setMsg(null);
    try {
      await registerAdminApi({
        fullName: addForm.fullName,
        username: addForm.email.split("@")[0],
        email: addForm.email,
        password: addForm.password,
        role: "admin",
      });
      setMsg({ type: "ok", text: "Admin baru berhasil didaftarkan!" });
      setAddForm({ fullName: "", email: "", password: "" });
      setAdmins(await fetchAdminsApi());
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal mendaftarkan admin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Make admin ────────────────────────────────────────────────────────────
  const handleMakeAdmin = async (e: any) => {
    e.preventDefault();
    if (!makeForm.email) {
      setMsg({ type: "err", text: "Email wajib diisi." });
      return;
    }
    setIsLoading(true);
    setMsg(null);
    try {
      const users = await findUserByEmailApi(makeForm.email);
      const found = Array.isArray(users) ? users[0] : users;
      if (!found) {
        setMsg({ type: "err", text: "User tidak ditemukan." });
        setIsLoading(false);
        return;
      }
      await updateUserRoleApi(found.id, {
        role: "admin",
        adminDuration: makeForm.duration,
      });
      setMsg({
        type: "ok",
        text: `${found.fullName} berhasil dijadikan admin!`,
      });
      setMakeForm({ email: "", duration: "30 hari" });
      setAdmins(await fetchAdminsApi());
    } catch (e: any) {
      setMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal memperbarui role.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Delete admin ──────────────────────────────────────────────────────────
  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!confirm(`Hapus akses admin untuk ${name}?`)) return;
    try {
      await deleteUserApi(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setMsg({ type: "ok", text: `Akses admin ${name} telah dicabut.` });
    } catch {
      setMsg({ type: "err", text: "Gagal menghapus admin." });
    }
  };

  const displayUser = userData || user;
  const displayName = displayUser?.fullName || displayUser?.name || "Admin";
  const displayEmail = displayUser?.email || "";
  const displayPic = profilePic
    ? URL.createObjectURL(profilePic)
    : displayUser?.profilePic || "";

  // Negara: prioritas selectedCountry (saat user pilih baru), lalu dari userData
  const displayCountry = selectedCountry?.name || userData?.country || "-";

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

  const isOwner = user?.role === "owner";

  const tabs = [
    {
      key: "account" as Tab,
      label: "⚙ Setting Account",
      active: "#16a34a",
      inactive: "#166534",
    },
    ...(isOwner
      ? [
          {
            key: "add-admin" as Tab,
            label: "+ Tambah Admin",
            active: "#9333ea",
            inactive: "#581c87",
          },
          {
            key: "make-admin" as Tab,
            label: "→ Jadikan Admin",
            active: "#2563eb",
            inactive: "#1e3a8a",
          },
        ]
      : []),
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
          gap: "16px",
          width: "100%",
          maxWidth: "900px",
          margin: "0 16px",
          maxHeight: "90vh",
        }}
      >
        {/* ── LEFT ──────────────────────────────────────────────────────── */}
        <div
          style={{
            background: "#161b2e",
            border: "1px solid #1e2744",
            borderRadius: "16px",
            padding: "24px",
            width: "420px",
            flexShrink: 0,
            overflowY: "auto",
            maxHeight: "90vh",
            position: "relative",
          }}
        >
          {/* Close */}
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

          {/* Avatar + name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid #1e2744",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #7c3aed",
                flexShrink: 0,
              }}
            >
              {displayPic ? (
                <img
                  src={displayPic}
                  alt="avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "18px",
                  }}
                >
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>
                {displayName}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                {displayEmail}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
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
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  border: `1.5px solid ${activeTab === t.key ? t.active : "#1e2744"}`,
                  background:
                    activeTab === t.key ? `${t.active}20` : "transparent",
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

          {/* ── FORM: Setting Account ── */}
          {activeTab === "account" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {/* Profile pic */}
              <div>
                <label style={labelCls}>Foto Profil</label>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #2d3748",
                      flexShrink: 0,
                    }}
                  >
                    {displayPic ? (
                      <img
                        src={displayPic}
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
                          background: "#7c3aed",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "16px",
                          fontWeight: 700,
                        }}
                      >
                        {displayName[0]}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-pic-upload"
                    style={{
                      padding: "8px 16px",
                      background: "#1e2744",
                      border: "1px solid #2d3748",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#94a3b8",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {profilePic ? profilePic.name : "Pilih Foto..."}
                  </label>
                  <input
                    id="profile-pic-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setProfilePic(e.target.files[0])
                    }
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Country picker */}
              <div style={{ position: "relative" }}>
                <label style={labelCls}>Negara</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    ...inputCls,
                  }}
                >
                  {selectedCountry && (
                    <span>{selectedCountry.unicodeFlag}</span>
                  )}
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => {
                      setCountrySearch(e.target.value);
                      setSelectedCountry(null);
                    }}
                    placeholder={
                      selectedCountry
                        ? selectedCountry.name
                        : userData?.country ||
                          displayUser?.country ||
                          "Cari negara..."
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: "13px",
                      color: "#fff",
                      width: "100%",
                    }}
                  />
                </div>
                {countrySearch && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "#1e2744",
                      border: "1px solid #2d3748",
                      borderRadius: "8px",
                      maxHeight: "180px",
                      overflowY: "auto",
                      zIndex: 9999,
                      marginTop: "4px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                  >
                    {filteredCountries.length === 0 ? (
                      <div
                        style={{
                          padding: "10px 12px",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        Tidak ditemukan
                      </div>
                    ) : (
                      filteredCountries.slice(0, 50).map((c) => (
                        <div
                          key={c.iso2}
                          onClick={() => {
                            handleCountryChange(c.iso2);
                            setCountrySearch("");
                          }}
                          style={{
                            padding: "8px 12px",
                            fontSize: "13px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#e2e8f0",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#2d3748")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <span>{c.unicodeFlag}</span>
                          <span>{c.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Street address */}
              {selectedCountry && (
                <div>
                  <label style={labelCls}>Jalan / Alamat Detail</label>
                  <input
                    style={inputCls}
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Jalan Raya No. 10, RT 01/RW 02"
                  />
                </div>
              )}

              {/* Indonesia dropdowns */}
              {isIndonesia && (
                <>
                  <div>
                    <label style={labelCls}>Provinsi</label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      style={{ ...inputCls, appearance: "none" as const }}
                    >
                      <option value="">Pilih provinsi...</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedProvince && (
                    <div>
                      <label style={labelCls}>Kabupaten / Kota</label>
                      <select
                        value={selectedRegency}
                        onChange={(e) => setSelectedRegency(e.target.value)}
                        style={{ ...inputCls, appearance: "none" as const }}
                      >
                        <option value="">Pilih kabupaten/kota...</option>
                        {regencies.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedRegency && (
                    <div>
                      <label style={labelCls}>Kecamatan</label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        style={{ ...inputCls, appearance: "none" as const }}
                      >
                        <option value="">Pilih kecamatan...</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedDistrict && (
                    <div>
                      <label style={labelCls}>Kelurahan / Desa</label>
                      <select
                        value={selectedVillage}
                        onChange={(e) => setSelectedVillage(e.target.value)}
                        style={{ ...inputCls, appearance: "none" as const }}
                      >
                        <option value="">Pilih kelurahan/desa...</option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Foreign city */}
              {selectedCountry && !isIndonesia && (
                <div>
                  <label style={labelCls}>Kota / State</label>
                  <input
                    style={inputCls}
                    type="text"
                    value={foreignAddress}
                    onChange={(e) => setForeignAddress(e.target.value)}
                    placeholder="Masukkan kota / state Anda"
                  />
                </div>
              )}

              {/* Phone */}
              <div>
                <label style={labelCls}>
                  Nomor HP <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputCls}
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelCls}>Password Baru</label>
                <input
                  style={inputCls}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak diubah"
                />
              </div>

              <button
                onClick={handleSaveAccount}
                disabled={isSaving}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#16a34a",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isSaving ? "not-allowed" : "pointer",
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          )}

          {/* ── FORM: Tambah Admin ── */}
          {activeTab === "add-admin" && (
            <form
              onSubmit={handleAddAdmin}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={labelCls}>Nama Lengkap</label>
                <input
                  style={inputCls}
                  type="text"
                  value={addForm.fullName}
                  onChange={(e) =>
                    setAddForm({ ...addForm, fullName: e.target.value })
                  }
                  placeholder="Budi Santoso"
                />
              </div>
              <div>
                <label style={labelCls}>Email</label>
                <input
                  style={inputCls}
                  type="email"
                  value={addForm.email}
                  onChange={(e) =>
                    setAddForm({ ...addForm, email: e.target.value })
                  }
                  placeholder="admin@saafragrance.com"
                />
              </div>
              <div>
                <label style={labelCls}>Password</label>
                <input
                  style={inputCls}
                  type="password"
                  value={addForm.password}
                  onChange={(e) =>
                    setAddForm({ ...addForm, password: e.target.value })
                  }
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#9333ea",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? "Memproses..." : "+ Daftarkan Admin"}
              </button>
            </form>
          )}

          {/* ── FORM: Jadikan Admin ── */}
          {activeTab === "make-admin" && (
            <form
              onSubmit={handleMakeAdmin}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label style={labelCls}>Email Pengguna Aktif</label>
                <input
                  style={inputCls}
                  type="email"
                  value={makeForm.email}
                  onChange={(e) =>
                    setMakeForm({ ...makeForm, email: e.target.value })
                  }
                  placeholder="email.user@gmail.com"
                />
              </div>
              <div>
                <label style={labelCls}>Durasi Admin</label>
                <select
                  value={makeForm.duration}
                  onChange={(e) =>
                    setMakeForm({ ...makeForm, duration: e.target.value })
                  }
                  style={{ ...inputCls, appearance: "none" as const }}
                >
                  <option value="7 hari">7 Hari</option>
                  <option value="30 hari">30 Hari</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "11px",
                  borderRadius: "8px",
                  background: "#2563eb",
                  border: "none",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? "Memproses..." : "→ Jadikan Admin"}
              </button>
            </form>
          )}
        </div>

        {/* ── GAP transparan ────────────────────────────────────────────── */}
        <div style={{ width: "16px", flexShrink: 0 }} />

        {/* ── RIGHT ─────────────────────────────────────────────────────── */}
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
          {/* ── Right: Biodata ── */}
          {activeTab === "account" && (
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
                Biodata Akun
              </div>
              {isFetchingUser ? (
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
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "0" }}
                >
                  {[
                    {
                      label: "Nama Lengkap",
                      value: displayUser?.fullName || displayUser?.name || "-",
                    },
                    { label: "Email", value: displayUser?.email || "-" },
                    {
                      label: "No. HP",
                      value: displayUser?.no_handphone || "-",
                    },
                    {
                      label: "Alamat",
                      value: getFullAddress() || displayUser?.address || "-",
                    },
                    {
                      label: "Negara",
                      value: displayCountry,
                    },
                    { label: "Role", value: displayUser?.role || "-" },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      style={{
                        paddingBottom: "14px",
                        marginBottom: "14px",
                        borderBottom: i < 5 ? "1px solid #1e2744" : "none",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginBottom: "5px",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#e2e8f0",
                          wordBreak: "break-word",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Right: Daftar Admin ── */}
          {(activeTab === "add-admin" || activeTab === "make-admin") && (
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
                Daftar Admin Aktif
              </div>
              {isFetchingAdmins ? (
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
              ) : admins.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Belum ada admin lain yang terdaftar.
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {admins.map((admin) => (
                    <div
                      key={admin.id}
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
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            flexShrink: 0,
                            border: "1.5px solid #7c3aed",
                          }}
                        >
                          {admin.profilePic ? (
                            <img
                              src={admin.profilePic}
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
                                background: "#7c3aed",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: 700,
                              }}
                            >
                              {(admin.fullName ||
                                admin.name ||
                                "A")[0].toUpperCase()}
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
                            {admin.fullName || admin.name}
                          </div>
                          <div style={{ fontSize: "11px", color: "#64748b" }}>
                            {admin.email}
                          </div>
                          {admin.role && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#7c3aed",
                                marginTop: "2px",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              {admin.role}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleDeleteAdmin(
                            admin.id,
                            admin.fullName || admin.name,
                          )
                        }
                        style={{
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: "transparent",
                          border: "1px solid #374151",
                          color: "#ef4444",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                        }}
                        title="Cabut akses admin"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="13"
                          height="13"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Hapus
                      </button>
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
