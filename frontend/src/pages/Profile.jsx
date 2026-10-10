import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Profile() {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="p-10 text-center text-white">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-10 text-center text-white">
                <h1 className="mb-4 text-2xl font-bold">
                    Please log in to view your profile
                </h1>
                <Link
                    to="/login"
                    className="rounded-lg bg-white px-5 py-2 font-semibold text-gray-900"
                >
                    Login
                </Link>
            </div>
        );
    }

    return (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10">
            <section className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-900/95 p-8 text-white shadow-xl">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-gray-900">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <h1 className="text-3xl font-bold">
                        My Profile
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Your GatherX account details
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg bg-gray-800 p-4">
                        <p className="text-sm text-gray-400">Full Name</p>
                        <p className="mt-1 font-medium">
                            {user.name || "Not provided"}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-800 p-4">
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="mt-1 break-all font-medium">
                            {user.email || "Not provided"}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-800 p-4">
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="mt-1 font-medium">
                            {user.phone || "Not provided"}
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-800 p-4">
                        <p className="text-sm text-gray-400">Account Role</p>
                        <p className="mt-1 font-medium capitalize">
                            {user.role || "attendee"}
                        </p>
                    </div>
                </div>

                {user.role === "organizer" && (
                    <Link
                        to="/organizer-dashboard"
                        className="mt-6 block rounded-lg bg-white py-3 text-center font-semibold text-gray-900 hover:bg-gray-200"
                    >
                        Go to Organizer Dashboard
                    </Link>
                )}

                {user.role !== "organizer" && (
                    <Link
                        to="/my-bookings"
                        className="mt-6 block rounded-lg bg-white py-3 text-center font-semibold text-gray-900 hover:bg-gray-200"
                    >
                        View My Bookings
                    </Link>
                )}
            </section>
        </main>
    );
}

export default Profile;