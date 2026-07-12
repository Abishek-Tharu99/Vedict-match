import { Router } from "express";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/upload", upload.single("image"), (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    url: `${baseUrl}/uploads/${req.file?.filename}`,
  });
});

export default router;