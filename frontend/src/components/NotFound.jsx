import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDocumentHead } from "../utils/seo";
import "../styles/theme.css";

const NotFound = () => {
    useDocumentHead({
        title: "Page not found",
        description: "This page doesn't exist or may have moved. Head back to Corpspace to browse listings.",
    });

    return (
        <div className="themed">
            <Navbar />
            <div className="section-inner not-found">
                <span className="not-found-code">404</span>
                <h1>This page went missing.</h1>
                <p>
                    The link might be broken, or the listing may have been taken down.
                    Let's get you back somewhere useful.
                </p>
                <div className="not-found-actions">
                    <Link to="/" className="btn btn-primary">Go home</Link>
                    <Link to="/listings" className="btn btn-secondary">Browse listings</Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NotFound;
