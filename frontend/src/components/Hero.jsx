import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, IndianRupee, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative Blur Circles */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6">
                Trusted by Students & Working Professionals
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Find Your Perfect PG <br />
                Anywhere in India
              </h1>

              <p className="mt-6 text-lg text-cyan-100 max-w-xl leading-relaxed">
                Search premium PGs, hostels, and co-living spaces in your
                favorite city with modern amenities, affordable pricing, and
                verified owners.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <button className="bg-white text-cyan-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg">
                  Explore PGs
                </button>

                <button className="border border-white/30 bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl hover:bg-white/20 transition">
                  View Popular Cities
                </button>
              </div>
            </motion.div>

            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 text-gray-800"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Search Your Ideal PG
              </h2>

              <div className="space-y-5">
                {/* City */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    City
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-cyan-500">
                    <MapPin className="text-cyan-600 mr-3" size={20} />
                    <input
                      type="text"
                      placeholder="Enter city name"
                      className="w-full outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Budget
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-cyan-500">
                    <IndianRupee className="text-cyan-600 mr-3" size={20} />
                    <select className="w-full outline-none bg-transparent text-gray-700">
                      <option>Select Budget</option>
                      <option>₹3,000 - ₹5,000</option>
                      <option>₹5,000 - ₹8,000</option>
                      <option>₹8,000 - ₹12,000</option>
                      <option>₹12,000+</option>
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Gender Preference
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:border-cyan-500">
                    <Users className="text-cyan-600 mr-3" size={20} />
                    <select className="w-full outline-none bg-transparent text-gray-700">
                      <option>Select Type</option>
                      <option>Boys PG</option>
                      <option>Girls PG</option>
                      <option>Co-Living</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold transition shadow-lg">
                  <Search size={20} />
                  <Link to="/visitpg" className="text-white">
                    Search PGs
                  </Link>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Popular Cities
          </h2>
          <p className="text-gray-600 mt-3">
            Explore the most searched PG destinations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {["Bhubaneswar", "Bangalore", "Hyderabad", "Pune", "Delhi"].map(
            (city, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-md p-6 text-center cursor-pointer hover:shadow-xl transition"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-cyan-100 flex items-center justify-center mb-4">
                  <MapPin className="text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{city}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  120+ Properties
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Hero;