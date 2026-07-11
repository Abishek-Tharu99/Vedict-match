import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import type { Blog } from "../lib/blog.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";


export function BlogDetails() {
  const [, params] = useRoute("/blog/:slug");
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;

    fetch(`${API_BASE_URL}/api/blogs/${params.slug}`)
      .then((res) => res.json())
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

      <div className="prose mt-10 max-w-none">
        {blog.content}
      </div>

    </div>
  );
}