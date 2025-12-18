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
import { Mail, MessageSquareText, MoreVertical, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Status = "new" | "replied" | "closed";

const statusLabel: Record<Status, string> = {
  new: "جديد",
  replied: "تم الرد",
  closed: "مغلق",
};

const badgeClass: Record<Status, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  replied: "bg-green-500/20 text-green-400 border-green-500/30",
  closed: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export default function CmsContactMessagesAdmin() {
  const utils = trpc.useUtils();
  const [filter, setFilter] = useState<"all" | Status>("all");
  const { data, isLoading } = trpc.cms.contactMessagesList.useQuery(
    filter === "all" ? undefined : { status: filter }
  );
  const update = trpc.cms.contactMessagesUpdateStatus.useMutation();

  const setStatus = async (id: number, status: Status) => {
    try {
      await update.mutateAsync({ id, status });
      await utils.cms.contactMessagesList.invalidate();
      toast.success("تم تحديث الحالة");
    } catch (e: any) {
      toast.error(e?.message ?? "تعذر تحديث الحالة");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">رسائل التواصل</h1>
          <p className="text-muted-foreground">متابعة رسائل صفحة اتصل بنا.</p>
        </div>

        <Card className="card-gold">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-gold" />
              الرسائل
            </CardTitle>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="new">جديد</TabsTrigger>
                <TabsTrigger value="replied">تم الرد</TabsTrigger>
                <TabsTrigger value="closed">مغلق</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground">جاري التحميل...</div>
            ) : data && data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المرسل</TableHead>
                    <TableHead>الرسالة</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-right">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((m) => {
                    const status = (m.status ?? "new") as Status;
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 space-y-1">
                            {m.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{m.phone}</span>
                              </div>
                            )}
                            {m.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span>{m.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed max-w-[620px]">
                            {m.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={badgeClass[status]}>{statusLabel[status]}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setStatus(m.id, "new")}>تعيين: جديد</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatus(m.id, "replied")}>تعيين: تم الرد</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setStatus(m.id, "closed")}>تعيين: مغلق</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-muted-foreground">لا توجد رسائل.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
