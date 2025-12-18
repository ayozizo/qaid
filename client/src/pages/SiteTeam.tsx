import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function SiteTeam() {
  const { data, isLoading } = trpc.publicSite.team.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border/50 py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">فريق العمل</h1>
          <p className="text-muted-foreground mt-2">خبراؤنا على استعداد دائم لتقديم المساعدة.</p>
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="text-muted-foreground">جاري التحميل...</div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((m) => (
              <Card key={m.id} className="card-gold">
                <CardHeader>
                  <CardTitle className="text-lg">{m.name}</CardTitle>
                  {m.title && <div className="text-sm text-muted-foreground">{m.title}</div>}
                </CardHeader>
                <CardContent>
                  {m.bio ? (
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {m.bio}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">—</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">لا توجد بيانات للفريق حالياً.</div>
        )}
      </div>
    </div>
  );
}
