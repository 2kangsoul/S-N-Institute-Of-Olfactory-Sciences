// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import apiClient from "../config/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";

async function fetchDashboardData() {
  let pageviewsData = { total: 0, trend: "0%", isPositive: true };
  let subscriptionsData = { total: 0, trend: "0%", isPositive: true };
  let financialsData = {
    totalRevenue: 0,
    totalProfit: 0,
    profitTrend: "0%",
    isProfitPositive: true,
  };
  let recentOrders = [];
  let monthlyUsersData = { total: 0, trend: "0%", isPositive: true };
  let newSignUpsData = { total: 0, trend: "0%", isPositive: true };
  let chartData = [];
  let sessionsData = { total: 0, trend: "0%", isPositive: true, chartData: [] };

  // ✅ NEW: Monthly Users realtime overview (device + country + total)
  let monthlyUsersOverview = {
    totalUsers: 0,
    byDevice: [],
    byCountry: [],
    lastUpdated: "",
  };
  // ✅ NEW: Monthly Users summary (KPI: growth %, newUsersThisMonth, etc.)
  let monthlyUsersSummary = {
    totalUsers: 0,
    newUsersThisMonth: 0,
    newUsersLastMonth: 0,
    growthPercentage: 0,
    activeUsers: 0,
  };

  try {
    const [
      pageviewsRes,
      subscriptionsRes,
      financialsRes,
      monthlyUsersRes,
      signUpsRes,
      chartRes,
      sessionsRes,
      monthlyOverviewRes, // ✅ NEW
      monthlySummaryRes, // ✅ NEW
    ] = await Promise.all([
      apiClient.get("/analytics/pageviews"),
      apiClient.get("/subscriptions/data"),
      apiClient.get("/orders/financials"),
      apiClient.get("/users/monthly"),
      apiClient.get("/signups/data"),
      apiClient.get("/expenses/chart"),
      apiClient.get("/analytics/sessions"),
      apiClient.get("/monthly-users/realtime"), // ✅ NEW
      apiClient.get("/monthly-users/summary"), // ✅ NEW
    ]);
    pageviewsData = pageviewsRes.data?.data || pageviewsData;
    subscriptionsData = subscriptionsRes.data?.data || subscriptionsData;
    financialsData = financialsRes.data?.data || financialsData;
    monthlyUsersData = monthlyUsersRes.data?.data || monthlyUsersData;
    newSignUpsData = signUpsRes.data?.data || newSignUpsData;
    chartData = chartRes.data?.data || chartData;
    sessionsData = sessionsRes.data?.data || sessionsData;
    monthlyUsersOverview =
      monthlyOverviewRes.data?.data || monthlyUsersOverview; // ✅ NEW
    monthlyUsersSummary = monthlySummaryRes.data?.data || monthlyUsersSummary; // ✅ NEW
  } catch (error) {
    console.error("Gagal mengambil data API:", error);
  }

  try {
    const recentOrdersRes = await apiClient.get("/orders/recent");
    recentOrders = recentOrdersRes.data?.data || [];
  } catch (error) {
    console.error("Gagal mengambil recent orders:", error);
  }

  return {
    pageviews: pageviewsData,
    subscriptions: subscriptionsData,
    totalRevenue: financialsData.totalRevenue,
    totalProfit: financialsData.totalProfit,
    profitTrend: financialsData.profitTrend,
    isProfitPositive: financialsData.isProfitPositive,
    recentOrders,
    monthlyUsers: monthlyUsersData,
    newSignUps: newSignUpsData,
    chartData,
    sessions: sessionsData,
    monthlyUsersOverview, // ✅ NEW: { totalUsers, byDevice, byCountry, lastUpdated }
    monthlyUsersSummary, // ✅ NEW: { totalUsers, newUsersThisMonth, growthPercentage, ... }
  };
}

