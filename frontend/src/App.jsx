import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import bgImage from "./assets/gatherx_bg.png";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
import Work from "./pages/Work";
import PostJob from "./pages/PostJob";

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <div
          className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <Navbar/>

          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/organizer-dashboard"element={<OrganizerDashboard />}/>
            <Route path="/profile" element={<Profile />} />
            <Route path="/work" element={<Work />} />
            <Route path="/organizer-work" element={<PostJob />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;