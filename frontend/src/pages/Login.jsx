import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const { refreshUser } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            // Fetch the logged-in user's profile and update AuthContext.
            const user = await refreshUser();

            if (!user) {
                setMessage(
                    "Login succeeded, but profile could not be loaded. Please check your authentication setup."
                );
                return;
            }

            setMessage("Login successful!");

            // Redirect based on the user's role.
            if (user.role === "organizer") {
                navigate("/organizer-dashboard");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
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
                    Welcome Back
                </h1>

                <p className="text-center text-gray-400">
                    Login to continue with GatherX.
                </p>

                <div>
                    <label className="mb-2 block" htmlFor="email">
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
                    <label className="mb-2 block" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 outline-none focus:border-white"
                        placeholder="Enter your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-white py-3 font-semibold text-gray-900 transition hover:bg-gray-200 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
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
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-white underline"
                    >
                        Register
                    </Link>
                </p>
            </form>
        </main>
    );
}

export default Login;