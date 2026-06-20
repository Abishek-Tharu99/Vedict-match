import { Router } from "express";
import { ComputeMatchBody, ComputeMatchResponse } from "@vedic-match/shared";
import { buildReport } from "../lib/vedic.js";

const router = Router();

router.post("/match", (req, res) => {
  const parsed = ComputeMatchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const report = buildReport(parsed.data.person1, parsed.data.person2);
  res.json(ComputeMatchResponse.parse(report));
});

export default router;
