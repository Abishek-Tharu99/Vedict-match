import type { Blog } from "./blog.types";

const WORDPRESS_URL =
  "https://cms.suiaihustle.com/wp-json/wp/v2";

function mapPost(post: any): Blog {
  return {
    id: post.id.toString(),
    title: post.title.rendered,
    slug: post.slug,
    excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ""),
    content: post.content.rendered,
    author: post._embedded?.author?.[0]?.name ?? "Su AI Hustle",
    category: "",
    published: true,
    featured: false,
    coverImage:
      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
    views: 0,
    readingTime: 5,
    createdAt: post.date,
    updatedAt: post.modified,
  };
}

export async function getBlogs(): Promise<Blog[]> {
  const res = await fetch(
    `${WORDPRESS_URL}/posts?_embed`
  );

  const posts = await res.json();

  return posts.map(mapPost);
}

export async function getBlogBySlug(
  slug: string
): Promise<Blog | null> {

  const res = await fetch(
    `${WORDPRESS_URL}/posts?slug=${slug}&_embed`
  );

  const posts = await res.json();

  if (posts.length === 0) return null;

  return mapPost(posts[0]);
}