import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();

async function handleSubmit(e: FormEvent) {
  e.preventDefault();
  setError(null);
  setIsSubmitting(true);
  try {
    await login({ username, password });
    const redirectTo = (location.state as { from?: string })?.from ?? "/admin";
    navigate(redirectTo, { replace: true });
  } catch (err) {
    setError(err instanceof Error ? err.message : "Login failed");
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="rounded-md bg-neutral-800 px-3 py-2 text-sm border border-neutral-700"
        autoComplete="username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="rounded-md bg-neutral-800 px-3 py-2 text-sm border border-neutral-700"
        autoComplete="current-password"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-500 hover:bg-blue-400 disabled:opacity-50 py-2 text-sm font-medium"
      >
        {isSubmitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}