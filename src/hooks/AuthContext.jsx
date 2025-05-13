import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token && user ? { token, user: JSON.parse(user) } : null;
  });

  const [loading, setLoading] = useState(true); // ✅ جديد

  // ✅ Fetch user & profile on initial load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false); // ❗ لازم نوقف اللودنغ حتى لو ما في توكن
          return;
        }

        const response = await axios.get(
          "https://railway-system-production-1a43.up.railway.app/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data?.data?.user;
        const profileData = response.data?.data?.profile;

        if (userData && profileData) {
          const mergedUser = {
            ...userData,
            profile: profileData,
          };

          localStorage.setItem("user", JSON.stringify(mergedUser));
          setAuth({ token, user: mergedUser });
        }
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
      } finally {
        setLoading(false); // ✅ مهما صار، لازم نوقف اللودينغ
      }
    };

    fetchUserProfile();
  }, []);

  const login = (data) => {
    console.log("📥 Login data received:", data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuth({ token: data.token, user: data.user });

    // Fetch full profile after login
    setTimeout(() => {
      fetchProfileAfterLogin(data.token);
    }, 300);
  };

  const fetchProfileAfterLogin = async (token) => {
    try {
      const response = await axios.get(
        "https://railway-system-production-1a43.up.railway.app/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data?.data?.user;
      const profileData = response.data?.data?.profile;

      if (userData && profileData) {
        const mergedUser = {
          ...userData,
          profile: profileData,
        };

        localStorage.setItem("user", JSON.stringify(mergedUser));
        setAuth({ token, user: mergedUser });
      }
    } catch (err) {
      console.error("❌ Failed to fetch profile after login:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
