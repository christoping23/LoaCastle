// /api/online.js  (Vercel Serverless Function)
// Proxies your VPS endpoint to avoid mixed-content issues on HTTPS sites.

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const upstream = "http://198.251.81.173/online_count.php";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const r = await fetch(upstream, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });

    const text = await r.text();

    let count = 0;
    try {
      const data = JSON.parse(text);
      count = Number(data.count ?? 0);
      if (!Number.isFinite(count) || count < 0) count = 0;
    } catch {
      count = 0;
    }

    // Cache at the edge for 5 seconds (protects your VPS)
    res.setHeader("Cache-Control", "s-maxage=5, stale-while-revalidate=25");
    return res.status(200).json({ count: Math.trunc(count) });
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ count: 0 });
  } finally {
    clearTimeout(timeout);
  }
}