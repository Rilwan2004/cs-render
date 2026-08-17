import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/theme.css";
import "../styles/detail.css";
import { useDocumentHead } from "../utils/seo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Login = () => {
    useDocumentHead({ title: "Login" });
    const [values, setValues] = React.useState({
        email: "",
        password: ""
    });
    const [error, setError] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, values);
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            console.error("Error during login:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="themed" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
            <div style={{ width: "100%", maxWidth: 420 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link to="/" className="logo">
                        Corpspace<span className="dot">.</span>
                    </Link>
                </div>

                <div className="form-card">
                    <h1 style={{ fontSize: 26, marginBottom: 6 }}>Welcome back</h1>
                    <p style={{ color: "var(--slate-500)", fontSize: 14, marginBottom: 24 }}>
                        Log in to see your matches and messages.
                    </p>

                    {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                            {submitting ? "Logging in..." : "Log in"}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--slate-500)" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "var(--ember-500)", fontWeight: 500, textDecoration: "none" }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;