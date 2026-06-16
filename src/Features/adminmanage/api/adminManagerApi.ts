import apiClient from "../../../config/api"; // Sesuaikan jika path-nya berbeda

export const fetchAdminsApi = async () => {
  // UPDATE: Endpoint ke /users dengan query parameter standar Express
  const res = await apiClient.get("/users", {
    params: { role: "admin" },
  });
  // UPDATE: Mengambil data dari bungkus response Express
  return res.data.data;
};

export const registerAdminApi = async (payload: any) => {
  // UPDATE: Endpoint register pindah ke /auth/register
  const res = await apiClient.post("/auth/register", payload);
  return res.data;
};

export const findUserByEmailApi = async (email: string) => {
  // UPDATE: Endpoint pencarian menggunakan query parameter email
  const res = await apiClient.get("/users", {
    params: { email: email },
  });
  return res.data.data;
};

// UPDATE: Parameter objectId diubah menjadi id
export const updateUserRoleApi = async (id: string, payload: any) => {
  // UPDATE: Endpoint update ke /users/:id
  const res = await apiClient.put(`/users/${id}`, payload);
  return res.data.data;
};

// UPDATE: Parameter objectId diubah menjadi id
export const deleteUserApi = async (id: string) => {
  const res = await apiClient.put(`/users/${id}`, { role: "user" });
  return res.data;
};