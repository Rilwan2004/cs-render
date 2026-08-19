import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDocumentHead } from "../utils/seo";
import "../styles/theme.css";

const Safety = () => {
    useDocumentHead({
        title: "Safety",
        description: "How to stay safe while finding a room or a roommate on Corpspace.",
    });

    return (
        <div className="themed">
            <Navbar />
            <div className="section-inner legal-page">
                <h1>Staying safe on Corpspace</h1>
                <p>
                    Corpspace connects you directly with agents and fellow corpers — there's no
                    middleman handling money or verifying every listing in person. A little
                    caution goes a long way. Here's what we recommend before you commit to a room
                    or a roommate.
                </p>

                <h2>Before you agree to anything</h2>
                <ul>
                    <li>Never send money — rent, deposit, "inspection fees," or anything else — before you've seen the room in person.</li>
                    <li>Ask to view the room yourself, or send someone you trust if you can't get there.</li>
                    <li>Meet in daylight hours, and let a friend or fellow corper know where you're going.</li>
                    <li>Be wary of listings priced far below similar rooms in the same area — it's the most common sign of a scam.</li>
                </ul>

                <h2>Once you're in contact</h2>
                <ul>
                    <li>Contact details only unlock after a mutual accept — you and the other person both agreed before either of you can see them.</li>
                    <li>Keep early conversations on record (text or email) rather than moving straight to cash or informal agreements.</li>
                    <li>For roommate matches, have an honest conversation about house rules, guests, and shared costs before moving in.</li>
                </ul>

                <h2>Red flags to watch for</h2>
                <ul>
                    <li>An agent or corper who refuses a viewing or always has an excuse to avoid meeting.</li>
                    <li>Pressure to pay quickly "before someone else takes it."</li>
                    <li>Requests to pay into a personal account with no documentation, receipt, or agreement.</li>
                </ul>

                <h2>Report a problem</h2>
                <p>
                    If something feels off about a listing or a person you've matched with, don't
                    proceed — email us at{" "}
                    <a href="mailto:safety@corpspace.app">safety@corpspace.app</a> with as much
                    detail as you can share, and we'll look into it.
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default Safety;
