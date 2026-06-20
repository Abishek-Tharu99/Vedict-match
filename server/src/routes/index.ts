import { Router } from "express";
import health from "./health.js";
import geocode from "./geocode.js";
import match from "./match.js";
import reports from "./reports.js";

const router = Router();

router.use(health);
router.use(geocode);
router.use(match);
router.use(reports);

export default router;
