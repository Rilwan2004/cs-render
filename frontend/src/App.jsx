import {BrowserRouter, Routes, Route} from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Listings from "./pages/Listings";
import MyListings from "./pages/MyListings";
import ListingDetail from "./pages/ListingDetail";
import PostListing from "./pages/PostListing";
import Applications from "./pages/Applications";
import RoommateRequests from "./pages/RoommateRequests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfileSetup />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/new" element={<PostListing />} />
        <Route path="/listings/mine" element={<MyListings />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/requests" element={<RoommateRequests />} />
        <Route path="/listings/:source/:id" element={<ListingDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App