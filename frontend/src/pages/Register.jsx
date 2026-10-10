import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "attendee",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

        if (!["attendee", "organizer", "worker"].includes(formData.role)) {
            setMessage("Please select a valid account type.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        password: formData.password,
                        phone: formData.phone.trim(),
                        role: formData.role,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed.");
                return;
            }

            setMessage(
                `Registration successful as ${formData.role}! Redirecting to login...`
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 rounded-2xl border border-gray-700 bg-gray-900/95 p-8 shadow-xl"
            >
                <h1 className="text-center text-3xl font-bold">
                    Create Your Account
                </h1>

                <p className="text-center text-gray-400">
                    Join GatherX and discover amazing events.
                </p>

                <div>
                    <label htmlFor="name" className="mb-2 block">
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 outline-none focus:border-white"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="mb-2 block">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 outline-none focus:border-white"
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="mb-2 block">
                        Phone
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        autoComplete="tel"
                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 outline-none focus:border-white"
                        placeholder="Enter your phone number"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 outline-none focus:border-white"
                        placeholder="Create a password"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="mb-2 block">
                        Account Type
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 outline-none focus:border-white"
                    >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                        <option value="worker">Worker</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-white py-3 font-semibold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>

                {message && (
                    <p
                        role="status"
                        className="text-center text-sm text-yellow-300"
                    >
                        {message}
                    </p>
                )}

                <p className="text-center text-gray-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-white underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </main>
    );
}

export default Register;