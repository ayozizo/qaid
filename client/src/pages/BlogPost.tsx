import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";

export default function BlogPost() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/blog/:slug");

  const slug = useMemo(() => params?.slug ?? null, [params?.slug]);

  const { data, isLoading } = trpc.blog.publicGetBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: Boolean(match) && Boolean(slug) }
  );

  if (!match || !slug) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">الرابط غير صالح</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/50 border-b border-border/50 py-10">
        <div className="container">
          <Button variant="outline" onClick={() => setLocation("/blog")}>
            رجوع للمدونة
          </Button>
          <h1 className="text-3xl font-bold text-foreground mt-4">{data?.title ?? "مقال"}</h1>
        </div>
      </div>

      <div className="container py-10">
        {isLoading ? (
          <div className="text-muted-foreground">جاري التحميل...</div>
        ) : data ? (
          <Card className="card-gold">
            <CardHeader>
              <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {data.content ? (
                <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {data.content}
                </div>
              ) : (
                <div className="text-muted-foreground">لا يوجد محتوى بعد.</div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-muted-foreground">المقال غير متاح.</div>
        )}
      </div>
    </div>
  );
}
