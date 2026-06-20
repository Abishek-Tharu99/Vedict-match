import { Router } from "express";
import { HealthCheckResponse } from "@vedic-match/shared";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json(HealthCheckResponse.parse({ status: "ok" }));
});

export default router;
