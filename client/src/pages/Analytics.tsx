import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Users,
  Receipt,
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = {
  gold: "#D4AF37",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
  orange: "#f97316",
  cyan: "#06b6d4",
};

export default function Analytics() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  const winRate = stats?.winRate ?? 0;
  const totalCases = stats?.totalCases ?? 0;
  const wonCases = stats?.wonCases ?? 0;
  const lostCases = stats?.lostCases ?? 0;
  const pendingCases = stats?.pendingCases ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;

  const monthlyData = [
    {
      month: "هذا الشهر",
      cases: totalCases,
      revenue: totalRevenue,
    },
  ];

  const caseOutcomeData = totalCases
    ? [
        { name: "مكسوبة", value: wonCases, color: COLORS.green },
        { name: "خاسرة", value: lostCases, color: COLORS.red },
        { name: "قيد المعالجة", value: pendingCases, color: COLORS.gold },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-gold" />
            التحليلات والتقارير
          </h1>
          <p className="text-muted-foreground mt-1">
            نظرة شاملة على أداء المكتب القانوني
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-gold">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">نسبة النجاح</p>
                  <p className="text-3xl font-bold text-gold mt-1">{winRate}%</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">-</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gold">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">القضايا النشطة</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stats?.activeCases ?? 0}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">-</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gold">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">العملاء</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stats?.totalClients ?? 0}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">-</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gold">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">الإيرادات</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {(totalRevenue / 1000).toFixed(0)}K
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-muted-foreground">-</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Cases & Revenue */}
          <Card className="card-gold">
            <CardHeader>
              <CardTitle className="text-lg">القضايا والإيرادات الشهرية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#888" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="cases"
                      name="القضايا"
                      fill={COLORS.gold}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      name="الإيرادات"
                      fill={COLORS.blue}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Case Types Distribution */}
          <Card className="card-gold">
            <CardHeader>
              <CardTitle className="text-lg">توزيع أنواع القضايا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">لا توجد بيانات كافية لعرض توزيع الأنواع</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Outcomes */}
          <Card className="card-gold">
            <CardHeader>
              <CardTitle className="text-lg">نتائج القضايا</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {caseOutcomeData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">لا توجد بيانات</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={caseOutcomeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {caseOutcomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="card-gold lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">مؤشرات الأداء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      معدل إغلاق القضايا
                    </span>
                    <span className="text-sm font-medium text-foreground">-</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      رضا العملاء
                    </span>
                    <span className="text-sm font-medium text-foreground">-</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      تحصيل المستحقات
                    </span>
                    <span className="text-sm font-medium text-foreground">-</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      الالتزام بالمواعيد
                    </span>
                    <span className="text-sm font-medium text-foreground">-</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-gold">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">قضايا مكسوبة</p>
                  <p className="text-2xl font-bold text-green-400">
                    {wonCases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gold">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">قيد المعالجة</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {pendingCases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gold">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Scale className="h-7 w-7 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">تسويات</p>
                  <p className="text-2xl font-bold text-gold">
                    {0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
