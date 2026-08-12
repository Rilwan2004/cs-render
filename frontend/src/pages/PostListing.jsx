import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FileUploadField from "../components/FileUploadField";
import "../styles/theme.css";
import "../styles/listings.css";
import "../styles/detail.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const PostListing = () => {
    const navigate = useNavigate();
    const uploadRef = useRef(null);
    const formCardRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [values, setValues] = useState({
        location: "",
        price: "",
        slots_available: "1",
        description: "",
        expires_at: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        setLoading(false);
    }, []);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);
        // Scroll to the top of the form right away so the person immediately
        // sees the success/error message land once the request resolves.
        formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        const token = localStorage.getItem("token");
        try {
            const images = await uploadRef.current.resolveUrls(token);
            await axios.post(`${API_URL}/listings`, { ...values, images }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess("Listing posted, it's now live in Browse listings.");
            setValues({ location: "", price: "", slots_available: "1", description: "", expires_at: "" });
        } catch (err) {
            console.error("Post listing error:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="themed">
                <Navbar active="post" />
                <p style={{ padding: "60px 40px", color: "var(--slate-500)" }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="themed">
            <Navbar active="post" />
            <div className="section-inner" style={{ padding: "20px 20px 60px" }}>
                <div className="form-card" ref={formCardRef}>
                    <h1 style={{ fontSize: 24, marginBottom: 6 }}>Post a listing</h1>
                    <p style={{ color: "var(--slate-500)", fontSize: 14, marginBottom: 24 }}>
                        Whether you're an agent or a corper with a spare room, this goes live in
                        Browse listings right away.
                    </p>

                    {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                    {success && (
                        <p className="form-success" style={{ marginBottom: 16 }}>
                            {success}{" "}
                            <Link to="/listings/mine" style={{ color: "var(--ember-500)", fontWeight: 600 }}>
                                View my listings
                            </Link>
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="e.g. Yaba, Lagos"
                                value={values.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="price">Price (&#8358;) &middot; Annual (per year)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    placeholder="900000"
                                    value={values.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="slots_available">Slots available</label>
                                <input
                                    type="number"
                                    id="slots_available"
                                    name="slots_available"
                                    min="1"
                                    value={values.slots_available}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="2 bedroom flat, close to the bus stop..."
                                value={values.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label>Photos &amp; videos <span className="hint">(optional)</span></label>
                            <FileUploadField ref={uploadRef} initialUrls={[]} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="expires_at">
                                Listing expires <span className="hint">(optional)</span>
                            </label>
                            <input
                                type="date"
                                id="expires_at"
                                name="expires_at"
                                value={values.expires_at}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                            {submitting ? "Posting..." : "Post listing"}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PostListing;
