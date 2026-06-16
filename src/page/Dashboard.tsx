// @ts-nocheck
/* eslint-disable */

import React, { useState, useEffect } from "react";
import backendlessApi from "./../config/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [dataPenjualan, setDataPenjualan] = useState<any[]>([]);
  const [dataBlog, setDataBlog] = useState<any[]>([]);
  const [dataTraffic, setDataTraffic] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");

  // Logika hitung persentase kenaikan/penurunan
  const calculatePercentage = (currentData: any[]) => {
    if (!currentData || currentData.length === 0) {
      return { val: "0.0", color: "text-gray-400", icon: "-" };
    }

    const now = new Date().getTime();
    const sixHoursAgo = now - 6 * 60 * 60 * 1000;

    const recent = currentData.filter(
      (item) => item.created && new Date(item.created).getTime() > sixHoursAgo,
    ).length;
    const old = currentData.length - recent;

    if (old === 0) return { val: "100.0", color: "text-green-600", icon: "↑" };

    const diff = (recent / old) * 100;

    return {
      val: diff.toFixed(1),
      color: diff > 0 ? "text-green-600" : "text-gray-500",
      icon: diff > 0 ? "↑" : "-",
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, blogsRes, trafficRes] = await Promise.all([
          backendlessApi.get("data/Transactions"),
          backendlessApi.get("data/Blogs"),
          backendlessApi.get("data/Traffic"),
        ]);

        const rawTransactions = transactionsRes.data;
        const rawBlogs = blogsRes.data;

        const groupedSales = rawTransactions.reduce((acc: any, curr: any) => {
          const date = new Date(curr.created);
          const month = date.toLocaleString("id-ID", { month: "short" });
          if (!acc[month]) acc[month] = 0;
          acc[month] += curr.total_amount || 0;
          return acc;
        }, {});

        const formattedBlogs = rawBlogs
          .map((blog: any) => ({
            artikel: blog.title || "Tanpa Judul",
            likes: blog.likes || 0,
            created: blog.created,
          }))
          .sort((a: any, b: any) => b.likes - a.likes)
          .slice(0, 5);

        setDataPenjualan(rawTransactions);
        setDataBlog(formattedBlogs);
        setDataTraffic(trafficRes.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    let targetTime = localStorage.getItem("targetTime");
    if (!targetTime) {
      targetTime = (new Date().getTime() + 6 * 60 * 60 * 1000).toString();
      localStorage.setItem("targetTime", targetTime);
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = parseInt(targetTime!) - now;

      if (distance < 0) {
        const newTarget = (
          new Date().getTime() +
          6 * 60 * 60 * 1000
        ).toString();
        localStorage.setItem("targetTime", newTarget);
        window.location.reload();
        return;
      }

      const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h}j ${m}m ${s}d`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const chartPenjualan = dataPenjualan.reduce((acc: any, curr: any) => {
    const date = new Date(curr.created);
    const month = date.toLocaleString("id-ID", { month: "short" });
    if (!acc[month]) acc[month] = 0;
    acc[month] += curr.total_amount || 0;
    return acc;
  }, {});
  const dataChartPenjualan = Object.keys(chartPenjualan).map((key) => ({
    bulan: key,
    penjualan: chartPenjualan[key],
  }));

  const totalTransaksi = dataPenjualan.reduce(
    (sum, item) => sum + (item.total_amount || 0),
    0,
  );
  const indArtikel = calculatePercentage(dataBlog);
  const indTraffic = calculatePercentage(dataTraffic);

  const totalTraffic = dataTraffic.length;
  const totalTransaksiCount = dataPenjualan.length;
  const totalLikes = dataBlog.reduce((sum, item) => sum + (item.likes || 0), 0);

  const conversionRate =
    totalTraffic > 0
      ? ((totalTransaksiCount / totalTraffic) * 100).toFixed(1)
      : "0.0";
  const engagementRate =
    totalTraffic > 0 ? ((totalLikes / totalTraffic) * 100).toFixed(1) : "0.0";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          Dashboard Overview
        </h1>
        <div className="text-sm font-mono bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-full shadow-sm">
          Next update: {timeLeft}
        </div>
      </div>

      {/* 4 KOTAK DENGAN BACKGROUND PUTIH & TEKS HITAM */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        style={{
          fontFamily: '"Arimo", sans-serif',
          fontSize: "1.3rem",
          fontWeight: "bold",
        }}
      >
        <div className="bg-white text-black rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform duration-300">
          <p className="text-md opacity-70">Total Like</p>
          <h2 className="text-4xl font-bold mt-2">{totalLikes}</h2>
          <p className={`text-sm mt-2 font-bold ${indArtikel.color}`}>
            {indArtikel.icon} {indArtikel.val}%
          </p>
        </div>

        <div className="bg-white text-black rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform duration-300">
          <p className="text-md opacity-70">Traffic</p>
          <h2 className="text-4xl font-bold mt-2">{dataTraffic.length}</h2>
          <p className={`text-sm mt-2 font-bold ${indTraffic.color}`}>
            {indTraffic.icon} {indTraffic.val}%
          </p>
        </div>

        <div className="bg-white text-black rounded-xl shadow-lg p-6 hover:-translate-y-1 transition-transform duration-300">
          <p className="text-md opacity-70">Total Transaksi</p>
          <h2 className="text-2xl md:text-2xl lg:text-xl xl:text-2xl font-bold mt-2 truncate">
            {totalTransaksi.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </h2>
        </div>

        <div className="bg-white text-black rounded-xl shadow-lg p-6 flex flex-col justify-center hover:-translate-y-1 transition-transform duration-300">
          <p className="text-md opacity-70 mb-2">Performance</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1">
              <span className="text-xs opacity-70">Konversi:</span>
              <span className="text-lg font-bold">{conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs opacity-70">Interaksi:</span>
              <span className="text-lg font-bold">{engagementRate}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-white">
            Statistik Pendapatan per Bulan
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dataChartPenjualan}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                vertical={false}
              />
              <XAxis dataKey="bulan" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#fff",
                  borderRadius: "8px",
                }}
                formatter={(value: any) =>
                  `Rp ${Number(value).toLocaleString("id-ID")}`
                }
              />
              <Legend wrapperStyle={{ color: "#9ca3af" }} />
              <Line
                type="monotone"
                dataKey="penjualan"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 8 }}
                name="Total Pendapatan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Top Artikel</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={dataBlog}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="artikel"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(val) =>
                  val.length > 8 ? val.substring(0, 8) + "..." : val
                }
              />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="likes"
                fill="#f97316"
                name="Jumlah Like"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
