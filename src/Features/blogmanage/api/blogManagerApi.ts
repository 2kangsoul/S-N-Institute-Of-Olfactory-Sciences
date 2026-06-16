import apiClient from "../../../config/api"; // Sesuaikan path jika berbeda

export const fetchBlogsApi = async () => {
  // UPDATE: Endpoint diubah ke /blogs dan hapus sortBy bawaan Backendless
  const response = await apiClient.get("/blogs");
  // UPDATE: Mengambil data dari bungkus response Express (res.data.data)
  return response.data.data || response.data;
};

// UPDATE: Parameter objectId diubah menjadi id
export const deleteBlogApi = async (id: string) => {
  // UPDATE: Endpoint diubah ke /blogs/:id
  return await apiClient.delete(`/blogs/${id}`);
};

export const createBlogApi = async (payload: any) => {
  // UPDATE: Endpoint diubah ke /blogs
  return await apiClient.post("/blogs", payload);
};

// UPDATE: Parameter objectId diubah menjadi id
export const updateBlogApi = async (id: string, payload: any) => {
  // UPDATE: Endpoint diubah ke /blogs/:id
  return await apiClient.put(`/blogs/${id}`, payload);
};

export const generateBlogAIApi = async (payload: any) => {
  const response = await fetch("/api/generate-blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal menghubungi AI");
  }

  return data;
};