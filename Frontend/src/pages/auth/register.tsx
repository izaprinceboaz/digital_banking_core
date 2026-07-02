import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { getApiErrorMessage } from "../../services/api";
import "./auth.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
      const res = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.replace(/[\s-]/g, ""),
        email: email.trim(),
        passwordHash: password,
      });
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(
        getApiErrorMessage(err, "We couldn't open your account. Check your details and try again.")
      );
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
          <h1>Open an account in minutes.</h1>
          <p className="auth-brand-tagline">
            Join Demo Bank to send money, pay bills, and stay on top of your
            finances.
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
          <h2>Create your account</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <div className="auth-row">
              <div>
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                id="phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="0781234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

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
                autoComplete="new-password"
                minLength={8}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Opening account…" : "Open account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>

        <p className="auth-disclaimer">
          Educational demo — not affiliated with or endorsed by Bank of Kigali.
        </p>
      </main>
    </div>
  );
}
