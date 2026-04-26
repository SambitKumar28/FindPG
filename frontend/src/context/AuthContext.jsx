import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (formData) => {
    const { data } = await API.post("/auth/login", formData);

    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
  };

  const register = async (formData) => {
    await API.post("/auth/register", formData);
  };

  const logout = async () => {
    await API.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // const loadUser = async () => {
  //   try {
  //     const { data } = await API.get("/auth/me");
  //     setUser(data.user);
  //   } catch {
  //     setUser(null);
  //   }
  // };

  // useEffect(() => {
  //   loadUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};