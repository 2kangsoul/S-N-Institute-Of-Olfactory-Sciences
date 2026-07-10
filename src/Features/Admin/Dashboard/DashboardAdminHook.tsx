import { useState, useEffect } from "react";
import { fetchDashboardData } from "./DashboardAdminApi";
import type { DashboardData } from "./DashboardAdminType";

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

function formatNumber(val: number) {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return `${val}`;
}

export function useDashboard() {
  const [data, setData] = useState<Partial<DashboardData>>({
    fullName: "User",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

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

  const deviceChartData = data?.monthlyUsersOverview?.byDevice?.length
    ? data.monthlyUsersOverview.byDevice.map((d) => ({
        name: d.deviceType,
        value: d.count,
      }))
    : data?.deviceData?.map((d) => ({
        name: d.device || "Unknown",
        value: d._count?.device ?? 0,
      })) || [
        { name: "Desktop", value: 15624 },
        { name: "Phone app", value: 5548 },
        { name: "Laptop", value: 2478 },
      ];

  const totalDeviceUsers =
    data?.monthlyUsersOverview?.totalUsers ||
    deviceChartData.reduce((s, d) => s + d.value, 0);

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

  const growthValue = data?.monthlyUsersSummary?.newUsersThisMonth
    ? `↑ ${formatNumber(data.monthlyUsersSummary.newUsersThisMonth)}`
    : "↑ 1.86K";
  const isGrowthPositive =
    data?.monthlyUsersSummary?.growthPercentage !== undefined
      ? data.monthlyUsersSummary.growthPercentage >= 0
      : true;

  return {
    data,
    isLoading,
    showCreateOrder,
    setShowCreateOrder,
    showAnalytics,
    setShowAnalytics,
    loadData,
    revenueChartData,
    sessionChartData,
    deviceChartData,
    totalDeviceUsers,
    countryData,
    growthValue,
    isGrowthPositive,
  };
}
