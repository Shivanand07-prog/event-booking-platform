
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/profile",
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                setUser(null);
                return null;
            }

            const data = await response.json();
            setUser(data.user);
            return data.user;
        } catch (error) {
            console.error("Profile fetch error:", error);
            setUser(null);
            return null;
        }
    };

    useEffect(() => {
        refreshUser().finally(() => setAuthLoading(false));
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, refreshUser, authLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
    