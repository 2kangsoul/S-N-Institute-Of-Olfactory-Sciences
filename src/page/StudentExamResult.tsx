// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../config/api";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function StudentExamResult() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const submissionId = searchParams.get("submissionId");
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedQ, setExpandedQ] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    const load = async () => {
      try {
        // ── Pakai GET /api/submissions/:id langsung ──
        const res = await apiClient.get(`/submissions/${submissionId}`);
        setSubmission(res.data?.data);
      } catch (e: any) {
        setError(e.response?.data?.message || "Gagal memuat hasil ujian");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [submissionId]);

  if (isLoading)
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
            width: "40px",
            height: "40px",
            border: "3px solid #1e2744",
            borderTop: "3px solid #10b981",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );

  if (error || !submission)
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
        <div
          style={{ fontSize: "14px", color: "#ef4444", marginBottom: "12px" }}
        >
          {error || "Data hasil ujian tidak ditemukan."}
        </div>
        <button
          onClick={() => navigate("/student")}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            background: "#1e2744",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Ke Dashboard
        </button>
      </div>
    );

  const isPassed = submission.isPassed === true;
  const isFailed = submission.isPassed === false;
  const hasEssay = submission.isPassed === null;
  const score = submission.score;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={() => navigate("/student/results")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          color: "#64748b",
          fontSize: "12px",
          cursor: "pointer",
          padding: 0,
          alignSelf: "flex-start",
        }}
      >
        <ArrowLeft size={14} /> Kembali ke Riwayat Ujian
      </button>

      {/* Result card */}
      <div
        style={{
          background: "#161b2e",
          border: `0.5px solid ${hasEssay ? "#f59e0b" : isPassed ? "#10b981" : "#ef4444"}`,
          borderRadius: "12px",
          padding: "28px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>
          {hasEssay ? "⏳" : isPassed ? "🎉" : "😔"}
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "6px",
          }}
        >
          {hasEssay
            ? "Menunggu Penilaian"
            : isPassed
              ? "Selamat, Kamu Lulus!"
              : "Belum Lulus"}
        </div>
        <div
          style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}
        >
          {hasEssay
            ? "Ujian essay kamu sedang diperiksa oleh instruktur."
            : isPassed
              ? `Kamu berhasil melewati nilai minimum ${submission.exam?.passingScore}.`
              : `Nilai minimum adalah ${submission.exam?.passingScore}. Semangat untuk mencoba lagi!`}
        </div>

        {score !== null && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "10px",
              background: hasEssay
                ? "rgba(245,158,11,0.1)"
                : isPassed
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(239,68,68,0.1)",
              border: `1px solid ${hasEssay ? "rgba(245,158,11,0.3)" : isPassed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            <Award
              size={20}
              color={hasEssay ? "#f59e0b" : isPassed ? "#10b981" : "#ef4444"}
            />
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: hasEssay ? "#f59e0b" : isPassed ? "#10b981" : "#ef4444",
              }}
            >
              {score}
            </span>
            <span style={{ fontSize: "16px", color: "#64748b" }}>/100</span>
          </div>
        )}
      </div>

      {/* Detail jawaban */}
      {submission.exam?.showResult && submission.answers?.length > 0 && (
        <div
          style={{
            background: "#161b2e",
            border: "0.5px solid #1e2744",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "0.5px solid #1e2744",
              fontSize: "14px",
              fontWeight: 500,
              color: "#fff",
            }}
          >
            Review Jawaban
          </div>
          <div>
            {submission.answers.map((ans: any, i: number) => {
              const isExpanded = expandedQ === ans.id;
              const correct = ans.isCorrect === true;
              const incorrect = ans.isCorrect === false;
              const pending = ans.isCorrect === null;

              return (
                <div
                  key={ans.id}
                  style={{ borderBottom: "0.5px solid #1a2035" }}
                >
                  <div
                    onClick={() => setExpandedQ(isExpanded ? null : ans.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px 16px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        background: correct
                          ? "rgba(16,185,129,0.1)"
                          : incorrect
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(245,158,11,0.1)",
                      }}
                    >
                      {correct ? (
                        <CheckCircle size={13} color="#10b981" />
                      ) : incorrect ? (
                        <XCircle size={13} color="#ef4444" />
                      ) : (
                        <Clock size={13} color="#f59e0b" />
                      )}
                    </div>
                    <div
                      style={{ flex: 1, fontSize: "12px", color: "#94a3b8" }}
                    >
                      <span style={{ color: "#64748b", marginRight: "6px" }}>
                        Soal {i + 1}.
                      </span>
                      {ans.question?.text?.slice(0, 70)}
                      {ans.question?.text?.length > 70 ? "..." : ""}
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: correct
                          ? "#10b981"
                          : incorrect
                            ? "#ef4444"
                            : "#f59e0b",
                      }}
                    >
                      {correct
                        ? `+${ans.pointsEarned}`
                        : incorrect
                          ? "0"
                          : "Pending"}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={13} color="#64748b" />
                    ) : (
                      <ChevronDown size={13} color="#64748b" />
                    )}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: "0 16px 14px 48px" }}>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#e2e8f0",
                          marginBottom: "10px",
                        }}
                      >
                        {ans.question?.text}
                      </div>

                      {ans.selectedOption && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            background: correct
                              ? "rgba(16,185,129,0.08)"
                              : "rgba(239,68,68,0.08)",
                            border: `0.5px solid ${correct ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                            marginBottom: "8px",
                          }}
                        >
                          {correct ? (
                            <CheckCircle size={12} color="#10b981" />
                          ) : (
                            <XCircle size={12} color="#ef4444" />
                          )}
                          <span
                            style={{
                              fontSize: "12px",
                              color: correct ? "#10b981" : "#ef4444",
                            }}
                          >
                            Jawaban kamu: {ans.selectedOption?.text}
                          </span>
                        </div>
                      )}

                      {ans.answerText && (
                        <div
                          style={{
                            padding: "8px 10px",
                            borderRadius: "6px",
                            background: "#0f1117",
                            border: "0.5px solid #1e2744",
                            marginBottom: "8px",
                            fontSize: "12px",
                            color: "#94a3b8",
                          }}
                        >
                          Jawaban: {ans.answerText}
                        </div>
                      )}

                      {ans.question?.explanation && (
                        <div
                          style={{
                            padding: "8px 10px",
                            borderRadius: "6px",
                            background: "rgba(245,158,11,0.06)",
                            border: "0.5px solid rgba(245,158,11,0.2)",
                            fontSize: "11px",
                            color: "#f59e0b",
                          }}
                        >
                          💡 {ans.question.explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tombol aksi */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => navigate("/student/results")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            background: "#161b2e",
            border: "0.5px solid #1e2744",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          Lihat Riwayat Ujian
        </button>
        <button
          onClick={() => navigate("/student")}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            background: "#10b981",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Ke Dashboard
        </button>
      </div>
    </div>
  );
}
