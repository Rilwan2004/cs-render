import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckIcon } from "../components/Icons";
import "../styles/theme.css";
import "../styles/landing.css";

const STEPS = [
    {
        num: "01",
        title: "Set up your profile",
        body: "Tell us your budget, preferred area, and whether you already have a place or you're starting from scratch.",
    },
    {
        num: "02",
        title: "Browse or get matched",
        body: "Search verified corpers splitting rent near you, or post your own spare room for others to find.",
    },
    {
        num: "03",
        title: "Chat once verified",
        body: "Contact details stay private until both sides accept, no phone numbers floating in a WhatsApp group.",
    },
];

const Landing = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    // Logged-in users have no reason to see the marketing landing page,
    // send them straight to their dashboard instead.
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/dashboard", { replace: true });
        }
    }, [isLoggedIn, navigate]);

    if (isLoggedIn) {
        return null;
    }

    return (
        <div className="themed">
            <Navbar variant="landing" />

            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-copy reveal in-view">
                        <span className="eyebrow">Built for NYSC corpers in Lagos</span>
                        <h1>
                            The safest way to <span className="gradient-text">match</span> with a roommate.
                        </h1>
                        <p className="body-lg">
                            Skip the WhatsApp groups and shady agents. Search verified corpers
                            splitting rent near you, then meet with confidence.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Get started
                            </Link>
                            <a href="#how-it-works" className="btn btn-secondary btn-lg">
                                How it works
                            </a>
                        </div>
                        {/* <div className="trust-micro">
                            <CheckIcon width="16" height="16" />
                            Verified corpers only, no agents pretending to be roommates
                        </div> */}
                    </div>

                    <div className="hero-visual">
                        <div className="match-seal">
                            <div className="seal-card seal-card-left glass">
                                <div className="seal-avatar"></div>
                                <div className="seal-line"></div>
                                <div className="seal-line short"></div>
                                <div className="seal-badge">
                                    <CheckIcon width="10" height="10" />
                                </div>
                            </div>
                            <div className="seal-card seal-card-right glass">
                                <div className="seal-avatar"></div>
                                <div className="seal-line"></div>
                                <div className="seal-line short"></div>
                                <div className="seal-badge">
                                    <CheckIcon width="10" height="10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="steps" id="how-it-works">
                <div className="section-inner">
                    <span className="eyebrow">How it works</span>
                    <h2>Three steps to a verified match</h2>
                    <div className="steps-grid">
                        {STEPS.map((step) => (
                            <div className="step-card glass-light" key={step.num}>
                                <span className="step-num">{step.num}</span>
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
