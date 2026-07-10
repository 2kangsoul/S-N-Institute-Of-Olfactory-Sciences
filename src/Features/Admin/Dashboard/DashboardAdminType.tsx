export interface MetricData {
  total: number;
  trend: string;
  isPositive: boolean;
}

export interface SessionsData extends MetricData {
  chartData?: Array<{ month: string; sessions: number }>;
}

export interface FinancialsData {
  totalRevenue: number;
  totalProfit: number;
  profitTrend: string;
  isProfitPositive: boolean;
}

export interface Order {
  orderNumber: string;
  createdAt: Date | string;
  status: string;
  totalAmount: number;
}

export interface DeviceData {
  deviceType?: string;
  device?: string;
  count?: number;
  _count?: { device: number };
}

export interface CountryData {
  country?: string;
  name?: string;
  count: number;
  percentage?: number | null;
  _count?: { country: number };
}

export interface MonthlyUsersOverview {
  totalUsers: number;
  byDevice: Array<{ deviceType: string; count: number }>;
  byCountry: Array<{ country: string; count: number; percentage: number }>;
  lastUpdated: string;
}

export interface MonthlyUsersSummary {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  growthPercentage: number;
  activeUsers: number;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface DashboardData {
  pageviews: MetricData;
  subscriptions: MetricData;
  totalRevenue: number;
  totalProfit: number;
  profitTrend: string;
  isProfitPositive: boolean;
  recentOrders: Order[];
  monthlyUsers: MetricData;
  newSignUps: MetricData;
  chartData: ChartDataPoint[];
  sessions: SessionsData;
  fullName: string;
  monthlyUsersOverview: MonthlyUsersOverview;
  monthlyUsersSummary: MonthlyUsersSummary;
  deviceData?: DeviceData[];
  countryData?: CountryData[];
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend: string;
  positive: boolean;
}

export interface StatusBadgeProps {
  status: string;
}

export interface CreateOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export interface CreateOrderForm {
  orderNumber: string;
  totalAmount: string;
  profitAmount: string;
  note: string;
  status: string;
  userId: string;
}

export interface AnalyticsModalProps {
  onClose: () => void;
  data: Partial<DashboardData>;
  deviceChartData: Array<{ name: string; value: number }>;
  totalDeviceUsers: number;
  countryData: Array<{ name: string; count: number; percentage: number | null }>;
}
