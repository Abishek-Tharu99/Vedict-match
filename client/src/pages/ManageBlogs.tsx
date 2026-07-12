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
        <table className="w-full border">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>

                {blogs.map((blog: any) => (
                    <tr key={blog.id}>

                        <td>{blog.title}</td>

                        <td>{blog.category}</td>

                        <td>{blog.author}</td>

                        <td>
                            {blog.published ? "Published" : "Draft"}
                        </td>

                        <td>

                            <Link href={`/admin/edit-blog/${blog.id}`}>
                                <button className="rounded bg-blue-600 px-3 py-1 text-white">
                                    Edit
                                </button>
                            </Link>

                            <button
                                onClick={() => handleDelete(blog.id)}
                                className="rounded bg-red-600 px-3 py-1 text-white"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>
                ))}

            </tbody>

        </table>
    );
}