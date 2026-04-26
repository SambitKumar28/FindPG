import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pgRes = await API.get("/pgs");
      //   const bookingRes = await API.get("/bookings/owner");

      setPgs(pgRes.data.pgs);
      //   setBookings(bookingRes.data.bookings);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Total PGs</h3>
          <p className="text-2xl font-bold">{pgs.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Bookings</h3>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Pending</h3>
          <p className="text-2xl font-bold">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Add PG Button */}
      <div className="mb-6">
        <button className="bg-cyan-600 text-white px-6 py-3 rounded-xl">
          <Link
            to="/owner/add-pg"
            className="bg-cyan-600 text-white px-4 py-2 rounded-xl"
          >
            + Add New PG
          </Link>
        </button>
      </div>

      {/* PG LIST */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">My PG Listings</h2>

        {pgs.length === 0 ? (
          <p>No PGs yet</p>
        ) : (
          <div className="space-y-4">
            {pgs.map((pg) => (
              <div
                key={pg._id}
                className="flex justify-between items-center border p-4 rounded-xl"
              >
                <div>
                  <h3 className="font-semibold">{pg.title}</h3>
                  <p className="text-sm text-gray-500">
                    {pg.city} • ₹{pg.rent}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button className="px-3 py-1 bg-yellow-400 rounded">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKINGS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

        {bookings.length === 0 ? (
          <p>No bookings</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b._id} className="border p-4 rounded-xl">
                <p className="font-semibold">{b.pg?.title}</p>
                <p className="text-sm text-gray-500">
                  {b.user?.name} • {b.status}
                </p>

                {b.status === "pending" && (
                  <div className="flex gap-3 mt-3">
                    <button className="px-3 py-1 bg-green-500 text-white rounded">
                      Approve
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
