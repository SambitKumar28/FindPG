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
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const Register = () => {
  const [selectedRole, setSelectedRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6">
              Join FindPG
            </span>

            <h1 className="text-5xl font-bold leading-tight">
              Create Your Account & Start Your Journey
            </h1>

            <p className="mt-6 text-cyan-100 text-lg leading-relaxed">
              Whether you are searching for a PG or listing your property, join
              FindPG and connect with the right people faster.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold">1000+</h3>
              <p className="text-cyan-100 mt-2">Verified PG Listings</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <h3 className="text-3xl font-bold">25K+</h3>
              <p className="text-cyan-100 mt-2">Trusted Users</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900">
                Create Account
              </h2>

              <p className="text-gray-500 mt-3">
                Choose your role and fill in your details
              </p>
            </div>

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mt-8 mb-8">
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={`rounded-3xl border p-5 transition-all duration-300 text-left ${
                  selectedRole === "user"
                    ? "border-cyan-600 bg-cyan-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-cyan-300"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                  <Users size={24} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">User</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Looking for PG accommodation
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("owner")}
                className={`rounded-3xl border p-5 transition-all duration-300 text-left ${
                  selectedRole === "owner"
                    ? "border-cyan-600 bg-cyan-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-cyan-300"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-4">
                  <Building2 size={24} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">Owner</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Want to list your PG property
                </p>
              </button>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
                  />
                </div>
              </div>

              {selectedRole === "owner" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    PG / Property Name
                  </label>

                  <div className="relative">
                    <Building2
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      placeholder="Enter your PG or property name"
                      className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full border border-gray-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-r from-cyan-600 to-blue-700 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Create {selectedRole === "owner" ? "Owner" : "User"} Account
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

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

            <p className="text-center text-gray-500 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-600 font-semibold hover:text-cyan-700"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;