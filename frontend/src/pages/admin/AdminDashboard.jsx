import React, { useEffect, useMemo, useState } from "react";
import { Check, RefreshCw, X } from "lucide-react";
import API from "../../api/axios";

const FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

const statusClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const [pgs, setPgs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPGs = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/admin/pgs");
      setPgs((data.data || []).filter((pg) => !pg.isDeleted));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load PG listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPGs();
  }, []);

  const counts = useMemo(
    () => ({
      all: pgs.length,
      pending: pgs.filter((pg) => pg.approvalStatus === "pending").length,
      approved: pgs.filter((pg) => pg.approvalStatus === "approved").length,
      rejected: pgs.filter((pg) => pg.approvalStatus === "rejected").length,
    }),
    [pgs]
  );

  const visiblePGs = useMemo(() => {
    if (activeFilter === "all") return pgs;
    return pgs.filter((pg) => pg.approvalStatus === activeFilter);
  }, [activeFilter, pgs]);

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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Review PG listings before they appear publicly.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPGs}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
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
            Loading PG listings...
          </div>
        ) : visiblePGs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            No PG listings found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.7fr_0.9fr] gap-4 border-b border-gray-200 bg-gray-100 px-5 py-3 text-xs font-semibold uppercase text-gray-500 md:grid">
              <span>Listing</span>
              <span>Location</span>
              <span>Rent</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            <div className="divide-y divide-gray-200">
              {visiblePGs.map((pg) => (
                <article
                  key={pg._id}
                  className="grid gap-4 px-5 py-4 md:grid-cols-[1.4fr_1fr_0.8fr_0.7fr_0.9fr] md:items-center"
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {pg.images?.[0]?.url ? (
                        <img
                          src={pg.images[0].url}
                          alt={pg.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{pg.title}</h2>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                        {pg.description}
                      </p>
                      {pg.owner?.name && (
                        <p className="mt-1 text-xs text-gray-400">
                          Owner: {pg.owner.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>{pg.locality}</p>
                    <p className="text-gray-400">{pg.city}</p>
                  </div>

                  <div className="text-sm font-semibold text-gray-900">
                    Rs. {pg.rent}
                  </div>

                  <div>
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                        statusClass[pg.approvalStatus] || "bg-gray-100 text-gray-600",
                      ].join(" ")}
                    >
                      {pg.approvalStatus}
                    </span>
                  </div>

                  <div className="flex justify-start gap-2 md:justify-end">
                    <button
                      type="button"
                      onClick={() => updatePGStatus(pg._id, "approve")}
                      disabled={actionId === pg._id || pg.approvalStatus === "approved"}
                      title="Approve PG"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePGStatus(pg._id, "reject")}
                      disabled={actionId === pg._id || pg.approvalStatus === "rejected"}
                      title="Reject PG"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;
