import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to log in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-200 sm:py-6 sm:flex sm:justify-center">
      <div className="w-full sm:max-w-[430px] sm:min-h-[calc(100vh-3rem)] sm:rounded-[2.25rem] sm:shadow-2xl sm:border-8 sm:border-stone-900 bg-cream min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-1 text-sage-dark">TV Time</h1>
          <p className="text-center text-stone-500 text-sm mb-8">Track every episode you watch.</p>
          <form onSubmit={handleSubmit} className="bg-white/70 border border-stone-900/10 rounded-2xl p-6 space-y-4 shadow-sm">
            <div>
              <label className="block text-sm text-stone-500 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white border border-stone-900/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-500 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white border border-stone-900/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </div>
            {error && <p className="text-sm text-rose">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-sage hover:bg-sage-dark text-white disabled:opacity-50 transition py-2.5 text-sm font-semibold"
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>
          <p className="text-center text-sm text-stone-500 mt-4">
            No account?{" "}
            <Link to="/register" className="text-sage-dark font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
