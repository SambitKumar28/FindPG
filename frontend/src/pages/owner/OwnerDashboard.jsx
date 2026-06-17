import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link, useLocation } from "react-router-dom";

const OwnerDashboard = () => {
  const location = useLocation();
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError("");
      const pgRes = await API.get("/pgs/my-pgs");
      console.log("PG API response:", pgRes.data);
      // const bookingRes = await API.get("/bookings/owner");

      setPgs(pgRes.data.data || []);
      // setBookings(bookingRes.data.data || bookingRes.data.bookings || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load your PG listings.");
    }
  };

  const pendingCount = pgs.filter((pg) => pg.approvalStatus === "pending").length;
  const approvedCount = pgs.filter((pg) => pg.approvalStatus === "approved").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      {location.state?.toast && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {location.state.toast}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Total PGs</h3>
          <p className="text-2xl font-bold">{pgs.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Approved PGs</h3>
          <p className="text-2xl font-bold">{approvedCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Pending Approval</h3>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
      </div>

      <div className="mb-6">
        <Link
          to="/owner/add-pg"
          className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-xl"
        >
          + Add New PG
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">My PG Listings</h2>

        {pgs.length === 0 ? (
          <p>No PGs yet</p>
        ) : (
          <div className="space-y-4">
            {pgs.map((pg) => (
              <div
                key={pg._id}
                className="flex justify-between items-center border p-4 rounded-xl gap-4"
              >
                <div>
                  <h3 className="font-semibold">{pg.title}</h3>
                  <p className="text-sm text-gray-500">
                    {pg.city} - Rs. {pg.rent}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold capitalize text-amber-700">
                    {pg.approvalStatus}
                  </span>
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
                  {b.user?.name} - {b.status}
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
