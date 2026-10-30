import { unstable_cache } from "next/cache";

const API_PATH = "/api/v1";

type ShelfResponse = {
  pagination?: { totalItems?: number };
};

const apiBase = (url: string) => {
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith(API_PATH) ? trimmed : `${trimmed}${API_PATH}`;
};

async function fetchReadCount(): Promise<number> {
  const baseUrl = process.env.TRAPICHE_BASE_URL;
  const apiKey = process.env.TRAPICHE_API_KEY;
  if (!baseUrl || !apiKey) throw new Error("Trapiche is not configured");

  const response = await fetch(
    `${apiBase(baseUrl)}/shelf?status=READ&per_page=1`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error(`Trapiche responded ${response.status}`);

  const body = (await response.json()) as ShelfResponse;
  const total = body.pagination?.totalItems;
  if (typeof total !== "number")
    throw new Error("Unexpected Trapiche response");
  return total;
}

const cachedReadCount = unstable_cache(
  fetchReadCount,
  ["trapiche-read-count"],
  {
    revalidate: 60 * 60 * 12,
  },
);

export async function getReadCount(): Promise<number | null> {
  try {
    return await cachedReadCount();
  } catch {
    return null;
  }
}

export const getTrapicheProfileUrl = () =>
  process.env.TRAPICHE_PROFILE_URL || null;
