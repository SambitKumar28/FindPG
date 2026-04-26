import { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= AUTO LOGIN =================
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.log("Auto login failed");
        setUser(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ================= REGISTER =================
  const register = async (formData) => {
    try {
      const res = await API.post("/auth/register", formData);

      // optional: auto login after register
      // better UX for SaaS
      const loginRes = await API.post("/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    localStorage.setItem("accessToken", loginRes.data.accessToken);
    setUser(loginRes.data.user);

      return { success: true, message: res.data.message, user: loginRes.data.user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // ================= LOGIN =================
  const login = async (credentials) => {
    try {
      const res = await API.post("/auth/login", credentials);

      localStorage.setItem("accessToken", res.data.accessToken);
      setUser(res.data.user);

      return { success: true, user: res.data.user };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout API failed");
    }

    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register, 
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);