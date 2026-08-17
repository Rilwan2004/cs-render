import { Link } from "react-router-dom";

// Pinned to the bottom of the viewport on mobile only (see .sticky-cta in
// theme.css, hidden at desktop widths). Keeps the primary action within
// thumb reach no matter how far someone has scrolled.
const StickyMobileCTA = () => {
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <div className="sticky-cta">
            {isLoggedIn ? (
                <>
                    <Link to="/listings" className="btn btn-secondary btn-full">
                        Browse listings
                    </Link>
                    <Link to="/listings/new" className="btn btn-primary btn-full">
                        Post a listing
                    </Link>
                </>
            ) : (
                <>
                    <Link to="/login" className="btn btn-secondary btn-full">
                        Login
                    </Link>
                    <Link to="/register" className="btn btn-primary btn-full">
                        Get started
                    </Link>
                </>
            )}
        </div>
    );
};

export default StickyMobileCTA;
