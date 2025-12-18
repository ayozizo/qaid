import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function LegalTools() {
  const translate = trpc.legalTools.translate.useMutation();
  const compareTexts = trpc.legalTools.compareTexts.useMutation();
  const predict = trpc.legalTools.predictCaseOutcome.useMutation();
  const inheritance = trpc.legalTools.inheritanceEstimate.useMutation();

  const { data: subscription, isLoading: subscriptionLoading } = trpc.subscriptions.me.useQuery(undefined, {
    staleTime: 30_000,
  });

  const { data: cases } = trpc.cases.list.useQuery(undefined, { staleTime: 30_000 });

  const [tab, setTab] = useState("translate");

  const [targetLanguage, setTargetLanguage] = useState<"ar" | "en">("ar");
  const [tone, setTone] = useState<"formal" | "simple">("formal");
  const [translateText, setTranslateText] = useState("");

  const [leftTitle, setLeftTitle] = useState("");
  const [rightTitle, setRightTitle] = useState("");
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [focus, setFocus] = useState<"general" | "risks" | "differences" | "compliance">("general");

  const [caseId, setCaseId] = useState<number | null>(null);
  const [caseSummary, setCaseSummary] = useState("");

  const [inheritanceScenario, setInheritanceScenario] = useState("");

  const selectedCase = useMemo(() => (cases ?? []).find((c) => c.id === caseId) ?? null, [cases, caseId]);

  const entitlements = subscription?.toolEntitlements;
  const canUse = {
    translate:
      subscriptionLoading ||
      (Boolean(entitlements?.translate?.enabled) &&
        (entitlements?.translate?.remaining === null || (entitlements?.translate?.remaining ?? 0) > 0)),
    compareTexts:
      subscriptionLoading ||
      (Boolean(entitlements?.compareTexts?.enabled) &&
        (entitlements?.compareTexts?.remaining === null || (entitlements?.compareTexts?.remaining ?? 0) > 0)),
    predictCaseOutcome:
      subscriptionLoading ||
      (Boolean(entitlements?.predictCaseOutcome?.enabled) &&
        (entitlements?.predictCaseOutcome?.remaining === null || (entitlements?.predictCaseOutcome?.remaining ?? 0) > 0)),
    inheritanceEstimate:
      subscriptionLoading ||
      (Boolean(entitlements?.inheritanceEstimate?.enabled) &&
        (entitlements?.inheritanceEstimate?.remaining === null || (entitlements?.inheritanceEstimate?.remaining ?? 0) > 0)),
  };

  const isEnabled = {
    translate: subscriptionLoading ? true : Boolean(entitlements?.translate?.enabled),
    compareTexts: subscriptionLoading ? true : Boolean(entitlements?.compareTexts?.enabled),
    predictCaseOutcome: subscriptionLoading ? true : Boolean(entitlements?.predictCaseOutcome?.enabled),
    inheritanceEstimate: subscriptionLoading ? true : Boolean(entitlements?.inheritanceEstimate?.enabled),
  };

  const remainingLabel = (remaining: number | null | undefined) =>
    remaining === null ? "غير محدود" : typeof remaining === "number" ? String(remaining) : "—";

  const planLabel = (plan?: string) => {
    if (plan === "enterprise") return "منشأة";
    if (plan === "law_firm") return "مكتب محاماة";
    if (plan === "individual") return "فردي";
    return plan ?? "—";
  };

  const runTranslate = async () => {
    if (!translateText.trim()) {
      toast.error("أدخل النص أولاً");
      return;
    }
    try {
      if (!canUse.translate) {
        toast.error("لا يمكنك استخدام أداة الترجمة حالياً (غير متاحة أو تم الوصول للحد اليومي)");
        return;
      }
      await translate.mutateAsync({ text: translateText, targetLanguage, tone });
    } catch (e: any) {
      toast.error(e?.message ?? "تعذر تنفيذ الترجمة");
    }
  };

  const runCompare = async () => {
    if (!leftText.trim() || !rightText.trim()) {
      toast.error("أدخل النصين أولاً");
      return;
    }
    try {
      if (!canUse.compareTexts) {
        toast.error("لا يمكنك استخدام أداة المقارنة حالياً (غير متاحة أو تم الوصول للحد اليومي)");
        return;
      }
      await compareTexts.mutateAsync({
        leftTitle: leftTitle.trim() ? leftTitle : null,
        rightTitle: rightTitle.trim() ? rightTitle : null,
        leftText,
        rightText,
        focus,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "تعذر تنفيذ المقارنة");
    }
  };

  const runPredict = async () => {
    if (!caseSummary.trim()) {
      toast.error("أدخل ملخص القضية أولاً");
      return;
    }
    try {
      if (!canUse.predictCaseOutcome) {
        toast.error("لا يمكنك استخدام أداة التوقع حالياً (غير متاحة أو تم الوصول للحد اليومي)");
        return;
      }
      await predict.mutateAsync({ caseId, caseSummary });
    } catch (e: any) {
      toast.error(e?.message ?? "تعذر تنفيذ التوقع");
    }
  };

  const runInheritance = async () => {
    if (!inheritanceScenario.trim()) {
      toast.error("أدخل تفاصيل الحالة أولاً");
      return;
    }
    try {
      if (!canUse.inheritanceEstimate) {
        toast.error("لا يمكنك استخدام أداة المواريث حالياً (غير متاحة أو تم الوصول للحد اليومي)");
        return;
      }
      await inheritance.mutateAsync({ scenario: inheritanceScenario });
    } catch (e: any) {
      toast.error(e?.message ?? "تعذر تنفيذ الحاسبة");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">الأدوات القانونية الذكية</h1>
          <p className="text-muted-foreground">ترجمة، مقارنة، توقع سيناريوهات، وحاسبة مواريث تقديرية.</p>
          {subscription?.organization && (
            <p className="text-xs text-muted-foreground mt-2">
              الخطة: {planLabel(subscription.organization.plan)} | عدد المستخدمين: {subscription.organization.seatLimit}
            </p>
          )}
          {subscriptionLoading && (
            <p className="text-xs text-muted-foreground mt-2">جاري تحميل الصلاحيات والحدود...</p>
          )}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="translate" disabled={!isEnabled.translate}>
              ترجمة ({remainingLabel(entitlements?.translate?.remaining)})
            </TabsTrigger>
            <TabsTrigger value="compare" disabled={!isEnabled.compareTexts}>
              مقارنة ({remainingLabel(entitlements?.compareTexts?.remaining)})
            </TabsTrigger>
            <TabsTrigger value="predict" disabled={!isEnabled.predictCaseOutcome}>
              توقع ({remainingLabel(entitlements?.predictCaseOutcome?.remaining)})
            </TabsTrigger>
            <TabsTrigger value="inheritance" disabled={!isEnabled.inheritanceEstimate}>
              مواريث ({remainingLabel(entitlements?.inheritanceEstimate?.remaining)})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translate">
            <Card className="card-gold">
              <CardHeader>
                <CardTitle>الترجمة القانونية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>اللغة المستهدفة</Label>
                    <Select value={targetLanguage} onValueChange={(v) => setTargetLanguage(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>النبرة</Label>
                    <Select value={tone} onValueChange={(v) => setTone(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">رسمي</SelectItem>
                        <SelectItem value="simple">مبسّط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>النص</Label>
                  <Textarea value={translateText} onChange={(e) => setTranslateText(e.target.value)} rows={8} />
                </div>

                <Button
                  className="btn-gold"
                  onClick={runTranslate}
                  disabled={subscriptionLoading || translate.isPending || !canUse.translate}
                >
                  {translate.isPending ? "جاري التنفيذ..." : "ترجم"}
                </Button>

                <div className="space-y-2">
                  <Label>النتيجة</Label>
                  <Textarea value={translate.data?.translation ?? ""} readOnly rows={10} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare">
            <Card className="card-gold">
              <CardHeader>
                <CardTitle>مقارنة نصين/وثيقتين</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>عنوان النص A (اختياري)</Label>
                    <Input value={leftTitle} onChange={(e) => setLeftTitle(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>عنوان النص B (اختياري)</Label>
                    <Input value={rightTitle} onChange={(e) => setRightTitle(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>نطاق المقارنة</Label>
                  <Select value={focus} onValueChange={(v) => setFocus(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="differences">الفروقات</SelectItem>
                      <SelectItem value="risks">المخاطر</SelectItem>
                      <SelectItem value="compliance">الامتثال</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>النص A</Label>
                    <Textarea value={leftText} onChange={(e) => setLeftText(e.target.value)} rows={10} />
                  </div>
                  <div className="space-y-2">
                    <Label>النص B</Label>
                    <Textarea value={rightText} onChange={(e) => setRightText(e.target.value)} rows={10} />
                  </div>
                </div>

                <Button
                  className="btn-gold"
                  onClick={runCompare}
                  disabled={subscriptionLoading || compareTexts.isPending || !canUse.compareTexts}
                >
                  {compareTexts.isPending ? "جاري التنفيذ..." : "قارن"}
                </Button>

                <div className="space-y-2">
                  <Label>النتيجة</Label>
                  <Textarea value={compareTexts.data?.analysis ?? ""} readOnly rows={14} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predict">
            <Card className="card-gold">
              <CardHeader>
                <CardTitle>توقع سيناريوهات نتيجة قضية (غير ملزم)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>اختيار قضية من النظام (اختياري)</Label>
                  <Select
                    value={caseId ? String(caseId) : "none"}
                    onValueChange={(v) => setCaseId(v === "none" ? null : Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="بدون" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون</SelectItem>
                      {(cases ?? []).slice(0, 200).map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.caseNumber} - {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCase && (
                    <div className="text-xs text-muted-foreground mt-1">
                      النوع: {selectedCase.type} - الحالة: {selectedCase.status}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>ملخص القضية</Label>
                  <Textarea value={caseSummary} onChange={(e) => setCaseSummary(e.target.value)} rows={10} />
                </div>

                <Button
                  className="btn-gold"
                  onClick={runPredict}
                  disabled={subscriptionLoading || predict.isPending || !canUse.predictCaseOutcome}
                >
                  {predict.isPending ? "جاري التنفيذ..." : "حلّل السيناريوهات"}
                </Button>

                <div className="space-y-2">
                  <Label>النتيجة</Label>
                  <Textarea value={predict.data?.analysis ?? ""} readOnly rows={14} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inheritance">
            <Card className="card-gold">
              <CardHeader>
                <CardTitle>حاسبة مواريث (تقديرية)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  هذه نتيجة تعليمية تقديرية وليست فتوى/استشارة ملزمة.
                </div>

                <div className="space-y-2">
                  <Label>وصف الحالة</Label>
                  <Textarea
                    value={inheritanceScenario}
                    onChange={(e) => setInheritanceScenario(e.target.value)}
                    rows={10}
                    placeholder="مثال: توفي رجل وترك زوجة وأم وابن وبنتين... قيمة التركة... هل هناك وصية..."
                  />
                </div>

                <Button
                  className="btn-gold"
                  onClick={runInheritance}
                  disabled={subscriptionLoading || inheritance.isPending || !canUse.inheritanceEstimate}
                >
                  {inheritance.isPending ? "جاري التنفيذ..." : "احسب تقديرياً"}
                </Button>

                <div className="space-y-2">
                  <Label>النتيجة</Label>
                  <Textarea value={inheritance.data?.analysis ?? ""} readOnly rows={14} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
