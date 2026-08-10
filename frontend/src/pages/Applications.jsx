import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/theme.css";
import "../styles/listings.css";
import "../styles/requests.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Applications = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applications, setApplications] = useState([]);
    const [actingId, setActingId] = useState(null);

    const fetchApplications = async (token) => {
        const res = await axios.get(`${API_URL}/interests/incoming`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.interests);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const init = async () => {
            try {
                const homeRes = await axios.get(`${API_URL}/auth/home`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (homeRes.data.user.role !== "agent") {
                    navigate("/dashboard");
                    return;
                }
                await fetchApplications(token);
            } catch (err) {
                console.error("Error loading applications:", err);
                setError("Couldn't load your applications right now.");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleAction = async (id, status) => {
        setActingId(id);
        const token = localStorage.getItem("token");
        try {
            await axios.patch(
                `${API_URL}/interests/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchApplications(token);
        } catch (err) {
            console.error("Error updating application:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setActingId(null);
        }
    };

    return (
        <div className="themed">
            <Navbar active="applications" />
            <div className="section-inner listings-header">
                <h1>Applications</h1>
                <p className="subtitle">Everyone who's applied to one of your listings.</p>
            </div>

            <div className="section-inner">
                {loading && <p style={{ color: "var(--slate-500)", padding: "40px 0" }}>Loading...</p>}
                {error && <p className="form-error" style={{ maxWidth: 400 }}>{error}</p>}

                {!loading && !error && applications.length === 0 && (
                    <div className="listings-empty">
                        <h3>No applications yet</h3>
                        <p>Once someone applies to one of your listings, they'll show up here.</p>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="request-list">
                        {applications.map((app) => (
                            <div className="request-row" key={app.id}>
                                <div className="request-avatar">
                                    {app.corps_member_name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="request-info">
                                    <div className="request-name">{app.corps_member_name}</div>
                                    <div className="request-meta">Applied for room in {app.location}</div>
                                    {app.status === "accepted" && (
                                        <div className="request-contact">{app.corps_member_contact}</div>
                                    )}
                                </div>
                                {app.status === "pending" ? (
                                    <div className="request-actions">
                                        <button
                                            className="accept"
                                            disabled={actingId === app.id}
                                            onClick={() => handleAction(app.id, "accepted")}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="decline"
                                            disabled={actingId === app.id}
                                            onClick={() => handleAction(app.id, "declined")}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`request-status ${app.status}`}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Applications;
