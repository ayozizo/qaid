import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

export default function SiteTestimonials() {
  const { data, isLoading } = trpc.publicSite.testimonials.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border/50 py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">آراء عملائنا</h1>
          <p className="text-muted-foreground mt-2">بعض الآراء والتجارب من عملائنا.</p>
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="text-muted-foreground">جاري التحميل...</div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.map((t) => (
              <Card key={t.id} className="card-gold">
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">{t.clientName}</CardTitle>
                    <Badge className="bg-gold/15 text-gold border-gold/20">{t.rating}/5</Badge>
                  </div>
                  {t.clientTitle && <div className="text-sm text-muted-foreground">{t.clientTitle}</div>}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {t.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">لا توجد آراء منشورة حالياً.</div>
        )}
      </div>
    </div>
  );
}
