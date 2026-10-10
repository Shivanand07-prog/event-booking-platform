
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EventDetails() {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState(1);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:5000/api/events/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch event");
                }

                console.log("Event API response:", data);
                setEvent(data.event);
            } catch (error) {
                console.error("Failed to fetch event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!event) return;

        if (
            !Number.isInteger(seats) ||
            seats < 1 ||
            seats > event.availableSeats
        ) {
            alert("Please select a valid number of seats");
            return;
        }

        try {
            setBookingLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        eventId: event._id,
                        seats: seats,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Booking failed");
                return;
            }

            alert("Booking successful!");

            setEvent((prev) => ({
                ...prev,
                availableSeats: prev.availableSeats - seats,
            }));

            setSeats(1);
        } catch (error) {
            console.error("Booking error:", error);
            alert("Something went wrong while booking");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <p className="p-8">Loading event...</p>;
    }

    if (!event) {
        return <p className="p-8">Event could not be loaded.</p>;
    }

    return (
        <main className="min-h-screen px-8 py-10">
            <div className="mx-auto max-w-3xl rounded-xl bg-gray-800 p-8">
                <h1 className="text-4xl font-bold">
                    {event.title}
                </h1>

                <p className="mt-4 text-gray-300">
                    {event.description}
                </p>

                <div className="mt-6 space-y-3 text-lg">
                    <p>📂 {event.category}</p>
                    <p>📍 {event.venue}, {event.city}</p>
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p>🕒 {event.time}</p>
                    <p>💰 ₹{event.price}</p>
                    <p>🎟️ {event.availableSeats} seats available</p>

                    <div className="mt-6">
                        <label className="mb-2 block">
                            Number of seats
                        </label>

                        <input
                            type="number"
                            min="1"
                            max={event.availableSeats}
                            value={seats}
                            disabled={event.availableSeats === 0 || bookingLoading}
                            onChange={(e) =>
                                setSeats(Number(e.target.value))
                            }
                            className="w-24 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white disabled:opacity-50"
                        />
                    </div>

                    <div className="mt-4 text-xl font-semibold">
                        Total: ₹{event.price * seats}
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={bookingLoading || event.availableSeats === 0}
                        className="mt-6 w-full rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {bookingLoading
                            ? "Booking..."
                            : event.availableSeats === 0
                            ? "Sold Out"
                            : "Book Now"}
                    </button>
                </div>
            </div>
        </main>
    );
}

export default EventDetails;
