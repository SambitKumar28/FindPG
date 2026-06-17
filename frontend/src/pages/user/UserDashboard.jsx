import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, RefreshCw } from "lucide-react";
import API from "../../api/axios";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const statusClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-700",
};

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/bookings/my");
      setBookings(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load booking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const counts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings]
  );

  const visibleBookings = useMemo(() => {
    if (activeFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === activeFilter);
  }, [activeFilter, bookings]);

  const cancelBooking = async (bookingId) => {
    try {
      setActionId(bookingId);
      setError("");
      setMessage("");

      const { data } = await API.put(`/bookings/${bookingId}/cancel`);
      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: data.booking.status }
            : booking
        )
      );
      setMessage(data.message || "Booking cancelled successfully.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setActionId("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your PG booking requests and their latest status.
            </p>
          </div>

          <button
            type="button"
            onClick={loadBookings}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={[
                "rounded-lg border px-4 py-3 text-left transition",
                activeFilter === filter.value
                  ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-cyan-300",
              ].join(" ")}
            >
              <span className="block text-sm font-semibold">{filter.label}</span>
              <span className="text-2xl font-bold">{counts[filter.value]}</span>
            </button>
          ))}
        </div>

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

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            Loading booking history...
          </div>
        ) : visibleBookings.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            No bookings found for this status.
          </div>
        ) : (
          <div className="space-y-4">
            {visibleBookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="grid gap-4 p-4 md:grid-cols-[160px_1fr_auto] md:items-center">
                  <div className="h-32 overflow-hidden rounded-lg bg-gray-100 md:h-24">
                    {booking.pg?.images?.[0]?.url ? (
                      <img
                        src={booking.pg.images[0].url}
                        alt={booking.pg.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {booking.pg?.title || "PG listing"}
                      </h2>
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                          statusClass[booking.status] || "bg-gray-100 text-gray-600",
                        ].join(" ")}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500">
                      {booking.pg?.locality}, {booking.pg?.city}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      Rs. {booking.pg?.rent}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays size={16} />
                      Move-in: {new Date(booking.moveInDate).toLocaleDateString()}
                    </p>
                    {booking.message && (
                      <p className="mt-2 text-sm text-gray-600">
                        Message: {booking.message}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 md:flex-col md:items-end">
                    {booking.pg?._id && (
                      <Link
                        to={`/pgs/${booking.pg._id}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        View PG
                      </Link>
                    )}

                    {booking.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(booking._id)}
                        disabled={actionId === booking._id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default UserDashboard;
