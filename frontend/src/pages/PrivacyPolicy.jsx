import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDocumentHead } from "../utils/seo";
import "../styles/theme.css";

const LAST_UPDATED = "14 August 2026";

const PrivacyPolicy = () => {
    useDocumentHead({
        title: "Privacy Policy",
        description: "How Corpspace collects, uses, and protects your personal data.",
    });

    return (
        <div className="themed">
            <Navbar />
            <div className="section-inner legal-page">
                <h1>Privacy Policy</h1>
                <p className="legal-updated">Last updated {LAST_UPDATED}</p>

                <p>
                    Corpspace ("we", "us") helps NYSC corpers in Lagos find roommates and spare
                    rooms. This page explains what personal data we collect, why we collect it,
                    and the choices you have.
                </p>

                <h2>Information we collect</h2>
                <ul>
                    <li>Account details: username, email address, phone number, and password (stored hashed, never in plain text).</li>
                    <li>Profile details you choose to share: gender, preferred location, budget, and bio.</li>
                    <li>Listing details if you post a room: location, price, description, and any photos or videos you upload.</li>
                    <li>Basic technical data: pages visited and general usage patterns, via Google Analytics.</li>
                </ul>

                <h2>How we use it</h2>
                <ul>
                    <li>To create and secure your account, and to authenticate you when you log in.</li>
                    <li>To show your listing or profile to other users browsing Corpspace.</li>
                    <li>To share your contact details (email and phone) with another user only after you both accept a match request — never before.</li>
                    <li>To understand overall usage of the app so we can improve it.</li>
                </ul>

                <h2>Who can see your contact details</h2>
                <p>
                    Your email and phone number are never shown publicly. They're only revealed
                    to another user once you've both mutually accepted an interest or roommate
                    request.
                </p>

                <h2>Data retention</h2>
                <p>
                    We keep your account data for as long as your account is active. You can
                    request deletion of your account and associated data at any time by
                    contacting us.
                </p>

                <h2>Your rights</h2>
                <p>
                    Under the Nigeria Data Protection Act, you have the right to access, correct,
                    or request deletion of your personal data. To exercise any of these rights,
                    reach out to us using the contact details below.
                </p>

                <h2>Contact us</h2>
                <p>
                    Questions about this policy or your data? Email us at{" "}
                    <a href="mailto:privacy@corpspace.app">privacy@corpspace.app</a>.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
