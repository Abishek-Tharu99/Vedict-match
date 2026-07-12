import { useEffect, useState } from "react";
import { createBlog, updateBlog, getBlogById } from "../lib/blog.api";
import { useLocation, useParams } from "wouter";
import TiptapEditor from "../components/TiptapEditor";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";

export function CreateBlog() {

    const params = useParams();
    const idParam = params?.id;
    const id = typeof idParam === "string" ? idParam : undefined;

    const [form, setForm] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "Abishek Tharu",
        category: "",
        coverImage: "",
        featured: false,
        published: true,
    });

    useEffect(() => {
        if (id === undefined) return;

        const blogId = id;

        async function loadBlog() {
            try {
                const blog = await getBlogById(blogId);

                setForm({
                    title: blog.title,
                    slug: blog.slug,
                    excerpt: blog.excerpt,
                    content: blog.content,
                    author: blog.author,
                    category: blog.category,
                    coverImage: blog.coverImage || "",
                    featured: blog.featured,
                    published: blog.published,
                });
            } catch (err) {
                console.error(err);
            }
        }

        loadBlog();
    }, [id]);

    const [, navigate] = useLocation();

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value, type } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload = {
            ...form,
            coverImage: form.coverImage || undefined,
        };

        try {
            if (id !== undefined) {
                await updateBlog(id, payload);
                alert("Blog updated successfully!");
            } else {
                await createBlog(payload);
                alert("Blog published successfully!");
            }

            navigate("/blog");
        } catch (err) {
            console.error(err);
            alert("Failed.");
        }
    }

    function generateSlug(text: string) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }

    async function handleImageUpload(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) return;

        const data = new FormData();

        data.append("image", file);

        const res = await fetch(
            `${API_BASE_URL}/api/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const json = await res.json();

        setForm(prev => ({
            ...prev,
            coverImage: json.url,
        }));
    }

    const categories = [
        "Programming",
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Python",
        "AI",
        "Machine Learning",
        "Web Development",
        "Frontend",
        "Backend",
        "DevOps",
        "Cloud",
        "Cybersecurity",
        "Mobile Development",
        "Database",
        "Linux",
        "Docker",
        "Career",
        "Tutorial",
        "News",
        "Others",
    ];

    return (
        <div className="mx-auto max-w-5xl p-8">

            <h1 className="mb-8 text-4xl font-bold">
                Create Blog
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                <input
                    name="title"
                    className="w-full rounded-xl text-green-500 border p-3"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                            slug: generateSlug(e.target.value),
                        }))
                    }
                />

                <input
                    value={form.slug}
                    readOnly
                    className="w-full rounded-xl text-green-500 border p-3"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />

                {form.coverImage && (

                    <img
                        src={`${API_BASE_URL}${form.coverImage}`}
                        className="w-full h-72 rounded-xl object-cover"
                    />

                )}

                <textarea
                    name="excerpt"
                    placeholder="Excerpt"
                    rows={3}
                    className="w-full rounded-xl border p-3"
                    value={form.excerpt}
                    onChange={handleChange}
                />


                <TiptapEditor
                    value={form.content}
                    onChange={(html) =>
                        setForm((prev) => ({
                            ...prev,
                            content: html,
                        }))
                    }
                />

                <input
                    name="author"
                    placeholder="Author"
                    className="w-full rounded-xl border p-3"
                    value={form.author}
                    onChange={handleChange}
                />

                {/* <select
                    name="category"
                    className="w-full  text-red-500 rounded-xl border p-3"
                    value={form.category}
                    onChange={handleChange}
                >
                    <option value="">Select Category</option>
                    <option>React</option>
                    <option>Next.js</option>
                    <option>TypeScript</option>
                    <option>AI</option>
                    <option>Programming</option>
                </select> */}

                <select
                    name="category"
                    className="w-full  text-red-500 rounded-xl border p-3"
                    value={form.category}
                    onChange={handleChange}
                >

                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                    />

                    Featured
                </label>

                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="published"
                        checked={form.published}
                        onChange={handleChange}
                    />

                    Publish
                </label>

                <button
                    className="rounded-xl bg-orange-500 px-8 py-3 text-white"
                >
                    {id ? "Update Blog" : "Publish Blog"}
                </button>

            </form>

        </div>
    );
}