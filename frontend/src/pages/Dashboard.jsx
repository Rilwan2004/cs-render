import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HomeIcon, UserIcon, DocIcon, CheckIcon } from "../components/Icons";
import "../styles/theme.css";
import "../styles/dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/auth/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="themed">
        <Navbar />
        <p style={{ padding: "60px 40px", color: "var(--slate-500)" }}>Loading...</p>
      </div>
    );
  }

  const isAgent = user?.role === "agent";
  const profileIncomplete = !user?.preferred_location && !user?.gender;

  return (
    <div className="themed">
      <Navbar />
      <div className="section-inner dash-wrap">
        <div className="dash-hero">
          <span className="eyebrow">Dashboard</span>
          <h1>Welcome back, {user?.username}.</h1>
          <p>
            {isAgent
              ? "Post your available rooms and keep track of what you've listed."
              : "Ready to find a roommate or fill a spare room? Browse verified corpers in Lagos or post your own place in a couple of minutes."}
          </p>
          <div className="dash-hero-actions">
            <Link to="/listings/new" className="btn btn-primary">
              Post a listing
            </Link>
            {isAgent ? (
              <Link to="/listings/mine" className="btn btn-secondary">
                My listings
              </Link>
            ) : (
              <Link to="/listings" className="btn btn-secondary">
                Look for houses
              </Link>
            )}
          </div>
        </div>

        <div className="dash-quicklinks">
          {isAgent ? (
            <>
              <Link to="/listings/mine" className="dash-quicklink">
                <div className="icon-wrap">
                  <DocIcon width="20" height="20" />
                </div>
                <h3>My listings</h3>
                <p>See everything you've posted so far.</p>
              </Link>
              <Link to="/applications" className="dash-quicklink">
                <div className="icon-wrap">
                  <CheckIcon width="20" height="20" />
                </div>
                <h3>Applications</h3>
                <p>See who's applied and respond.</p>
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="dash-quicklink">
                <div className="icon-wrap">
                  <UserIcon width="20" height="20" />
                </div>
                <h3>{profileIncomplete ? "Complete your profile" : "Your profile"}</h3>
                <p>
                  {profileIncomplete
                    ? "Add your budget and location so others can find you."
                    : "Update your gender, budget, and bio anytime."}
                </p>
              </Link>
              <Link to="/listings" className="dash-quicklink">
                <div className="icon-wrap">
                  <HomeIcon width="20" height="20" />
                </div>
                <h3>Browse listings</h3>
                <p>See agent rooms and corpers with a spare space.</p>
              </Link>
              <Link to="/listings/mine" className="dash-quicklink">
                <div className="icon-wrap">
                  <DocIcon width="20" height="20" />
                </div>
                <h3>My listings</h3>
                <p>See what you've posted so far.</p>
              </Link>
              <Link to="/requests" className="dash-quicklink">
                <div className="icon-wrap">
                  <CheckIcon width="20" height="20" />
                </div>
                <h3>Requests</h3>
                <p>See who wants to room with you and respond.</p>
              </Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;