import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(5).max(200),

  excerpt: z.string().min(20).max(500),

  content: z.string().min(100),

  coverImage: z.string().url().optional(),

  author: z.string().min(2),

  category: z.string().min(2),

  tags: z.array(z.string()).optional(),

  published: z.boolean().optional(),

  featured: z.boolean().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;