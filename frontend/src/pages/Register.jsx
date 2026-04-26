import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Building2,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";


const Register = () => {
  const [selectedRole, setSelectedRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const  register  = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");

      await register({
        ...form,
        role: selectedRole,
      });

      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2"
      >
        {/* Left Section */}
        <div className="hidden lg:flex bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white p-14 flex-col justify-between">
          <div>
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
              Join FindPG
            </span>

            <h1 className="text-5xl font-bold leading-tight">
              Create Your Account & Start Your Journey
            </h1>

            <p className="mt-6 text-cyan-100 text-lg">
              Join FindPG and connect with the right people faster.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-bold text-gray-900">
              Create Account
            </h2>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={`p-5 rounded-3xl border ${
                  selectedRole === "user"
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-gray-200"
                }`}
              >
                <Users /> User
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`p-5 rounded-3xl border ${
                  selectedRole === "owner"
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-gray-200"
                }`}
              >
                <Building2 /> Owner
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border p-4 rounded-2xl"
              />

              {/* Email */}
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-4 rounded-2xl"
              />

              {/* Phone */}
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border p-4 rounded-2xl"
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border p-4 rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full border p-4 rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-4"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 text-white py-4 rounded-2xl"
              >
                {loading
                  ? "Creating..."
                  : `Create ${selectedRole} Account`}
              </button>
            </form>

            <p className="text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-600">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;