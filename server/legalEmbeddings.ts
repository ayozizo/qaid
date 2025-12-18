import { ENV } from "./_core/env";

type EmbeddingResponse = {
  data: Array<{ embedding: number[] }>;
};

function resolveEmbeddingsApiUrl() {
  if (!ENV.openaiApiKey || ENV.openaiApiKey.trim().length === 0) {
    throw new Error("OPENAI_API_KEY is required for embeddings");
  }
  return "https://api.openai.com/v1/embeddings";
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const url = resolveEmbeddingsApiUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${ENV.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Embeddings request failed: ${response.status} ${response.statusText}${detail ? ` – ${detail}` : ""}`);
  }

  const payload = (await response.json()) as EmbeddingResponse;
  return (payload.data ?? []).map((d) => d.embedding ?? []);
}

export async function embedText(text: string): Promise<number[]> {
  const vectors = await embedTexts([text]);
  return vectors[0] ?? [];
}
