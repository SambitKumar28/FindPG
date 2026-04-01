import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  Users,
  MapPin,
  Star,
  HeartHandshake,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { number: "10K+", label: "Verified PGs" },
    { number: "50+", label: "Cities Covered" },
    { number: "25K+", label: "Happy Users" },
    { number: "4.8★", label: "Average Rating" },
  ];

  const values = [
    {
      icon: <ShieldCheck size={28} />,
      title: "Verified Listings",
      description:
        "Every PG listing goes through a verification process to ensure trust, safety, and accurate information.",
    },
    {
      icon: <Users size={28} />,
      title: "User First",
      description:
        "We focus on making PG searching easier, faster, and stress-free for students and professionals.",
    },
    {
      icon: <MapPin size={28} />,
      title: "Wide Coverage",
      description:
        "Explore PGs, hostels, and co-living spaces across major cities in India.",
    },
    {
      icon: <HeartHandshake size={28} />,
      title: "Trusted Experience",
      description:
        "We connect users with genuine property owners for a transparent and smooth booking process.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6">
              About FindPG
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Helping You Find the <br />
              Perfect PG with Ease
            </h1>

            <p className="mt-6 text-lg text-cyan-100 max-w-3xl mx-auto leading-relaxed">
              FindPG is built to simplify the way students and working
              professionals discover safe, affordable, and verified PG
              accommodations across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
                alt="About FindPG"
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 w-56">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Building2 className="text-cyan-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">10K+</h3>
                  <p className="text-sm text-gray-500">Verified Listings</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="text-cyan-600 font-semibold uppercase tracking-wider">
              Our Story
            </span>

            <h2 className="text-4xl font-bold text-gray-900 mt-3 leading-tight">
              Making PG Search Smarter, Faster, and Safer
            </h2>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Searching for a PG in a new city can be difficult, confusing, and
              time-consuming. We created FindPG to solve this problem by giving
              users one trusted platform where they can discover verified PGs,
              compare prices, explore amenities, and connect with owners.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Our goal is to make finding accommodation as easy as booking a
              hotel — with better transparency, faster decisions, and a more
              reliable experience.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg">
                <Link to="/visitpg" className="text-white">
                  Explore PGs
                </Link>
              </button>

              <button className="border border-cyan-600 text-cyan-600 px-6 py-3 rounded-xl font-semibold hover:bg-cyan-50 transition">
                <Link to="/contact" className="text-cyan-600">
                  Contact Us
                </Link>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="bg-gray-50 rounded-3xl shadow-sm hover:shadow-xl transition p-8 text-center"
              >
                <h3 className="text-4xl font-extrabold text-cyan-600">
                  {item.number}
                </h3>
                <p className="mt-3 text-gray-600 font-medium">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-cyan-600 font-semibold uppercase tracking-wider">
              Why Choose Us
            </span>

            <h2 className="text-4xl font-bold text-gray-900 mt-3">
              Our Core Values
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We are focused on delivering the best PG search experience with
              trust, transparency, and convenience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-8 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-6">
                  {value.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {value.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-r from-cyan-600 to-blue-700 rounded-3xl p-10 lg:p-16 text-center text-white shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Star size={36} />
            </div>

            <h2 className="text-4xl font-bold">
              Ready to Find Your Perfect PG?
            </h2>

            <p className="mt-4 text-cyan-100 max-w-2xl mx-auto">
              Explore thousands of verified PG listings and discover your ideal
              accommodation today.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button className="bg-white text-cyan-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
                <Link to="/visitpg" className="text-cyan-700">
                  Browse PGs
                </Link>
              </button>

              <button className="border border-white/30 bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition">
                <Link to="/contact" className="text-white">
                  Contact Team
                </Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;