import { useState } from "react";
import { createBlog } from "../lib/blog.api";
import { useLocation } from "wouter";

export function CreateBlog() {
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
            await createBlog(payload);

            alert("Blog published successfully!");

            navigate("/blog");
        } catch (err) {
            console.error(err);
            alert("Failed to publish blog.");
        }
    }

    function generateSlug(text: string) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
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

                <textarea
                    name="excerpt"
                    placeholder="Excerpt"
                    rows={3}
                    className="w-full rounded-xl border p-3"
                    value={form.excerpt}
                    onChange={handleChange}
                />

                <textarea
                    name="content"
                    placeholder="Write your blog..."
                    rows={15}
                    className="w-full rounded-xl border p-3"
                    value={form.content}
                    onChange={handleChange}
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
                    Publish Blog
                </button>

            </form>

        </div>
    );
}