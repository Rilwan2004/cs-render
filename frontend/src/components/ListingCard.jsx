import { Link } from "react-router-dom";
import { CheckIcon, HeartIcon, PinIcon, ImageIcon, HomeIcon, DocIcon } from "./Icons";

const TINTS = [
    { className: "tint-sun", Icon: ImageIcon },
    { className: "tint-ember", Icon: HomeIcon },
    { className: "tint-mist", Icon: DocIcon },
];

const formatPrice = (price) => {
    const num = Number(price);
    if (Number.isNaN(num)) return price;
    return num.toLocaleString("en-NG");
};

const ListingCard = ({ listing, index }) => {
    const tint = TINTS[index % TINTS.length];

    return (
        <Link to={`/listings/${listing.source}/${listing.id}`} className="listing-card">
            <div className={`listing-card-image ${tint.className}`}>
                <span className="badge-verified">
                    <CheckIcon /> Verified
                </span>
                <span className="icon-btn">
                    <HeartIcon width="16" height="16" />
                </span>
                <tint.Icon />
            </div>
            <div className="listing-card-body">
                <div className="listing-price mono">
                    &#8358;{formatPrice(listing.price)} <span className="unit">/month</span>
                </div>
                <div className="listing-title">{listing.title}</div>
                <div className="listing-location">
                    <PinIcon />
                    {listing.location} &middot; {listing.roomType}
                </div>
                <div className="listing-tags">
                    {listing.tags.map((tag) => (
                        <span key={tag} className="tag-pill">{tag}</span>
                    ))}
                </div>
                <div className="listing-card-footer">
                    <span className={`poster-role-tag ${listing.source === "agent" ? "agent" : "corper"}`}>
                        {listing.source === "agent" ? "Agent" : "Corper"}
                    </span>
                    <span className="posted-dot"></span>
                    {listing.postedLabel}
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;
