const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";

export async function getBlogs() {
  const res = await fetch(`${API_BASE_URL}/blogs`);

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}