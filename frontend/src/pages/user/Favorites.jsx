import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, RefreshCw, Trash2 } from "lucide-react";
import API from "../../api/axios";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/favorites", { params: { limit: 50 } });
      setFavorites(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load saved PGs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (pgId) => {
    try {
      setActionId(pgId);
      setError("");
      setMessage("");
      const { data } = await API.delete(`/favorites/${pgId}`);
      setFavorites((current) => current.filter((pg) => pg._id !== pgId));
      setMessage(data.message || "Removed from favourites.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to remove saved PG.");
    } finally {
      setActionId("");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved PGs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Keep track of listings you want to revisit.
            </p>
          </div>
          <button
            type="button"
            onClick={loadFavorites}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
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
            Loading saved PGs...
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            No saved PGs yet. Browse listings and tap the heart on a PG.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((pg) => (
              <article
                key={pg._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="h-48 bg-gray-100">
                  {pg.images?.[0]?.url ? (
                    <img
                      src={pg.images[0].url}
                      alt={pg.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {pg.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {pg.locality}, {pg.city}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-cyan-700">
                      Rs. {pg.rent}
                    </p>
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <Heart size={16} className="fill-red-500 text-red-500" />
                    Saved listing
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/pgs/${pg._id}`}
                      className="flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-cyan-700"
                    >
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFavorite(pg._id)}
                      disabled={actionId === pg._id}
                      title="Remove from saved PGs"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 size={17} />
                    </button>
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

export default Favorites;
