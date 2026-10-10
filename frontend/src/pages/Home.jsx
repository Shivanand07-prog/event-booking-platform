import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/gatherx_bg.png";
function Home(){
    const [search, setSearch] = useState("");
    const [events, setEvents] = useState([]);
    const handleSearch = async () =>{
        const response = await fetch(
            `http://localhost:5000/api/events?search=${search}`
        );
        const data = await response.json();
        setEvents(data.events);
    }
    const navigate = useNavigate();
   return(
    <main
    className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${bgImage})` }}
    >
        <h1 className="text-5xl md:text-6xl font-bold">Discover. Gather. Experience.</h1>
        <p className="mt-5 max-w-2xl text-lg text-gray-400">Discover amazing events, connect with people, and create unforgettable experiences.</p>

        <div className="mt-8 flex w-full max-w-2xl">
            <input
               type="text"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search event, artists, venues..."
               className="flex-1 rounded-l-lg border border-gray-700 bg-gray-800 px-5 py-3 text-white outline-none focus:border-white"
            />
            <button onClick={handleSearch} 
            className="rounded-r-xl bg-white px-7 py-4 font-semibold text-gray-900 hover:bg-gray-200 transition">
                Search
            </button>

        </div>
        <button 
        onClick={() => navigate("/events")}
        className="mt-6 px-7 py-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition">
            Explore Events
        </button>

        <div className="mt-8 w-full max-w-2xl">
            {events.map((event) => (
                <div key={event._id} className="mb-4 p-5 bg-gray-800 rounded-xl">
                    <h2 className="text-xl font-bold">{event.title}</h2>
                    <p className="text-gray-400 mt-2">{event.description}</p>
                    <p className="mt-2">📍 {event.city}</p>
                    <p>💰 ₹{event.price}</p>
                    <p>🎟️ {event.availableSeats} seats available</p>
                </div>
            ))}
        </div>
    </main>

   );
}

export default Home;