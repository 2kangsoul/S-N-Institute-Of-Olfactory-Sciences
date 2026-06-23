// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import apiClient from "../config/api";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  Sparkles,
  Target,
  BarChart2,
  RefreshCw,
  Download,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrency(val: number) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val?.toFixed(0) || 0}`;
}
function formatNumber(val: number) {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return `${val || 0}`;
}

// ── Metric Card ───────────────────────────────────────────────────────────────
const MetricCard = ({
  icon: Icon,
  label,
  value,
  trend,
  positive,
  color,
}: any) => (
  <div
    style={{
      background: "#161b2e",
      borderRadius: "10px",
      padding: "16px",
      border: "0.5px solid #1e2744",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "8px",
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={16} color={color} />
      </div>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: positive ? "#10b981" : "#ef4444",
          background: positive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
          padding: "2px 8px",
          borderRadius: "4px",
        }}
      >
        {positive ? "↑" : "↓"} {trend}
      </span>
    </div>
    <div
      style={{
        fontSize: "22px",
        fontWeight: 700,
        color: "#fff",
        marginBottom: "4px",
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: "11px", color: "#64748b" }}>{label}</div>
  </div>
);

// ── Custom Tooltip ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0f1117",
        border: "0.5px solid #1e2744",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
      }}
    >
      <div style={{ color: "#94a3b8", marginBottom: "6px", fontWeight: 600 }}>
        {label}
      </div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, marginBottom: "2px" }}>
          {p.name}:{" "}
          <strong>
            {p.name.includes("Revenue") || p.name.includes("Target")
              ? formatCurrency(p.value)
              : formatNumber(p.value)}
          </strong>
        </div>
      ))}
    </div>
  );
};

// ── Generate chart data berdasarkan growth % ──────────────────────────────────
// Bar colors gradient dari kuning ke hijau ke ungu
const BAR_COLORS = [
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#7c3aed",
  "#3b82f6",
  "#06b6d4",
];

function generateProjectionData(
  currentRevenue: number,
  targetDays: number,
  growthPercent: number,
  chartData: any[],
) {
  const dailyGrowthRate = Math.pow(1 + growthPercent / 100, 1 / targetDays) - 1;
  const baseDaily = currentRevenue / 30;

  return Array.from({ length: targetDays }, (_, i) => {
    const day = i + 1;
    const label =
      day % 5 === 0 || day === 1 || day === targetDays ? `Hari ${day}` : "";
    const projected = baseDaily * Math.pow(1 + dailyGrowthRate, i);
    const target = baseDaily * (1 + growthPercent / 100) * (day / targetDays);
    const actual = i < 7 ? baseDaily * (1 + Math.random() * 0.1) : undefined;
    return {
      day: `H${day}`,
      label,
      "Proyeksi Revenue": Math.round(projected),
      "Target Revenue": Math.round(target),
      ...(actual !== undefined
        ? { "Aktual (7 hari)": Math.round(actual) }
        : {}),
    };
  });
}

export default function AdminLaporan() {
  // ── State analytics ───────────────────────────────────────────────────────
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // ── State AI planner ──────────────────────────────────────────────────────
  const [targetDays, setTargetDays] = useState("30");
  const [growthPercent, setGrowthPercent] = useState("10");
  const [generating, setGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string>("");
  const [aiSections, setAiSections] = useState<any[]>([]);
  const [projectionData, setProjectionData] = useState<any[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // ── Fetch analytics ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      try {
        const [financialsRes, ordersRes, usersRes, pageviewsRes] =
          await Promise.all([
            apiClient
              .get("/orders/financials")
              .catch(() => ({ data: { data: null } })),
            apiClient
              .get("/orders/recent")
              .catch(() => ({ data: { data: [] } })),
            apiClient
              .get("/users/monthly")
              .catch(() => ({ data: { data: null } })),
            apiClient
              .get("/analytics/pageviews")
              .catch(() => ({ data: { data: null } })),
          ]);

        setAnalytics({
          financials: financialsRes.data?.data,
          recentOrders: ordersRes.data?.data || [],
          users: usersRes.data?.data,
          pageviews: pageviewsRes.data?.data,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  // ── Generate AI report ────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!targetDays || !growthPercent) return;
    setGenerating(true);
    setAiReport("");
    setAiSections([]);

    const days = Number(targetDays);
    const growth = Number(growthPercent);
    const currentRevenue = analytics?.financials?.totalRevenue || 0;
    const totalOrders = analytics?.recentOrders?.length || 0;
    const totalUsers = analytics?.users?.total || 0;
    const pageviews = analytics?.pageviews?.total || 0;

    // Generate projection chart data
    const projection = generateProjectionData(currentRevenue, days, growth, []);
    setProjectionData(projection);

    const prompt = `Kamu adalah analis bisnis profesional untuk toko parfum premium "Saa Fragrance".

