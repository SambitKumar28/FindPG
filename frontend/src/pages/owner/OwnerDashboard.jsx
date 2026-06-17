import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Link, useLocation } from "react-router-dom";

const OwnerDashboard = () => {
  const location = useLocation();
  const [pgs, setPgs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError("");
      const [pgRes, bookingRes] = await Promise.all([
        API.get("/pgs/my-pgs"),
        API.get("/bookings/owner"),
      ]);

      setPgs(pgRes.data.data || []);
      setBookings(bookingRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load owner dashboard.");
    }
  };

  const updateBookingStatus = async (bookingId, action) => {
    try {
      setActionId(bookingId);
      setError("");
      setMessage("");

      const { data } = await API.put(`/bookings/${bookingId}/${action}`);

      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: data.booking.status }
            : booking
        )
      );
      setMessage(data.message || `Booking ${action}d successfully.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to ${action} booking.`);
    } finally {
      setActionId("");
    }
  };

  const pendingCount = pgs.filter((pg) => pg.approvalStatus === "pending").length;
  const approvedCount = pgs.filter((pg) => pg.approvalStatus === "approved").length;
  const pendingBookingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Dashboard</h1>

      {location.state?.toast && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {location.state.toast}
        </div>
      )}

      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Booking Requests</h3>
          <p className="text-2xl font-bold">{pendingBookingCount}</p>
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
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold">{b.pg?.title}</p>
                    <p className="text-sm text-gray-500">
                      {b.user?.name} - {b.user?.phone || b.user?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Move-in: {new Date(b.moveInDate).toLocaleDateString()}
                    </p>
                    {b.message && (
                      <p className="mt-2 text-sm text-gray-700">{b.message}</p>
                    )}
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700">
                    {b.status}
                  </span>
                </div>

                {b.status === "pending" && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => updateBookingStatus(b._id, "approve")}
                      disabled={actionId === b._id}
                      className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateBookingStatus(b._id, "reject")}
                      disabled={actionId === b._id}
                      className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-60"
                    >
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
