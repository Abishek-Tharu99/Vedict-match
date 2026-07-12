import { Router } from "express";
import health from "./health.js";
import geocode from "./geocode.js";
import match from "./match.js";
import reports from "./reports.js";
import createBlog from "./blog.js";
import auth from "./auth.js";
import uploadRoute from "./upload.js";


const router = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Vedict Match API running" });
});


router.use(health);
router.use(geocode);
router.use(match);
router.use(reports);
router.use("/blogs", createBlog);
router.use("/auth", auth);
router.use(uploadRoute);


export default router;
