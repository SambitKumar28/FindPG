import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { CiFacebook, CiInstagram } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold text-cyan-500 mb-4">
              FindPG
            </h2>
            <p className="text-sm leading-6 text-gray-400">
              Find the perfect PG, hostel, or co-living space in your preferred city with ease.
            </p>


            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="hover:text-cyan-500 transition">
                <CiFacebook  size={20}/>
              </a>
              <a href="#" className="hover:text-cyan-500 transition">
                <CiInstagram size={20} />
              </a>
            </div>
          </div>

           {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Know More
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/visitpg" className="hover:text-cyan-500 transition">
                  Visit PG
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-500 transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-cyan-500 transition cursor-pointer">
                PG Booking
              </li>
              <li className="hover:text-cyan-500 transition cursor-pointer">
                Co-Living Spaces
              </li>
              <li className="hover:text-cyan-500 transition cursor-pointer">
                Hostel Search
              </li>
              <li className="hover:text-cyan-500 transition cursor-pointer">
                Rental Assistance
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-cyan-500 mt-1" />
                <p>Bhubaneswar, Odisha, India</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-cyan-500" />
                <p>+91 9876543210</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-500" />
                <p>support@findpg.com</p>
              </div>
            </div>
          </div>
        </div>

         {/* Bottom Footer */}
        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FindPG. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
