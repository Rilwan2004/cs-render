import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="footer">
        <div className="section-inner footer-inner">
            <div className="footer-row">
                <span>&copy; 2026 Corpspace Lagos</span>
                <span>Not affiliated with the NYSC</span>
            </div>
            <div className="footer-row footer-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/safety">Safety</Link>
            </div>
        </div>
    </footer>
);

export default Footer;
