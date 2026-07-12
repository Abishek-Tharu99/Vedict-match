import { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "../lib/blog.api";
import { Link} from "wouter";

export function ManageBlogs() {
    const [blogs, setBlogs] = useState([]);

    async function loadBlogs() {
        const data = await getBlogs();
        setBlogs(data);
    }

    useEffect(() => {
        loadBlogs();
    }, []);

    async function handleDelete(id: string) {
        if (!confirm("Delete this blog?")) return;

        await deleteBlog(id);

        await loadBlogs();
    }

    return (
  <div className="mx-auto max-w-7xl p-8">
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[var(--ink)]">
          Manage Blogs
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Create, edit and delete your published articles.
        </p>
      </div>

      <Link href="/admin/blog/new">
        <button className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
          + New Blog
        </button>
      </Link>
    </div>

    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-lg">
      <table className="w-full border-collapse">
        <thead className="bg-[var(--inset)]">
          <tr className="text-left">
            <th className="px-6 py-4 font-semibold">Title</th>
            <th className="px-6 py-4 font-semibold">Category</th>
            <th className="px-6 py-4 font-semibold">Author</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {blogs.map((blog: any) => (
            <tr
              key={blog.id}
              className="border-t border-[var(--line)] transition hover:bg-[var(--inset)]"
            >
              <td className="px-6 py-5">
                <div>
                  <h3 className="font-semibold text-[var(--ink)]">
                    {blog.title}
                  </h3>

                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    {blog.slug}
                  </p>
                </div>
              </td>

              <td className="px-6 py-5">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {blog.category}
                </span>
              </td>

              <td className="px-6 py-5 text-[var(--ink-soft)]">
                {blog.author}
              </td>

              <td className="px-6 py-5">
                {blog.published ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                    Draft
                  </span>
                )}
              </td>

              <td className="px-6 py-5">
                <div className="flex justify-center gap-3">
                  <Link href={`/admin/edit-blog/${blog.id}`}>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}