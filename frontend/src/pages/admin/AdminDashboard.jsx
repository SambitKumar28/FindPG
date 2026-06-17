import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Home,
  RefreshCw,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
  X,
} from "lucide-react";
import API from "../../api/axios";

const TABS = [
  { value: "stats", label: "Stats" },
  { value: "pgs", label: "PGs" },
  { value: "users", label: "Users" },
  { value: "bookings", label: "Bookings" },
];

const pgFilters = ["all", "pending", "approved", "rejected"];
const bookingFilters = ["all", "pending", "approved", "rejected", "cancelled"];

const statusClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-700",
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [pgFilter, setPgFilter] = useState("pending");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [stats, setStats] = useState(null);
  const [pgs, setPgs] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");
      const [statsRes, pgsRes, usersRes, bookingsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/pgs", { params: { limit: 100 } }),
        API.get("/admin/users", { params: { limit: 100 } }),
        API.get("/admin/bookings", { params: { limit: 100 } }),
      ]);

      setStats(statsRes.data.stats || null);
      setPgs((pgsRes.data.data || []).filter((pg) => !pg.isDeleted));
      setUsers((usersRes.data.data || []).filter((user) => !user.isDeleted));
      setBookings(bookingsRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const pgCounts = useMemo(
    () => ({
      all: pgs.length,
      pending: pgs.filter((pg) => pg.approvalStatus === "pending").length,
      approved: pgs.filter((pg) => pg.approvalStatus === "approved").length,
      rejected: pgs.filter((pg) => pg.approvalStatus === "rejected").length,
    }),
    [pgs]
  );

  const bookingCounts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      approved: bookings.filter((b) => b.status === "approved").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    }),
    [bookings]
  );

  const visiblePGs = useMemo(() => {
    if (pgFilter === "all") return pgs;
    return pgs.filter((pg) => pg.approvalStatus === pgFilter);
  }, [pgFilter, pgs]);

  const visibleBookings = useMemo(() => {
    if (bookingFilter === "all") return bookings;
    return bookings.filter((booking) => booking.status === bookingFilter);
  }, [bookingFilter, bookings]);

  const updatePGStatus = async (pgId, action) => {
    try {
      setActionId(pgId);
      setError("");
      setMessage("");
      const { data } = await API.put(`/admin/pgs/${pgId}/${action}`);
      setPgs((current) =>
        current.map((pg) => (pg._id === pgId ? data.pg : pg))
      );
      setMessage(data.message || `PG ${action}d successfully.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to ${action} PG.`);
    } finally {
      setActionId("");
    }
  };

  const deletePG = async (pgId) => {
    if (!window.confirm("Delete this PG from the platform?")) return;

    try {
      setActionId(pgId);
      setError("");
      setMessage("");
      const { data } = await API.delete(`/admin/pgs/${pgId}`);
      setPgs((current) => current.filter((pg) => pg._id !== pgId));
      setMessage(data.message || "PG removed from platform.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to delete PG.");
    } finally {
      setActionId("");
    }
  };

  const updateUserBlock = async (userId, action) => {
    try {
      setActionId(userId);
      setError("");
      setMessage("");
      const { data } = await API.put(`/admin/users/${userId}/${action}`);
      setUsers((current) =>
        current.map((user) =>
          user._id === userId ? { ...user, isBlocked: action === "block" } : user
        )
      );
      setMessage(data.message || `User ${action}ed.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to ${action} user.`);
    } finally {
      setActionId("");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Deactivate this user account?")) return;

    try {
      setActionId(userId);
      setError("");
      setMessage("");
      const { data } = await API.delete(`/admin/users/${userId}`);
      setUsers((current) => current.filter((user) => user._id !== userId));
      setMessage(data.message || "User deactivated.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to deactivate user.");
    } finally {
      setActionId("");
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
      setMessage(data.message || `Booking ${action}d.`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to ${action} booking.`);
    } finally {
      setActionId("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage PG approvals, users, bookings, and platform health.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAdminData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={[
                "rounded-lg px-4 py-2 text-sm font-semibold",
                activeTab === tab.value
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              {tab.label}
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
            Loading admin dashboard...
          </div>
        ) : (
          <>
            {activeTab === "stats" && <StatsPanel stats={stats} />}

            {activeTab === "pgs" && (
              <section>
                <FilterBar
                  values={pgFilters}
                  active={pgFilter}
                  counts={pgCounts}
                  onChange={setPgFilter}
                />
                <div className="space-y-4">
                  {visiblePGs.map((pg) => (
                    <article
                      key={pg._id}
                      className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[1.4fr_1fr_0.8fr_1fr] md:items-center"
                    >
                      <div className="flex gap-3">
                        <Thumb image={pg.images?.[0]?.url} title={pg.title} />
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {pg.title}
                          </h2>
                          <p className="line-clamp-2 text-sm text-gray-500">
                            {pg.description}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Owner: {pg.owner?.name || "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>{pg.locality}</p>
                        <p>{pg.city}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Rs. {pg.rent}
                        </p>
                        <StatusBadge status={pg.approvalStatus} />
                      </div>
                      <div className="flex gap-2 md:justify-end">
                        <IconButton
                          title="Approve PG"
                          disabled={
                            actionId === pg._id ||
                            pg.approvalStatus === "approved"
                          }
                          onClick={() => updatePGStatus(pg._id, "approve")}
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          <Check size={16} />
                        </IconButton>
                        <IconButton
                          title="Reject PG"
                          disabled={
                            actionId === pg._id ||
                            pg.approvalStatus === "rejected"
                          }
                          onClick={() => updatePGStatus(pg._id, "reject")}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          <X size={16} />
                        </IconButton>
                        <IconButton
                          title="Delete PG"
                          disabled={actionId === pg._id}
                          onClick={() => deletePG(pg._id)}
                          className="border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </div>
                    </article>
                  ))}
                  {visiblePGs.length === 0 && <Empty text="No PGs found." />}
                </div>
              </section>
            )}

            {activeTab === "users" && (
              <section className="space-y-4">
                {users.map((user) => (
                  <article
                    key={user._id}
                    className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[1.2fr_0.7fr_0.7fr_1fr] md:items-center"
                  >
                    <div>
                      <h2 className="font-semibold text-gray-900">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      {user.phone && (
                        <p className="text-xs text-gray-400">{user.phone}</p>
                      )}
                    </div>
                    <p className="capitalize text-gray-700">{user.role}</p>
                    <span
                      className={[
                        "w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
                        user.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700",
                      ].join(" ")}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                    <div className="flex gap-2 md:justify-end">
                      {user.isBlocked ? (
                        <IconButton
                          title="Unblock user"
                          disabled={actionId === user._id}
                          onClick={() => updateUserBlock(user._id, "unblock")}
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          <ShieldCheck size={16} />
                        </IconButton>
                      ) : (
                        <IconButton
                          title="Block user"
                          disabled={actionId === user._id || user.role === "admin"}
                          onClick={() => updateUserBlock(user._id, "block")}
                          className="bg-amber-500 text-white hover:bg-amber-600"
                        >
                          <ShieldOff size={16} />
                        </IconButton>
                      )}
                      <IconButton
                        title="Deactivate user"
                        disabled={actionId === user._id || user.role === "admin"}
                        onClick={() => deleteUser(user._id)}
                        className="border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </div>
                  </article>
                ))}
                {users.length === 0 && <Empty text="No users found." />}
              </section>
            )}

            {activeTab === "bookings" && (
              <section>
                <FilterBar
                  values={bookingFilters}
                  active={bookingFilter}
                  counts={bookingCounts}
                  onChange={setBookingFilter}
                />
                <div className="space-y-4">
                  {visibleBookings.map((booking) => (
                    <article
                      key={booking._id}
                      className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 md:grid-cols-[1.2fr_1fr_0.8fr_1fr] md:items-center"
                    >
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {booking.pg?.title || "PG listing"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          User: {booking.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Owner: {booking.owner?.name || "Unknown"}
                        </p>
                      </div>
                      <p className="inline-flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays size={16} />
                        {new Date(booking.moveInDate).toLocaleDateString()}
                      </p>
                      <StatusBadge status={booking.status} />
                      <div className="flex gap-2 md:justify-end">
                        {booking.status === "pending" && (
                          <>
                            <IconButton
                              title="Approve booking"
                              disabled={actionId === booking._id}
                              onClick={() =>
                                updateBookingStatus(booking._id, "approve")
                              }
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              <Check size={16} />
                            </IconButton>
                            <IconButton
                              title="Reject booking"
                              disabled={actionId === booking._id}
                              onClick={() =>
                                updateBookingStatus(booking._id, "reject")
                              }
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              <X size={16} />
                            </IconButton>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                  {visibleBookings.length === 0 && (
                    <Empty text="No bookings found." />
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
};

const StatsPanel = ({ stats }) => {
  const cards = [
    {
      label: "Users",
      value: stats?.users?.total || 0,
      sub: `${stats?.users?.owners || 0} owners`,
      icon: Users,
    },
    {
      label: "PGs",
      value: stats?.pgs?.total || 0,
      sub: `${stats?.pgs?.pending || 0} pending`,
      icon: Home,
    },
    {
      label: "Bookings",
      value: stats?.bookings?.total || 0,
      sub: `${stats?.bookings?.approved || 0} approved`,
      icon: CalendarDays,
    },
    {
      label: "Blocked Users",
      value: stats?.users?.blocked || 0,
      sub: `${stats?.users?.admins || 0} admins`,
      icon: ShieldOff,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
              <Icon size={19} />
            </div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-1 text-xs text-gray-400">{card.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

const FilterBar = ({ values, active, counts, onChange }) => (
  <div className="mb-4 flex flex-wrap gap-2">
    {values.map((value) => (
      <button
        key={value}
        type="button"
        onClick={() => onChange(value)}
        className={[
          "rounded-full px-3 py-1 text-xs font-semibold capitalize",
          active === value
            ? "bg-cyan-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-100",
        ].join(" ")}
      >
        {value} ({counts[value] || 0})
      </button>
    ))}
  </div>
);

const Thumb = ({ image, title }) => (
  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
    {image ? (
      <img src={image} alt={title} className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full items-center justify-center text-xs text-gray-400">
        No image
      </div>
    )}
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={[
      "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
      statusClass[status] || "bg-gray-100 text-gray-600",
    ].join(" ")}
  >
    {status}
  </span>
);

const IconButton = ({ children, className, ...props }) => (
  <button
    type="button"
    className={[
      "inline-flex h-9 w-9 items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].join(" ")}
    {...props}
  >
    {children}
  </button>
);

const Empty = ({ text }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
    {text}
  </div>
);

export default AdminDashboard;
