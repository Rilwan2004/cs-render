const parseMedia = (raw) => {
    if (!raw) return [];
    return raw.split(",").map((url) => url.trim()).filter(Boolean);
};

const isVideoUrl = (url) => /\.(mp4|webm|mov)$/i.test(url);

// Turns a /listings row (agent-posted) into the shape ListingCard/detail pages expect
export const normalizeAgentListing = (listing) => ({
    id: listing.id,
    source: "agent",
    title: `${Number(listing.slots_available) > 1 ? "Shared" : "Private"} room in ${listing.location}`,
    location: listing.location,
    price: listing.price,
    slots: listing.slots_available,
    slotsTaken: Number(listing.slots_taken || 0),
    isFull: Number(listing.slots_taken || 0) >= Number(listing.slots_available),
    roomType: Number(listing.slots_available) > 1 ? "Shared room" : "Private room",
    description: listing.description,
    posterName: listing.agent_name,
    posterId: null, // not exposed by /listings; not needed since interest flow only needs listing id
    tags: [`${listing.slots_available} slot${Number(listing.slots_available) === 1 ? "" : "s"} available`],
    postedLabel: listing.created_at ? formatRelativeTime(listing.created_at) : "Active listing",
    media: parseMedia(listing.images),
});

export { isVideoUrl };

// Turns a /roommates profile with has_apartment=true into the same shape
export const normalizeCorperListing = (profile) => {
    const tags = [];
    if (profile.gender) tags.push(`${capitalize(profile.gender)} only`);
    return {
        id: profile.id,
        source: "corper",
        title: `Room in ${profile.username}'s apartment, ${profile.apartment_location || "Lagos"}`,
        location: profile.apartment_location || "Lagos",
        price: profile.apartment_price,
        slots: profile.apartment_slots,
        roomType: Number(profile.apartment_slots) > 1 ? "Shared room" : "Private room",
        description: profile.apartment_description,
        posterName: profile.username,
        posterId: profile.id,
        tags: tags.length ? tags : ["Fellow corper"],
        postedLabel: "Available now",
        media: parseMedia(profile.apartment_images),
    };
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatRelativeTime = (dateString) => {
    const then = new Date(dateString).getTime();
    const now = Date.now();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return diffMins <= 1 ? "Posted just now" : `Posted ${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Posted ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Posted ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `Posted ${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
};