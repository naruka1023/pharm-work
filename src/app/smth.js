export default {
  async fetch(request, env, ctx) {
    const cacheUrl = new URL(request.url);
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;
    // Only cache GET for SSR pages
    if (request.method !== "GET") {
      return fetch(request);
    } // Serve from Cloudflare edge cache if available
    let response = await cache.match(cacheKey);
    if (response) {
      console.log("cache exist");
      return response;
    } else {
      console.log("cache doesn't exist");
    }
    console.log("something");
    // Proxy to your Cloud Run SSR origin. Ensure we request the real
    // Cloud Run hostname over HTTPS (don't forward the dev port).
    const originURL = new URL(request.url);
    originURL.protocol = "https:";
    originURL.hostname = "pharm-work-ssr-797947649067.us-central1.run.app";
    originURL.port = "";
    console.log("Fetching from origin:", originURL.toString());
    // Add a timeout so local wrangler/dev doesn't hang indefinitely.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      response = await fetch(originURL.toString(), {
        cf: { cacheEverything: true },
        signal: controller.signal,
        // Forward most headers from the incoming request but ensure Host
        // is set to the origin host.
        headers: request.headers,
      });
    } catch (err) {
      console.error("Origin fetch failed", err);
      return new Response("Origin fetch failed", { status: 502 });
    } finally {
      clearTimeout(timeout);
    }
    // Clone for Cloudflare cache (safe copy of status/headers/body)
    const responseClone = response.clone();
    const responseToCache = new Response(responseClone.body, {
      status: responseClone.status,
      statusText: responseClone.statusText,
      headers: responseClone.headers,
    });
    responseToCache.headers.set("Cache-Control", "public, max-age=86400");
    // Store HTML in cache
    ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));
    return responseToCache;
  },
};
