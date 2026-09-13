import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let cachedCount: number = 1;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

export async function GET() {
  const now = Date.now();

  // If cached recently and valid, return cached value to stay fast and avoid rate limits
  if (now - lastFetchTime < CACHE_TTL_MS && cachedCount > 1) {
    return NextResponse.json({
      count: cachedCount,
      formatted: cachedCount.toLocaleString(),
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(
      "https://api.visitorbadge.io/api/visitors?path=a-ldnstntng.myportfolio",
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "Mozilla/5.0 (compatible; AliAndreiPortfolio/1.0)",
        },
        cache: "no-store",
      }
    );

    clearTimeout(timeoutId);

    if (res.ok) {
      const text = await res.text();
      const match = text.match(/aria-label="VISITORS:\s*([^"]+)"/i);
      if (match && match[1]) {
        const raw = match[1].replace(/,/g, "").trim();
        const num = parseInt(raw, 10);
        if (!isNaN(num) && num > 0) {
          cachedCount = num;
          lastFetchTime = now;
          return NextResponse.json({
            count: cachedCount,
            formatted: cachedCount.toLocaleString(),
          });
        }
      }
    }
  } catch (err) {
    console.warn("Visitor count fetch warning, falling back to cache:", err);
  } finally {
    clearTimeout(timeoutId);
  }

  return NextResponse.json({
    count: cachedCount,
    formatted: cachedCount.toLocaleString(),
  });
}
