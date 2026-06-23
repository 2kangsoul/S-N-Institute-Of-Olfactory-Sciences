// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from "lucide-react";

export default function StudentExam() {
  const { user } = useAuthStore();
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const enrollmentId = searchParams.get("enrollmentId");
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<"info" | "exam" | "done">("info");
  const [error, setError] = useState("");
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!examId || !enrollmentId) return;
    const load = async () => {
      try {
        const res = await apiClient.get(`/exams/${examId}/student?enrollmentId=${enrollmentId}`);
        setExam(res.data?.data);
      } catch (e: any) {
        setError(e.response?.data?.message || "Gagal memuat ujian");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [examId, enrollmentId]);

  // Timer countdown
  useEffect(() => {
    if (phase !== "exam" || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const handleStart = async () => {
    if (!enrollmentId) return;
    setIsStarting(true);
    setError("");
    try {
      const res = await apiClient.post(`/exams/${examId}/start`, { enrollmentId });
      setSubmission(res.data?.data);
      setTimeLeft((exam.duration || 60) * 60);
      setPhase("exam");
    } catch (e: any) {
      setError(e.response?.data?.message || "Gagal memulai ujian");
    } finally {
      setIsStarting(false);
    }
  };

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!submission) return;
    if (!autoSubmit && !confirm("Yakin ingin submit ujian? Jawaban tidak bisa diubah setelah submit.")) return;

    clearInterval(timerRef.current);
    setIsSubmitting(true);

    const formattedAnswers = exam.questions.map((q: any) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id]?.selectedOptionId || null,
      answerText: answers[q.id]?.answerText || null,
    }));

    try {
      const res = await apiClient.post(`/submissions/${submission.id}/submit`, { answers: formattedAnswers });
      navigate(`/student/exam/${examId}/result?submissionId=${submission.id}`);
    } catch (e: any) {
      setError(e.response?.data?.message || "Gagal submit ujian");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const timeColor = timeLeft < 300 ? "#ef4444" : timeLeft < 600 ? "#f59e0b" : "#10b981";

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid #1e2744", borderTop: "3px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error && phase === "info") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", gap: "12px" }}>
      <AlertTriangle size={40} color="#ef4444" />
      <div style={{ fontSize: "14px", color: "#ef4444" }}>{error}</div>
      <button onClick={() => navigate(-1)} style={{ padding: "8px 16px", borderRadius: "8px", background: "#1e2744", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "13px" }}>
        Kembali
      </button>
    </div>
  );

  // ── PHASE: INFO ──
  if (phase === "info") return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#64748b", fontSize: "12px", cursor: "pointer", padding: 0, alignSelf: "flex-start" }}>
        <ChevronLeft size={14} /> Kembali
      </button>

      <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "12px", padding: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "#fff", marginBottom: "8px" }}>{exam?.title}</h1>
        {exam?.description && <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>{exam.description}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          {[
            { label: "⏱ Durasi", value: `${exam?.duration} menit` },
            { label: "📝 Jumlah Soal", value: `${exam?.questions?.length || 0} soal` },
            { label: "🎯 Nilai Lulus", value: `${exam?.passingScore}` },
            { label: "🔄 Max Percobaan", value: `${exam?.maxAttempts}x` },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0f1117", borderRadius: "8px", padding: "12px 14px", border: "0.5px solid #1e2744" }}>
              <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "4px" }}>{item.label}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {exam?.canAttempt === false ? (
          <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "13px", textAlign: "center" }}>
            Kamu sudah mencapai batas percobaan maksimum ({exam?.maxAttempts}x)
          </div>
        ) : (
          <>
            <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(245,158,11,0.08)", border: "0.5px solid rgba(245,158,11,0.2)", marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600, marginBottom: "4px" }}>⚠️ Perhatian</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.6 }}>
                Setelah klik "Mulai Ujian", timer akan berjalan. Pastikan koneksi internet stabil. Ujian akan otomatis submit saat waktu habis.
              </div>
            </div>
            {error && <div style={{ fontSize: "12px", color: "#ef4444", marginBottom: "12px" }}>{error}</div>}
            <button
              onClick={handleStart}
              disabled={isStarting}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", background: "#10b981", border: "none", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: isStarting ? "not-allowed" : "pointer", opacity: isStarting ? 0.7 : 1 }}
            >
              {isStarting ? "Memulai..." : "🚀 Mulai Ujian"}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ── PHASE: EXAM ──
  const questions = exam?.questions || [];
  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ display: "flex", gap: "16px", height: "calc(100vh - 40px)" }}>
      {/* Left: Soal */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflow: "auto" }}>
        {/* Timer bar */}
        <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>{exam?.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "8px", background: `${timeColor}18`, border: `1px solid ${timeColor}40` }}>
            <Clock size={14} color={timeColor} />
            <span style={{ fontSize: "16px", fontWeight: 700, color: timeColor, fontVariantNumeric: "tabular-nums" }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Soal */}
        {currentQ && (
          <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "20px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#a78bfa" }}>
                {currentIdx + 1}
              </div>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(124,58,237,0.1)", color: "#a78bfa" }}>
                {currentQ.type === "MULTIPLE_CHOICE" ? "Pilihan Ganda" : currentQ.type === "TRUE_FALSE" ? "Benar/Salah" : "Essay"}
              </span>
              <span style={{ fontSize: "10px", color: "#64748b" }}>{currentQ.points} poin</span>
            </div>

            <div style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.7, marginBottom: "20px" }}>
              {currentQ.text}
            </div>

            {/* Options */}
            {(currentQ.type === "MULTIPLE_CHOICE" || currentQ.type === "TRUE_FALSE") && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {currentQ.options?.map((opt: any, i: number) => {
                  const isSelected = answers[currentQ.id]?.selectedOptionId === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleAnswer(currentQ.id, { selectedOptionId: opt.id })}
                      style={{
                        display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "8px", cursor: "pointer",
                        background: isSelected ? "rgba(16,185,129,0.1)" : "#0f1117",
                        border: `1.5px solid ${isSelected ? "#10b981" : "#1e2744"}`,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${isSelected ? "#10b981" : "#374151"}`,
                        background: isSelected ? "#10b981" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isSelected && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <span style={{ fontSize: "13px", color: isSelected ? "#fff" : "#94a3b8" }}>
                        {String.fromCharCode(65 + i)}. {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {currentQ.type === "ESSAY" && (
              <textarea
                placeholder="Tulis jawaban kamu di sini..."
                value={answers[currentQ.id]?.answerText || ""}
                onChange={(e) => handleAnswer(currentQ.id, { answerText: e.target.value })}
                rows={6}
                style={{ width: "100%", background: "#0f1117", border: "0.5px solid #2d3748", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#e2e8f0", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box" }}
              />
            )}
          </div>
        )}

        {/* Navigasi */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <button
            onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
            disabled={currentIdx === 0}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#161b2e", border: "0.5px solid #1e2744", color: currentIdx === 0 ? "#374151" : "#94a3b8", cursor: currentIdx === 0 ? "not-allowed" : "pointer", fontSize: "12px" }}
          >
            <ChevronLeft size={14} /> Sebelumnya
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((p) => Math.min(questions.length - 1, p + 1))}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", background: "#161b2e", border: "0.5px solid #1e2744", color: "#94a3b8", cursor: "pointer", fontSize: "12px" }}
            >
              Selanjutnya <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", background: "#10b981", border: "none", color: "#fff", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "12px", fontWeight: 600, opacity: isSubmitting ? 0.7 : 1 }}
            >
              <Send size={13} /> {isSubmitting ? "Submitting..." : "Submit Ujian"}
            </button>
          )}
        </div>
        {error && <div style={{ fontSize: "12px", color: "#ef4444" }}>{error}</div>}
      </div>

      {/* Right: Navigasi nomor soal */}
      <div style={{ width: "200px", flexShrink: 0 }}>
        <div style={{ background: "#161b2e", border: "0.5px solid #1e2744", borderRadius: "10px", padding: "14px", position: "sticky", top: 0 }}>
          <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Navigasi Soal
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "10px" }}>
            Dijawab: <span style={{ color: "#10b981", fontWeight: 600 }}>{answeredCount}</span> / {questions.length}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
            {questions.map((_: any, i: number) => {
              const q = questions[i];
              const isAnswered = !!answers[q.id];
              const isCurrent = i === currentIdx;
              return (
                <div
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 600, cursor: "pointer",
                    background: isCurrent ? "#10b981" : isAnswered ? "rgba(16,185,129,0.2)" : "#0f1117",
                    border: `1.5px solid ${isCurrent ? "#10b981" : isAnswered ? "rgba(16,185,129,0.4)" : "#1e2744"}`,
                    color: isCurrent ? "#fff" : isAnswered ? "#10b981" : "#64748b",
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "10px", color: "#64748b" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#10b981" }} /> Sedang dikerjakan
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)" }} /> Sudah dijawab
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#0f1117", border: "1px solid #1e2744" }} /> Belum dijawab
            </div>
          </div>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            style={{ width: "100%", marginTop: "14px", padding: "9px", borderRadius: "8px", background: "#10b981", border: "none", color: "#fff", fontSize: "12px", fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Submitting..." : "Submit Ujian"}
          </button>
        </div>
      </div>
    </div>
  );
}
