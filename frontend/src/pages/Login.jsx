import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="hidden lg:flex relative bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white p-14 flex-col justify-between">
          <div>
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6">
              Welcome Back
            </span>

            <h1 className="text-5xl font-bold leading-tight">
              Find Your Perfect PG Stay Easily
            </h1>

            <p className="mt-6 text-cyan-100 text-lg leading-relaxed">
              Login to explore verified PGs, manage bookings, save favorites,
              and connect directly with property owners.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-cyan-100 mt-2">Verified PG Listings</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold">10K+</h3>
              <p className="text-cyan-100 mt-2">Happy Users</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900">
                Login Account
              </h2>

              <p className="text-gray-500 mt-3">
                Enter your credentials to continue
              </p>
            </div>

            <form className="mt-10 space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  Remember me
                </label>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-linear-to-r from-cyan-600 to-blue-700 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Login
                <ArrowRight size={20} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button className="border border-gray-200 rounded-2xl py-3 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3">
                <FcGoogle size={22} />
                Google
              </button>

              <button className="border border-gray-200 rounded-2xl py-3 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3">
                <FaFacebookF size={18} className="text-blue-600" />
                Facebook
              </button>
            </div>

            {/* Signup */}
            <p className="text-center text-gray-500 mt-8">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-cyan-600 font-semibold hover:text-cyan-700"
              >
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
