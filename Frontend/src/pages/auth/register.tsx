import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

export default function Login() {
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
            const res = await register({ firstName, lastName, phoneNumber, email, passwordHash: password });
            localStorage.setItem("accessToken", res.accessToken);
            localStorage.setItem("refreshToken", res.refreshToken);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        <label htmlFor="firstName">First Name</label>
        <input
            id="firstName"
            type="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
            id="lastName"
            type="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
        />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
            id="phoneNumber"
            type="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
        />

        <label htmlFor="email">Email</label>
        <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        <label htmlFor="password">Password</label>
        <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
        </button>
        </form>
    );
}
