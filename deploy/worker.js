const PERFORMANCE_SOURCE_URL =
  "https://script.google.com/macros/s/AKfycbzit_JpLpeDvvlZ-e7j_bT9oF7L_3sWcypPmj2_dhg1A1PCAYor5GeV34m9hpPTXV2gvA/exec";
const performanceFreshForMs = 5 * 60 * 1000;
const performanceRetainSeconds = 24 * 60 * 60;

const securityHeaders = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
};

function withHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([name, value]) => headers.set(name, value));
  if (/\.(?:webp|png|jpe?g|gif|svg|css|js|woff2?)$/i.test(pathname)) {
    headers.set("Cache-Control", "public, max-age=3600");
  } else {
    headers.set("Cache-Control", "no-cache");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function fetchAsset(request, env, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  const assetRequest = new Request(assetUrl, request);
  return env.ASSETS.fetch(assetRequest);
}

function performanceCacheKey(request) {
  const url = new URL(request.url);
  url.pathname = "/api/performance";
  url.search = "";
  return new Request(url.toString(), { method: "GET" });
}

async function updatePerformanceCache(cache, cacheKey) {
  const upstream = await fetch(PERFORMANCE_SOURCE_URL, {
    headers: { Accept: "application/json" },
    redirect: "follow",
  });
  if (!upstream.ok) throw new Error(`Performance source returned ${upstream.status}`);

  const result = await upstream.json();
  if (!result?.ok || !Array.isArray(result.data)) throw new Error("Invalid performance source response");
  const body = JSON.stringify(result);
  const stored = new Response(body, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${performanceRetainSeconds}`,
      "Content-Type": "application/json; charset=utf-8",
      "X-Performance-Cached-At": String(Date.now()),
    },
  });
  await cache.put(cacheKey, stored.clone());
  return stored;
}

function performanceClientResponse(response, cacheStatus) {
  const headers = new Headers(response.headers);
  Object.entries(securityHeaders).forEach(([name, value]) => headers.set(name, value));
  headers.set("Cache-Control", "private, max-age=60, stale-while-revalidate=300");
  headers.set("X-Performance-Cache", cacheStatus);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function servePerformanceFeed(request, context) {
  const cache = caches.default;
  const cacheKey = performanceCacheKey(request);
  const cached = await cache.match(cacheKey);
  if (cached) {
    const cachedAt = Number(cached.headers.get("X-Performance-Cached-At")) || 0;
    const stale = Date.now() - cachedAt > performanceFreshForMs;
    if (stale) {
      context.waitUntil(updatePerformanceCache(cache, cacheKey).catch((error) => console.error(error)));
    }
    return performanceClientResponse(cached, stale ? "STALE" : "HIT");
  }

  try {
    const fresh = await updatePerformanceCache(cache, cacheKey);
    return performanceClientResponse(fresh, "MISS");
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: "Performance feed is temporarily unavailable" }), {
      status: 502,
      headers: {
        ...securityHeaders,
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }
}

export default {
  async fetch(request, env, context) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const url = new URL(request.url);
    if (url.pathname === "/api/performance") {
      const response = await servePerformanceFeed(request, context);
      if (request.method === "HEAD") {
        return new Response(null, { status: response.status, statusText: response.statusText, headers: response.headers });
      }
      return response;
    }

    let pathname = url.pathname;
    if (pathname === "/" || pathname.endsWith("/")) pathname += "index.html";

    let response = await fetchAsset(request, env, pathname);
    if (response.status === 404 && !/\.[^/]+$/.test(pathname)) {
      response = await fetchAsset(request, env, `${pathname}.html`);
    }
    return withHeaders(response, pathname);
  },
};
