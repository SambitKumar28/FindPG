import React, { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, MapPin, Search, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState({
    keyword: "",
    budget: "",
    genderPreference: "",
  });

  const dashboardLink =
    user?.role === "owner"
      ? "/owner/dashboard"
      : user?.role === "admin"
      ? "/admin/dashboard"
      : "/dashboard";

  const secondaryCta =
    user?.role === "owner"
      ? { to: "/owner/add-pg", label: "List Your PG" }
      : user?.role === "admin"
      ? { to: "/admin/dashboard", label: "Review Listings" }
      : { to: dashboardLink, label: user ? "My Bookings" : "User Dashboard" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search.keyword) params.set("keyword", search.keyword);
    if (search.genderPreference) {
      params.set("genderPreference", search.genderPreference);
    }
    if (search.budget) {
      const [minRent, maxRent] = search.budget.split("-");
      if (minRent) params.set("minRent", minRent);
      if (maxRent) params.set("maxRent", maxRent);
    }

    navigate(`/visitpg${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="bg-gray-50">
      <section className="relative overflow-hidden bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="mb-6 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-md">
                Trusted by Students & Working Professionals
              </span>

              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                Find Your Perfect PG <br />
                Anywhere in India
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-cyan-100">
                Search PGs, hostels, and co-living spaces by location, budget,
                room type, and amenities.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/visitpg"
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-cyan-700 shadow-lg transition hover:bg-gray-100"
                >
                  Find PG
                </Link>

                <Link
                  to={secondaryCta.to}
                  className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 backdrop-blur-md transition hover:bg-white/20"
                >
                  {secondaryCta.label}
                </Link>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-3xl bg-white p-6 text-gray-800 shadow-2xl lg:p-8"
            >
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Search Your Ideal PG
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    City or locality
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 px-4 py-3 focus-within:border-cyan-500">
                    <MapPin className="mr-3 text-cyan-600" size={20} />
                    <input
                      type="text"
                      name="keyword"
                      value={search.keyword}
                      onChange={handleChange}
                      placeholder="Enter city or locality"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Budget
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 px-4 py-3 focus-within:border-cyan-500">
                    <IndianRupee className="mr-3 text-cyan-600" size={20} />
                    <select
                      name="budget"
                      value={search.budget}
                      onChange={handleChange}
                      className="w-full bg-transparent text-gray-700 outline-none"
                    >
                      <option value="">Select budget</option>
                      <option value="3000-5000">Rs. 3,000 - Rs. 5,000</option>
                      <option value="5000-8000">Rs. 5,000 - Rs. 8,000</option>
                      <option value="8000-12000">Rs. 8,000 - Rs. 12,000</option>
                      <option value="12000-">Rs. 12,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Gender Preference
                  </label>
                  <div className="flex items-center rounded-xl border border-gray-200 px-4 py-3 focus-within:border-cyan-500">
                    <Users className="mr-3 text-cyan-600" size={20} />
                    <select
                      name="genderPreference"
                      value={search.genderPreference}
                      onChange={handleChange}
                      className="w-full bg-transparent text-gray-700 outline-none"
                    >
                      <option value="">Any</option>
                      <option value="male">Male only</option>
                      <option value="female">Female only</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white shadow-lg transition hover:bg-cyan-700"
                >
                  <Search size={20} />
                  Search PGs
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Popular Cities</h2>
          <p className="mt-3 text-gray-600">
            Explore the most searched PG destinations
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {["Bhubaneswar", "Bangalore", "Hyderabad", "Pune", "Delhi"].map(
            (city) => (
              <Link
                key={city}
                to={`/visitpg?keyword=${encodeURIComponent(city)}`}
                className="rounded-2xl bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100">
                  <MapPin className="text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{city}</h3>
                <p className="mt-1 text-sm text-gray-500">View listings</p>
              </Link>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;
