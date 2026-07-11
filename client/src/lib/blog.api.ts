const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";

export async function getBlogs() {
  const res = await fetch(`${API_BASE_URL}/api/blogs`);

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}

export async function createBlog(blog: any) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}/api/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(blog),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("Validation Error:", data);
    throw new Error(data.message);
  }

  return data;
}