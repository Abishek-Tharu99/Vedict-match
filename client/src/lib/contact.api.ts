const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";

export async function sendContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed");
  }

  return json;
}