import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import AppServerModule from './src/main.server';
import {
  createEnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { inject } from '@angular/core';
import { JobPostService } from 'src/app/pharmacist/service/job-post.service';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/pharm-work/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');
  console.log(
    'path exists? ',
    existsSync(join(distFolder, 'index.original.html'))
  );
  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );
  // Handle /.well-known/* requests first
  server.get('/.well-known/*', (req, res) => {
    // Option 1: If you want to return empty (common for devtools manifests)
    return res.status(204).end();

    // Option 2: If you have actual files in a folder:
    // const filePath = join(distFolder, '.well-known', req.params[0]);
    // if (existsSync(filePath)) {
    //   res.sendFile(filePath);
    // } else {
    //   res.status(404).end();
    // }
  });
  // All regular routes use the Angular engine
  server.get(
    '*',
    async (
      req: { protocol: any; originalUrl: any; baseUrl: any; headers: any },
      res: { send: (arg0: string) => any },
      next: (arg0: any) => any
    ) => {
      console.log('Handling request for: ', req.originalUrl);
      const { protocol, originalUrl, baseUrl, headers } = req;
      commonEngine
        .render({
          bootstrap: AppServerModule,
          documentFilePath: indexHtml,
          url: `${protocol}://${headers.host}${originalUrl}`,
          publicPath: distFolder,
          providers: [
            { provide: APP_BASE_HREF, useValue: baseUrl },
            { provide: Request, useValue: req },
            { provide: Response, useValue: res },
          ],
        })
        .then((html) => {
          res.send(html);
        })
        .catch((err) => next(err));
    }
  );

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listenfdsing on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default AppServerModule;
