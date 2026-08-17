const GA_ID = import.meta.env.VITE_GA4_ID;

let initialized = false;

// Loads the gtag.js script and initializes GA4. Safe to call multiple times —
// only runs once. No-ops if VITE_GA4_ID isn't set, so local dev doesn't spam
// your real analytics property.
export const initAnalytics = () => {
    if (initialized || !GA_ID) return;
    initialized = true;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    // send_page_view: false because this is an SPA — we send pageviews
    // ourselves on route change (see trackPageview), otherwise every route
    // change would be missed and only the very first load would be counted.
    gtag("config", GA_ID, { send_page_view: false });
};

// Call this on every route change to record a pageview in GA4.
export const trackPageview = (path) => {
    if (!GA_ID || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
};
