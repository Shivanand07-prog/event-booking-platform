
import { useEffect, useState } from "react";

function OrganizerDashboard() {
    const initialForm = {
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        venue: "",
        city: "",
        image: "",
        price: "",
        totalSeats: "",
    };

    const [formData, setFormData] = useState(initialForm);
    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/events"
            );
            const data = await response.json();

            if (response.ok) {
                setEvents(data.events || []);
            }
        } catch (error) {
            console.error("Fetch events error:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/events",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        ...formData,
                        price: Number(formData.price),
                        totalSeats: Number(formData.totalSeats),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to create event");
                return;
            }

            setMessage("Event created successfully!");
            setFormData(initialForm);
            await fetchEvents();
        } catch (error) {
            console.error("Create event error:", error);
            setMessage("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen px-4 py-10 md:px-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="mb-8 text-3xl font-bold">
                    Organizer Dashboard
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="mb-10 grid gap-5 rounded-2xl border border-gray-700 bg-gray-900/95 p-6 md:grid-cols-2"
                >
                    <h2 className="text-2xl font-semibold md:col-span-2">
                        Create New Event
                    </h2>

                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Event title"
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category (e.g. Music)"
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Event description"
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3 md:col-span-2"
                    />

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <input
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        placeholder="Venue"
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Image URL (optional)"
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3 md:col-span-2"
                    />

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Ticket price (₹)"
                        min="0"
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <input
                        type="number"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={handleChange}
                        placeholder="Total seats"
                        min="1"
                        required
                        className="rounded-lg border border-gray-600 bg-gray-800 p-3"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-white p-3 font-semibold text-gray-900 hover:bg-gray-200 disabled:opacity-50 md:col-span-2"
                    >
                        {loading ? "Creating Event..." : "Create Event"}
                    </button>

                    {message && (
                        <p role="status" className="md:col-span-2">
                            {message}
                        </p>
                    )}
                </form>

                <h2 className="mb-5 text-2xl font-semibold">
                    Events
                </h2>

                {events.length === 0 ? (
                    <p className="text-gray-300">
                        No events found.
                    </p>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="rounded-xl border border-gray-700 bg-gray-800 p-5"
                            >
                                <h3 className="text-xl font-bold">
                                    {event.title}
                                </h3>
                                <p className="mt-2 text-gray-300">
                                    {event.category} · {event.city}
                                </p>
                                <p className="mt-2">
                                    Price: ₹{event.price}
                                </p>
                                <p>
                                    Available seats: {event.availableSeats}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default OrganizerDashboard;
