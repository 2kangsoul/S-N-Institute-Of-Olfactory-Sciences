import apiClient from "../../../config/api";
import type { DashboardData } from "./DashboardAdminType";

const safeGet = async (url: string, timeoutMs = 15000) => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await apiClient.get(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`Gagal fetch ${url}:`, err.message);
    return { data: { data: null } };
  }
};

function extractFullName(payload: any) {
  return payload?.data?.fullName?.trim() || payload?.data?.data?.fullName?.trim() || "User";
}

export async function fetchDashboardData(): Promise<DashboardData> {
  let pageviewsData = { total: 0, trend: "0%", isPositive: true };
  let financialsData = { totalRevenue: 0, totalProfit: 0, profitTrend: "0%", isProfitPositive: true };
  let recentOrders: any[] = [];
  let monthlyUsersData = { total: 0, trend: "0%", isPositive: true };
  let newSignUpsData = { total: 0, trend: "0%", isPositive: true };
  let chartData: any[] = [];
  let fullName = "User";
  let monthlyUsersOverview = { totalUsers: 0, byCountry: [], lastUpdated: "" };
  let monthlyUsersSummary = { totalUsers: 0, newUsersThisMonth: 0, newUsersLastMonth: 0, growthPercentage: 0, activeUsers: 0 };

  const [pageviewsRes, financialsRes, monthlyUsersRes, signUpsRes] = await Promise.all([
    safeGet("/analytics/pageviews"),
    safeGet("/orders/financials"),
    safeGet("/users/monthly"),
    safeGet("/signups/data"),
  ]);

  const [monthlyOverviewRes, monthlySummaryRes, userProfileRes, chartRes] = await Promise.all([
    safeGet("/monthly-users/realtime"),
    safeGet("/monthly-users/summary"),
    safeGet("/auth/me"),
    safeGet("/orders/monthly-revenue"),
  ]);

  pageviewsData = pageviewsRes.data?.data || pageviewsData;
  financialsData = financialsRes.data?.data || financialsData;
  monthlyUsersData = monthlyUsersRes.data?.data || monthlyUsersData;
  newSignUpsData = signUpsRes.data?.data || newSignUpsData;
  monthlyUsersOverview = monthlyOverviewRes.data?.data || monthlyUsersOverview;
  monthlyUsersSummary = monthlySummaryRes.data?.data || monthlyUsersSummary;
  fullName = extractFullName(userProfileRes.data);
  chartData = chartRes.data?.data || chartData;

  const recentOrdersRes = await safeGet("/orders/recent");
  recentOrders = recentOrdersRes.data?.data || [];

  return {
    pageviews: pageviewsData,
    totalRevenue: financialsData.totalRevenue,
    totalProfit: financialsData.totalProfit,
    profitTrend: financialsData.profitTrend,
    isProfitPositive: financialsData.isProfitPositive,
    recentOrders,
    monthlyUsers: monthlyUsersData,
    newSignUps: newSignUpsData,
    chartData,
    fullName,
    monthlyUsersOverview,
    monthlyUsersSummary,
  };
}
