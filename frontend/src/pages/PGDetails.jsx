import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [pg, setPg] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasApprovedBooking, setHasApprovedBooking] = useState(false);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const minMoveInDate = useMemo(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        setError("");
        const { data } = await API.get(`/pgs/${id}`);
        setPg(data.pg);
        setActiveImage(data.pg?.images?.[0]?.url || "");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load PG details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPG();
  }, [id]);

  useEffect(() => {
    const loadUserContext = async () => {
      if (user?.role !== "user") {
        setIsFavorite(false);
        setHasApprovedBooking(false);
        return;
      }

      try {
        const [favoritesRes, bookingsRes] = await Promise.all([
          API.get("/favorites", { params: { limit: 50 } }),
          API.get("/bookings/my", { params: { limit: 50 } }),
        ]);

        setIsFavorite(
          (favoritesRes.data.data || []).some((favorite) => favorite._id === id)
        );
        setHasApprovedBooking(
          (bookingsRes.data.data || []).some(
            (booking) =>
              booking.pg?._id === id && booking.status === "approved"
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

    loadUserContext();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (user.role !== "user") {
      setBookingError("Only user accounts can save PGs.");
      return;
    }

    try {
      setFavoriteLoading(true);
      setBookingError("");
      const nextAction = isFavorite ? "remove" : "add";
      const { data } = await API.patch(`/favorites/${id}/toggle`, {
        action: nextAction,
      });
      setIsFavorite(nextAction === "add");
      setBookingSuccess(data.message || "Saved PGs updated.");
    } catch (err) {
      console.error(err);
      setBookingError(err.response?.data?.message || "Failed to update saved PGs.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (user.role !== "user") {
      setBookingError("Only user accounts can book a PG.");
      return;
    }

    if (!moveInDate) {
      setBookingError("Please select a move-in date.");
      return;
    }

    setBookingLoading(true);
    try {
      const { data } = await API.post("/bookings", {
        pgId: id,
        moveInDate,
        message,
      });
      setBookingSuccess(data.message || "Booking request submitted successfully.");
      setMessage("");
      setHasApprovedBooking(false);
    } catch (err) {
      console.error(err);
      setBookingError(
        err.response?.data?.message || "Failed to submit booking request."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
          Loading PG details...
        </div>
      </main>
    );
  }

  if (error || !pg) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/visitpg"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700"
          >
            <ChevronLeft size={16} />
            Back to PGs
          </Link>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error || "PG not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/visitpg"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700"
        >
          <ChevronLeft size={16} />
          Back to PGs
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <section>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="aspect-video bg-gray-100">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={pg.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              {pg.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-4">
                  {pg.images.map((image) => (
                    <button
                      key={image.public_id || image.url}
                      type="button"
                      onClick={() => setActiveImage(image.url)}
                      className={[
                        "h-20 w-28 shrink-0 overflow-hidden rounded-lg border",
                        activeImage === image.url
                          ? "border-cyan-600"
                          : "border-gray-200",
                      ].join(" ")}
                    >
                      <img
                        src={image.url}
                        alt={pg.title}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {pg.title}
                    </h1>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {pg.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-gray-500">
                    <MapPin size={18} />
                    {pg.locality}, {pg.city}
                  </p>
                </div>
                <div className="rounded-lg bg-cyan-50 px-4 py-3 text-right">
                  <p className="text-xs font-semibold uppercase text-cyan-700">
                    Monthly rent
                  </p>
                  <p className="text-2xl font-bold text-cyan-800">
                    Rs. {pg.rent}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className={[
                  "mb-5 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-60",
                  isFavorite
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                <Heart
                  size={17}
                  className={isFavorite ? "fill-red-500 text-red-500" : ""}
                />
                {isFavorite ? "Saved" : "Save PG"}
              </button>

              <p className="leading-7 text-gray-700">{pg.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Info label="Room Type" value={pg.roomType} />
                <Info label="Gender" value={pg.genderPreference} />
                <Info label="Deposit" value={`Rs. ${pg.securityDeposit || 0}`} />
              </div>

              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Amenities
                </h2>
                {pg.amenities?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {pg.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No amenities listed.</p>
                )}
              </div>

              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h2 className="font-semibold text-gray-900">Full address</h2>
                <p className="mt-1 text-sm text-gray-600">{pg.address}</p>
              </div>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                <h2 className="font-semibold text-gray-900">Owner contact</h2>
                {hasApprovedBooking ? (
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>{pg.owner?.name}</p>
                    {pg.owner?.email && (
                      <p className="flex items-center gap-2">
                        <Mail size={15} />
                        {pg.owner.email}
                      </p>
                    )}
                    {pg.owner?.phone && (
                      <p className="flex items-center gap-2">
                        <Phone size={15} />
                        {pg.owner.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Contact details unlock after the owner approves your booking.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Request Booking</h2>
                <p className="text-sm text-gray-500">Owner approval required</p>
              </div>
            </div>

            {bookingSuccess && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {bookingSuccess}
              </div>
            )}

            {bookingError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Move-in date
                </label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    min={minMoveInDate}
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Message to owner
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Share your preferred timing or questions."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
              >
                {bookingLoading ? "Submitting..." : user ? "Book Now" : "Login to Book"}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
};

const Info = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
    <p className="mt-1 capitalize text-gray-900">{value || "Not specified"}</p>
  </div>
);

export default PGDetails;
