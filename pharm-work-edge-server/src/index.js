// src/index.js
var index_default = {
	async fetch(request, env, ctx) {
		const cacheUrl = new URL(request.url);
		const cacheKey = new Request(cacheUrl.toString(), request);
		const cache = caches.default;
		console.log('request url: ', request.url.split('.dev/'));
		// classify request: HTML/SSR pages vs static assets by extension
		const pathname = cacheUrl.pathname || '/';
		const assetExt = (pathname.match(/\.([a-z0-9]+)(?:$|\?)/i) || [])[1];
		const staticExts = new Set([
			'js',
			'css',
			'map',
			'png',
			'jpg',
			'jpeg',
			'gif',
			'webp',
			'svg',
			'ico',
			'woff',
			'woff2',
			'ttf',
			'eot',
			'json',
			'webmanifest',
		]);
		const isStaticAsset = assetExt && staticExts.has(assetExt.toLowerCase());
		if (request.method !== 'GET') {
			return fetch(request);
		}
		let response = await cache.match(cacheKey);
		if (response) {
			console.log('cache exist');
			return response;
		} else {
			console.log("cache doesn't exist");
		}
		const originURL = new URL(request.url);
		originURL.protocol = 'https:';
		originURL.hostname = 'pharm-work-ssr-797947649067.us-central1.run.app';
		originURL.port = '';
		console.log('Fetching from origin:', originURL.toString());
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 3e4);
		try {
			// Build fetch options: HTML pages should be cached as full HTML at
			// the edge (cacheEverything) while static assets rely on origin
			// cache headers and are cached with a long TTL at the edge.
			const fetchOptions = {
				signal: controller.signal,
				headers: request.headers,
			};
			if (!isStaticAsset) {
				fetchOptions.cf = { cacheEverything: true };
			}
			response = await fetch(originURL.toString(), fetchOptions);
		} catch (err) {
			console.error('Origin fetch failed', err);
			return new Response('Origin fetch failed', { status: 502 });
		} finally {
			clearTimeout(timeout);
		}
		const responseClone = response.clone();
		const responseToCache = new Response(responseClone.body, {
			status: responseClone.status,
			statusText: responseClone.statusText,
			headers: responseClone.headers,
		});
		// Set different TTLs: long for static assets, short for SSR HTML
		if (isStaticAsset) {
			responseToCache.headers.set('Cache-Control', 'public, max-age=2592000');
		} else {
			responseToCache.headers.set('Cache-Control', 'public, max-age=60');
		}
		ctx.waitUntil(cache.put(cacheKey, responseToCache.clone()));
		return responseToCache;
	},
};
export { index_default as default };
//# sourceMappingURL=index.js.map
