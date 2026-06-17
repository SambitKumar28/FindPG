import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

const AMENITY_OPTIONS = [
  "WiFi",
  "AC",
  "Parking",
  "Laundry",
  "Meals",
  "Power Backup",
  "CCTV",
  "Security Guard",
  "Gym",
  "TV",
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male only" },
  { value: "female", label: "Female only" },
  { value: "unisex", label: "Unisex" },
];

const ROOM_TYPES = ["single", "double", "triple"];
const MAX_IMAGES = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const EditPG = () => {
  const { id } = useParams();
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
    amenities: [],
    isAvailable: true,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPG = async () => {
      try {
        setSubmitError("");
        const { data } = await API.get(`/pgs/my-pgs/${id}`);
        const pg = data.pg;
        setForm({
          title: pg.title || "",
          description: pg.description || "",
          city: pg.city || "",
          locality: pg.locality || "",
          address: pg.address || "",
          rent: pg.rent || "",
          securityDeposit: pg.securityDeposit || "",
          genderPreference: pg.genderPreference || "unisex",
          roomType: pg.roomType || "single",
          amenities: pg.amenities || [],
          isAvailable: pg.isAvailable ?? true,
        });
        setExistingImages(pg.images || []);
      } catch (err) {
        console.error(err);
        setSubmitError(err.response?.data?.message || "Failed to load PG.");
      } finally {
        setLoading(false);
      }
    };

    loadPG();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }));
  };

  const toggleAmenity = (amenity) => {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((a) => a !== amenity)
        : [...current.amenities, amenity],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > MAX_IMAGES) {
      setErrors((current) => ({
        ...current,
        images: `You can upload at most ${MAX_IMAGES} replacement images.`,
      }));
      e.target.value = "";
      return;
    }

    if (files.some((file) => !ALLOWED_TYPES.includes(file.type))) {
      setErrors((current) => ({
        ...current,
        images: "Only JPEG, PNG, and WebP images are allowed.",
      }));
      e.target.value = "";
      return;
    }

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      setErrors((current) => ({
        ...current,
        images: "Each image must be under 5 MB.",
      }));
      e.target.value = "";
      return;
    }

    setErrors((current) => ({ ...current, images: "" }));
    setImages(files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(file);
          })
      )
    ).then(setPreviews);
    e.target.value = "";
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.description.trim()) nextErrors.description = "Description is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.locality.trim()) nextErrors.locality = "Locality is required";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!form.rent || Number(form.rent) <= 0) {
      nextErrors.rent = "Valid rent amount is required";
    }
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });
    images.forEach((image) => formData.append("images", image));

    setSaving(true);
    try {
      await API.put(`/pgs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/owner/my-pgs", {
        state: { toast: "PG updated successfully." },
      });
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.message || "Failed to update PG. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-gray-500">
        Loading PG...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/owner/my-pgs" className="text-sm font-semibold text-cyan-700">
        Back to dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Edit PG</h1>
      <p className="mb-8 mt-1 text-sm text-gray-500">
        Update listing details. New photo uploads replace existing photos.
      </p>

      {submitError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Section title="Basic information">
          <Field label="Listing title" error={errors.title}>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass(errors.title)}
            />
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className={inputClass(errors.description)}
            />
          </Field>
        </Section>

        <Section title="Location">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="City" error={errors.city}>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass(errors.city)}
              />
            </Field>
            <Field label="Locality" error={errors.locality}>
              <input
                type="text"
                name="locality"
                value={form.locality}
                onChange={handleChange}
                className={inputClass(errors.locality)}
              />
            </Field>
          </div>
          <Field label="Full address" error={errors.address}>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass(errors.address)}
            />
          </Field>
        </Section>

        <Section title="Pricing and room">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Monthly rent" error={errors.rent}>
              <input
                type="number"
                min="0"
                name="rent"
                value={form.rent}
                onChange={handleChange}
                className={inputClass(errors.rent)}
              />
            </Field>
            <Field label="Security deposit" error={errors.securityDeposit}>
              <input
                type="number"
                min="0"
                name="securityDeposit"
                value={form.securityDeposit}
                onChange={handleChange}
                className={inputClass(errors.securityDeposit)}
              />
            </Field>
            <Field label="Gender preference" error={errors.genderPreference}>
              <select
                name="genderPreference"
                value={form.genderPreference}
                onChange={handleChange}
                className={inputClass(errors.genderPreference)}
              >
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Room type" error={errors.roomType}>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className={inputClass(errors.roomType)}
              >
                {ROOM_TYPES.map((roomType) => (
                  <option key={roomType} value={roomType}>
                    {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            Available for booking
          </label>
        </Section>

        <Section title="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  form.amenities.includes(amenity)
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-cyan-400",
                ].join(" ")}
              >
                {amenity}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Photos">
          {existingImages.length > 0 && previews.length === 0 && (
            <div className="mb-4 flex flex-wrap gap-3">
              {existingImages.map((image) => (
                <img
                  key={image.public_id || image.url}
                  src={image.url}
                  alt="Current PG"
                  className="h-24 w-24 rounded-lg border object-cover"
                />
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-3">
              {previews.map((preview) => (
                <img
                  key={preview}
                  src={preview}
                  alt="New PG preview"
                  className="h-24 w-24 rounded-lg border object-cover"
                />
              ))}
            </div>
          )}

          <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 hover:border-cyan-400">
            Choose replacement photos
            <span className="mt-1 text-xs">Leave empty to keep current photos</span>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {errors.images && (
            <p className="mt-1 text-xs text-red-600">{errors.images}</p>
          )}
        </Section>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-cyan-600 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-6">
    <h2 className="mb-4 text-base font-semibold text-gray-800">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const inputClass = (hasError) =>
  [
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent",
    hasError
      ? "border-red-400 focus:ring-red-400"
      : "border-gray-300 focus:ring-cyan-500",
  ].join(" ");

const Field = ({ label, error, children }) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default EditPG;
