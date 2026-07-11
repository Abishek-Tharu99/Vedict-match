import slugify from "slugify";
import { db } from "../db/index.js";
import { blogs } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

export class BlogService {

    //create a new blog post
    static async createBlog(data: any) {
        const slug = slugify(data.title, {
            lower: true,
            strict: true,
        });

        const [blog] = await db
            .insert(blogs)
            .values({
                ...data,
                slug,
            })
            .returning();

        return blog;
    }
    //get all published blogs
    static async getBlogs() {
        return await db
            .select()
            .from(blogs)
            .where(eq(blogs.published, true))
            .orderBy(desc(blogs.createdAt));
    }
    //get a blog by slug
    static async getBlogBySlug(slug: string) {
        const [blog] = await db
            .select()
            .from(blogs)
            .where(eq(blogs.slug, slug));

        return blog;
    }
    //update a blog by id
    static async updateBlog(id: string, data: any) {
        const [blog] = await db
            .update(blogs)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(blogs.id, id))
            .returning();

        return blog;
    }
        //delete a blog by id
    static async deleteBlog(id: string) {
        const [blog] = await db
            .delete(blogs)
            .where(eq(blogs.id, id))
            .returning();

        return blog;
    }

}