import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { MoreVertical, Phone, Mail, ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Status = "new" | "in_progress" | "completed" | "cancelled";

const statusLabel: Record<Status, string> = {
  new: "جديد",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

const statusBadgeClass: Record<Status, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function ServiceRequestsAdmin() {
  const utils = trpc.useUtils();
  const [filter, setFilter] = useState<"all" | Status>("all");

  const { data: services } = trpc.services.adminList.useQuery();
  const { data: requests, isLoading } = trpc.serviceRequests.list.useQuery(
    filter === "all" ? undefined : { status: filter }
  );

  const updateRequest = trpc.serviceRequests.update.useMutation();

  const serviceTitleById = useMemo(() => {
    const map = new Map<number, string>();
    for (const s of services ?? []) {
      map.set(s.id, s.title);
    }
    return map;
  }, [services]);

  const setStatus = async (id: number, status: Status) => {
    try {
      await updateRequest.mutateAsync({ id, status });
      await utils.serviceRequests.list.invalidate();
      toast.success("تم تحديث حالة الطلب");
    } catch (e: any) {
      toast.error(e?.message ?? "تعذر تحديث حالة الطلب");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">طلبات الخدمات</h1>
          <p className="text-muted-foreground">تابع طلبات العملاء وحدّث حالتها.</p>
        </div>

        <Card className="card-gold">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-gold" />
              قائمة الطلبات
            </CardTitle>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="new">جديد</TabsTrigger>
                <TabsTrigger value="in_progress">قيد التنفيذ</TabsTrigger>
                <TabsTrigger value="completed">مكتمل</TabsTrigger>
                <TabsTrigger value="cancelled">ملغي</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground">جاري تحميل الطلبات...</div>
            ) : requests && requests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العميل</TableHead>
                    <TableHead>الخدمة</TableHead>
                    <TableHead>الموعد المفضل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => {
                    const status = (r.status ?? "new") as Status;
                    const preferredAt = r.preferredAt ? new Date(r.preferredAt as any) : null;
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-medium">{r.clientName}</div>
                          <div className="text-xs text-muted-foreground mt-1 space-y-1">
                            {r.clientPhone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{r.clientPhone}</span>
                              </div>
                            )}
                            {r.clientEmail && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{r.clientEmail}</span>
                              </div>
                            )}
                          </div>
                          {r.notes && (
                            <div className="text-xs text-muted-foreground mt-2 max-w-[420px] truncate">
                              {r.notes}
                            </div>
                          )}
                        </TableCell>

                        <TableCell>
                          {r.serviceId ? serviceTitleById.get(r.serviceId) ?? `#${r.serviceId}` : "—"}
                        </TableCell>

                        <TableCell>
                          {preferredAt ? preferredAt.toLocaleString("ar-SA") : "—"}
                        </TableCell>

                        <TableCell>
                          <Badge className={statusBadgeClass[status]}>{statusLabel[status]}</Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setStatus(r.id, "new")}>
                                تعيين: جديد
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatus(r.id, "in_progress")}>
                                تعيين: قيد التنفيذ
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatus(r.id, "completed")}>
                                تعيين: مكتمل
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatus(r.id, "cancelled")}>
                                تعيين: ملغي
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-muted-foreground">لا توجد طلبات حالياً.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
