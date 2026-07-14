import { Router } from "express";
import health from "./health.js";
import geocode from "./geocode.js";
import match from "./match.js";
import reports from "./reports.js";
import createBlog from "./blog.js";
import auth from "./auth.js";
import uploadRoute from "./upload.js";
import contact from "./contact.js";


const router = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Vedict Match API running" });
  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("GMAIL_PASS exists:", !!process.env.GMAIL_PASS);
});


router.use(health);
router.use(geocode);
router.use(match);
router.use(reports);
router.use("/blogs", createBlog);
router.use("/auth", auth);
router.use("/upload", uploadRoute);
router.use("/contact", contact);


export default router;
