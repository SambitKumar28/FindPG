import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await API.post("/auth/login", formData);

    login(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(form);

      alert("Login successful");
      navigate("/owner/dashboard"); // 👉 change to dashboard later
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2"
      >
        {/* Left Side */}
        <div className="hidden lg:flex bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white p-14 flex-col justify-between">
          <div>
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
              Welcome Back
            </span>

            <h1 className="text-5xl font-bold leading-tight">
              Find Your Perfect PG Stay Easily
            </h1>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-bold text-gray-900">Login Account</h2>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-12 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-cyan-600 to-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                {loading ? "Logging in..." : "Login"}
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-4">
              <button className="border rounded-2xl py-3 flex items-center justify-center gap-2">
                <FcGoogle /> Google
              </button>
              <button className="border rounded-2xl py-3 flex items-center justify-center gap-2">
                <FaFacebookF /> Facebook
              </button>
            </div>

            <p className="text-center mt-6">
              Don’t have an account?{" "}
              <Link to="/register" className="text-cyan-600">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
