import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger.js";
import { apiLimiter, heavyLimiter } from "./lib/limits.js";
import routes from "./routes/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

export const app = express();

// In production we sit behind a TLS-terminating proxy (load balancer / nginx),
// so trust the first hop for req.ip and req.secure.
if (isProd) {
  app.set("trust proxy", 1);
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "img-src": ["'self'", "data:"],
        "connect-src": ["'self'"],
        "frame-ancestors": ["'none'"],
      },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    crossOriginEmbedderPolicy: false,
  }),
);

// Force HTTPS in production. Health checks hit plain http from inside the network,
// so let those through.
if (isProd) {
  app.use((req, res, next) => {
    if (req.secure || req.path === "/api/healthz") return next();
    const host = req.headers.host;
    if (!host) return next();
    res.redirect(308, `https://${host}${req.originalUrl}`);
  });
}

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vedict-match-client.vercel.app",
    "https://your-other-domain.vercel.app"
  ],
  credentials: false
}));

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use("/api", apiLimiter);
app.use("/api/geocode", heavyLimiter);
app.use("/api/match", heavyLimiter);
app.post("/api/reports", heavyLimiter);

app.use("/api", routes);

// Serve the built frontend (server/public) when present, with SPA fallback.
const publicDir = path.resolve(__dirname, "..", "public");
if (fs.existsSync(publicDir)) {
  logger.info({ publicDir }, "Serving static frontend");
  app.use(express.static(publicDir, { index: false, maxAge: "1h" }));
  app.get(/^\/(?!api\/).*/, (_req, res, next) => {
    const indexHtml = path.join(publicDir, "index.html");
    if (!fs.existsSync(indexHtml)) {
      next();
      return;
    }
    res.sendFile(indexHtml);
  });
}

// JSON error handler.
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  req.log.error({ err }, "Unhandled request error");
  if (res.headersSent) return;
  res.status(500).json({ error: "Internal server error" });
});

export default app;