const DEVICE_COLORS = ["#7c3aed", "#06b6d4", "#8b5cf6"];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatCurrency(val: number) {
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val.toFixed(2)}`;
}

function formatNumber(val: number) {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return `${val}`;
}

const MetricCard = ({ label, value, trend, positive }) => (
  <div
    style={{
      background: "#161b2e",
      borderRadius: "10px",
      padding: "14px 16px",
      border: "0.5px solid #1e2744",
    }}
  >
    <div
      style={{
        fontSize: "11px",
        color: "#64748b",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "6px",
      }}
    >
      {label}
      <span style={{ color: "#374151", cursor: "pointer" }}>···</span>
    </div>
    <div style={{ fontSize: "22px", fontWeight: 500, color: "#fff" }}>
      {value}
    </div>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        fontSize: "10px",
        padding: "2px 6px",
        borderRadius: "4px",
        marginTop: "4px",
        background: positive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
        color: positive ? "#10b981" : "#ef4444",
      }}
    >
      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {trend}
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const isPaid = status?.toLowerCase() === "paid";
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 500,
        background: isPaid ? "rgba(16,185,129,0.15)" : "rgba(251,191,36,0.15)",
        color: isPaid ? "#10b981" : "#fbbf24",
      }}
    >
      {status}
    </span>
  );
};

const CreateOrderModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    orderNumber: "",
    totalAmount: "",
    profitAmount: "",
    note: "",
    status: "Pending",
    userId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (
      !form.orderNumber ||
      !form.totalAmount ||
      !form.profitAmount ||
      !form.userId
    ) {
      setError("Semua field wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await apiClient.post("/orders", {
        orderNumber: form.orderNumber,
        totalAmount: parseFloat(form.totalAmount),
        profitAmount: parseFloat(form.profitAmount),
        status: form.status,
        userId: form.userId,
        note: form.note,
        items: [],
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError("Gagal membuat order. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#161b2e",
          borderRadius: "12px",
          padding: "24px",
          width: "400px",
          border: "0.5px solid #1e2744",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>
            Create Order
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {[
          {
            label: "Order Number",
            key: "orderNumber",
            placeholder: "#INV-002",
          },
          { label: "Total Amount", key: "totalAmount", placeholder: "100000" },
          { label: "Profit Amount", key: "profitAmount", placeholder: "30000" },
          { label: "User ID", key: "userId", placeholder: "uuid user..." },
          {
            label: "Note",
            key: "note",
            placeholder: "Catatan order (opsional)",
          },
        ].map(({ label, key, placeholder }) => (
          <div key={key} style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#64748b",
                marginBottom: "6px",
              }}
            >
              {label}
            </div>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              style={{
                width: "100%",
                background: "#0f1117",
                border: "0.5px solid #1e2744",
                borderRadius: "6px",
                padding: "8px 10px",
                fontSize: "12px",
                color: "#fff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px" }}
          >
            Status
          </div>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={{
              width: "100%",
              background: "#0f1117",
              border: "0.5px solid #1e2744",
              borderRadius: "6px",
              padding: "8px 10px",
              fontSize: "12px",
              color: "#fff",
              outline: "none",
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        {error && (
          <div
            style={{ fontSize: "11px", color: "#ef4444", marginBottom: "12px" }}
          >
            {error}
          </div>
        )}

        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              background: "transparent",
              border: "0.5px solid #2d3748",
              color: "#94a3b8",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              background: "#7c3aed",
              border: "none",
              color: "#fff",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Tambahan baru: Modal Analytics
const AnalyticsModal = ({ onClose, data }) => {
  const deviceChartData = data?.deviceData?.map((d) => ({
    name: d.device || "Unknown",
    value: d._count.device,
  })) || [
    { name: "Desktop", value: 15624 },
    { name: "Phone app", value: 5548 },
    { name: "Laptop", value: 2478 },
  ];

  const totalDeviceUsers = deviceChartData.reduce((s, d) => s + d.value, 0);
  const countryData = data?.countryData || [];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#161b2e",
          borderRadius: "12px",
          padding: "24px",
          width: "700px",
          maxHeight: "85vh",
          overflowY: "auto",
          border: "0.5px solid #1e2744",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#fff" }}>
            Analytics Report
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            { label: "Total Sessions", value: data?.sessions?.total ?? 0 },
            { label: "Total Pageviews", value: data?.pageviews?.total ?? 0 },
            { label: "Total Users", value: totalDeviceUsers },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: "#0f1117",
                borderRadius: "8px",
                padding: "12px",
                border: "0.5px solid #1e2744",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  marginBottom: "6px",
                }}
              >
                {card.label}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 500, color: "#fff" }}>
                {card.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Sessions Chart */}
        <div
          style={{
            background: "#0f1117",
            borderRadius: "8px",
            padding: "12px",
            border: "0.5px solid #1e2744",
            marginBottom: "16px",
          }}
        >
          <div
            style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "10px" }}
          >
            Sessions — Last 12 months
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={
                data?.sessions?.chartData?.length ? data.sessions.chartData : []
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#4b5563"
                tick={{ fontSize: 10, fill: "#4b5563" }}
              />
              <YAxis
                stroke="#4b5563"
                tick={{ fontSize: 10, fill: "#4b5563" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e2744",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "11px",
                }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#7c3aed"
                fill="rgba(124,58,237,0.12)"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device & Country */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {/* Device Breakdown */}
          <div
            style={{
              background: "#0f1117",
              borderRadius: "8px",
              padding: "12px",
              border: "0.5px solid #1e2744",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginBottom: "10px",
              }}
            >
              Users by device
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <PieChart width={90} height={90}>
                <Pie
                  data={deviceChartData}
                  cx={40}
                  cy={40}
                  innerRadius={28}
                  outerRadius={40}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {deviceChartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <div style={{ flex: 1 }}>
                {deviceChartData.map((d, i) => (
                  <div key={i} style={{ marginBottom: "8px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "3px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "2px",
                            background: DEVICE_COLORS[i],
                            display: "inline-block",
                          }}
                        />
                        {d.name}
                      </span>
                      <span style={{ fontSize: "11px", color: "#fff" }}>
                        {d.value.toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "3px",
                        background: "#1e2744",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "2px",
                          background: DEVICE_COLORS[i],
                          width: `${Math.round((d.value / totalDeviceUsers) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Country Breakdown */}
          <div
            style={{
              background: "#0f1117",
              borderRadius: "8px",
              padding: "12px",
              border: "0.5px solid #1e2744",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                marginBottom: "10px",
              }}
            >
              Users by country
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {(countryData.length
                ? countryData.map((c) => ({
                    name: c.country,
                    count: c._count.country,
                  }))
                : [
                    { name: "United States", count: 30 },
                    { name: "United Kingdom", count: 25 },
                    { name: "Canada", count: 25 },
                    { name: "Australia", count: 15 },
                    { name: "Spain", count: 15 },
                  ]
              ).map((c, i) => {
                const total = countryData.length
                  ? countryData.reduce((s, x) => s + x._count.country, 0)
                  : 110;
                const pct = Math.round((c.count / total) * 100);
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "3px",
                      }}
                    >
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>
                        {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "3px",
                        background: "#1e2744",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "2px",
                          background: "#7c3aed",
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false); // ✅ Tambahan baru

  const loadData = () => {
    setIsLoading(true);
    fetchDashboardData()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const revenueChartData = data?.chartData?.length
    ? data.chartData
    : MONTH_NAMES.map((month) => ({ month, revenue: 0, expenses: 0 }));

  const sessionChartData = Array.from({ length: 12 }, (_, i) => ({
    month: MONTH_NAMES[i],
    sessions: Math.round(Math.random() * 100 + 80),
  }));

  // ✅ UPDATED: Prioritaskan data dari /monthly-users/realtime (byDevice)
  // Fallback ke data lama (data?.deviceData) jika API baru belum ada datanya
  const deviceChartData = data?.monthlyUsersOverview?.byDevice?.length
    ? data.monthlyUsersOverview.byDevice.map((d) => ({
        name: d.deviceType,
        value: d.count,
      }))
    : data?.deviceData?.map((d) => ({
        name: d.device || "Unknown",
        value: d._count.device,
      })) || [
        { name: "Desktop", value: 15624 },
        { name: "Phone app", value: 5548 },
        { name: "Laptop", value: 2478 },
      ];

  // ✅ UPDATED: Prioritaskan totalUsers dari /monthly-users/realtime
  const totalDeviceUsers =
    data?.monthlyUsersOverview?.totalUsers ||
    deviceChartData.reduce((s, d) => s + d.value, 0);

  // ✅ UPDATED: Prioritaskan byCountry dari /monthly-users/realtime
  // Fallback ke data lama (data?.countryData) jika API baru belum ada datanya
  const countryData = data?.monthlyUsersOverview?.byCountry?.length
    ? data.monthlyUsersOverview.byCountry.map((c) => ({
        name: c.country,
        count: c.count,
        percentage: c.percentage,
      }))
    : data?.countryData?.length
      ? data.countryData.map((c) => ({
          name: c.country,
          count: c._count?.country ?? c.count ?? 0,
          percentage: null,
        }))
      : [
          { name: "United States", count: 30, percentage: 27 },
          { name: "United Kingdom", count: 25, percentage: 23 },
          { name: "Canada", count: 25, percentage: 23 },
          { name: "Australia", count: 15, percentage: 14 },
          { name: "Spain", count: 15, percentage: 14 },
        ];

  // ✅ UPDATED: Growth badge pakai growthPercentage dari /monthly-users/summary
  const growthValue = data?.monthlyUsersSummary?.newUsersThisMonth
    ? `↑ ${formatNumber(data.monthlyUsersSummary.newUsersThisMonth)}`
    : "↑ 1.86K";
  const isGrowthPositive =
    data?.monthlyUsersSummary?.growthPercentage !== undefined
      ? data.monthlyUsersSummary.growthPercentage >= 0
      : true;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "500px",
          background: "#0f1117",
          borderRadius: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #1e2744",
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* ✅ Tambahan baru: Modal Create Order */}
      {showCreateOrder && (
        <CreateOrderModal
          onClose={() => setShowCreateOrder(false)}
          onSuccess={loadData}
        />
      )}

      {/* ✅ Tambahan baru: Modal Analytics */}
      {showAnalytics && (
        <AnalyticsModal onClose={() => setShowAnalytics(false)} data={data} />
      )}

      {/* Topbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: 500, color: "#fff" }}>
            Welcome back, John
          </h1>
          <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
            Measure your advertising ROI and report website traffic.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              background: "transparent",
              border: "0.5px solid #2d3748",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Download size={12} /> Export data
          </button>
          <button
            onClick={() => setShowCreateOrder(true)}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              background: "#7c3aed",
              border: "none",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={12} /> Create report
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <MetricCard
          label="Pageviews"
          value={formatNumber(data?.pageviews?.total ?? 0)}
          trend={data?.pageviews?.trend ?? "0%"}
          positive={data?.pageviews?.isPositive ?? true}
        />
        <MetricCard
          label="Monthly users"
          value={formatNumber(data?.monthlyUsers?.total ?? 0)}
          trend={data?.monthlyUsers?.trend ?? "0%"}
          positive={data?.monthlyUsers?.isPositive ?? true}
        />
        <MetricCard
          label="New sign-ups"
          value={formatNumber(data?.newSignUps?.total ?? 0)}
          trend={data?.newSignUps?.trend ?? "0%"}
          positive={data?.newSignUps?.isPositive ?? true}
        />
        <MetricCard
          label="Subscriptions"
          value={formatNumber(data?.subscriptions?.total ?? 0)}
          trend={data?.subscriptions?.trend ?? "0%"}
          positive={data?.subscriptions?.isPositive ?? true}
        />
      </div>

      {/* Charts Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "12px",
        }}
      >
        {/* Revenue Chart */}
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
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>
                Total revenue
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#fff",
                  marginTop: "4px",
                }}
              >
                {formatCurrency(data?.totalRevenue || 0)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>
                Total profit
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#fff",
                  marginTop: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {formatCurrency(data?.totalProfit || 0)}
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background:
                      (data?.isProfitPositive ?? true)
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(239,68,68,0.15)",
                    color:
                      (data?.isProfitPositive ?? true) ? "#10b981" : "#ef4444",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  {(data?.isProfitPositive ?? true) ? (
                    <TrendingUp size={10} />
                  ) : (
                    <TrendingDown size={10} />
                  )}
                  {data?.profitTrend ?? "0%"}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "#64748b",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: "#7c3aed",
                  display: "inline-block",
                }}
              />
              Revenue
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                color: "#64748b",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  border: "1px dashed #06b6d4",
                  display: "inline-block",
                }}
              />
              Expenses
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={revenueChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#4b5563"
                tick={{ fontSize: 10, fill: "#4b5563" }}
              />
              <YAxis
                stroke="#4b5563"
                tick={{ fontSize: 10, fill: "#4b5563" }}
                tickFormatter={(v) => `$${v}K`}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e2744",
                  border: "0.5px solid #2d3748",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "11px",
                }}
                formatter={(v) => [`$${v}K`]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={{ r: 3, fill: "#7c3aed" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#06b6d4"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={{ r: 2, fill: "#06b6d4" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sessions Chart */}
        <div
          style={{
            background: "#161b2e",
            borderRadius: "10px",
            padding: "16px",
            border: "0.5px solid #1e2744",
          }}
        >
          <div style={{ marginBottom: "8px" }}>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>
              Total sessions
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#fff",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {formatNumber(data?.sessions?.total ?? 0)}
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background:
                    (data?.sessions?.isPositive ?? true)
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                  color:
                    (data?.sessions?.isPositive ?? true)
                      ? "#10b981"
                      : "#ef4444",
                }}
              >
                {(data?.sessions?.isPositive ?? true) ? "↑" : "↓"}{" "}
                {data?.sessions?.trend ?? "0%"}
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart
              data={
                data?.sessions?.chartData?.length
                  ? data.sessions.chartData
                  : sessionChartData
              }
            >
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#7c3aed"
                fill="rgba(124,58,237,0.12)"
                strokeWidth={1.5}
                dot={false}
              />
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1e2744",
                  border: "none",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "11px",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div
            style={{
              marginTop: "10px",
              borderTop: "0.5px solid #1e2744",
              paddingTop: "10px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Last 12 months
            </div>
            {/* ✅ Tambahan baru: onClick buka modal analytics */}
            <div
              onClick={() => setShowAnalytics(true)}
              style={{
                fontSize: "12px",
                color: "#a78bfa",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View report <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {/* Recent Orders */}
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
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}>
              Recent orders
            </div>
            <div
              style={{
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "4px",
                background: "#1e2744",
                color: "#a78bfa",
              }}
            >
              {new Date().toLocaleString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Order", "Date", "Status", "Total"].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      textAlign: "left",
                      padding: "6px 8px",
                      borderBottom: "0.5px solid #1e2744",
                      fontWeight: 400,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.recentOrders?.length
                ? data.recentOrders
                : [
                    {
                      orderNumber: "#1532",
                      createdAt: new Date("2024-12-30T10:00:00"),
                      status: "Paid",
                      totalAmount: 9309.4,
                    },
                    {
                      orderNumber: "#931",
                      createdAt: new Date("2024-12-29T02:59:00"),
                      status: "Pending",
                      totalAmount: 117.24,
                    },
                    {
                      orderNumber: "#1620",
                      createdAt: new Date("2024-12-29T00:54:00"),
                      status: "Pending",
                      totalAmount: 52.91,
                    },
                    {
                      orderNumber: "#1523",
                      createdAt: new Date("2024-12-28T19:00:00"),
                      status: "Paid",
                      totalAmount: 5392.52,
                    },
                    {
                      orderNumber: "#1520",
                      createdAt: new Date("2024-12-27T18:36:00"),
                      status: "Pending",
                      totalAmount: 5949.19,
                    },
                  ]
              ).map((order, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "0.5px solid #1a2035",
                      fontSize: "12px",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {order.orderNumber}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "0.5px solid #1a2035",
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "0.5px solid #1a2035",
                    }}
                  >
                    <StatusBadge status={order.status} />
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "0.5px solid #1a2035",
                      fontSize: "12px",
                      color: "#94a3b8",
                    }}
                  >
                    ${" "}
                    {Number(order.totalAmount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reports Overview — ✅ UPDATED: real data dari /monthly-users/realtime */}
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
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              marginBottom: "12px",
            }}
          >
            Reports overview
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "110px",
                height: "110px",
                flexShrink: 0,
              }}
            >
              <PieChart width={110} height={110}>
                <Pie
                  data={deviceChartData}
                  cx={50}
                  cy={50}
                  innerRadius={35}
                  outerRadius={50}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {deviceChartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#1e2744",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                {/* ✅ UPDATED: totalDeviceUsers dari API realtime */}
                <div
                  style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}
                >
                  {totalDeviceUsers.toLocaleString()}
                </div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>Users</div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {/* ✅ UPDATED: deviceChartData dari API realtime */}
              {deviceChartData.map((d, i) => (
                <div key={i} style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "2px",
                          background: DEVICE_COLORS[i],
                          display: "inline-block",
                        }}
                      />
                      {d.name}
                    </span>
                    <span style={{ fontSize: "12px", color: "#fff" }}>
                      {d.value.toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "4px",
                      background: "#1e2744",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "2px",
                        background: DEVICE_COLORS[i],
                        width: `${Math.round(
                          (d.value / totalDeviceUsers) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "0.5px solid #1e2744", paddingTop: "12px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#fff",
                marginBottom: "10px",
              }}
            >
              Users by country
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {/* ✅ UPDATED: countryData dari API realtime */}
              {countryData.map((c, i) => {
                const total = countryData.reduce((s, x) => s + x.count, 0);
                const pct =
                  c.percentage !== null && c.percentage !== undefined
                    ? Math.round(c.percentage)
                    : total > 0
                      ? Math.round((c.count / total) * 100)
                      : 0;
                return (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "3px",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {c.name}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "4px",
                        background: "#1e2744",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "2px",
                          background: "#7c3aed",
                          width: `${pct}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* ✅ UPDATED: total & growth badge dari API summary */}
              <div style={{ fontSize: "16px", fontWeight: 500, color: "#fff" }}>
                {formatNumber(
                  data?.monthlyUsersSummary?.totalUsers ||
                    data?.monthlyUsers?.total ||
                    12400,
                )}
                <span
                  style={{
                    fontSize: "10px",
                    marginLeft: "6px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: isGrowthPositive
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                    color: isGrowthPositive ? "#10b981" : "#ef4444",
                  }}
                >
                  {growthValue}
                </span>
              </div>
              <button
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "0.5px solid #2d3748",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Download size={11} /> Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
