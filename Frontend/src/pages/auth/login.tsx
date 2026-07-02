import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { getApiErrorMessage } from "../../services/api";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login({ email: email.trim(), passwordHash: password });
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Incorrect email or password. Try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <div className="auth-wordmark">
          <span>DB</span> Demo Bank
        </div>
        <div>
          <h1>Banking that moves at your speed.</h1>
          <p className="auth-brand-tagline">
            Sign in to check balances, send money, and pay bills — anywhere,
            any time.
          </p>
          <ul>
            <li>Send money to any bank or mobile money wallet</li>
            <li>Pay bills and buy airtime in seconds</li>
            <li>Track your spending with clear statements</li>
          </ul>
        </div>
        <p className="auth-disclaimer">
          Educational demo — not affiliated with or endorsed by Bank of Kigali.
        </p>
      </aside>

      <main className="auth-form-side">
        <div className="auth-wordmark">
          <span>DB</span> Demo Bank
        </div>

        <div className="auth-card">
          <h2>Sign in</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            New to Demo Bank? <Link to="/register">Open an account</Link>
          </p>
        </div>

        <p className="auth-disclaimer">
          Educational demo — not affiliated with or endorsed by Bank of Kigali.
        </p>
      </main>
    </div>
  );
}
