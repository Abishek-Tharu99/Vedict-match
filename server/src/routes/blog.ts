import { Router } from "express";
import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
} from "../controllers/blog.controllers.js";


const router = Router();

// router.get("/", (_req, res) => {
//   res.json({ message: "Blog route is working 🚀" });
// });

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);


export default router;


