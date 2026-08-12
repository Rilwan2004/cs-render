import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FileUploadField from "../components/FileUploadField";
import "../styles/theme.css";
import "../styles/detail.css";
import { LAGOS_AREAS } from "../utils/lagosAreas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ProfileSetup = () => {
    const uploadRef = useRef(null);
    const [values, setValues] = useState({
        phone: "",
        gender: "",
        preferred_location: "",
        budget_min: "",
        budget_max: "",
        bio: "",
        has_apartment: false,
        apartment_location: "",
        apartment_price: "",
        apartment_slots: "",
        apartment_description: ""
    });
    const [existingImages, setExistingImages] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();

    // Pre-fill the form with whatever the user has already saved
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }
            try {
                const response = await axios.get(`${API_URL}/auth/home`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = response.data.user;
                // Agents don't have a roommate-matching profile, only corpers do
                if (user.role === "agent") {
                    navigate("/dashboard");
                    return;
                }
                setValues({
                    phone: user.phone || "",
                    gender: user.gender || "",
                    preferred_location: user.preferred_location || "",
                    budget_min: user.budget_min ?? "",
                    budget_max: user.budget_max ?? "",
                    bio: user.bio || "",
                    has_apartment: !!user.has_apartment,
                    apartment_location: user.apartment_location || "",
                    apartment_price: user.apartment_price ?? "",
                    apartment_slots: user.apartment_slots ?? "",
                    apartment_description: user.apartment_description || ""
                });
                setExistingImages(
                    user.apartment_images ? user.apartment_images.split(",").map((u) => u.trim()).filter(Boolean) : []
                );
            } catch (err) {
                console.error("Error fetching profile:", err);
                localStorage.removeItem("token");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues({ ...values, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSaving(true);

        const token = localStorage.getItem("token");

        // Only send apartment fields if has_apartment is checked, so we don't
        // overwrite saved apartment info with blanks by accident.
        const payload = {
            phone: values.phone || null,
            gender: values.gender || null,
            preferred_location: values.preferred_location || null,
            budget_min: values.budget_min === "" ? null : Number(values.budget_min),
            budget_max: values.budget_max === "" ? null : Number(values.budget_max),
            bio: values.bio || null,
            has_apartment: values.has_apartment
        };

        try {
            if (values.has_apartment) {
                payload.apartment_location = values.apartment_location || null;
                payload.apartment_price = values.apartment_price === "" ? null : Number(values.apartment_price);
                payload.apartment_slots = values.apartment_slots === "" ? null : Number(values.apartment_slots);
                payload.apartment_description = values.apartment_description || null;
                payload.apartment_images = await uploadRef.current.resolveUrls(token);
            }

            await axios.patch(`${API_URL}/auth/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess("Profile updated!");
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="themed">
                <Navbar />
                <p style={{ padding: "60px 40px", color: "var(--slate-500)" }}>Loading...</p>
            </div>
        );
    }

    return (
        <div className="themed">
            <Navbar />
            <div className="section-inner" style={{ padding: "40px 20px 60px" }}>
                <div className="form-card">
                    <span className="eyebrow" style={{ marginBottom: 4 }}>Your profile</span>
                    <h1 style={{ fontSize: 26, marginBottom: 6 }}>Set up your profile</h1>
                    <p style={{ color: "var(--slate-500)", fontSize: 14, marginBottom: 24 }}>
                        This is what other corpers see when they're browsing for a roommate.
                    </p>

                    {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}
                    {success && <p className="form-success" style={{ marginBottom: 16 }}>{success}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="phone">Phone number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="080X XXX XXXX"
                                value={values.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="preferred_location">Preferred location</label>
                            <input
                                type="text"
                                id="preferred_location"
                                name="preferred_location"
                                placeholder="e.g. Yaba, Lagos"
                                value={values.preferred_location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="budget_min">Budget min (&#8358;)</label>
                                <input
                                    type="number"
                                    id="budget_min"
                                    name="budget_min"
                                    placeholder="50000"
                                    value={values.budget_min}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="budget_max">Budget max (&#8358;)</label>
                                <input
                                    type="number"
                                    id="budget_max"
                                    name="budget_max"
                                    placeholder="150000"
                                    value={values.budget_max}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell potential roommates about yourself, sleep schedule, habits, work..."
                                value={values.bio}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "16px 0",
                                borderTop: "1px solid var(--slate-100)",
                                marginBottom: values.has_apartment ? 20 : 4,
                            }}
                        >
                            <input
                                type="checkbox"
                                id="has_apartment"
                                name="has_apartment"
                                checked={values.has_apartment}
                                onChange={handleChange}
                                style={{ width: 18, height: 18 }}
                            />
                            <label htmlFor="has_apartment" style={{ margin: 0, fontSize: 14 }}>
                                I already have an apartment and need a roommate
                            </label>
                        </div>

                        {values.has_apartment && (
                            <div
                                style={{
                                    background: "var(--paper)",
                                    borderRadius: "var(--r-md)",
                                    padding: 20,
                                    marginBottom: 20,
                                }}
                            >
                                <div className="form-field">
                                    <label htmlFor="apartment_location">Apartment location</label>
                                    <select
                                        id="apartment_location"
                                        name="apartment_location"
                                        value={values.apartment_location}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select an area</option>
                                        {LAGOS_AREAS.map((group) => (
                                            <optgroup key={group.group} label={group.group}>
                                                {group.areas.map((area) => (
                                                    <option key={area} value={area}>{area}</option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-field">
                                        <label htmlFor="apartment_price">Price (&#8358;) &middot; Annual (per year)</label>
                                        <input
                                            type="number"
                                            id="apartment_price"
                                            name="apartment_price"
                                            placeholder="120000"
                                            value={values.apartment_price}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label htmlFor="apartment_slots">Slots available</label>
                                        <input
                                            type="number"
                                            id="apartment_slots"
                                            name="apartment_slots"
                                            placeholder="1"
                                            value={values.apartment_slots}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-field" style={{ marginBottom: 0 }}>
                                    <label htmlFor="apartment_description">Apartment description</label>
                                    <textarea
                                        id="apartment_description"
                                        name="apartment_description"
                                        placeholder="2 bedroom flat, need 1 person to fill the second room..."
                                        value={values.apartment_description}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>
                                <div className="form-field" style={{ marginBottom: 0, marginTop: 20 }}>
                                    <label>Photos &amp; videos <span className="hint">(optional)</span></label>
                                    <FileUploadField ref={uploadRef} initialUrls={existingImages} />
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                            {saving ? "Saving..." : "Save profile"}
                        </button>
                        <Link
                            to="/dashboard"
                            className="btn btn-secondary btn-full"
                            style={{ marginTop: 12 }}
                        >
                            Back to dashboard
                        </Link>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfileSetup;
    