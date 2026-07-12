import { Link } from "wouter";

export function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[var(--ink)]">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-[var(--ink-soft)]">
          Manage blogs, publish articles and monitor your content.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--ink-soft)]">Total Blogs</p>
          <h2 className="mt-2 text-4xl font-bold">24</h2>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--ink-soft)]">Published</p>
          <h2 className="mt-2 text-4xl font-bold text-green-500">20</h2>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--ink-soft)]">Drafts</p>
          <h2 className="mt-2 text-4xl font-bold text-yellow-500">4</h2>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--ink-soft)]">Views</p>
          <h2 className="mt-2 text-4xl font-bold text-orange-500">12.8K</h2>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/admin/blog/new">
          <div className="cursor-pointer rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 transition hover:-translate-y-1 hover:border-orange-500 hover:shadow-xl">
            <div className="mb-4 text-5xl">📝</div>

            <h2 className="text-2xl font-bold">
              Create Blog
            </h2>

            <p className="mt-3 text-[var(--ink-soft)]">
              Publish a new article with the rich text editor.
            </p>
          </div>
        </Link>

        <Link href="/admin/blogs/manage">
          <div className="cursor-pointer rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 transition hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl">
            <div className="mb-4 text-5xl">📚</div>

            <h2 className="text-2xl font-bold">
              Manage Blogs
            </h2>

            <p className="mt-3 text-[var(--ink-soft)]">
              Edit, update or delete your existing blogs.
            </p>
          </div>
        </Link>

        <div
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="cursor-pointer rounded-2xl border border-red-400 bg-red-50 p-8 transition hover:-translate-y-1 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40"
        >
          <div className="mb-4 text-5xl">🚪</div>

          <h2 className="text-2xl font-bold text-red-500">
            Logout
          </h2>

          <p className="mt-3 text-[var(--ink-soft)]">
            Securely sign out from the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}