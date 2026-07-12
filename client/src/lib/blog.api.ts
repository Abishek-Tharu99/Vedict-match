const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";

export async function getBlogs() {
  const res = await fetch(`${API_BASE_URL}/api/blogs`);

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}

export async function deleteBlog(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete blog");
  }
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

export async function updateBlog(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function getBlogById(id: string) {
  const res = await fetch(`${API_BASE_URL}/api/blogs/id/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  // const res = await fetch(`${API_BASE_URL}/admin/edit-blog/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res.json();
}