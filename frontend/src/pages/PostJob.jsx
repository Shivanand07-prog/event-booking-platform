import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const initialForm = {
    title: "",
    eventName: "",
    description: "",
    category: "Event Crew",
    location: "",
    date: "",
    pay: "",
    payType: "per day",
    workersNeeded: "",
};

function PostJob() {
    const { user, authLoading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (authLoading) return;

        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "organizer") {
            setMessage("Only organizers can post jobs.");
            return;
        }

        if (
            Number(formData.pay) < 0 ||
            Number(formData.workersNeeded) < 1
        ) {
            setMessage("Enter a valid payment and number of workers.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/work", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    pay: Number(formData.pay),
                    workersNeeded: Number(formData.workersNeeded),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to post job.");
            }

            setMessage("Job posted successfully!");

            setTimeout(() => {
                navigate("/work");
            }, 1000);
        } catch (error) {
            console.error("Post job error:", error);
            setMessage(error.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="p-10 text-center text-white">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <main className="px-4 py-20 text-center text-white">
                <h1 className="mb-4 text-3xl font-bold">
                    Organizer Login Required
                </h1>
                <Link
                    to="/login"
                    className="rounded-lg bg-white px-6 py-3 font-semibold text-gray-900"
                >
                    Login
                </Link>
            </main>
        );
    }

    if (user.role !== "organizer") {
        return (
            <main className="px-4 py-20 text-center text-white">
                <h1 className="text-3xl font-bold">
                    Organizers Only
                </h1>
                <p className="mt-3 text-gray-300">
                    You need an organizer account to post event jobs.
                </p>
                <Link
                    to="/work"
                    className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900"
                >
                    Browse Jobs
                </Link>
            </main>
        );
    }

    const inputClass =
        "w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white outline-none focus:border-purple-400";

    return (
        <main className="min-h-screen px-4 py-10 text-white md:px-8">
            <section className="mx-auto max-w-3xl rounded-2xl border border-gray-700 bg-gray-900/95 p-6 shadow-2xl md:p-10">
                <Link
                    to="/work"
                    className="text-sm text-purple-300 hover:text-purple-200"
                >
                    ← Back to Work
                </Link>

                <h1 className="mt-5 text-3xl font-extrabold md:text-4xl">
                    Post an Event Job
                </h1>

                <p className="mt-3 text-gray-400">
                    Find the right people to make your event successful.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="title" className="mb-2 block">
                            Job title
                        </label>
                        <input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            className={inputClass}
                            placeholder="e.g. Event Crew Member"
                        />
                    </div>

                    <div>
                        <label htmlFor="eventName" className="mb-2 block">
                            Event name
                        </label>
                        <input
                            id="eventName"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="e.g. Hyderabad Music Fest"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="mb-2 block">
                            Job category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option>Event Crew</option>
                            <option>Ticketing</option>
                            <option>Registration Desk</option>
                            <option>Usher</option>
                            <option>Stage Assistant</option>
                            <option>Security Support</option>
                            <option>Photography</option>
                            <option>Food & Beverage</option>
                            <option>Technical Support</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-2 block">
                            Job description and responsibilities
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            minLength={10}
                            rows={4}
                            className={inputClass}
                            placeholder="Explain the work, required skills, and responsibilities..."
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="mb-2 block">
                            Work location
                        </label>
                        <input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className={inputClass}
                            placeholder="e.g. HITEX, Hyderabad"
                        />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="date" className="mb-2 block">
                                Work date
                            </label>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                min={new Date().toLocaleDateString("en-CA")}
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="workersNeeded"
                                className="mb-2 block"
                            >
                                Number of workers
                            </label>
                            <input
                                id="workersNeeded"
                                type="number"
                                name="workersNeeded"
                                value={formData.workersNeeded}
                                onChange={handleChange}
                                min="1"
                                max="10000"
                                required
                                className={inputClass}
                                placeholder="e.g. 10"
                            />
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label htmlFor="pay" className="mb-2 block">
                                Payment (₹)
                            </label>
                            <input
                                id="pay"
                                type="number"
                                name="pay"
                                value={formData.pay}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                required
                                className={inputClass}
                                placeholder="e.g. 1000"
                            />
                        </div>

                        <div>
                            <label htmlFor="payType" className="mb-2 block">
                                Payment type
                            </label>
                            <select
                                id="payType"
                                name="payType"
                                value={formData.payType}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                <option value="per hour">Per hour</option>
                                <option value="per day">Per day</option>
                                <option value="fixed">Fixed payment</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-white py-4 font-bold text-gray-900 transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Publishing Job..." : "Publish Job"}
                    </button>

                    {message && (
                        <p
                            role="status"
                            className="rounded-lg bg-gray-800 p-3 text-center text-yellow-300"
                        >
                            {message}
                        </p>
                    )}
                </form>
            </section>
        </main>
    );
}

export default PostJob;