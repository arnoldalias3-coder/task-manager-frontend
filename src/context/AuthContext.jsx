import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setIsAuthenticated(true);

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        const res = await axiosInstance.get("/auth/me");

        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleForceLogout = () => {
      clearAuth();
    };

    window.addEventListener("auth:logout", handleForceLogout);

    return () => {
      window.removeEventListener("auth:logout", handleForceLogout);
    };
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem("token", token);

    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }

    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};