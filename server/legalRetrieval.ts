import * as db from "./db";
import { ENV } from "./_core/env";
import { embedText } from "./legalEmbeddings";

export type RetrievedLegalSnippet = {
  text: string;
  score: number;
  source: string;
  url: string;
  title: string | null;
  meta: Record<string, unknown> | null;
};

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || value.trim().length === 0) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function dot(a: number[], b: number[]) {
  let s = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}

function norm(a: number[]) {
  return Math.sqrt(dot(a, a));
}

function cosineSimilarity(a: number[], b: number[]) {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return 0;
  return dot(a, b) / (na * nb);
}

export async function retrieveLegalSnippets(params: {
  query: string;
  topK?: number;
  scanLimit?: number;
}): Promise<RetrievedLegalSnippet[]> {
  const topK = params.topK ?? 6;
  const scanLimit = params.scanLimit ?? 400;

  if (!ENV.openaiApiKey || ENV.openaiApiKey.trim().length === 0) {
    // Embeddings not available; retrieval disabled.
    return [];
  }

  const queryVector = await embedText(params.query);
  if (!queryVector.length) return [];

  const rows: any[] = (await db.listLegalChunksWithEmbeddings({ limit: scanLimit })) as any[];

  const scored: RetrievedLegalSnippet[] = rows
    .map((r) => {
      const embedding = safeJsonParse<number[]>(r.embeddingJson, []);
      const score = cosineSimilarity(queryVector, embedding);
      const meta = safeJsonParse<Record<string, unknown> | null>(r.metaJson, null);

      return {
        text: String(r.text ?? ""),
        score,
        source: String((r.source ?? (r.document?.source ?? "")) as any),
        url: String((r.url ?? (r.document?.url ?? "")) as any),
        title: (r.title ?? (r.document?.title ?? null)) as string | null,
        meta,
      };
    })
    .filter((x) => x.text.trim().length > 0 && x.url.trim().length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

export function formatSnippetsForPrompt(snippets: RetrievedLegalSnippet[]) {
  if (snippets.length === 0) {
    return "لا توجد مقتطفات متاحة حالياً من قاعدة المعرفة الرسمية.";
  }

  const lines: string[] = [];
  lines.push("مقتطفات من مصادر رسمية (لا تعتمد على أي معلومة خارج هذه المقتطفات عند ذكر مواد/نصوص):");

  snippets.forEach((s, idx) => {
    const title = s.title ? ` | ${s.title}` : "";
    lines.push(`\n[${idx + 1}] المصدر: ${s.source}${title}`);
    lines.push(`الرابط: ${s.url}`);
    lines.push(`المقتطف:\n${s.text}`);
  });

  return lines.join("\n");
}
