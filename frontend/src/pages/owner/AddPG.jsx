import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";

const AddPG = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "",
    locality: "",
    address: "",
    rent: "",
    securityDeposit: "",
    genderPreference: "unisex",
    roomType: "single",
    amenities: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      // append fields
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      // convert amenities string → array
      formData.set(
        "amenities",
        form.amenities.split(",").map((a) => a.trim())
      );

      // append images
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await API.post("/pgs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("PG Listed Successfully 🎉");

      navigate("/owner/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add PG");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 py-10 px-4">
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Add Your PG Listing
        </h1>
        <p className="text-gray-500 mt-2">
          Fill in the details to list your property on FindPG
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Title
            </label>
            <input
              name="title"
              onChange={handleChange}
              placeholder="e.g. Luxury PG near IT Park"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Rent (₹)
            </label>
            <input
              type="number"
              name="rent"
              onChange={handleChange}
              placeholder="e.g. 8000"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            name="description"
            onChange={handleChange}
            rows={4}
            placeholder="Describe your PG..."
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Location */}
        <div className="grid md:grid-cols-3 gap-6">
          <input
            name="city"
            onChange={handleChange}
            placeholder="City"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
          <input
            name="locality"
            onChange={handleChange}
            placeholder="Locality"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
          <input
            name="address"
            onChange={handleChange}
            placeholder="Full Address"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        {/* Pricing */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="number"
            name="securityDeposit"
            onChange={handleChange}
            placeholder="Security Deposit"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
          />

          <input
            name="amenities"
            onChange={handleChange}
            placeholder="Amenities (WiFi, AC, Food...)"
            className="border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Gender Preference
            </label>
            <select
              name="genderPreference"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="unisex">Unisex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Room Type
            </label>
            <select
              name="roomType"
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-3">
            Upload Images
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-cyan-500 transition">
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="fileUpload"
            />

            <label htmlFor="fileUpload" className="cursor-pointer">
              <p className="text-gray-500">
                Click to upload images or drag & drop
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG up to 5 images
              </p>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-linear-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            {loading ? "Publishing..." : "Publish PG"}
          </button>
        </div>
      </form>
    </div>
  </div>
)};

export default AddPG;