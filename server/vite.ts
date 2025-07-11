import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { blogMeta, type BlogMeta } from "../shared/meta";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

function injectOg(html: string, meta: BlogMeta) {
  const tags = `\n<meta property="og:type" content="article"/>\n<meta property="og:title" content="${meta.title}"/>\n<meta property="og:description" content="${meta.description}"/>\n<meta property="og:url" content="${meta.url}"/>\n<meta property="og:image" content="${meta.image}"/>\n<meta name="twitter:card" content="summary_large_image"/>\n<meta name="twitter:title" content="${meta.title}"/>\n<meta name="twitter:description" content="${meta.description}"/>\n<meta name="twitter:image" content="${meta.image}"/>\n`;
  return html.replace("</head>", `${tags}</head>`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions as any,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      const slugMatch = url.match(/\/blog\/([^/?#]+)/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const meta = blogMeta[slug];
        if (meta) {
          template = injectOg(template, meta);
        }
      }
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const slugMatch = url.match(/\/blog\/([^/?#]+)/);
      const distIndex = path.resolve(distPath, "index.html");
      let html = await fs.promises.readFile(distIndex, "utf-8");
      if (slugMatch) {
        const slug = slugMatch[1];
        const meta = blogMeta[slug];
        if (meta) {
          html = injectOg(html, meta);
        }
      }
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      next(e);
    }
  });
}
