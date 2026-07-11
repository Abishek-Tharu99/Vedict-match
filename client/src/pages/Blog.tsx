import { useEffect, useState } from "react";
import { getBlogs } from "../lib/blog.api";
import { BlogCard } from "../components/blog/BlogCard";
import type { Blog } from "../lib/blog.types";

export function Blog() {
    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlogs()
            .then(setBlogs)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="mx-auto max-w-7xl">

            {/* Hero */}
            <section className="mb-10 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8">

                <h1 className="text-4xl font-bold text-[var(--ink)]">
                    VedicMatch Blog
                </h1>

                <p className="mt-3 text-[var(--ink-soft)]">
                    Learn AI, Programming, Web Development, Career, and Technology.
                </p>

            </section>

            {/* Search + Write */}
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:justify-between">

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3 outline-none md:w-96"
                />

                <button
                    className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                >
                    Write Blog
                </button>

            </div>
            {loading ? (
                <p>Loading blogs...</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {blogs.map((blog) => (
                        <BlogCard
                            key={blog.id}
                            blog={blog}
                        />
                    ))}

                </div>
            )}



        </div>
    );
}