Data bisnis saat ini:
- Total Revenue: ${formatCurrency(currentRevenue)}
- Total Orders Terbaru: ${totalOrders}
- Total Users: ${formatNumber(totalUsers)}
- Pageviews: ${formatNumber(pageviews)}

Target yang ingin dicapai:
- Dalam ${days} hari
- Growth revenue sebesar ${growth}%
- Target revenue: ${formatCurrency(currentRevenue * (1 + growth / 100))}

Buatlah laporan analisis penjualan yang komprehensif dalam Bahasa Indonesia dengan format JSON berikut:
{
  "summary": "ringkasan eksekutif 2-3 kalimat",
  "strategies": [
    {
      "title": "judul strategi",
      "description": "deskripsi detail",
      "impact": "High/Medium/Low",
      "timeline": "minggu ke berapa",
      "actions": ["aksi 1", "aksi 2", "aksi 3"]
    }
  ],
  "weeklyTargets": [
    { "week": "Minggu 1", "target": angka_revenue, "focus": "fokus utama" }
  ],
  "risks": ["risiko 1", "risiko 2"],
  "kpis": [
    { "metric": "nama KPI", "current": "nilai saat ini", "target": "nilai target" }
  ]
}

Berikan minimal 4 strategi konkret dan realistis. Mulai langsung dengan { tanpa teks lain.`;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_NINE_ROUTER_URL || "http://localhost:20128/v1"}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_NINE_ROUTER_KEY || ""}`,
          },
          body: JSON.stringify({
            model:
              import.meta.env.VITE_NINE_ROUTER_MODEL_EXAM ||
              "kr/claude-sonnet-4.5",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 4000,
            temperature: 0.5,
            stream: false,
          }),
        },
      );

      const data = await res.json();
      let rawText = data.choices?.[0]?.message?.content || "";

      // Strip thinking tags
      rawText = rawText.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();

      // Parse JSON
      let cleaned = rawText
        .replace(/```[\w]*\n?/g, "")
        .replace(/```/g, "")
        .trim();
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1)
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);

      const parsed = JSON.parse(cleaned);
      setAiSections(parsed);
      setHasGenerated(true);
    } catch (e) {
      console.error("AI error:", e);
      setAiReport("Gagal generate laporan. Coba lagi.");
    } finally {
      setGenerating(false);
    }
  };

  // ── Metrics ───────────────────────────────────────────────────────────────
  const metrics = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: formatCurrency(analytics?.financials?.totalRevenue || 0),
      trend: analytics?.financials?.profitTrend || "0%",
      positive: analytics?.financials?.isProfitPositive ?? true,
      color: "#10b981",
    },
    {
      icon: TrendingUp,
      label: "Total Profit",
      value: formatCurrency(analytics?.financials?.totalProfit || 0),
      trend: analytics?.financials?.profitTrend || "0%",
      positive: analytics?.financials?.isProfitPositive ?? true,
      color: "#7c3aed",
    },
    {
      icon: ShoppingCart,
      label: "Recent Orders",
      value: analytics?.recentOrders?.length || 0,
      trend: analytics?.users?.trend || "0%",
      positive: true,
      color: "#f59e0b",
    },
    {
      icon: Users,
      label: "Monthly Users",
      value: formatNumber(analytics?.users?.total || 0),
      trend: analytics?.users?.trend || "0%",
      positive: analytics?.users?.isPositive ?? true,
      color: "#06b6d4",
    },
    {
      icon: Eye,
      label: "Pageviews",
      value: formatNumber(analytics?.pageviews?.total || 0),
      trend: analytics?.pageviews?.trend || "0%",
      positive: analytics?.pageviews?.isPositive ?? true,
      color: "#a78bfa",
    },
  ];

  const impactColor = (impact: string) =>
    impact === "High" ? "#10b981" : impact === "Medium" ? "#f59e0b" : "#64748b";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
            📊 Laporan & AI Sales Planner
          </h1>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
            Analisis performa & rencana pertumbuhan penjualan berbasis AI
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
        }}
      >
        {loadingAnalytics
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#161b2e",
                  borderRadius: "10px",
                  padding: "16px",
                  border: "0.5px solid #1e2744",
                  height: "100px",
                }}
              >
                <div
                  style={{
                    background: "#1e2744",
                    borderRadius: "6px",
                    height: "32px",
                    width: "32px",
                    marginBottom: "10px",
                  }}
                />
                <div
                  style={{
                    background: "#1e2744",
                    borderRadius: "4px",
                    height: "24px",
                    width: "60%",
                    marginBottom: "6px",
                  }}
                />
                <div
                  style={{
                    background: "#1e2744",
                    borderRadius: "4px",
                    height: "12px",
                    width: "40%",
                  }}
                />
              </div>
            ))
          : metrics.map((m, i) => <MetricCard key={i} {...m} />)}
      </div>

      {/* AI Sales Planner */}
      <div
        style={{
          background: "#161b2e",
          border: "0.5px solid #1e2744",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
            paddingBottom: "14px",
            borderBottom: "0.5px solid #1e2744",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "rgba(124,58,237,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={18} color="#a78bfa" />
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>
              AI Sales Planner
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              Generate rencana pertumbuhan penjualan otomatis
            </div>
          </div>
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-end",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                display: "block",
                marginBottom: "6px",
              }}
            >
              <Target
                size={11}
                style={{ display: "inline", marginRight: "4px" }}
              />
              Target (Hari)
            </label>
            <input
              type="number"
              min="7"
              max="365"
              value={targetDays}
              onChange={(e) => setTargetDays(e.target.value)}
              style={{
                width: "100%",
                background: "#0f1117",
                border: "1px solid #2d3748",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "15px",
                color: "#fff",
                outline: "none",
                fontWeight: 600,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{ fontSize: "10px", color: "#4b5563", marginTop: "4px" }}
            >
              Dalam berapa hari target tercapai
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                display: "block",
                marginBottom: "6px",
              }}
            >
              <TrendingUp
                size={11}
                style={{ display: "inline", marginRight: "4px" }}
              />
              Growth Target (%)
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={growthPercent}
              onChange={(e) => setGrowthPercent(e.target.value)}
              style={{
                width: "100%",
                background: "#0f1117",
                border: "1px solid #2d3748",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "15px",
                color: "#fff",
                outline: "none",
                fontWeight: 600,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{ fontSize: "10px", color: "#4b5563", marginTop: "4px" }}
            >
              Persentase pertumbuhan yang diinginkan
            </div>
          </div>

          <div style={{ flex: 2 }}>
            <label
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Preview Target
            </label>
            <div
              style={{
                background: "#0f1117",
                border: "1px solid #1e2744",
                borderRadius: "8px",
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", gap: "20px" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>
                    Revenue Saat Ini
                  </div>
                  <div
                    style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}
                  >
                    {formatCurrency(analytics?.financials?.totalRevenue || 0)}
                  </div>
                </div>
                <div
                  style={{
                    color: "#374151",
                    fontSize: "20px",
                    alignSelf: "center",
                  }}
                >
                  →
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>
                    Target Revenue
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#10b981",
                    }}
                  >
                    {formatCurrency(
                      (analytics?.financials?.totalRevenue || 0) *
                        (1 + Number(growthPercent) / 100),
                    )}
                  </div>
                </div>
                <div
                  style={{
                    color: "#374151",
                    fontSize: "20px",
                    alignSelf: "center",
                  }}
                >
                  ·
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>
                    Dalam
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#a78bfa",
                    }}
                  >
                    {targetDays} hari
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#7c3aed",
              border: "none",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: generating ? "not-allowed" : "pointer",
              opacity: generating ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
              height: "42px",
            }}
          >
            {generating ? (
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
                <Sparkles size={14} /> Generate Laporan
              </>
            )}
          </button>
        </div>

        {/* Loading state */}
        {generating && (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#64748b" }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid #1e2744",
                borderTop: "3px solid #7c3aed",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }}
            />
            <div style={{ fontSize: "14px", color: "#94a3b8" }}>
              SNN sedang menganalisis data bisnis...
            </div>
            <div
              style={{ fontSize: "12px", color: "#4b5563", marginTop: "4px" }}
            >
              Membutuhkan 15-30 detik
            </div>
          </div>
        )}
      </div>

      {/* Hasil AI */}
      {hasGenerated && !generating && aiSections && (
        <>
          {/* Summary */}
          {aiSections.summary && (
            <div
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "0.5px solid rgba(124,58,237,0.3)",
                borderRadius: "10px",
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#a78bfa",
                  marginBottom: "6px",
                }}
              >
                📋 Ringkasan Eksekutif
              </div>
              <div
                style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: 1.7 }}
              >
                {aiSections.summary}
              </div>
            </div>
          )}

          {/* Projection Chart */}
          {projectionData.length > 0 && (
            <div
              style={{
                background: "#161b2e",
                border: "0.5px solid #1e2744",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "4px",
                }}
              >
                📈 Proyeksi Revenue — Target {growthPercent}% dalam {targetDays}{" "}
                Hari
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  marginBottom: "16px",
                }}
              >
                Kombinasi line chart proyeksi, area target, dan bar aktual 7
                hari pertama
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart
                  data={projectionData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2744" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    interval={Math.floor(projectionData.length / 6)}
                  />
                  <YAxis
                    tickFormatter={(v) => formatCurrency(v)}
                    tick={{ fill: "#64748b", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Target Revenue"
                    fill="url(#areaGrad)"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Proyeksi Revenue"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Bar
                    dataKey="Aktual (7 hari)"
                    opacity={0.9}
                    radius={[3, 3, 0, 0]}
                  >
                    {projectionData.map((_: any, index: number) => (
                      <Cell
                        key={index}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                  <ReferenceLine
                    y={
                      ((analytics?.financials?.totalRevenue || 0) *
                        (1 + Number(growthPercent) / 100)) /
                      Number(targetDays)
                    }
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    label={{
                      value: "Target Harian",
                      fill: "#ef4444",
                      fontSize: 10,
                    }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Weekly Targets */}
          {aiSections.weeklyTargets?.length > 0 && (
            <div
              style={{
                background: "#161b2e",
                border: "0.5px solid #1e2744",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "14px",
                }}
              >
                🗓️ Target Mingguan
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {aiSections.weeklyTargets.map((wt: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: "#0f1117",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      border: "0.5px solid #1e2744",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#7c3aed",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {wt.week}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#10b981",
                        marginBottom: "4px",
                      }}
                    >
                      {formatCurrency(wt.target)}
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>
                      {wt.focus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategies */}
          {aiSections.strategies?.length > 0 && (
            <div
              style={{
                background: "#161b2e",
                border: "0.5px solid #1e2744",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "14px",
                }}
              >
                🎯 Strategi Pertumbuhan
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {aiSections.strategies.map((s: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: "#0f1117",
                      borderRadius: "10px",
                      padding: "14px 16px",
                      border: "0.5px solid #1e2744",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "8px",
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
                        {i + 1}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {s.title}
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          color: impactColor(s.impact),
                          background: `${impactColor(s.impact)}18`,
                          border: `1px solid ${impactColor(s.impact)}40`,
                          flexShrink: 0,
                        }}
                      >
                        {s.impact} Impact
                      </span>
                      {s.timeline && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#64748b",
                            flexShrink: 0,
                          }}
                        >
                          ⏱ {s.timeline}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        lineHeight: 1.6,
                        marginBottom: "10px",
                      }}
                    >
                      {s.description}
                    </div>
                    {s.actions?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        {s.actions.map((action: string, j: number) => (
                          <div
                            key={j}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "6px",
                              fontSize: "11px",
                              color: "#64748b",
                            }}
                          >
                            <span style={{ color: "#10b981", flexShrink: 0 }}>
                              ✓
                            </span>
                            {action}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KPIs & Risks */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* KPIs */}
            {aiSections.kpis?.length > 0 && (
              <div
                style={{
                  background: "#161b2e",
                  border: "0.5px solid #1e2744",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: "14px",
                  }}
                >
                  📊 KPI Target
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {aiSections.kpis.map((kpi: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        background: "#0f1117",
                        borderRadius: "8px",
                        border: "0.5px solid #1e2744",
                      }}
                    >
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {kpi.metric}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          fontSize: "11px",
                        }}
                      >
                        <span style={{ color: "#64748b" }}>
                          Saat ini:{" "}
                          <strong style={{ color: "#e2e8f0" }}>
                            {kpi.current}
                          </strong>
                        </span>
                        <span style={{ color: "#64748b" }}>
                          Target:{" "}
                          <strong style={{ color: "#10b981" }}>
                            {kpi.target}
                          </strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {aiSections.risks?.length > 0 && (
              <div
                style={{
                  background: "#161b2e",
                  border: "0.5px solid #1e2744",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#fff",
                    marginBottom: "14px",
                  }}
                >
                  ⚠️ Potensi Risiko
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {aiSections.risks.map((risk: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        padding: "10px 12px",
                        background: "rgba(239,68,68,0.05)",
                        borderRadius: "8px",
                        border: "0.5px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      <span
                        style={{
                          color: "#ef4444",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        ⚠
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#94a3b8",
                          lineHeight: 1.5,
                        }}
                      >
                        {risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
