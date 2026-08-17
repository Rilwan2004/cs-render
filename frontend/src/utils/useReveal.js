import { useEffect, useRef } from "react";

/**
 * Adds the .in-view class to an element once it scrolls into the viewport,
 * pairing with the .reveal CSS utility (opacity/translate fade-in defined in
 * theme.css). Triggers once, then stops observing. No-op-safe if the
 * environment doesn't support IntersectionObserver.
 */
export const useReveal = (options = { threshold: 0.2 }) => {
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                node.classList.add("in-view");
                observer.unobserve(node);
            }
        }, options);

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return ref;
};
