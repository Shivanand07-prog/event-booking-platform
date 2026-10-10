
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/bookings/my-bookings",
                {
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Failed to fetch bookings");
                return;
            }

            setBookings(data.bookings || []);
        } catch (error) {
            console.error("Fetch bookings error:", error);
            setError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `http://localhost:5000/api/bookings/${bookingId}/cancel`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Cancellation failed");
                return;
            }

            alert("Booking cancelled successfully!");
            await fetchBookings();
        } catch (error) {
            console.error("Cancel booking error:", error);
            alert("Unable to cancel booking.");
        }
    };

    if (loading) {
        return <p className="p-8 text-center">Loading your bookings...</p>;
    }

    if (error) {
        return <p className="p-8 text-center text-red-400">{error}</p>;
    }

    return (
        <main className="min-h-screen px-4 py-10 md:px-8">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-8 text-3xl font-bold">
                    My Bookings
                </h1>

                {bookings.length === 0 ? (
                    <div className="rounded-xl bg-gray-800 p-8 text-center">
                        <p className="text-gray-300">
                            You haven't booked any events yet.
                        </p>

                        <Link
                            to="/events"
                            className="mt-5 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-200"
                        >
                            Explore Events
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="rounded-xl border border-gray-700 bg-gray-800 p-6"
                            >
                                <h2 className="text-xl font-bold">
                                    {booking.event?.title || "Event"}
                                </h2>

                                <div className="mt-4 space-y-2 text-gray-300">
                                    <p>
                                        📍 {booking.event?.venue || "Venue"},{" "}
                                        {booking.event?.city || ""}
                                    </p>

                                    <p>
                                        🎟️ Seats booked: {booking.seats}
                                    </p>

                                    <p>
                                        💰 Total: ₹{booking.totalAmount}
                                    </p>

                                    <p>
                                        Status:{" "}
                                        <span
                                            className={
                                                booking.status === "confirmed"
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }
                                        >
                                            {booking.status}
                                        </span>
                                    </p>
                                </div>

                                {booking.status === "confirmed" && (
                                    <button
                                        onClick={() =>
                                            handleCancel(booking._id)
                                        }
                                        className="mt-5 w-full rounded-lg border border-red-400 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default MyBookings;
