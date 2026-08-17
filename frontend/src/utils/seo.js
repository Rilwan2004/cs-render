import { useEffect } from "react";

const SITE_NAME = "Corpspace";
const DEFAULT_DESCRIPTION =
    "Corpspace helps NYSC corpers in Lagos find verified roommates and spare rooms without shady agents or WhatsApp groups.";

/**
 * Sets document.title and the <meta name="description"> tag for the current page.
 * Note: since this is a client-rendered SPA, search engines that don't execute
 * JS won't see these per-route values on first crawl — for full SEO benefit
 * this app would eventually want server-side rendering or prerendering. This
 * hook still helps: it's correct for anything that does render JS (modern
 * Googlebot, social share unfurls via bots that run JS, and the browser tab/
 * history entries), and it's the right foundation to build on.
 */
export const useDocumentHead = ({ title, description } = {}) => {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Verified roommates for Lagos corpers`;
        document.title = fullTitle;

        let tag = document.querySelector('meta[name="description"]');
        if (!tag) {
            tag = document.createElement("meta");
            tag.setAttribute("name", "description");
            document.head.appendChild(tag);
        }
        tag.setAttribute("content", description || DEFAULT_DESCRIPTION);
    }, [title, description]);
};
