import { useState } from "react";
import { useLocation } from "wouter";


export function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [, navigate] = useLocation();
    const API_BASE_URL =
        import.meta.env.VITE_API_URL || "https://vedict-match.onrender.com";


    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);

            navigate("/admin/dashboard");

            // Redirect later
            // navigate("/admin/dashboard");
            
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    }

    return (
        <div className="mx-auto mt-20 max-w-md rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-8">

            <h1 className="mb-6 text-center text-3xl font-bold">
                Admin Login
            </h1>

            <form onSubmit={handleLogin} className="space-y-5">

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] p-3"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] p-3"
                />

                <button
                    className="w-full rounded-xl bg-orange-500 py-3 text-white"
                >
                    Login
                </button>

            </form>

        </div>
    );
}