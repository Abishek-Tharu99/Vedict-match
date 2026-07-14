import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import type { Blog } from "../lib/blog.types";
import { getBlogBySlug } from "../lib/wordpress.api";

export function BlogDetails() {
  const [, params] = useRoute("/blog/:slug");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;

    getBlogBySlug(params.slug)
      .then(setBlog)
      .finally(() => setLoading(false));
  }, [params]);

  if (loading) return <p className="p-10">Loading...</p>;

  if (!blog) return <p className="p-10">Blog not found.</p>;

  return (
    <div className="mx-auto max-w-4xl py-10">

      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="mb-8 rounded-xl"
        />
      )}

      <h1 className="text-5xl font-bold">{blog.title}</h1>

      <div className="mt-4 flex gap-5 text-gray-500">
        <span>{blog.author}</span>
        <span>{blog.category}</span>
        <span>{blog.readingTime} min read</span>
      </div>

      <div
        className="prose prose-lg mt-10 max-w-none"
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />

    </div>
  );
}