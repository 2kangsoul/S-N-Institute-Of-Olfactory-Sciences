// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Edit2,
  Sparkles,
  X,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0f1117",
  border: "0.5px solid #2d3748",
  borderRadius: "6px",
  padding: "8px 12px",
  fontSize: "13px",
  color: "#e2e8f0",
  outline: "none",
  boxSizing: "border-box",
};

const QUESTION_TYPES = [
  { value: "MULTIPLE_CHOICE", label: "Pilihan Ganda" },
  { value: "TRUE_FALSE", label: "Benar / Salah" },
  { value: "ESSAY", label: "Essay" },
];

// ── Helper: Extract text dari HTML ──────────────────────────────────────────
function extractTextFromHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  // Hapus script, style
  doc.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
  const title = doc.querySelector("title")?.textContent?.trim() || "";
  const body = doc.body?.innerText?.replace(/\s+/g, " ").trim() || "";
  return title ? `JUDUL: ${title}\n\n${body}` : body;
}

// ── Helper: Extract text dari PDF via AI ────────────────────────────────────
async function extractTextFromPDFViaAI(
  file: File,
  nineRouterUrl: string,
  nineRouterKey: string,
  model: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch(`${nineRouterUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${nineRouterKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Ekstrak semua teks dari dokumen PDF ini. Kembalikan HANYA teks kontennya saja, tanpa penjelasan tambahan.",
                  },
                  {
                    type: "image_url",
                    image_url: { url: `data:application/pdf;base64,${base64}` },
                  },
                ],
              },
            ],
            max_tokens: 8000,
            stream: false,
          }),
        });
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        resolve(text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim());
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ExamManager() {
  const { id: moduleId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeExam, setActiveExam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"soal" | "hasil">("soal");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    duration: "60",
    passingScore: "70",
    maxAttempts: "1",
    startAt: "",
    endAt: "",
    showResult: true,
  });
  const [showExamForm, setShowExamForm] = useState(false);
  const [savingExam, setSavingExam] = useState(false);
  const [examMsg, setExamMsg] = useState<any>(null);

  const [qForm, setQForm] = useState({
    text: "",
    type: "MULTIPLE_CHOICE",
    points: "10",
    explanation: "",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });
  const [savingQ, setSavingQ] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [editingQ, setEditingQ] = useState<any>(null);

  // AI Generate state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const convertInputRef = useRef<HTMLInputElement>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiConfig, setAIConfig] = useState({
    questionCount: "10",
    questionTypes: "MULTIPLE_CHOICE",
    difficulty: "MEDIUM",
    pointsPerQ: "10",
  });
  const [aiFile, setAIFile] = useState<File | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiPreview, setAIPreview] = useState<any[]>([]);
  const [savingAI, setSavingAI] = useState(false);
  const [aiMsg, setAIMsg] = useState<any>(null);
  const [selectedAIQ, setSelectedAIQ] = useState<Set<number>>(new Set());

  // ── Convert ke TXT state ─────────────────────────────────────────────────
  const [convertFile, setConvertFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertedTxt, setConvertedTxt] = useState<string>("");
  const [convertMsg, setConvertMsg] = useState<any>(null);
  const [showConvertPanel, setShowConvertPanel] = useState(false);

  const NINE_ROUTER_URL =
    import.meta.env.VITE_NINE_ROUTER_URL || "http://localhost:20128/v1";
  const NINE_ROUTER_KEY = import.meta.env.VITE_NINE_ROUTER_KEY || "";
  const NINE_ROUTER_MODEL =
    import.meta.env.VITE_NINE_ROUTER_MODEL_EXAM || "kr/claude-sonnet-4.5";

  useEffect(() => {
    if (!moduleId) return;
    const load = async () => {
      try {
        const [modRes, examRes] = await Promise.all([
          apiClient.get(`/modules/${moduleId}`),
          apiClient.get(`/modules/${moduleId}/exams`),
        ]);
        setModule(modRes.data?.data);
        setExams(examRes.data?.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [moduleId]);

  const loadExam = async (examId: string) => {
    const res = await apiClient.get(`/exams/${examId}`);
    setActiveExam(res.data?.data);
  };

  const loadSubmissions = async (examId: string) => {
    const res = await apiClient.get(`/exams/${examId}/submissions`);
    setSubmissions(res.data?.data || []);
  };

  const handleSaveExam = async () => {
    if (!examForm.title) {
      setExamMsg({ type: "err", text: "Judul wajib diisi" });
      return;
    }
    setSavingExam(true);
    setExamMsg(null);
    try {
      const payload = {
        title: examForm.title,
        description: examForm.description || null,
        duration: Number(examForm.duration),
        passingScore: Number(examForm.passingScore),
        maxAttempts: Number(examForm.maxAttempts),
        startAt: examForm.startAt
          ? new Date(examForm.startAt).toISOString()
          : null,
        endAt: examForm.endAt ? new Date(examForm.endAt).toISOString() : null,
        showResult: examForm.showResult,
      };
      const res = await apiClient.post(`/modules/${moduleId}/exams`, payload);
      const newExam = res.data?.data;
      setExams((prev) => [...prev, newExam]);
      setExamMsg({ type: "ok", text: "Ujian berhasil dibuat!" });
      setShowExamForm(false);
      setExamForm({
        title: "",
        description: "",
        duration: "60",
        passingScore: "70",
        maxAttempts: "1",
        startAt: "",
        endAt: "",
        showResult: true,
      });
      await loadExam(newExam.id);
    } catch (e: any) {
      setExamMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal membuat ujian.",
      });
    } finally {
      setSavingExam(false);
    }
  };

  const handleToggleStatus = async (examId: string, currentStatus: string) => {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await apiClient.put(`/exams/${examId}`, { status: newStatus });
      setExams((prev) =>
        prev.map((e) => (e.id === examId ? { ...e, status: newStatus } : e)),
      );
      if (activeExam?.id === examId)
        setActiveExam((prev: any) => ({ ...prev, status: newStatus }));
    } catch (e: any) {
      alert(e.response?.data?.message || "Gagal update status");
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm("Hapus ujian ini?")) return;
    try {
      await apiClient.delete(`/exams/${examId}`);
      setExams((prev) => prev.filter((e) => e.id !== examId));
      if (activeExam?.id === examId) setActiveExam(null);
    } catch {
      alert("Gagal hapus ujian");
    }
  };

  const resetQForm = () => {
    setQForm({
      text: "",
      type: "MULTIPLE_CHOICE",
      points: "10",
      explanation: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
    setEditingQ(null);
    setShowQForm(false);
  };

  const handleSaveQuestion = async () => {
    if (!qForm.text) {
      alert("Soal wajib diisi");
      return;
    }
    if (qForm.type !== "ESSAY" && !qForm.options.some((o) => o.isCorrect)) {
      alert("Pilih minimal 1 jawaban yang benar");
      return;
    }
    setSavingQ(true);
    try {
      const payload = {
        text: qForm.text,
        type: qForm.type,
        points: Number(qForm.points),
        explanation: qForm.explanation || null,
        options:
          qForm.type !== "ESSAY" ? qForm.options.filter((o) => o.text) : [],
      };
      if (editingQ) {
        await apiClient.put(`/questions/${editingQ.id}`, payload);
      } else {
        await apiClient.post(`/exams/${activeExam.id}/questions`, payload);
      }
      await loadExam(activeExam.id);
      resetQForm();
    } catch (e: any) {
      alert(e.response?.data?.message || "Gagal simpan soal");
    } finally {
      setSavingQ(false);
    }
  };

  const handleEditQuestion = (q: any) => {
    setQForm({
      text: q.text,
      type: q.type,
      points: String(q.points),
      explanation: q.explanation || "",
      options: q.options?.length
        ? q.options
        : [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
    });
    setEditingQ(q);
    setShowQForm(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Hapus soal ini?")) return;
    try {
      await apiClient.delete(`/questions/${questionId}`);
      await loadExam(activeExam.id);
    } catch {
      alert("Gagal hapus soal");
    }
  };

  const updateOption = (idx: number, field: string, value: any) => {
    setQForm((prev) => {
      const opts = [...prev.options];
      if (field === "isCorrect" && qForm.type !== "ESSAY") {
        opts.forEach((o, i) => (o.isCorrect = i === idx ? value : false));
      } else {
        opts[idx] = { ...opts[idx], [field]: value };
      }
      return { ...prev, options: opts };
    });
  };

  // ── Convert HTML/PDF ke TXT via AI ────────────────────────────────────────
  const handleConvert = async () => {
    if (!convertFile) {
      setConvertMsg({ type: "err", text: "Pilih file HTML atau PDF dulu" });
      return;
    }
    setConverting(true);
    setConvertMsg(null);
    setConvertedTxt("");

    try {
      let extractedText = "";

      if (convertFile.name.toLowerCase().endsWith(".pdf")) {
        // PDF → AI extract via vision
        setConvertMsg({ type: "info", text: "AI sedang membaca PDF..." });
        extractedText = await extractTextFromPDFViaAI(
          convertFile,
          NINE_ROUTER_URL,
          NINE_ROUTER_KEY,
          NINE_ROUTER_MODEL,
        );
      } else {
        // HTML → extract di browser
        const html = await convertFile.text();
        extractedText = extractTextFromHTML(html);

        // Kalau terlalu pendek (SPA), pakai AI untuk ekstrak
        if (extractedText.length < 200) {
          setConvertMsg({
            type: "info",
            text: "Konten HTML minimal, AI membantu ekstrak...",
          });
          const res = await fetch(`${NINE_ROUTER_URL}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${NINE_ROUTER_KEY}`,
            },
            body: JSON.stringify({
              model: NINE_ROUTER_MODEL,
              messages: [
                {
                  role: "user",
                  content: `Dari HTML berikut, ekstrak SEMUA teks konten materi pembelajaran yang bermakna. Abaikan kode CSS/JS. Kembalikan hanya teks materi:\n\n${html.slice(0, 15000)}`,
                },
              ],
              max_tokens: 8000,
              stream: false,
            }),
          });
          const data = await res.json();
          extractedText = data.choices?.[0]?.message?.content || "";
          extractedText = extractedText
            .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
            .trim();
        }
      }

      if (!extractedText || extractedText.length < 50) {
        setConvertMsg({
          type: "err",
          text: "Tidak bisa mengekstrak konten dari file ini.",
        });
        return;
      }

      setConvertedTxt(extractedText);
      setConvertMsg({
        type: "ok",
        text: `Berhasil! ${extractedText.length} karakter diekstrak. Klik "Download TXT" untuk menyimpan.`,
      });
    } catch (e: any) {
      setConvertMsg({ type: "err", text: "Gagal convert. Coba lagi." });
    } finally {
      setConverting(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!convertedTxt) return;
    const fileName =
      convertFile?.name.replace(/\.(html|htm|pdf)$/i, "") || "materi";
    const blob = new Blob([convertedTxt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}_materi.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUseTxtAsInput = () => {
    if (!convertedTxt || !convertFile) return;
    const fileName =
      convertFile.name.replace(/\.(html|htm|pdf)$/i, "") + "_materi.txt";
    const blob = new Blob([convertedTxt], { type: "text/plain" });
    const file = new File([blob], fileName, { type: "text/plain" });
    setAIFile(file);
    setShowConvertPanel(false);
    setConvertMsg(null);
    setAIMsg({
      type: "ok",
      text: `File "${fileName}" siap digunakan untuk generate soal!`,
    });
  };

  const handleGenerateAI = async () => {
    if (!aiFile) {
      setAIMsg({
        type: "err",
        text: "Upload file materi dulu (.html atau .txt)",
      });
      return;
    }
    if (!activeExam) {
      setAIMsg({ type: "err", text: "Pilih ujian dulu" });
      return;
    }
    setGeneratingAI(true);
    setAIMsg(null);
    setAIPreview([]);
    try {
      const fd = new FormData();
      fd.append("material", aiFile);
      fd.append("questionCount", aiConfig.questionCount);
      fd.append("questionTypes", aiConfig.questionTypes);
      fd.append("difficulty", aiConfig.difficulty);
      fd.append("pointsPerQ", aiConfig.pointsPerQ);
      const res = await apiClient.post(
        `/exams/${activeExam.id}/generate-ai`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 180000,
        },
      );
      const questions = res.data?.data?.questions || [];
      setAIPreview(questions);
      setSelectedAIQ(new Set(questions.map((_: any, i: number) => i)));
      setAIMsg({
        type: "ok",
        text: `${questions.length} soal berhasil di-generate!`,
      });
    } catch (e: any) {
      setAIMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal generate soal. Coba lagi.",
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSaveAIQuestions = async () => {
    const selectedQuestions = aiPreview.filter((_, i) => selectedAIQ.has(i));
    if (!selectedQuestions.length) {
      setAIMsg({ type: "err", text: "Pilih minimal 1 soal" });
      return;
    }
    setSavingAI(true);
    try {
      await apiClient.post(`/exams/${activeExam.id}/save-ai-questions`, {
        questions: selectedQuestions,
      });
      await loadExam(activeExam.id);
      setShowAIModal(false);
      setAIPreview([]);
      setAIFile(null);
      setSelectedAIQ(new Set());
      setAIMsg(null);
    } catch (e: any) {
      setAIMsg({
        type: "err",
        text: e.response?.data?.message || "Gagal simpan soal",
      });
    } finally {
      setSavingAI(false);
    }
  };

  const toggleSelectAIQ = (idx: number) => {
    setSelectedAIQ((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
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

  const statusColor = (s: string) =>
    s === "PUBLISHED" ? "#10b981" : s === "CLOSED" ? "#ef4444" : "#64748b";
  const statusLabel = (s: string) =>
    s === "PUBLISHED" ? "Aktif" : s === "CLOSED" ? "Ditutup" : "Draft";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/lecture/modules/${moduleId}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: "12px",
            cursor: "pointer",
            marginBottom: "12px",
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> Kembali ke Modul
        </button>
        <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
          📝 Manajemen Ujian
        </h1>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
          {module?.title}
        </p>
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
        {/* LEFT */}
        <div
          style={{
            width: "280px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            onClick={() => setShowExamForm(!showExamForm)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#7c3aed",
              border: "none",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
            }}
          >
            <Plus size={14} /> Buat Ujian Baru
          </button>

          {showExamForm && (
            <div
              style={{
                background: "#161b2e",
                border: "0.5px solid #1e2744",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "4px",
                }}
              >
                Buat Ujian Baru
              </div>
              <div>
                <label
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Judul Ujian *
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="cth: Ujian Akhir Modul 1"
                  value={examForm.title}
                  onChange={(e) =>
                    setExamForm({ ...examForm, title: e.target.value })
                  }
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Durasi (menit)
                  </label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={examForm.duration}
                    onChange={(e) =>
                      setExamForm({ ...examForm, duration: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Nilai Lulus
                  </label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={examForm.passingScore}
                    onChange={(e) =>
                      setExamForm({ ...examForm, passingScore: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Max Percobaan
                </label>
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  value={examForm.maxAttempts}
                  onChange={(e) =>
                    setExamForm({ ...examForm, maxAttempts: e.target.value })
                  }
                />
              </div>
              {examMsg && (
                <div
                  style={{
                    fontSize: "11px",
                    color: examMsg.type === "ok" ? "#10b981" : "#ef4444",
                  }}
                >
                  {examMsg.text}
                </div>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleSaveExam}
                  disabled={savingExam}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    background: "#7c3aed",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    opacity: savingExam ? 0.6 : 1,
                  }}
                >
                  {savingExam ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  onClick={() => setShowExamForm(false)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    background: "transparent",
                    border: "0.5px solid #374151",
                    color: "#64748b",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={async () => {
                await loadExam(exam.id);
                setActiveTab("soal");
              }}
              style={{
                padding: "12px",
                background:
                  activeExam?.id === exam.id
                    ? "rgba(124,58,237,0.15)"
                    : "#161b2e",
                border: `0.5px solid ${activeExam?.id === exam.id ? "#7c3aed" : "#1e2744"}`,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}
                >
                  {exam.title}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    color: statusColor(exam.status),
                    background: `${statusColor(exam.status)}18`,
                  }}
                >
                  {statusLabel(exam.status)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                <span>📝 {exam._count?.questions || 0} soal</span>
                <span>👥 {exam._count?.submissions || 0} submission</span>
              </div>
            </div>
          ))}

          {exams.length === 0 && !showExamForm && (
            <div
              style={{
                textAlign: "center",
                padding: "24px",
                color: "#64748b",
                fontSize: "12px",
              }}
            >
              Belum ada ujian
            </div>
          )}
        </div>

        {/* RIGHT */}
        {activeExam ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "#161b2e",
                border: "0.5px solid #1e2744",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#fff",
                      marginBottom: "4px",
                    }}
                  >
                    {activeExam.title}
                  </h2>
                  {activeExam.description && (
                    <p style={{ fontSize: "12px", color: "#64748b" }}>
                      {activeExam.description}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() =>
                      handleToggleStatus(activeExam.id, activeExam.status)
                    }
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      background:
                        activeExam.status === "PUBLISHED"
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(16,185,129,0.15)",
                      color:
                        activeExam.status === "PUBLISHED"
                          ? "#ef4444"
                          : "#10b981",
                    }}
                  >
                    {activeExam.status === "PUBLISHED"
                      ? "Tutup Ujian"
                      : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDeleteExam(activeExam.id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "0.5px solid #374151",
                      background: "transparent",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "12px",
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  {
                    icon: <Clock size={12} />,
                    label: "Durasi",
                    value: `${activeExam.duration} menit`,
                  },
                  {
                    icon: <Award size={12} />,
                    label: "Nilai Lulus",
                    value: `${activeExam.passingScore}`,
                  },
                  {
                    icon: <Users size={12} />,
                    label: "Max Attempt",
                    value: `${activeExam.maxAttempts}x`,
                  },
                  {
                    icon: <CheckCircle size={12} />,
                    label: "Total Soal",
                    value: `${activeExam.questions?.length || 0}`,
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#0f1117",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      border: "0.5px solid #1e2744",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span style={{ color: "#64748b" }}>{s.icon}</span>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      {s.label}:
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#e2e8f0",
                      }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              {[
                {
                  key: "soal",
                  label: `📝 Daftar Soal (${activeExam.questions?.length || 0})`,
                },
                {
                  key: "hasil",
                  label: `📊 Hasil Ujian (${submissions.length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={async () => {
                    setActiveTab(tab.key as any);
                    if (tab.key === "hasil")
                      await loadSubmissions(activeExam.id);
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1.5px solid ${activeTab === tab.key ? "#7c3aed" : "#1e2744"}`,
                    background:
                      activeTab === tab.key
                        ? "rgba(124,58,237,0.15)"
                        : "transparent",
                    color: activeTab === tab.key ? "#a78bfa" : "#64748b",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "soal" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      resetQForm();
                      setShowQForm(true);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 14px",
                      borderRadius: "8px",
                      background: "rgba(16,185,129,0.15)",
                      border: "0.5px solid rgba(16,185,129,0.3)",
                      color: "#10b981",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={13} /> Tambah Soal
                  </button>
                  <button
                    onClick={() => {
                      setShowAIModal(true);
                      setAIMsg(null);
                      setAIPreview([]);
                      setAIFile(null);
                      setShowConvertPanel(false);
                      setConvertedTxt("");
                      setConvertFile(null);
                      setConvertMsg(null);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "9px 14px",
                      borderRadius: "8px",
                      background: "rgba(124,58,237,0.15)",
                      border: "0.5px solid rgba(124,58,237,0.3)",
                      color: "#a78bfa",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Sparkles size={13} /> Generate AI
                  </button>
                </div>

                {showQForm && (
                  <div
                    style={{
                      background: "#161b2e",
                      border: "0.5px solid #1e2744",
                      borderRadius: "10px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      {editingQ ? "Edit Soal" : "Tambah Soal Baru"}
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Tipe Soal
                      </label>
                      <select
                        value={qForm.type}
                        onChange={(e) =>
                          setQForm({ ...qForm, type: e.target.value })
                        }
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        {QUESTION_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      >
                        Teks Soal *
                      </label>
                      <textarea
                        value={qForm.text}
                        onChange={(e) =>
                          setQForm({ ...qForm, text: e.target.value })
                        }
                        placeholder="Tulis soal di sini..."
                        rows={3}
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          fontFamily: "inherit",
                          lineHeight: 1.6,
                        }}
                      />
                    </div>
                    {qForm.type !== "ESSAY" && (
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          Pilihan Jawaban{" "}
                          <span style={{ color: "#64748b" }}>
                            (centang jawaban yang benar)
                          </span>
                        </label>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {(qForm.type === "TRUE_FALSE"
                            ? [
                                {
                                  text: "Benar",
                                  isCorrect:
                                    qForm.options[0]?.isCorrect || false,
                                },
                                {
                                  text: "Salah",
                                  isCorrect:
                                    qForm.options[1]?.isCorrect || false,
                                },
                              ]
                            : qForm.options
                          ).map((opt, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <input
                                type="radio"
                                name="correct"
                                checked={opt.isCorrect}
                                onChange={() =>
                                  updateOption(idx, "isCorrect", true)
                                }
                                style={{
                                  accentColor: "#10b981",
                                  flexShrink: 0,
                                }}
                              />
                              {qForm.type === "TRUE_FALSE" ? (
                                <span
                                  style={{ fontSize: "13px", color: "#e2e8f0" }}
                                >
                                  {opt.text}
                                </span>
                              ) : (
                                <input
                                  style={{ ...inputStyle, flex: 1 }}
                                  type="text"
                                  placeholder={`Pilihan ${String.fromCharCode(65 + idx)}`}
                                  value={opt.text}
                                  onChange={(e) =>
                                    updateOption(idx, "text", e.target.value)
                                  }
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            display: "block",
                            marginBottom: "5px",
                          }}
                        >
                          Poin
                        </label>
                        <input
                          style={inputStyle}
                          type="number"
                          min="1"
                          value={qForm.points}
                          onChange={(e) =>
                            setQForm({ ...qForm, points: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                            display: "block",
                            marginBottom: "5px",
                          }}
                        >
                          Penjelasan (opsional)
                        </label>
                        <input
                          style={inputStyle}
                          type="text"
                          placeholder="Jelaskan jawaban benar..."
                          value={qForm.explanation}
                          onChange={(e) =>
                            setQForm({ ...qForm, explanation: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={handleSaveQuestion}
                        disabled={savingQ}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          background: "#7c3aed",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          opacity: savingQ ? 0.6 : 1,
                        }}
                      >
                        {savingQ
                          ? "Menyimpan..."
                          : editingQ
                            ? "Update Soal"
                            : "Simpan Soal"}
                      </button>
                      <button
                        onClick={resetQForm}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          background: "transparent",
                          border: "0.5px solid #374151",
                          color: "#64748b",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}

                {activeExam.questions?.length === 0 ? (
                  <div
                    style={{
                      background: "#161b2e",
                      border: "0.5px solid #1e2744",
                      borderRadius: "10px",
                      padding: "40px",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Belum ada soal. Klik "Tambah Soal" untuk mulai.
                  </div>
                ) : (
                  activeExam.questions?.map((q: any, idx: number) => (
                    <div
                      key={q.id}
                      style={{
                        background: "#161b2e",
                        border: "0.5px solid #1e2744",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 16px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setExpandedQ(expandedQ === q.id ? null : q.id)
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: "rgba(124,58,237,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#a78bfa",
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#e2e8f0",
                                lineHeight: 1.4,
                              }}
                            >
                              {q.text.length > 80
                                ? q.text.slice(0, 80) + "..."
                                : q.text}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                marginTop: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  color: "#64748b",
                                  background: "#0f1117",
                                  padding: "1px 6px",
                                  borderRadius: "3px",
                                }}
                              >
                                {
                                  QUESTION_TYPES.find((t) => t.value === q.type)
                                    ?.label
                                }
                              </span>
                              <span
                                style={{ fontSize: "10px", color: "#a78bfa" }}
                              >
                                {q.points} poin
                              </span>
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
                              handleEditQuestion(q);
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              background: "rgba(124,58,237,0.15)",
                              border: "none",
                              color: "#a78bfa",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(q.id);
                            }}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              background: "rgba(239,68,68,0.1)",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                          >
                            <Trash2 size={11} />
                          </button>
                          {expandedQ === q.id ? (
                            <ChevronUp size={14} color="#64748b" />
                          ) : (
                            <ChevronDown size={14} color="#64748b" />
                          )}
                        </div>
                      </div>
                      {expandedQ === q.id && (
                        <div
                          style={{
                            padding: "0 16px 16px",
                            borderTop: "0.5px solid #1e2744",
                          }}
                        >
                          <div
                            style={{
                              paddingTop: "12px",
                              fontSize: "13px",
                              color: "#e2e8f0",
                              marginBottom: "10px",
                            }}
                          >
                            {q.text}
                          </div>
                          {q.options?.length > 0 && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "6px",
                              }}
                            >
                              {q.options.map((opt: any, i: number) => (
                                <div
                                  key={opt.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "7px 10px",
                                    borderRadius: "6px",
                                    background: opt.isCorrect
                                      ? "rgba(16,185,129,0.08)"
                                      : "#0f1117",
                                    border: `0.5px solid ${opt.isCorrect ? "rgba(16,185,129,0.3)" : "#1e2744"}`,
                                  }}
                                >
                                  {opt.isCorrect ? (
                                    <CheckCircle size={13} color="#10b981" />
                                  ) : (
                                    <XCircle size={13} color="#374151" />
                                  )}
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      color: opt.isCorrect
                                        ? "#10b981"
                                        : "#94a3b8",
                                    }}
                                  >
                                    {String.fromCharCode(65 + i)}. {opt.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                          {q.explanation && (
                            <div
                              style={{
                                marginTop: "10px",
                                padding: "8px 12px",
                                background: "rgba(245,158,11,0.06)",
                                border: "0.5px solid rgba(245,158,11,0.2)",
                                borderRadius: "6px",
                                fontSize: "11px",
                                color: "#f59e0b",
                              }}
                            >
                              💡 {q.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "hasil" && (
              <div
                style={{
                  background: "#161b2e",
                  border: "0.5px solid #1e2744",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                {submissions.length === 0 ? (
                  <div
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    Belum ada murid yang mengerjakan ujian ini.
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {[
                          "Murid",
                          "Attempt",
                          "Nilai",
                          "Status",
                          "Waktu Submit",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              fontSize: "10px",
                              color: "#64748b",
                              textAlign: "left",
                              padding: "10px 14px",
                              borderBottom: "0.5px solid #1e2744",
                              fontWeight: 400,
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub: any) => (
                        <tr key={sub.id}>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "0.5px solid #1a2035",
                              fontSize: "13px",
                              color: "#fff",
                              fontWeight: 500,
                            }}
                          >
                            {sub.enrollment?.student?.user?.fullName || "-"}
                            <div style={{ fontSize: "11px", color: "#64748b" }}>
                              {sub.enrollment?.student?.user?.email}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "0.5px solid #1a2035",
                              fontSize: "12px",
                              color: "#64748b",
                            }}
                          >
                            #{sub.attemptNo}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "0.5px solid #1a2035",
                            }}
                          >
                            {sub.score !== null ? (
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: sub.isPassed ? "#10b981" : "#ef4444",
                                }}
                              >
                                {sub.score}
                              </span>
                            ) : (
                              <span
                                style={{ fontSize: "11px", color: "#f59e0b" }}
                              >
                                Belum dinilai
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "0.5px solid #1a2035",
                            }}
                          >
                            {sub.submittedAt ? (
                              <span
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  color: sub.isPassed
                                    ? "#10b981"
                                    : sub.isPassed === false
                                      ? "#ef4444"
                                      : "#f59e0b",
                                  background: sub.isPassed
                                    ? "rgba(16,185,129,0.1)"
                                    : sub.isPassed === false
                                      ? "rgba(239,68,68,0.1)"
                                      : "rgba(245,158,11,0.1)",
                                }}
                              >
                                {sub.isPassed === true
                                  ? "✅ Lulus"
                                  : sub.isPassed === false
                                    ? "❌ Tidak Lulus"
                                    : "⏳ Menunggu"}
                              </span>
                            ) : (
                              <span
                                style={{ fontSize: "10px", color: "#64748b" }}
                              >
                                Belum submit
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "10px 14px",
                              borderBottom: "0.5px solid #1a2035",
                              fontSize: "11px",
                              color: "#64748b",
                            }}
                          >
                            {sub.submittedAt
                              ? new Date(sub.submittedAt).toLocaleString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#161b2e",
              border: "0.5px solid #1e2744",
              borderRadius: "10px",
              minHeight: "300px",
            }}
          >
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>📝</div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "6px",
                }}
              >
                Pilih atau buat ujian
              </div>
              <div style={{ fontSize: "12px" }}>
                Klik ujian di kiri atau buat ujian baru
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── AI Generate Modal ── */}
      {showAIModal && (
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
              background: "#161b2e",
              border: "0.5px solid #1e2744",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "920px",
              margin: "0 16px",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "0.5px solid #1e2744",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Sparkles size={16} color="#a78bfa" /> Generate Soal dengan AI
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "2px",
                  }}
                >
                  Upload materi (.html atau .txt) → AI generate soal otomatis
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAIModal(false);
                  setAIPreview([]);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Left: Config */}
              <div
                style={{
                  width: "320px",
                  flexShrink: 0,
                  padding: "20px",
                  borderRight: "0.5px solid #1e2744",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* ── CONVERT KE TXT ── */}
                <div
                  style={{
                    background: "rgba(245,158,11,0.06)",
                    border: "0.5px solid rgba(245,158,11,0.2)",
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <button
                    onClick={() => setShowConvertPanel(!showConvertPanel)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <RefreshCw size={14} color="#f59e0b" />
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#f59e0b",
                        }}
                      >
                        Convert HTML/PDF → TXT
                      </span>
                    </div>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      {showConvertPanel ? "▲" : "▼"}
                    </span>
                  </button>

                  {showConvertPanel && (
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                        Upload file HTML atau PDF — AI akan mengekstrak konten
                        menjadi file .txt yang siap digunakan untuk generate
                        soal.
                      </div>

                      {/* Upload convert file */}
                      <div
                        onClick={() => convertInputRef.current?.click()}
                        style={{
                          padding: "12px",
                          border: `1.5px dashed ${convertFile ? "#f59e0b" : "#374151"}`,
                          borderRadius: "8px",
                          textAlign: "center",
                          cursor: "pointer",
                          background: convertFile
                            ? "rgba(245,158,11,0.06)"
                            : "#0f1117",
                        }}
                      >
                        {convertFile ? (
                          <div>
                            <div
                              style={{ fontSize: "16px", marginBottom: "4px" }}
                            >
                              📄
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#f59e0b",
                                fontWeight: 600,
                              }}
                            >
                              {convertFile.name}
                            </div>
                            <div style={{ fontSize: "10px", color: "#64748b" }}>
                              {(convertFile.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div
                              style={{ fontSize: "20px", marginBottom: "4px" }}
                            >
                              📁
                            </div>
                            <div style={{ fontSize: "11px", color: "#64748b" }}>
                              Klik untuk upload .html atau .pdf
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={convertInputRef}
                        type="file"
                        accept=".html,.htm,.pdf"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setConvertFile(e.target.files[0]);
                            setConvertedTxt("");
                            setConvertMsg(null);
                          }
                          e.target.value = "";
                        }}
                      />

                      {convertMsg && (
                        <div
                          style={{
                            fontSize: "11px",
                            color:
                              convertMsg.type === "ok"
                                ? "#10b981"
                                : convertMsg.type === "info"
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        >
                          {convertMsg.text}
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={handleConvert}
                          disabled={converting || !convertFile}
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            padding: "8px",
                            borderRadius: "6px",
                            background: "#f59e0b",
                            border: "none",
                            color: "#000",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor:
                              converting || !convertFile
                                ? "not-allowed"
                                : "pointer",
                            opacity: converting || !convertFile ? 0.6 : 1,
                          }}
                        >
                          {converting ? (
                            <>
                              <div
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  border: "2px solid rgba(0,0,0,0.3)",
                                  borderTop: "2px solid #000",
                                  borderRadius: "50%",
                                  animation: "spin 0.8s linear infinite",
                                }}
                              />{" "}
                              Mengekstrak...
                            </>
                          ) : (
                            <>
                              <RefreshCw size={12} /> Convert
                            </>
                          )}
                        </button>

                        {convertedTxt && (
                          <>
                            <button
                              onClick={handleDownloadTxt}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "8px 10px",
                                borderRadius: "6px",
                                background: "rgba(16,185,129,0.15)",
                                border: "0.5px solid rgba(16,185,129,0.3)",
                                color: "#10b981",
                                fontSize: "11px",
                                cursor: "pointer",
                              }}
                            >
                              <Download size={11} /> Download
                            </button>
                            <button
                              onClick={handleUseTxtAsInput}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                padding: "8px 10px",
                                borderRadius: "6px",
                                background: "rgba(124,58,237,0.15)",
                                border: "0.5px solid rgba(124,58,237,0.3)",
                                color: "#a78bfa",
                                fontSize: "11px",
                                cursor: "pointer",
                              }}
                            >
                              <Sparkles size={11} /> Pakai
                            </button>
                          </>
                        )}
                      </div>

                      {convertedTxt && (
                        <div
                          style={{
                            background: "#0f1117",
                            borderRadius: "6px",
                            padding: "8px",
                            border: "0.5px solid #1e2744",
                            maxHeight: "80px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#64748b",
                              marginBottom: "4px",
                            }}
                          >
                            Preview ({convertedTxt.length} karakter):
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              lineHeight: 1.4,
                            }}
                          >
                            {convertedTxt.slice(0, 150)}...
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Upload file generate */}
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    File Materi (.html atau .txt) *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: "20px",
                      border: `1.5px dashed ${aiFile ? "#7c3aed" : "#2d3748"}`,
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      background: aiFile ? "rgba(124,58,237,0.08)" : "#0f1117",
                      transition: "all 0.2s",
                    }}
                  >
                    {aiFile ? (
                      <div>
                        <div style={{ fontSize: "20px", marginBottom: "6px" }}>
                          📄
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#a78bfa",
                            fontWeight: 600,
                          }}
                        >
                          {aiFile.name}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#64748b",
                            marginTop: "2px",
                          }}
                        >
                          {(aiFile.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "24px", marginBottom: "6px" }}>
                          📁
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          Klik untuk upload file .html atau .txt
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm,.txt"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setAIFile(e.target.files[0]);
                        setAIPreview([]);
                      }
                      e.target.value = "";
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Jumlah Soal
                  </label>
                  <select
                    value={aiConfig.questionCount}
                    onChange={(e) =>
                      setAIConfig({
                        ...aiConfig,
                        questionCount: e.target.value,
                      })
                    }
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    {["5", "10", "15", "20", "25"].map((n) => (
                      <option key={n} value={n}>
                        {n} soal
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Tipe Soal
                  </label>
                  <select
                    value={aiConfig.questionTypes}
                    onChange={(e) =>
                      setAIConfig({
                        ...aiConfig,
                        questionTypes: e.target.value,
                      })
                    }
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="MULTIPLE_CHOICE">Pilihan Ganda</option>
                    <option value="TRUE_FALSE">Benar / Salah</option>
                    <option value="ESSAY">Essay</option>
                    <option value="MULTIPLE_CHOICE,TRUE_FALSE">
                      Campuran PG + B/S
                    </option>
                    <option value="MULTIPLE_CHOICE,ESSAY">
                      Campuran PG + Essay
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={aiConfig.difficulty}
                    onChange={(e) =>
                      setAIConfig({ ...aiConfig, difficulty: e.target.value })
                    }
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="EASY">Mudah</option>
                    <option value="MEDIUM">Sedang</option>
                    <option value="HARD">Sulit</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "#94a3b8",
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    Poin per Soal
                  </label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="1"
                    value={aiConfig.pointsPerQ}
                    onChange={(e) =>
                      setAIConfig({ ...aiConfig, pointsPerQ: e.target.value })
                    }
                  />
                </div>

                {aiMsg && (
                  <div
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      background:
                        aiMsg.type === "ok"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(239,68,68,0.1)",
                      color: aiMsg.type === "ok" ? "#10b981" : "#ef4444",
                      border: `0.5px solid ${aiMsg.type === "ok" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                    }}
                  >
                    {aiMsg.text}
                  </div>
                )}

                <button
                  onClick={handleGenerateAI}
                  disabled={generatingAI || !aiFile}
                  style={{
                    padding: "11px",
                    borderRadius: "8px",
                    background: "#7c3aed",
                    border: "none",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: generatingAI || !aiFile ? "not-allowed" : "pointer",
                    opacity: generatingAI || !aiFile ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  {generatingAI ? (
                    <>
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTop: "2px solid #fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />{" "}
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Generate Soal
                    </>
                  )}
                </button>

                {aiPreview.length > 0 && (
                  <button
                    onClick={handleSaveAIQuestions}
                    disabled={savingAI || selectedAIQ.size === 0}
                    style={{
                      padding: "11px",
                      borderRadius: "8px",
                      background: "#10b981",
                      border: "none",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      opacity: savingAI || selectedAIQ.size === 0 ? 0.6 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Save size={14} />{" "}
                    {savingAI
                      ? "Menyimpan..."
                      : `Simpan ${selectedAIQ.size} Soal`}
                  </button>
                )}
              </div>

              {/* Right: Preview */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
                {generatingAI ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: "16px",
                      color: "#64748b",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        border: "3px solid #1e2744",
                        borderTop: "3px solid #7c3aed",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <div style={{ fontSize: "14px" }}>
                      AI sedang membuat soal...
                    </div>
                    <div style={{ fontSize: "12px", color: "#4b5563" }}>
                      Membutuhkan waktu 15-30 detik
                    </div>
                  </div>
                ) : aiPreview.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {aiPreview.length} soal di-generate
                      </span>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() =>
                            setSelectedAIQ(new Set(aiPreview.map((_, i) => i)))
                          }
                          style={{
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            background: "rgba(16,185,129,0.15)",
                            border: "0.5px solid rgba(16,185,129,0.3)",
                            color: "#10b981",
                            cursor: "pointer",
                          }}
                        >
                          Pilih Semua
                        </button>
                        <button
                          onClick={() => setSelectedAIQ(new Set())}
                          style={{
                            fontSize: "11px",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            background: "rgba(239,68,68,0.1)",
                            border: "0.5px solid rgba(239,68,68,0.2)",
                            color: "#ef4444",
                            cursor: "pointer",
                          }}
                        >
                          Kosongkan
                        </button>
                      </div>
                    </div>
                    {aiPreview.map((q: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          padding: "14px",
                          background: selectedAIQ.has(idx)
                            ? "rgba(124,58,237,0.08)"
                            : "#0f1117",
                          border: `0.5px solid ${selectedAIQ.has(idx) ? "rgba(124,58,237,0.3)" : "#1e2744"}`,
                          borderRadius: "10px",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onClick={() => toggleSelectAIQ(idx)}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "4px",
                              border: `2px solid ${selectedAIQ.has(idx) ? "#7c3aed" : "#374151"}`,
                              background: selectedAIQ.has(idx)
                                ? "#7c3aed"
                                : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          >
                            {selectedAIQ.has(idx) && (
                              <CheckCircle size={12} color="#fff" />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "6px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 6px",
                                  borderRadius: "3px",
                                  background: "rgba(124,58,237,0.15)",
                                  color: "#a78bfa",
                                }}
                              >
                                {QUESTION_TYPES.find((t) => t.value === q.type)
                                  ?.label || q.type}
                              </span>
                              <span
                                style={{ fontSize: "10px", color: "#64748b" }}
                              >
                                {q.points} poin
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "#e2e8f0",
                                marginBottom: "8px",
                                lineHeight: 1.5,
                              }}
                            >
                              {q.text}
                            </div>
                            {q.options?.length > 0 && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                {q.options.map((opt: any, oi: number) => (
                                  <div
                                    key={oi}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                      fontSize: "12px",
                                      color: opt.isCorrect
                                        ? "#10b981"
                                        : "#64748b",
                                    }}
                                  >
                                    {opt.isCorrect ? (
                                      <CheckCircle size={11} color="#10b981" />
                                    ) : (
                                      <div
                                        style={{
                                          width: "11px",
                                          height: "11px",
                                          borderRadius: "50%",
                                          border: "1px solid #374151",
                                        }}
                                      />
                                    )}
                                    {String.fromCharCode(65 + oi)}. {opt.text}
                                  </div>
                                ))}
                              </div>
                            )}
                            {q.explanation && (
                              <div
                                style={{
                                  marginTop: "8px",
                                  fontSize: "11px",
                                  color: "#f59e0b",
                                  padding: "6px 10px",
                                  background: "rgba(245,158,11,0.06)",
                                  borderRadius: "6px",
                                }}
                              >
                                💡 {q.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      gap: "12px",
                      color: "#64748b",
                    }}
                  >
                    <Sparkles size={40} color="#374151" />
                    <div style={{ fontSize: "14px" }}>
                      Upload materi dan klik "Generate Soal"
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                        textAlign: "center",
                        lineHeight: 1.6,
                      }}
                    >
                      AI akan membaca konten HTML materi
                      <br />
                      dan generate soal secara otomatis
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
