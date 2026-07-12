import { Request, Response } from "express";
import { createBlogSchema } from "../validators/blog.validator.js";
import { BlogService } from "../services/blog.service.js";
import { ZodError } from "zod";

//create a new blog post

export async function createBlog(req: Request, res: Response) {
  try {
    const data = createBlogSchema.parse(req.body);

    const blog = await BlogService.createBlog(data);

    return res.status(201).json(blog);
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.issues);

      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


//get all published blogs
export async function getBlogs(__req: Request, res: Response) {
  try {
    const blogs = await BlogService.getBlogs();

    res.json(blogs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch blogs",
    });
  }
}

type BlogParams = {
  slug: string;
};

//get a blog by slug
export async function getBlogBySlug(req: Request<BlogParams>, res: Response) {
  try {
    const { slug } = req.params;

    const blog = await BlogService.getBlogBySlug(slug);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    res.json(blog);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch blog",
    });
  }
}

type BlogIdParams = {
  id: string;
};

//update a blog by id
export async function updateBlog(
  req: Request<BlogIdParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const data = createBlogSchema.partial().parse(req.body);

    const blog = await BlogService.updateBlog(id, data);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.json(blog);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

//delete a blog by id

export async function deleteBlog(
  req: Request<BlogIdParams>,
  res: Response
) {
  try {
    const { id } = req.params;

    const blog = await BlogService.deleteBlog(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      message: "Blog deleted successfully",
      blog,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getBlogById(req: Request<BlogIdParams>, res: Response) {
  try {
    const { id } = req.params;

    const blog = await BlogService.getBlogById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.json(blog);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch blog",
    });
  }
}