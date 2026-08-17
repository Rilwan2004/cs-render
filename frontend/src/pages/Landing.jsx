import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import USPBar from "../components/USPBar";
import StickyMobileCTA from "../components/StickyMobileCTA";
import { CheckIcon, HeartIcon, PinIcon } from "../components/Icons";
import { useDocumentHead } from "../utils/seo";
import { useReveal } from "../utils/useReveal";
import heroImage from "../assets/hero.png";
import "../styles/theme.css";
import "../styles/listings.css";
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

const StepCard = ({ step }) => {
    const ref = useReveal();
    return (
        <div className="step-card glass-light reveal" ref={ref} key={step.num}>
            <span className="step-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
        </div>
    );
};

const Landing = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("token");

    useDocumentHead({
        title: "Find a verified roommate in Lagos",
        description:
            "Find a verified NYSC corper roommate in Lagos, or list your spare room. No agents, no WhatsApp groups, contact details stay private until you both accept.",
    });

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
        <div className="themed landing-page">
            <Navbar variant="landing" />
            <USPBar />

            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-copy reveal in-view">
                        <span className="eyebrow">Built for NYSC corpers in Lagos</span>
                        <h1>
                            Find a roommate <span className="gradient-text">you can trust</span>.
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
                    </div>

                    <div className="hero-visual">
                        <div className="hero-photo-card">
                            <img src={heroImage} alt="Housing estate in Lagos" />
                        </div>

                        <div className="hero-mockup-card listing-card">
                            <div className="listing-card-image tint-ember">
                                <span className="badge-verified">
                                    <CheckIcon /> Verified
                                </span>
                                <span className="icon-btn">
                                    <HeartIcon width="16" height="16" />
                                </span>
                                <img src={heroImage} alt="" className="listing-card-photo" />
                            </div>
                            <div className="listing-card-body">
                                <div className="listing-price mono">
                                    &#8358;450,000 <span className="unit">/year (annual)</span>
                                </div>
                                <div className="listing-title">Private room in Yaba</div>
                                <div className="listing-location">
                                    <PinIcon />
                                    Yaba &middot; Private room
                                </div>
                                <div className="listing-tags">
                                    <span className="tag-pill">1 slot available</span>
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
                            <StepCard step={step} key={step.num} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <StickyMobileCTA />
        </div>
    );
};

export default Landing;
