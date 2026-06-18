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
} from "lucide-react";

async function fetchDashboardData() {
  // 1. Fetch Pageviews, Subscriptions, dan Financials (Revenue & Profit) dari Backend
  let pageviewsData = { total: 0, trend: "0%", isPositive: true };
  let subscriptionsData = { total: 0, trend: "0%", isPositive: true };
  let financialsData = {
    totalRevenue: 0,
    totalProfit: 0,
    profitTrend: "0%",
    isProfitPositive: true,
  };

  try {
    const [pageviewsRes, subscriptionsRes, financialsRes] = await Promise.all([
      apiClient.get("/analytics/pageviews"),
      apiClient.get("/subscriptions/data"),
      apiClient.get("/orders/financials"), // <-- Data Dinamis Baru
    ]);
    pageviewsData = pageviewsRes.data?.data || pageviewsData;
    subscriptionsData = subscriptionsRes.data?.data || subscriptionsData;
    financialsData = financialsRes.data?.data || financialsData;
  } catch (error) {
    console.error("Gagal mengambil data API:", error);
  }

  // 2. Query Prisma dihapus karena ini di Frontend.
  // Nilai seperti monthlyUsers, deviceData, dll akan otomatis menggunakan
  // nilai dummy yang sudah kamu pasang di komponen UI sampai API-nya siap.

  return {
    pageviews: pageviewsData,
    subscriptions: subscriptionsData,
    totalRevenue: financialsData.totalRevenue, // <-- Memasukkan objek data dinamis
    totalProfit: financialsData.totalProfit, // <-- Memasukkan objek data dinamis
    profitTrend: financialsData.profitTrend, // <-- Memasukkan objek data dinamis
    isProfitPositive: financialsData.isProfitPositive, // <-- Memasukkan objek data dinamis
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

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const revenueChartData = MONTH_NAMES.map((month, i) => ({
    month,
    revenue: Math.round(Math.random() * 60 + 60),
    expenses: Math.round(Math.random() * 40 + 30),
  }));

  const sessionChartData = Array.from({ length: 12 }, (_, i) => ({
    month: MONTH_NAMES[i],
    sessions: Math.round(Math.random() * 100 + 80),
  }));

  const deviceChartData = data?.deviceData?.map((d, i) => ({
    name: d.device || "Unknown",
    value: d._count.device,
  })) || [
    { name: "Desktop", value: 15624 },
    { name: "Phone app", value: 5548 },
    { name: "Laptop", value: 2478 },
  ];

  const totalDeviceUsers = deviceChartData.reduce((s, d) => s + d.value, 0);

  const countryData = data?.countryData || [];

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
          value={formatNumber(data?.monthlyUsers || 23600)}
          trend="8.2%"
          positive
        />
        <MetricCard
          label="New sign-ups"
          value={formatNumber(data?.newSignups || 756)}
          trend="3.1%"
          positive={false}
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
                {/* REVENUE SEKARANG DINAMIS */}
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
                {/* PROFIT SEKARANG DINAMIS */}
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
                  {/* TREND PROFIT SEKARANG DINAMIS */}
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
              {formatNumber(data?.totalSessions || 400)}
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: "rgba(16,185,129,0.15)",
                  color: "#10b981",
                }}
              >
                ↑ 0%
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={sessionChartData}>
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
            <div
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

        {/* Reports Overview */}
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
                <div
                  style={{ fontSize: "13px", fontWeight: 500, color: "#fff" }}
                >
                  {totalDeviceUsers.toLocaleString()}
                </div>
                <div style={{ fontSize: "10px", color: "#64748b" }}>Users</div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
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
              <div style={{ fontSize: "16px", fontWeight: 500, color: "#fff" }}>
                {formatNumber(data?.monthlyUsers || 12400)}
                <span
                  style={{
                    fontSize: "10px",
                    marginLeft: "6px",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: "rgba(16,185,129,0.15)",
                    color: "#10b981",
                  }}
                >
                  ↑ 1.86K
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