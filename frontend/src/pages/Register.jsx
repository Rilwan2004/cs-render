import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/theme.css";
import "../styles/detail.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Register = () => {
    const [values, setValues] = React.useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "corps_member"
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
            await axios.post(`${API_URL}/auth/register`, values);
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
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="At least 6 characters"
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
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
