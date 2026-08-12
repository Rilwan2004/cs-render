import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/theme.css";
import "../styles/listings.css";
import "../styles/requests.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const RoommateRequests = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [requests, setRequests] = useState([]);
    const [actingId, setActingId] = useState(null);

    const fetchRequests = async (token) => {
        const res = await axios.get(`${API_URL}/roommates/requests/incoming`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests);
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
                if (homeRes.data.user.role === "agent") {
                    navigate("/listings/mine");
                    return;
                }
                await fetchRequests(token);
            } catch (err) {
                console.error("Error loading roommate requests:", err);
                setError("Couldn't load your requests right now.");
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
                `${API_URL}/roommates/requests/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await fetchRequests(token);
        } catch (err) {
            console.error("Error updating request:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setActingId(null);
        }
    };

    return (
        <div className="themed">
            <Navbar active="requests" />
            <div className="section-inner listings-header">
                <h1>Roommate requests</h1>
                <p className="subtitle">Everyone who wants to room with you.</p>
            </div>

            <div className="section-inner">
                {loading && <p style={{ color: "var(--slate-500)", padding: "40px 0" }}>Loading...</p>}
                {error && <p className="form-error" style={{ maxWidth: 400 }}>{error}</p>}

                {!loading && !error && requests.length === 0 && (
                    <div className="listings-empty">
                        <h3>No requests yet</h3>
                        <p>
                            Make sure "I already have an apartment and need a roommate" is checked on your
                            profile, that's what makes you visible to browse.
                        </p>
                    </div>
                )}

                {!loading && !error && requests.length > 0 && (
                    <div className="request-list">
                        {requests.map((req) => (
                            <div className="request-row" key={req.id}>
                                <div className="request-avatar">
                                    {req.username?.charAt(0).toUpperCase()}
                                </div>
                                <div className="request-info">
                                    <div className="request-name">{req.username}</div>
                                    <div className="request-meta">Wants to room with you</div>
                                    {req.status === "accepted" && (
                                        <div className="request-contact">
                                            {req.contact}
                                            {req.contact_phone ? ` · ${req.contact_phone}` : ""}
                                        </div>
                                    )}
                                </div>
                                {req.status === "pending" ? (
                                    <div className="request-actions">
                                        <button
                                            className="accept"
                                            disabled={actingId === req.id}
                                            onClick={() => handleAction(req.id, "accepted")}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="decline"
                                            disabled={actingId === req.id}
                                            onClick={() => handleAction(req.id, "declined")}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`request-status ${req.status}`}>
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
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

export default RoommateRequests;
