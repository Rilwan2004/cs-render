import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/theme.css";
import "../styles/detail.css";
import { useDocumentHead } from "../utils/seo";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Register = () => {
    useDocumentHead({
        title: "Sign up",
        description: "Create your free Corpspace account to browse verified rooms or post your own spare space in Lagos.",
    });
    const [values, setValues] = React.useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "corps_member"
    });
    const [error, setError] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            const { confirmPassword, ...payload } = values;
            await axios.post(`${API_URL}/auth/register`, payload);
            navigate("/login");
        } catch (err) {
            console.error("Error during registration:", err);
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
                    <h1 style={{ fontSize: 26, marginBottom: 6 }}>Create your account</h1>
                    <p style={{ color: "var(--slate-500)", fontSize: 14, marginBottom: 24 }}>
                        Verified corpers only, takes less than a minute.
                    </p>

                    {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

                    <div className="filter-pill-group" style={{ width: "100%", marginBottom: 20 }}>
                        <button
                            type="button"
                            className={values.role === "corps_member" ? "active" : ""}
                            style={{ flex: 1 }}
                            onClick={() => setValues({ ...values, role: "corps_member" })}
                        >
                            I'm a corper
                        </button>
                        <button
                            type="button"
                            className={values.role === "agent" ? "active" : ""}
                            style={{ flex: 1 }}
                            onClick={() => setValues({ ...values, role: "agent" })}
                        >
                            I'm an agent
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                onChange={handleChange}
                                required
                            />
                        </div>
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
                            <label htmlFor="phone">Phone number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="080X XXX XXXX"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="At least 6 characters"
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    style={{ width: "100%", paddingRight: 40, boxSizing: "border-box" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    style={{
                                        position: "absolute",
                                        right: 10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        color: "var(--slate-500)"
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-enter password"
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    style={{ width: "100%", paddingRight: 40, boxSizing: "border-box" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    style={{
                                        position: "absolute",
                                        right: 10,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 4,
                                        display: "flex",
                                        alignItems: "center",
                                        color: "var(--slate-500)"
                                    }}
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                            {submitting ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--slate-500)" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "var(--ember-500)", fontWeight: 500, textDecoration: "none" }}>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;