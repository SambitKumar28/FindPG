import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, Search, X } from "lucide-react";
import API from "../api/axios";

const initialFilters = (params) => ({
  keyword: params.get("keyword") || "",
  genderPreference: params.get("genderPreference") || "",
  roomType: params.get("roomType") || "",
  minRent: params.get("minRent") || "",
  maxRent: params.get("maxRent") || "",
  sort: params.get("sort") || "",
});

const VisitePg = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => initialFilters(searchParams));
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        setError("");
        const params = Object.fromEntries(
          Object.entries(initialFilters(searchParams)).filter(([, value]) => value)
        );
        const { data } = await API.get("/pgs", { params: { ...params, limit: 50 } });
        setPgs(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load PG listings.");
      } finally {
        setLoading(false);
      }
    };

    setFilters(initialFilters(searchParams));
    fetchPGs();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const nextParams = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value)
    );
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setFilters({
      keyword: "",
      genderPreference: "",
      roomType: "",
      minRent: "",
      maxRent: "",
      sort: "",
    });
    setSearchParams({});
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available PGs</h1>
          <p className="mt-2 text-sm text-gray-500">
            Browse approved PG listings that are ready for booking.
          </p>
        </div>

        <form
          onSubmit={applyFilters}
          className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Filter size={18} />
            Search and Filters
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City, locality, or title
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleChange}
                  placeholder="Search Bangalore, IT park..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <FilterSelect
              label="Gender"
              name="genderPreference"
              value={filters.genderPreference}
              onChange={handleChange}
              options={[
                ["", "Any"],
                ["male", "Male only"],
                ["female", "Female only"],
                ["unisex", "Unisex"],
              ]}
            />

            <FilterSelect
              label="Room"
              name="roomType"
              value={filters.roomType}
              onChange={handleChange}
              options={[
                ["", "Any"],
                ["single", "Single"],
                ["double", "Double"],
                ["triple", "Triple"],
              ]}
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Min rent
              </label>
              <input
                type="number"
                min="0"
                name="minRent"
                value={filters.minRent}
                onChange={handleChange}
                placeholder="3000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Max rent
              </label>
              <input
                type="number"
                min="0"
                name="maxRent"
                value={filters.maxRent}
                onChange={handleChange}
                placeholder="12000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <FilterSelect
              label="Sort"
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              options={[
                ["", "Newest first"],
                ["rentLowToHigh", "Rent low to high"],
                ["rentHighToLow", "Rent high to low"],
              ]}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                <X size={16} />
                Clear
              </button>
              <button
                type="submit"
                className="rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>

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
            No approved PG listings match your filters.
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

const FilterSelect = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500"
    >
      {options.map(([optionValue, optionLabel]) => (
        <option key={optionValue || "all"} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  </div>
);

export default VisitePg;
