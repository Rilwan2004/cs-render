import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Navbar = ({ active, variant }) => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");
    const isLoggedIn = !!localStorage.getItem("token");

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;
        const token = localStorage.getItem("token");
        axios
            .get(`${API_URL}/auth/home`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                setUsername(res.data.user.username);
                setRole(res.data.user.role);
            })
            .catch(() => {});
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // The landing page is only ever shown to logged-out visitors, so it gets a
    // stripped-down nav: just "How it works" plus login / sign up.
    const isLanding = variant === "landing";

    // Agents can only post and view their own listings, not browse or roommate-match
    const links = isLanding
        ? [{ to: "#how-it-works", label: "How it works", key: "how", anchor: true }]
        : role === "agent"
        ? [
            { to: "/listings/new", label: "Post", key: "post" },
            { to: "/listings/mine", label: "My listings", key: "mine" },
            { to: "/applications", label: "Applications", key: "applications" },
          ]
        : [
            { to: "/listings", label: "Browse", key: "browse" },
            { to: "/listings/new", label: "Post", key: "post" },
            ...(isLoggedIn ? [{ to: "/listings/mine", label: "My listings", key: "mine" }] : []),
            ...(isLoggedIn ? [{ to: "/requests", label: "Requests", key: "requests" }] : []),
            { to: "/safety", label: "Safety", key: "safety" },
          ];

    return (
        <>
            <nav className={`nav${scrolled ? " scrolled" : ""}`}>
                <div className="nav-bottom">
                    <div className={`section-inner${isLanding ? " nav-grid" : ""}`}>
                        {isLanding ? (
                            <>
                                <div className="nav-links nav-links-left">
                                    {links.map((link) => (
                                        <a key={link.key} href={link.to}>
                                            {link.label}
                                        </a>
                                    ))}
                                </div>
                                <Link to="/" className="logo nav-logo-center">
                                    Corpspace<span className="dot">.</span>
                                </Link>
                                <div className="nav-grid-right">
                                    <div className="nav-actions">
                                        <Link to="/login" className="btn btn-secondary btn-sm">
                                            Login
                                        </Link>
                                        <Link to="/register" className="btn btn-primary btn-sm">
                                            Get started
                                        </Link>
                                    </div>
                                    <button
                                        className="hamburger"
                                        onClick={() => setMenuOpen(true)}
                                        aria-label="Open menu"
                                    >
                                        <span></span><span></span><span></span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="logo">
                                    Corpspace<span className="dot">.</span>
                                </Link>
                                <div className="nav-links">
                                    {links.map((link) => (
                                        <Link
                                            key={link.key}
                                            to={link.to}
                                            className={active === link.key ? "active" : ""}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                                <div className="nav-actions">
                                    {isLoggedIn ? (
                                        <>
                                            <Link to="/dashboard" className="nav-avatar" title={username}>
                                                {username?.charAt(0).toUpperCase() || "?"}
                                            </Link>
                                            <Link to="/dashboard" className="btn btn-secondary btn-sm">
                                                Dashboard
                                            </Link>
                                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                                Log out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="btn btn-secondary btn-sm">
                                                Login
                                            </Link>
                                            <Link to="/register" className="btn btn-primary btn-sm">
                                                Get started
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <button
                                    className="hamburger"
                                    onClick={() => setMenuOpen(true)}
                                    aria-label="Open menu"
                                >
                                    <span></span><span></span><span></span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className={`mobile-sheet${menuOpen ? " open" : ""}`}>
                <div className="mobile-sheet-top">
                    <span className="logo">
                        Corpspace<span className="dot">.</span>
                    </span>
                    <button className="close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                        &times;
                    </button>
                </div>
                {links.map((link) =>
                    link.anchor ? (
                        <a key={link.key} href={link.to} onClick={() => setMenuOpen(false)}>
                            {link.label}
                        </a>
                    ) : (
                        <Link key={link.key} to={link.to} onClick={() => setMenuOpen(false)}>
                            {link.label}
                        </Link>
                    )
                )}
                {!isLanding && isLoggedIn ? (
                    <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                        <a onClick={() => { setMenuOpen(false); handleLogout(); }}>Log out</a>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/register" onClick={() => setMenuOpen(false)}>Get started</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default Navbar;
