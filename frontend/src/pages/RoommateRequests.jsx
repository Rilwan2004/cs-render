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
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const [applications, setApplications] = useState([]);
    const [actingId, setActingId] = useState(null);

    const fetchAll = async (token) => {
        const headers = { Authorization: `Bearer ${token}` };
        const [mineRes, incomingRes, applicationsRes] = await Promise.all([
            axios.get(`${API_URL}/roommates/requests/mine`, { headers }),
            axios.get(`${API_URL}/roommates/requests/incoming`, { headers }),
            axios.get(`${API_URL}/interests/mine`, { headers }),
        ]);
        setSent(mineRes.data.requests);
        setReceived(incomingRes.data.requests);
        setApplications(applicationsRes.data.interests);
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
                await fetchAll(token);
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
            await fetchAll(token);
        } catch (err) {
            console.error("Error updating request:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setActingId(null);
        }
    };

    // Clicking an accepted "sent" request takes you to that person's listing,
    // with the now-unblurred contact details — and marks it seen along the way
    // (ListingDetail itself calls the /seen endpoint once it loads).
    const openAcceptedProfile = (req) => {
        if (req.status !== "accepted") return;
        navigate(`/listings/corper/${req.requested_id}`);
    };

    // Same idea, for a listing you applied to.
    const openAcceptedListing = (app) => {
        if (app.status !== "accepted") return;
        navigate(`/listings/agent/${app.listing_id}`);
    };

    const noRequestsAtAll = sent.length === 0 && received.length === 0 && applications.length === 0;

    return (
        <div className="themed">
            <Navbar active="requests" />
            <div className="section-inner listings-header">
                <h1>Requests</h1>
                <p className="subtitle">Everyone you've reached out to, and everyone who's reached out to you.</p>
            </div>

            <div className="section-inner">
                {loading && <p style={{ color: "var(--slate-500)", padding: "40px 0" }}>Loading...</p>}
                {error && <p className="form-error" style={{ maxWidth: 400 }}>{error}</p>}

                {!loading && !error && noRequestsAtAll && (
                    <div className="listings-empty">
                        <h3>No requests yet</h3>
                        <p>
                            Browse listings and apply, or reach out to a fellow corper with a spare room, or make
                            sure "I already have an apartment and need a roommate" is checked on your profile so
                            others can find you.
                        </p>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="request-section">
                        <h2 className="request-section-title">Rooms you've applied to</h2>
                        <div className="request-list">
                            {applications.map((app) => {
                                const isAccepted = app.status === "accepted";
                                const isNew = isAccepted && !app.seen_by_applicant;
                                return (
                                    <div
                                        className={`request-row ${isAccepted ? "request-row-clickable" : ""}`}
                                        key={app.id}
                                        role={isAccepted ? "button" : undefined}
                                        tabIndex={isAccepted ? 0 : undefined}
                                        onClick={() => openAcceptedListing(app)}
                                        onKeyDown={(e) => {
                                            if (isAccepted && (e.key === "Enter" || e.key === " ")) {
                                                e.preventDefault();
                                                openAcceptedListing(app);
                                            }
                                        }}
                                    >
                                        <div className="request-avatar">
                                            {app.location?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="request-info">
                                            <div className="request-name">
                                                {app.location}
                                                {isNew && <span className="request-new-badge">New</span>}
                                            </div>
                                            <div className="request-meta">
                                                {isAccepted
                                                    ? "Accepted \u2014 tap to view the listing & contact details"
                                                    : "You applied to this listing"}
                                            </div>
                                        </div>
                                        <span className={`request-status ${app.status}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!loading && !error && sent.length > 0 && (
                    <div className="request-section">
                        <h2 className="request-section-title">Requests you've sent</h2>
                        <div className="request-list">
                            {sent.map((req) => {
                                const isAccepted = req.status === "accepted";
                                const isNew = isAccepted && !req.seen_by_requester;
                                return (
                                    <div
                                        className={`request-row ${isAccepted ? "request-row-clickable" : ""}`}
                                        key={req.id}
                                        role={isAccepted ? "button" : undefined}
                                        tabIndex={isAccepted ? 0 : undefined}
                                        onClick={() => openAcceptedProfile(req)}
                                        onKeyDown={(e) => {
                                            if (isAccepted && (e.key === "Enter" || e.key === " ")) {
                                                e.preventDefault();
                                                openAcceptedProfile(req);
                                            }
                                        }}
                                    >
                                        <div className="request-avatar">
                                            {req.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="request-info">
                                            <div className="request-name">
                                                {req.username}
                                                {isNew && <span className="request-new-badge">New</span>}
                                            </div>
                                            <div className="request-meta">
                                                {isAccepted
                                                    ? "Accepted your request \u2014 tap to view their listing & contact details"
                                                    : "You asked to room with them"}
                                            </div>
                                        </div>
                                        <span className={`request-status ${req.status}`}>
                                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!loading && !error && received.length > 0 && (
                    <div className="request-section">
                        <h2 className="request-section-title">Requests you've received</h2>
                        <div className="request-list">
                            {received.map((req) => (
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
                                                {req.contact_phone ? ` \u00b7 ${req.contact_phone}` : ""}
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
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default RoommateRequests;