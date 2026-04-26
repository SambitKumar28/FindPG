import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VisitePg from "./pages/VisitePg";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AuthProvider } from "./context/AuthContext";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import UserDashboard from "./pages/user/UserDashboard";
import AddPG from "./pages/owner/AddPG";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visitpg" element={<VisitePg />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Owner Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["owner", "admin"]}>
                  <OwnerDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/add-pg"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["owner"]}>
                  <AddPG />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
