import { useState } from "react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    console.log({
      username,
      password,
    });

    // Later we'll call POST /api/auth/login
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
          onChange={(e)=>setUsername(e.target.value)}
          className="w-full rounded-xl border border-[var(--line)] p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
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