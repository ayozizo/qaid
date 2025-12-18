import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function SitePractices() {
  const { data, isLoading } = trpc.publicSite.practices.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border/50 py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">ممارساتنا</h1>
          <p className="text-muted-foreground mt-2">مجالات التخصص والخبرة القانونية.</p>
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="text-muted-foreground">جاري التحميل...</div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((p) => (
              <Card key={p.id} className="card-gold">
                <CardHeader>
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {p.description ? (
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {p.description}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">—</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">لا توجد ممارسات منشورة حالياً.</div>
        )}
      </div>
    </div>
  );
}
