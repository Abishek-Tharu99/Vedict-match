import { Link } from "wouter";
import type { Blog } from "../../lib/blog.types";

interface Props {
    blog: Blog;
}

export function BlogCard({ blog }: Props) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)]">

            {blog.coverImage && (
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-52 w-full object-cover"
                />
            )}

            <div className="p-5">

                <span className="text-sm text-orange-500">
                    {blog.category}
                </span>

                <h2 className="mt-2 text-xl font-bold">
                    {blog.title}
                </h2>

                <p className="mt-3 text-sm text-[var(--ink-soft)]">
                    {blog.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between">

                    <span className="text-xs text-[var(--ink-faint)]">
                        {blog.author}
                    </span>

                    {/* <Link
            href={`/blog/${blog.slug}`}
            className="font-semibold text-orange-500"
          >
            Read More →
          </Link> */}
                    <Link href={`/blog/${blog.slug}`}>
                        Read More →
                    </Link>

                </div>

            </div>

        </div>
    );
}