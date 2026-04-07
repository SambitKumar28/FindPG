import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
} from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone size={28} />,
      title: "Call Us",
      value: "+91 9876543210",
      description: "Mon - Sat, 9:00 AM - 7:00 PM",
    },
    {
      icon: <Mail size={28} />,
      title: "Email Us",
      value: "support@findpg.com",
      description: "We reply within 24 hours",
    },
    {
      icon: <MapPin size={28} />,
      title: "Visit Office",
      value: "Bhubaneswar, Odisha, India",
      description: "Open for walk-ins and meetings",
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
              Get In Touch
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              We’re Here to Help You <br />
              Find the Perfect Stay
            </h1>

            <p className="mt-6 text-lg text-cyan-100 max-w-3xl mx-auto leading-relaxed">
              Have questions about PG listings, booking, or finding the right
              accommodation? Reach out to our team anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8 lg:p-10"
          >
            <div className="mb-8">
              <span className="text-cyan-600 font-semibold uppercase tracking-wider">
                Contact Form
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mt-3">
                Fill out the form below and our support team will get back to
                you shortly.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows="6"
                  placeholder="Write your message here..."
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-600 to-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-[1.02] transition"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 mb-5">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="text-cyan-600 font-medium mt-2">
                  {item.value}
                </p>

                <p className="text-gray-500 mt-2 text-sm">
                  {item.description}
                </p>
              </div>
            ))}

            {/* Extra Support Box */}
            <div className="bg-linear-to-r from-cyan-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                <Headphones size={28} />
              </div>

              <h3 className="text-2xl font-bold">
                Need Instant Support?
              </h3>

              <p className="mt-3 text-cyan-100 leading-relaxed">
                Our support team is available to help you with PG search,
                booking assistance, and owner contact details.
              </p>

              <button className="mt-6 inline-flex items-center gap-2 bg-white text-cyan-700 px-5 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition">
                <MessageCircle size={18} />
                Chat With Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <span className="text-cyan-600 font-semibold uppercase tracking-wider">
                Our Location
              </span>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                Visit Our Office
              </h2>

              <p className="text-gray-600 mt-3">
                We’re located in Bhubaneswar, Odisha and welcome walk-ins for
                support and consultation.
              </p>
            </div>

            <div className="h-96 w-full">
  <iframe
    title="Bhubaneswar Office Location"
    src="https://maps.google.com/maps?q=Bhubaneswar,Odisha,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
    className="w-full h-full"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 mx-auto mb-6">
              <Clock size={28} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900">
              Office Hours
            </h2>

            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our team is available during the following hours for calls,
              support, and inquiries.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mt-10 text-left">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900">Monday - Friday</h3>
                <p className="text-gray-600 mt-2">9:00 AM - 7:00 PM</p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900">Saturday</h3>
                <p className="text-gray-600 mt-2">10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;