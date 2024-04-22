import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import e from "express";
import { ViteDevServer } from "vite";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./api/app.module";

const isProduction = process.env.NODE_ENV === "production";
const port = +process.env.PORT || 5173;
const base = process.env.BASE || "/";
const logger = new Logger("Bootstrap");

(async () => {
  const templateHtml = isProduction ? await readFile(resolve("client/index.html"), "utf-8") : "";
  const ssrManifest = isProduction
    ? await readFile(resolve("client/.vite/ssr-manifest.json"), "utf-8")
    : undefined;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("/api");

  let vite: ViteDevServer;
  if (isProduction) {
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;
    app.use(compression());
    app.use(base, sirv(resolve(__dirname, "client"), { extensions: [] }));
  } else {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
      base
    });
    app.use(vite.middlewares);
  }

  app.use("*", async (req: e.Request, res: e.Response, next: e.NextFunction) => {
    try {
      const url = req.originalUrl.replace(base, "");

      if (url.startsWith("api")) {
        return next();
      }

      let template: string;
      let render: (url: string, manifest: string) => { html: string; head?: string };
      if (isProduction) {
        template = templateHtml;
        render = (await import("./entry-server")).render;
      } else {
        // Always read fresh template in development
        template = await readFile("./index.html", "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      }

      const rendered = render(url, ssrManifest);

      let html = template
        .replace(`<!--app-head-->`, rendered.head ?? "")
        .replace(`<!--app-html-->`, rendered.html ?? "");

      if (isProduction) {
        const { minify } = await import("html-minifier");
        html = minify(html, {
          collapseWhitespace: true,
          removeComments: true,
          keepClosingSlash: true,
          minifyCSS: true,
          minifyJS: true
        });
      } else {
        const { resolveConfig, format } = await import("prettier");
        const config = await resolveConfig(process.cwd());
        html = await format(html, { ...config, parser: "html" });
      }

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  await app.listen(port);
  logger.log(`Server listening at http://localhost:${port}`);
})();
