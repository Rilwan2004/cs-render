import { useState } from "react";
import { isVideoUrl } from "../utils/listings";
import { ImageIcon, HomeIcon, DocIcon } from "./Icons";

const TINTS = [
    { className: "tint-sun", Icon: ImageIcon },
    { className: "tint-ember", Icon: HomeIcon },
    { className: "tint-mist", Icon: DocIcon },
];

const MediaSlider = ({ media, fallbackIndex = 0, heightClass = "detail-image" }) => {
    const [index, setIndex] = useState(0);

    if (!media || media.length === 0) {
        const tint = TINTS[fallbackIndex % TINTS.length];
        return (
            <div className={`${heightClass} ${tint.className}`}>
                <tint.Icon />
            </div>
        );
    }

    const current = media[index];
    const goPrev = (e) => {
        e.stopPropagation();
        setIndex((index - 1 + media.length) % media.length);
    };
    const goNext = (e) => {
        e.stopPropagation();
        setIndex((index + 1) % media.length);
    };

    return (
        <div className={`${heightClass} media-slider`}>
            {isVideoUrl(current) ? (
                <video src={current} className="media-slide" controls />
            ) : (
                <img src={current} alt="" className="media-slide" />
            )}
            {media.length > 1 && (
                <>
                    <button className="media-nav prev" onClick={goPrev} aria-label="Previous">
                        &#8249;
                    </button>
                    <button className="media-nav next" onClick={goNext} aria-label="Next">
                        &#8250;
                    </button>
                    <div className="media-dots">
                        {media.map((_, i) => (
                            <span
                                key={i}
                                className={`media-dot${i === index ? " active" : ""}`}
                                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MediaSlider;
