import { useEffect } from "react";
import { CheckIcon } from "./Icons";
import "../styles/toast.css";

// Floating, auto-dismissing confirmation banner. Pass `message` (falsy hides
// it) and `onDismiss` to clear it early or after the timeout fires.
const Toast = ({ message, type = "success", onDismiss, duration = 3500 }) => {
    useEffect(() => {
        if (!message) return undefined;
        const timer = setTimeout(onDismiss, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onDismiss]);

    if (!message) return null;

    return (
        <div className="toast-wrap" role="status" aria-live="polite">
            <div className={`toast toast-${type}`}>
                {type === "success" && <CheckIcon width="16" height="16" />}
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;
