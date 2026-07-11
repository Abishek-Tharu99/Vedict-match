import { Link } from "wouter";

export function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-8 text-4xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">

        <Link href="/admin/blog/new">
          <div className="cursor-pointer rounded-xl border p-6 hover:bg-gray-100 dark:hover:bg-gray-800">
            <h2 className="text-xl font-semibold">➕ Create Blog</h2>
            <p className="mt-2 text-sm text-gray-500">
              Write a new article
            </p>
          </div>
        </Link>

        <Link href="/admin/blogs">
          <div className="cursor-pointer rounded-xl border p-6 hover:bg-gray-100 dark:hover:bg-gray-800">
            <h2 className="text-xl font-semibold">📝 Manage Blogs</h2>
            <p className="mt-2 text-sm text-gray-500">
              Edit or delete blogs
            </p>
          </div>
        </Link>

        <div
          className="cursor-pointer rounded-xl border p-6 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          <h2 className="text-xl font-semibold">🚪 Logout</h2>

          <p className="mt-2 text-sm text-gray-500">
            Sign out
          </p>
        </div>

      </div>

    </div>
  );
}