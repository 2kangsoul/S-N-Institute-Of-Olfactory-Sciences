import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import type { BlogFormData, BlogItem } from "../types/blogManagerTypes";
import {
  fetchBlogsApi,
  deleteBlogApi,
  createBlogApi,
  updateBlogApi,
  generateBlogAIApi,
} from "../api/blogManagerApi";

import { useBlogAuth } from "./useBlogAuth";
import { useBlogPagination } from "./useBlogPagination";
import { useAuthStore } from "../../../stores/useAuthStore" // <-- TAMBAHAN: Import Auth Store

export const useBlogManager = (isOpen: boolean) => {
  const [activeTab, setActiveTab] = useState<"ai" | "manage">("ai");

  const { isAdminOrOwner } = useBlogAuth();
  const { user } = useAuthStore(); // <-- TAMBAHAN: Ambil data user yang sedang login

  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditingPending, setIsEditingPending] = useState(false);

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    category: "Niche",
    excerpt: "",
    author: user?.name || "", // <-- UBAH: Otomatis terisi nama user
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
    referenceLink: "",
    content: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    pendingPage,
    setPendingPage,
    publishedPage,
    setPublishedPage,
    currentPending,
    totalPendingPages,
    currentPublished,
    totalPublishedPages,
  } = useBlogPagination(blogs);

  const fetchBlogs = async () => {
    setIsLoadingBlogs(true);
    try {
      const fetchedData = await fetchBlogsApi();
      setBlogs(fetchedData);
    } catch (error) {
      console.error("Gagal menarik data:", error);
      toast.error("Gagal memuat data blog dari database.");
    } finally {
      setIsLoadingBlogs(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBlogs();
      setActiveTab("ai");
      // <-- TAMBAHAN: Memastikan nama terisi saat modal dibuka
      setFormData((prev) => ({ ...prev, author: user?.name || "" })); 
    }
  }, [isOpen, user]); // <-- TAMBAHAN: Tambahkan user ke dependency array

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (blog: BlogItem) => {
    setFormData({
      title: blog.title || "",
      category: blog.category || "Niche",
      excerpt: blog.excerpt || "",
      author: blog.author || user?.name || "", // <-- UBAH: Gunakan nama original blog, atau nama user jika kosong
      imageUrl: blog.imageUrl || "",
      imageUrl2: blog.imageUrl2 || "",
      imageUrl3: blog.imageUrl3 || "",
      referenceLink: "",
      content: blog.content || "",
    });
    // UPDATE: objectId diganti menjadi id
    setEditId(blog.id as string);
    setIsEditingPending(blog.approval === false || blog.approval == null);
    setActiveTab("ai");
  };

  // UPDATE: Parameter objectId diganti menjadi id
  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus/menolak artikel ini secara permanen?")) return;

    const loadingToast = toast.loading("Memproses...");
    try {
      // UPDATE: objectId diganti menjadi id
      await deleteBlogApi(id);
      toast.success("Artikel berhasil dihapus!", { id: loadingToast });
      setTimeout(() => {
        fetchBlogs();
        window.dispatchEvent(new Event("refreshBlogs"));
      }, 500);
    } catch (error) {
      console.error("Gagal menghapus:", error);
      toast.error("Gagal menghapus artikel.", { id: loadingToast });
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Judul dan Kategori wajib diisi sebagai acuan AI!");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("AI Llama 3.3 sedang meracik artikel...");

    try {
      const data = await generateBlogAIApi({
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        author: formData.author,
        referenceLink: formData.referenceLink,
      });

      setFormData((prev) => ({ ...prev, content: data.content }));
      toast.success("Artikel berhasil ditulis oleh AI!", { id: loadingToast });
    } catch (error: any) {
      console.error("AI Error:", error);
      toast.error("Gagal men-generate artikel.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Judul dan Konten tidak boleh kosong!");
      return;
    }

    // =========================================================
    // VALIDASI KONTEN: MENCEGAH PENYIMPANAN JIKA DITOLAK AI
    // Berpatokan langsung pada kalimat penolakan baku dari AI
    // =========================================================
    const lowerContent = formData.content.toLowerCase();
    
    // Menggunakan potongan kalimat pasti yang diberikan AI Anda
    const rejectedKeywords = [
      "mohon maaf, the scent journal secara eksklusif hanya menerbitkan kampanye dan artikel seputar dunia wewangian",
      "the scent journal secara eksklusif hanya menerbitkan" // Potongan cadangan agar lebih kebal
    ];

    const isRejectedByAI = rejectedKeywords.some(keyword => lowerContent.includes(keyword));

    if (isRejectedByAI) {
      toast.error("Gagal menyimpan: Topik ditolak karena The Scent Journal hanya membahas wewangian.", { duration: 5000 });
      return; // Langsung hentikan fungsi, tidak akan masuk database
    }
    // =========================================================

    setIsSaving(true);
    const loadingToast = toast.loading(
      editId ? "Memperbarui artikel..." : "Menyimpan ke database...",
    );

    try {
      const currentDate = new Date().toISOString(); // Menggunakan format ISO string untuk tanggal

      const payload: any = {
        title: formData.title,
        category: formData.category,
        excerpt: formData.excerpt,
        author: formData.author,
        imageUrl: formData.imageUrl,
        imageUrl2: formData.imageUrl2,
        imageUrl3: formData.imageUrl3,
        content: formData.content,
      };

      if (editId) {
        if (isEditingPending && isAdminOrOwner) {
          payload.approval = true;
          payload.publishDate = currentDate;
        }
        await updateBlogApi(editId, payload);
        toast.success(
          isEditingPending
            ? "Artikel berhasil di-Approve & Diterbitkan!"
            : "Artikel berhasil diperbarui!",
          { id: loadingToast },
        );
      } else {
        payload.approval = isAdminOrOwner ? true : false;
        payload.publishDate = currentDate;

        await createBlogApi(payload);
        toast.success(
          isAdminOrOwner
            ? "Artikel berhasil diterbitkan!"
            : "Artikel berhasil dikirim untuk review Admin!",
          { id: loadingToast },
        );
      }

      setFormData({
        title: "",
        category: "Niche",
        excerpt: "",
        author: user?.name || "", // <-- UBAH: Reset ke nama user lagi
        imageUrl: "",
        imageUrl2: "",
        imageUrl3: "",
        referenceLink: "",
        content: "",
      });
      setEditId(null);
      setIsEditingPending(false);

      setTimeout(() => {
        fetchBlogs();
        window.dispatchEvent(new Event("refreshBlogs"));
      }, 500);

      if (isAdminOrOwner) setActiveTab("manage");
    } catch (error: any) {
      console.error("Database Error Detail:", error.response?.data || error);
      const errorMsg = error.response?.data?.message || error.message || "Kesalahan jaringan/server";
      toast.error(`Gagal menyimpan: ${errorMsg}`, { id: loadingToast, duration: 6000 });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setIsEditingPending(false);
    setFormData({
      title: "",
      category: "Niche",
      excerpt: "",
      author: user?.name || "", // <-- UBAH: Reset ke nama user lagi
      imageUrl: "",
      imageUrl2: "",
      imageUrl3: "",
      referenceLink: "",
      content: "",
    });
  };

  return {
    activeTab,
    setActiveTab,
    pendingPage,
    setPendingPage,
    publishedPage,
    setPublishedPage,
    formData,
    handleChange,
    isGenerating,
    isSaving,
    handleGenerateAI,
    handleSaveBlog,
    handleEditClick,
    handleDeleteClick,
    handleCancelEdit,
    editId,
    isEditingPending,
    isAdminOrOwner,
    isLoadingBlogs,
    currentPending,
    totalPendingPages,
    currentPublished,
    totalPublishedPages,
  };
};