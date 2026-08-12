import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import { normalizeAgentListing } from "../utils/listings";
import "../styles/theme.css";
import "../styles/listings.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const MyListings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }
        axios
            .get(`${API_URL}/listings/mine`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setListings(res.data.listings.map(normalizeAgentListing)))
            .catch((err) => {
                console.error("Error fetching my listings:", err);
                setError("Couldn't load your listings right now.");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="themed">
            <Navbar active="mine" />
            <div className="section-inner listings-header">
                <h1>My listings</h1>
                <p className="subtitle">Everything you've posted, agent or corper.</p>
            </div>

            <div className="section-inner">
                {loading && <p style={{ color: "var(--slate-500)", padding: "40px 0" }}>Loading...</p>}
                {error && <p className="form-error" style={{ maxWidth: 400 }}>{error}</p>}

                {!loading && !error && listings.length === 0 && (
                    <div className="listings-empty">
                        <h3>You haven't posted anything yet</h3>
                        <p>
                            <Link to="/listings/new" style={{ color: "var(--ember-500)", fontWeight: 600 }}>
                                Post your first listing
                            </Link>
                        </p>
                    </div>
                )}

                {!loading && !error && listings.length > 0 && (
                    <div className="listings-grid">
                        {listings.map((listing, i) => (
                            <ListingCard key={listing.id} listing={listing} index={i} />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default MyListings;
