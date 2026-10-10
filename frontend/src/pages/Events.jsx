import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Events() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchEvents = async () => {
            const response = await fetch("http://localhost:5000/api/events");
            const data = await response.json();

            setEvents(data.events);
        };

        fetchEvents();
    }, []);

   return (
    <main className="min-h-screen px-8 py-10">
        <h1 className="text-4xl font-bold text-center">
            Explore Events
        </h1>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <div
                    key={event._id}
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition"
                >
                    <h2 className="text-2xl font-bold">
                        {event.title}
                    </h2>

                    <p className="text-gray-400 mt-2">
                        {event.description}
                    </p>

                    <p className="mt-4">📍 {event.city}</p>
                    <p>💰 ₹{event.price}</p>
                    <p>🎟️ {event.availableSeats} seats available</p>
                </div>
            ))}
        </div>
    </main>
);
}

export default Events;