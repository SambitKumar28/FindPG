import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const VisitePg = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setError("");
        const { data } = await API.get("/pgs");
        setPgs(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load PG listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available PGs</h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse approved PG listings that are ready for booking.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            Loading PG listings...
          </div>
        ) : pgs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">
            No approved PG listings are available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pgs.map((pg) => (
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

                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {pg.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {[pg.roomType, pg.genderPreference, ...(pg.amenities || []).slice(0, 3)]
                      .filter(Boolean)
                      .map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-gray-100 px-2.5 py-1 text-xs capitalize text-gray-600"
                        >
                          {item}
                        </span>
                      ))}
                  </div>

                  <Link
                    to={`/pgs/${pg._id}`}
                    className="block w-full rounded-lg bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-cyan-700"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default VisitePg;
