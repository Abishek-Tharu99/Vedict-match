import { Router } from "express";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    res.json({
      url: `/uploads/${req.file?.filename}`,
    });
  }
);

export default router;