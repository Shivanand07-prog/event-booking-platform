import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, setUser, authLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                console.error("Logout failed");
                return;
            }

            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const linkStyle =
        "text-gray-300 hover:text-white transition whitespace-nowrap";

    return (
        <nav className="flex flex-wrap items-center justify-between gap-4 px-8 py-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
                GatherX
            </Link>

            {/* Public navigation */}
            <div className="flex flex-wrap gap-5">
                <Link to="/" className={linkStyle}>
                    Home
                </Link>

                <Link to="/events" className={linkStyle}>
                    Events
                </Link>

                <Link to="/work" className={linkStyle}>
                    Work
                </Link>
            </div>

            {/* Authentication navigation */}
            <div className="flex flex-wrap items-center gap-4">
                {authLoading ? (
                    <span className="text-sm text-gray-400">
                        Loading...
                    </span>
                ) : user ? (
                    <>
                        <Link to="/profile" className={linkStyle}>
                            My Profile
                        </Link>

                        <Link to="/my-bookings" className={linkStyle}>
                            My Bookings
                        </Link>

                        {user.role === "organizer" && (
                            <Link
                                to="/organizer-dashboard"
                                className={linkStyle}
                            >
                                Organizer Dashboard
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg bg-white px-4 py-2 font-medium text-gray-900 transition hover:bg-gray-200"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={linkStyle}>
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-lg bg-white px-4 py-2 font-medium text-gray-900 transition hover:bg-gray-200"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;