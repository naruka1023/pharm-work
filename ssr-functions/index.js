// Load zone.js for Angular and the Angular compiler first
require("zone.js/node");
require("@angular/compiler");

const { onRequest } = require("firebase-functions/v2/https");
const path = require("path");
const { existsSync } = require("fs");
const express = require("express");

// Lazy-load server bundle to avoid timeout during initialization
let AppServerModule = null;
let serverBundlePath = null;

function getServerBundlePath() {
  if (!serverBundlePath) {
    serverBundlePath = path.join(
      __dirname,
      "..",
      "dist",
      "pharm-work",
      "server",
      "main.js"
    );
  }
  return serverBundlePath;
}

function loadAppServerModule() {
  if (AppServerModule) return AppServerModule;

  console.log("[ssr-functions] Loading server bundle...");
  const bundlePath = getServerBundlePath();
  const _serverMod = require(bundlePath);
  AppServerModule = (_serverMod && _serverMod.default) || _serverMod;
  console.log("[ssr-functions] Server bundle loaded");
  return AppServerModule;
}

// Lazy-load Angular dependencies inside the handler to avoid ESM/CJS conflicts at module init time
let APP_BASE_HREF_token = null;
let CommonEngine_class = null;
let PLATFORM_ID_token = null;

async function initializeAngularDeps() {
  if (APP_BASE_HREF_token) return; // already initialized

  // Dynamic require inside function to support ESM
  const angular_common = require("@angular/common");
  const angular_ssr = require("@angular/ssr");
  const angular_core = require("@angular/core");

  APP_BASE_HREF_token = angular_common.APP_BASE_HREF;
  CommonEngine_class = angular_ssr.CommonEngine;
  PLATFORM_ID_token = angular_core.PLATFORM_ID;
}

// Factory function to create the Express SSR app (inlined from server.ts)
async function createSSRApp() {
  // Load server bundle and Angular dependencies lazily
  const serverModule = loadAppServerModule();
  await initializeAngularDeps();

  const server = express();
  const distFolder = path.join(
    __dirname,
    "..",
    "dist",
    "pharm-work",
    "browser"
  );
  const indexHtml = existsSync(path.join(distFolder, "index.original.html"))
    ? path.join(distFolder, "index.original.html")
    : path.join(distFolder, "index.html");

  console.log(
    "[ssr-functions] path exists?",
    existsSync(path.join(distFolder, "index.original.html"))
  );
  const commonEngine = new CommonEngine_class();

  server.set("view engine", "html");
  server.set("views", distFolder);

  // Serve static files from /browser
  server.get("*.*", express.static(distFolder, { maxAge: "1y" }));

  // Handle /.well-known/* requests
  server.get("/.well-known/*", (req, res) => {
    return res.status(204).end();
  });

  // All regular routes use the Angular SSR engine
  server.get("*", async (req, res, next) => {
    try {
      const { protocol, originalUrl, baseUrl, headers } = req;
      console.log("[ssr-functions] Handling request for:", originalUrl);

      const html = await commonEngine.render({
        bootstrap: serverModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF_token, useValue: baseUrl },
          { provide: "REQUEST", useValue: req },
          { provide: "RESPONSE", useValue: res },
          { provide: PLATFORM_ID_token, useValue: "server" },
        ],
      });

      res.send(html);
    } catch (err) {
      console.error("[ssr-functions] SSR render error:", err);
      console.error("[ssr-functions] Error message:", err.message);
      console.error("[ssr-functions] Error code:", err.code);
      res.status(500).send(`<html><body><h1>SSR Error</h1><pre>${err.message}</pre></body></html>`);
      next(err);
    }
  });

  return server;
}

// Export the Firebase Cloud Function (onRequest handler)
exports.ssr = onRequest(
  { cors: true, timeoutSeconds: 60 },
  async (req, res) => {
    try {
      const app = await createSSRApp();
      console.log("[ssr-functions] SSR app created, delegating request");
      return app(req, res);
    } catch (err) {
      console.error("[ssr-functions] Error in ssr function:", err);
      res.status(500).send("Internal Server Error");
    }
  }
);
