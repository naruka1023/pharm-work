## Quick orientation for AI coding agents

This repo is an Angular application with Server-Side Rendering (SSR) and Firebase-related pieces. Below are the concise, high-value facts and examples an agent should know to be productive immediately.

### Big picture

- Frontend: Angular app (generated with Angular CLI). Browser build outputs to `dist/pharm-work/browser`.
- SSR: a Node/Express server built from `server.ts` that uses `@angular/ssr` (CommonEngine). Server bundle ends up at `dist/pharm-work/server/main.js` (also present under `ssr-functions/dist/.../server/main.js` in the functions build).
- Hosting/deploy: project includes Firebase artifacts (see `firebase.json` and the `functions/` or `ssr-functions/` folders). SSR can run as a standalone Node server or inside cloud functions.

### Key files to inspect

- `package.json` — scripts you can run (start, build, dev:ssr, build:ssr, serve:ssr, prerender).
- `server.ts` — the Express + SSR engine. Examples:
  - static assets: `server.get('*.*', express.static(distFolder, { maxAge: '1y' }))`
  - well-known handling: `server.get('/.well-known/*', ...)` (returns 204 by default)
  - SSR render: `commonEngine.render({ bootstrap: AppServerModule, documentFilePath: indexHtml, ... })`
- `src/main.server.ts` / `src/main.server.ts` (bootstrap for SSR) and `src/app/app-routing.module.ts` (shows SSR vs CSR routing pattern).
- `dist/pharm-work/server/main.js` (compiled server bundle) and `ssr-functions/dist/pharm-work/server/main.js` (functions bundle) — useful for debugging runtime issues after build.

### Developer workflows & commands (concrete)

- Local dev (client-only): `npm run start` (runs `ng serve` at http://localhost:4200).
- SSR dev (live-ish): `npm run dev:ssr` (runs `ng run pharm-work:serve-ssr`) — uses Angular CLI builder to host SSR during development.
- Build SSR bundle: `npm run build:ssr` (equivalent to `ng build && ng run pharm-work:server`). After this you can run the server bundle.
- Serve built SSR bundle: `npm run serve:ssr` (runs `node dist/pharm-work/server/main.js`). If running directly: `PORT=4000 node dist/pharm-work/server/main.js` (on Windows PowerShell set via `$env:PORT=4000; node ...`).
- Prerender routes: `npm run prerender` (uses Angular prerender target).
- Tests: `npm run test` / `ng test` (Karma + Jasmine), e2e: `ng e2e`.

### Important patterns & conventions in this repo

- SSR / CSR split: some routes are declared as SSR routes in `app-routing.module.ts` (look for `ssrRoutes`), while client-only routes are dynamically added at runtime (a lazy import is used for CSR-only routes).
- Server DI providers: `server.ts` injects `APP_BASE_HREF`, `Request`, and `Response` into the SSR context — when writing server-side code or testing SSR, respect these providers.
- Static asset caching: static files are served with `maxAge: '1y'` — mind cache-busting when editing static output.
- `.well-known` is intentionally short-circuited with a 204 response — if adding manifests or devtools files, update that handler.

### Editing flow for SSR changes (always follow this order)

1. Make code change in `server.ts` or `src/**/*.ts`.
2. Rebuild server: `npm run build:ssr` (or `ng run pharm-work:server`).
3. Run the built server to verify behavior: `npm run serve:ssr` (or use `npm run dev:ssr` for faster iteration).
4. If deploying to Firebase Functions, ensure the functions build (check `ssr-functions` or `functions` folder) is updated and the bundled `dist/.../server/main.js` is what the function will run.

### Debugging tips

- To see server-side logs, add `console.log(...)` inside `server.ts` or the compiled server entry (`dist/.../server/main.js`) and run `npm run serve:ssr`.
- To attach a debugger: run `node --inspect-brk dist/pharm-work/server/main.js` then connect your debugger to the given port.
- If a route fails to render on SSR, check `src/app/app-routing.module.ts` for SSR vs CSR declaration and ensure the route is not parameterized without server support.

### Integration points & external deps

- Firebase / AngularFire (`@angular/fire`) is used (see `package.json`). Check `firebase.json`, `service-account.json`, and any code under `functions/` or `ssr-functions/` for deployment details.
- Express is used for server; you can add small REST endpoints directly in `server.ts` (commented example present: `// server.get('/api/**', (req, res) => { });`).

### Examples agents can apply directly

- Add a debug route in `server.ts`:
  server.get('/\_\_debug/health', (req, res) => res.json({ok: true, time: Date.now()}));
- Ensure SSR route is server-rendered — check `app-routing.module.ts` for a route with a `component` under `ssrRoutes`.

### Where to look next (quick pointers)

- `server.ts` — SSR entry and express handlers
- `package.json` — canonical scripts
- `src/app/app-routing.module.ts` — SSR vs CSR routing pattern
- `dist/pharm-work/browser` and `dist/pharm-work/server` — build outputs to inspect after building
- `ssr-functions` / `functions` — deployment glue (Firebase)

If you want I can: (1) merge this with any existing `.github/copilot-instructions.md` if you have a different project root in mind, or (2) extend the file with a short checklist for PR reviewers and CI steps. Which would you prefer?
