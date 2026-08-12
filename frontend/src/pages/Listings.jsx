import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ListingCard from "../components/ListingCard";
import { normalizeAgentListing, normalizeCorperListing } from "../utils/listings";
import "../styles/theme.css";
import "../styles/listings.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SORTS = [
    { key: "newest", label: "Newest" },
    { key: "price-low", label: "Price: low to high" },
    { key: "price-high", label: "Price: high to low" },
];

const Listings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [listings, setListings] = useState([]);

    const [sourceFilter, setSourceFilter] = useState("all"); // all | agent | corper
    const [sort, setSort] = useState("newest");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            axios.get(`${API_URL}/listings`, { headers }),
            axios.get(`${API_URL}/roommates`, { headers }),
        ])
            .then(([listingsRes, roommatesRes]) => {
                const agentListings = listingsRes.data.listings.map(normalizeAgentListing);
                const corperListings = roommatesRes.data.profiles
                    .filter((p) => p.has_apartment)
                    .map(normalizeCorperListing);
                setListings([...agentListings, ...corperListings]);
            })
            .catch((err) => {
                console.error("Error fetching listings:", err);
                setError("Couldn't load listings right now. Please try again.");
            })
            .finally(() => setLoading(false));
    }, []);

    const visibleListings = useMemo(() => {
        let result = listings;

        if (sourceFilter !== "all") {
            result = result.filter((l) => l.source === sourceFilter);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter(
                (l) =>
                    l.location?.toLowerCase().includes(q) ||
                    l.title?.toLowerCase().includes(q)
            );
        }

        result = [...result].sort((a, b) => {
            if (sort === "price-low") return Number(a.price) - Number(b.price);
            if (sort === "price-high") return Number(b.price) - Number(a.price);
            return 0; // "newest": keep API order (agent listings already sorted desc by created_at)
        });

        return result;
    }, [listings, sourceFilter, sort, search]);

    return (
        <div className="themed">
            <Navbar active="browse" />

            <div className="section-inner listings-header">
                <h1>Browse listings</h1>
                <p className="subtitle">Agent rooms and corpers with a spare space, all in one place.</p>
            </div>

            <div className="section-inner">
                <div className="filter-bar">
                    <input
                        type="text"
                        className="filter-select"
                        style={{ flex: "1 1 220px", cursor: "text" }}
                        placeholder="Search by location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="filter-pill-group">
                        <button
                            className={sourceFilter === "all" ? "active" : ""}
                            onClick={() => setSourceFilter("all")}
                        >
                            All
                        </button>
                        <button
                            className={sourceFilter === "agent" ? "active" : ""}
                            onClick={() => setSourceFilter("agent")}
                        >
                            Agent
                        </button>
                        <button
                            className={sourceFilter === "corper" ? "active" : ""}
                            onClick={() => setSourceFilter("corper")}
                        >
                            Corper
                        </button>
                    </div>

                    <select
                        className="filter-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        {SORTS.map((s) => (
                            <option key={s.key} value={s.key}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>

                {!loading && !error && (
                    <div className="listings-meta">
                        <span className="count">
                            {visibleListings.length} <span>listing{visibleListings.length === 1 ? "" : "s"}</span>
                        </span>
                    </div>
                )}

                {loading && <p style={{ color: "var(--slate-500)", padding: "40px 0" }}>Loading...</p>}
                {error && <p className="form-error" style={{ maxWidth: 400 }}>{error}</p>}

                {!loading && !error && visibleListings.length === 0 && (
                    <div className="listings-empty">
                        <h3>No listings match your filters</h3>
                        <p>Try a different search term or clear the filters.</p>
                    </div>
                )}

                {!loading && !error && visibleListings.length > 0 && (
                    <div className="listings-grid">
                        {visibleListings.map((listing, i) => (
                            <ListingCard key={`${listing.source}-${listing.id}`} listing={listing} index={i} />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Listings;
