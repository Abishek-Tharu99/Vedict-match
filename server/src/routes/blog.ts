import { Router } from "express";
import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    getBlogById,
} from "../controllers/blog.controllers.js";
import { authenticate } from "../middleware/auth.middleware.js";


const router = Router();

// router.get("/", (_req, res) => {
//   res.json({ message: "Blog route is working 🚀" });
// });

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", authenticate, createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.get("/id", getBlogById);


export default router;


