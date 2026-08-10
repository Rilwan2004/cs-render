import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MediaSlider from "../components/MediaSlider";
import { CheckIcon, HeartIcon, PinIcon, ArrowLeftIcon, LockIcon } from "../components/Icons";
import { normalizeAgentListing, normalizeCorperListing } from "../utils/listings";
import "../styles/theme.css";
import "../styles/listings.css";
import "../styles/detail.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const formatPrice = (price) => {
    const num = Number(price);
    if (Number.isNaN(num)) return price;
    return num.toLocaleString("en-NG");
};

const ListingDetail = () => {
    const { source, id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [listing, setListing] = useState(null);
    const [status, setStatus] = useState(null); // null | 'pending' | 'accepted' | 'declined'
    const [contact, setContact] = useState(null);
    const [sending, setSending] = useState(false);
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const fetchData = async () => {
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const homeRes = await axios.get(`${API_URL}/auth/home`, { headers });
                if (homeRes.data.user.role === "agent") {
                    navigate("/listings/mine");
                    return;
                }

                if (source === "agent") {
                    const [listingsRes, interestsRes] = await Promise.all([
                        axios.get(`${API_URL}/listings`, { headers }),
                        axios.get(`${API_URL}/interests/mine`, { headers }),
                    ]);
                    const raw = listingsRes.data.listings.find((l) => String(l.id) === id);
                    if (!raw) {
                        setError("This listing isn't available anymore.");
                        return;
                    }
                    setListing(normalizeAgentListing(raw));
                    const existing = interestsRes.data.interests.find((i) => String(i.listing_id) === id);
                    if (existing) {
                        setStatus(existing.status);
                        setContact(existing.agent_contact);
                    }
                } else {
                    const [roommatesRes, requestsRes] = await Promise.all([
                        axios.get(`${API_URL}/roommates`, { headers }),
                        axios.get(`${API_URL}/roommates/requests/mine`, { headers }),
                    ]);
                    const raw = roommatesRes.data.profiles.find((p) => String(p.id) === id);
                    if (!raw) {
                        setError("This profile isn't available anymore.");
                        return;
                    }
                    setListing(normalizeCorperListing(raw));
                    const existing = requestsRes.data.requests.find((r) => String(r.requested_id) === id);
                    if (existing) {
                        setStatus(existing.status);
                        setContact(existing.contact);
                    }
                }
            } catch (err) {
                console.error("Error fetching listing detail:", err);
                setError("Couldn't load this listing right now.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [source, id]);

    const handleAction = async () => {
        setSending(true);
        setActionError("");
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (source === "agent") {
                await axios.post(`${API_URL}/interests`, { listing_id: Number(id) }, { headers });
            } else {
                await axios.post(`${API_URL}/roommates/request`, { requested_id: Number(id) }, { headers });
            }
            setStatus("pending");
        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong. Please try again.";
            // If it already exists, treat that as pending rather than an error
            if (message.toLowerCase().includes("already")) {
                setStatus("pending");
            } else {
                setActionError(message);
            }
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="themed">
                <Navbar active="browse" />
                <p style={{ padding: "60px 40px", color: "var(--slate-500)" }}>Loading...</p>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="themed">
                <Navbar active="browse" />
                <div className="section-inner">
                    <Link to="/listings" className="back-link">
                        <ArrowLeftIcon /> Back to listings
                    </Link>
                    <p className="form-error" style={{ maxWidth: 400 }}>{error || "Listing not found."}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="themed">
            <Navbar active="browse" />
            <div className="section-inner">
                <Link to="/listings" className="back-link">
                    <ArrowLeftIcon /> Back to listings
                </Link>

                <div className="detail-grid">
                    <div>
                        <div style={{ position: "relative" }}>
                            <MediaSlider media={listing.media} fallbackIndex={Number(id) || 0} />
                            <span className="badge-verified" style={{ position: "absolute", top: 16, left: 16 }}>
                                <CheckIcon /> Verified
                            </span>
                            <span className="icon-btn" style={{ position: "absolute", top: 16, right: 16 }}>
                                <HeartIcon width="18" height="18" />
                            </span>
                        </div>

                        <div className="detail-body">
                            <h1 className="detail-title">{listing.title}</h1>
                            <div className="detail-location">
                                <PinIcon /> {listing.location} &middot; {listing.roomType}
                            </div>
                            <div className="detail-tags">
                                {listing.tags.map((tag) => (
                                    <span key={tag} className="tag-pill">{tag}</span>
                                ))}
                            </div>
                            <div className="detail-description">
                                <h3>About this place</h3>
                                <p>{listing.description || "No additional description provided."}</p>
                            </div>
                        </div>
                    </div>

                    <div className="detail-sidebar">
                        <div className="price mono">
                            &#8358;{formatPrice(listing.price)} <span className="unit">/month</span>
                        </div>

                        <div className="poster-row">
                            <div className="poster-avatar-wrap">
                                <div className="poster-avatar">
                                    {listing.posterName?.charAt(0).toUpperCase()}
                                </div>
                                <span className="poster-verified-badge">
                                    <CheckIcon width="10" height="10" />
                                </span>
                            </div>
                            <div>
                                <div className="poster-name">{listing.posterName}</div>
                                <span className={`poster-role-tag ${source === "agent" ? "agent" : "corper"}`}>
                                    {source === "agent" ? "Agent" : "Fellow corper"}
                                </span>
                                <div className="poster-credibility">
                                    {source === "agent" ? "Verified agent on Corpspace" : "Verified corper on Corpspace"}
                                </div>
                            </div>
                        </div>

                        <div className="contact-card">
                            <h4>Contact details</h4>
                            {status === "accepted" ? (
                                <div className="contact-unblurred">{contact}</div>
                            ) : (
                                <div className="contact-blur-wrap">
                                    <div className="contact-blur-value">{listing.posterName}@example.com</div>
                                    <div className="contact-blur-overlay">
                                        <LockIcon width="18" height="18" />
                                        <span>
                                            {source === "agent" ? "Apply" : "Send a request"} to unlock contact details
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {status === "pending" && (
                            <div className="status-banner pending">
                                {source === "agent" ? "Application" : "Request"} sent, waiting for {listing.posterName} to respond.
                            </div>
                        )}
                        {status === "declined" && (
                            <div className="status-banner declined">
                                {listing.posterName} declined this {source === "agent" ? "application" : "request"}.
                            </div>
                        )}
                        {!status && (
                            <button className="btn btn-primary btn-full" onClick={handleAction} disabled={sending}>
                                {sending
                                    ? "Sending..."
                                    : source === "agent"
                                        ? "Apply Now"
                                        : "Send Roommate Request"}
                            </button>
                        )}
                        {actionError && <p className="form-error">{actionError}</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListingDetail;
