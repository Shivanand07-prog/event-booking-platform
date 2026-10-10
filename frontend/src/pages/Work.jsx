import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

function Work() {
    const { user, authLoading } = useAuth();

    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [applyingId, setApplyingId] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`${API}/work`);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load jobs");
                }

                setJobs(Array.isArray(data) ? data : data.jobs || []);
            } catch (error) {
                console.error("Fetch jobs error:", error);
                setMessage("Unable to load jobs. Please check the backend.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const categories = useMemo(
        () => [
            "All",
            ...new Set(jobs.map((job) => job.category).filter(Boolean)),
        ],
        [jobs]
    );

    const filteredJobs = useMemo(() => {
        const term = search.toLowerCase().trim();

        return jobs.filter((job) => {
            const matchesSearch = [
                job.title,
                job.description,
                job.location,
                job.city,
                job.category,
                job.eventName,
                job.event?.title,
            ]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(term));

            const matchesCategory =
                category === "All" || job.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [jobs, search, category]);

    const handleApply = async (jobId) => {
        if (!user) {
            setMessage("Please log in before applying for a job.");
            return;
        }

        if (user.role !== "worker") {
            setMessage("Please log in with a worker account to apply.");
            return;
        }

        setMessage("");
        setApplyingId(jobId);

        try {
            const response = await fetch(`${API}/work/${jobId}/apply`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Application failed");
            }

            setMessage(data.message || "Application submitted successfully!");
        } catch (error) {
            setMessage(error.message || "Unable to submit application.");
        } finally {
            setApplyingId(null);
        }
    };

    return (
        <main className="min-h-screen px-5 py-10 text-white md:px-12">
            <section className="mx-auto max-w-7xl">
                <div className="mb-10 text-center">
                    <p className="mb-3 font-semibold uppercase tracking-[0.25em] text-purple-300">
                        GatherX Careers
                    </p>

                    <h1 className="text-4xl font-extrabold md:text-5xl">
                        Find Your Next Event Job
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-300">
                        Discover temporary event opportunities, gain
                        experience, and become part of exciting events.
                    </p>

                    {user?.role === "organizer" && (
                        <Link
                            to="/organizer-work"
                            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-200"
                        >
                            Post a Job
                        </Link>
                    )}

                    {user?.role === "worker" && (
                        <Link
                            to="/my-applications"
                            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-gray-900 hover:bg-gray-200"
                        >
                            My Applications
                        </Link>
                    )}
                </div>

                <div className="mb-8 grid gap-4 md:grid-cols-[1fr_240px]">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search jobs, events, or locations..."
                        className="rounded-xl border border-gray-600 bg-gray-900/90 px-5 py-4 outline-none focus:border-purple-400"
                    />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border border-gray-600 bg-gray-900/90 px-5 py-4 outline-none focus:border-purple-400"
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item === "All" ? "All job categories" : item}
                            </option>
                        ))}
                    </select>
                </div>

                {message && (
                    <p
                        role="status"
                        className="mb-6 rounded-lg border border-gray-700 bg-gray-900/90 p-4 text-center text-yellow-300"
                    >
                        {message}
                        {!user && (
                            <span>
                                {" "}
                                <Link
                                    to="/login"
                                    className="underline"
                                >
                                    Login here
                                </Link>
                            </span>
                        )}
                    </p>
                )}

                {loading ? (
                    <p className="py-16 text-center text-gray-300">
                        Loading available jobs...
                    </p>
                ) : filteredJobs.length === 0 ? (
                    <div className="rounded-2xl border border-gray-700 bg-gray-900/80 p-12 text-center">
                        <h2 className="text-2xl font-bold">
                            No jobs found
                        </h2>
                        <p className="mt-3 text-gray-400">
                            Try another search, or check back when organizers
                            publish new opportunities.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <article
                                key={job._id}
                                className="flex flex-col rounded-2xl border border-gray-700 bg-gray-900/90 p-6 shadow-lg transition hover:-translate-y-1 hover:border-purple-400"
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-200">
                                        {job.category || "Event Staff"}
                                    </span>

                                    <span className="text-sm text-gray-400">
                                        {job.workersNeeded
                                            ? `${job.workersNeeded} openings`
                                            : "Event opportunity"}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold">
                                    {job.title}
                                </h2>

                                <p className="mt-2 text-sm text-gray-400">
                                    {job.event?.title ||
                                        job.eventName ||
                                        "Event opportunity"}
                                </p>

                                <p className="mt-4 flex-1 leading-7 text-gray-300">
                                    {job.description}
                                </p>

                                <div className="mt-5 space-y-2 border-t border-gray-700 pt-4 text-sm text-gray-300">
                                    <p>
                                        <span className="mr-2">📍</span>
                                        {job.location || job.city || "Location not specified"}
                                    </p>

                                    <p>
                                        <span className="mr-2">📅</span>
                                        {job.date
                                            ? new Date(job.date).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )
                                            : "Date to be announced"}
                                    </p>

                                    <p>
                                        <span className="mr-2">💰</span>
                                        {job.pay != null
                                            ? `₹${job.pay} ${job.payType ? `/ ${job.payType}` : ""}`
                                            : job.compensation != null
                                                ? `₹${job.compensation}`
                                                : "Pay not specified"}
                                    </p>
                                </div>

                                {job.status === "closed" ? (
                                    <button
                                        disabled
                                        className="mt-6 rounded-lg bg-gray-700 px-4 py-3 font-semibold text-gray-400"
                                    >
                                        Applications Closed
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApply(job._id)}
                                        disabled={
                                            applyingId === job._id ||
                                            authLoading ||
                                            user?.role === "organizer" ||
                                            user?.role === "admin"
                                        }
                                        className="mt-6 rounded-lg bg-white px-4 py-3 font-semibold text-gray-900 transition hover:bg-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {applyingId === job._id
                                            ? "Applying..."
                                            : user?.role === "organizer" ||
                                                user?.role === "admin"
                                                ? "Workers Only"
                                                : "Apply Now"}
                                    </button>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Work;