import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AMENITY_OPTIONS = [
  "WiFi", "AC", "Parking", "Laundry", "Meals", "Power Backup",
  "CCTV", "Security Guard", "Gym", "TV",
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male only" },
  { value: "female", label: "Female only" },
  { value: "unisex", label: "Unisex" },
];

const ROOM_TYPES = ["single", "double", "triple"];

const MAX_IMAGES = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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
    amenities: [],
  });

  const [images, setImages] = useState([]);       // File objects
  const [previews, setPreviews] = useState([]);    // data-URL strings
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const toggleAmenity = (amenity) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(amenity)
        ? p.amenities.filter((a) => a !== amenity)
        : [...p.amenities, amenity],
    }));
  };

  // FIX #24 — Validate file type and size before accepting images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const combined = [...images, ...files];

    const typeErrors = files.filter((f) => !ALLOWED_TYPES.includes(f.type));
    if (typeErrors.length > 0) {
      setErrors((p) => ({
        ...p,
        images: "Only JPEG, PNG, and WebP images are allowed.",
      }));
      e.target.value = "";
      return;
    }

    const sizeErrors = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (sizeErrors.length > 0) {
      setErrors((p) => ({
        ...p,
        images: "Each image must be under 5 MB.",
      }));
      e.target.value = "";
      return;
    }

    if (combined.length > MAX_IMAGES) {
      setErrors((p) => ({
        ...p,
        images: `You can upload at most ${MAX_IMAGES} images.`,
      }));
      e.target.value = "";
      return;
    }

    setErrors((p) => ({ ...p, images: "" }));
    setImages(combined);

    // Build preview URLs
    Promise.all(
      files.map(
        (file) =>
          new Promise((res) => {
            const reader = new FileReader();
            reader.onload = (ev) => res(ev.target.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((urls) => setPreviews((p) => [...p, ...urls]));

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((p) => p.filter((_, i) => i !== index));
    setPreviews((p) => p.filter((_, i) => i !== index));
  };

  // ─── Validation ────────────────────────────────────────────────────────────

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.locality.trim()) errs.locality = "Locality is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.rent || Number(form.rent) <= 0) errs.rent = "Valid rent amount is required";
    // FIX #24 — Must have at least one image
    if (images.length === 0) errs.images = "Please upload at least one image.";
    return errs;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });
    images.forEach((img) => formData.append("images", img));

    setLoading(true);
    try {
      await API.post("/pgs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/owner/my-pgs", {
        state: { toast: "PG listed successfully — pending admin approval." },
      });
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.length > 0) {
        const mapped = {};
        serverErrors.forEach((e) => {
          if (e.field) mapped[e.field] = e.message;
        });
        setErrors(mapped);
      } else {
        setSubmitError(
          err.response?.data?.message || "Failed to submit listing. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">List your PG</h1>
      <p className="text-sm text-gray-500 mb-8">
        Your listing will be reviewed and published within 24 hours.
      </p>

      {submitError && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Basic info */}
        <Section title="Basic information">
          <Field label="Listing title" error={errors.title}>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Spacious PG near Koramangala Metro"
              className={inputClass(errors.title)}
            />
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the PG — rules, nearby landmarks, included services…"
              className={inputClass(errors.description)}
            />
          </Field>
        </Section>

        {/* Location */}
        <Section title="Location">
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" error={errors.city}>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Bengaluru"
                className={inputClass(errors.city)}
              />
            </Field>

            <Field label="Locality" error={errors.locality}>
              <input
                type="text"
                name="locality"
                value={form.locality}
                onChange={handleChange}
                placeholder="Koramangala"
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
              placeholder="Street / building name"
              className={inputClass(errors.address)}
            />
          </Field>
        </Section>

        {/* Pricing */}
        <Section title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Monthly rent (₹)" error={errors.rent}>
              <input
                type="number"
                name="rent"
                value={form.rent}
                onChange={handleChange}
                placeholder="8000"
                min={0}
                className={inputClass(errors.rent)}
              />
            </Field>

            <Field label="Security deposit (₹)" error={errors.securityDeposit}>
              <input
                type="number"
                name="securityDeposit"
                value={form.securityDeposit}
                onChange={handleChange}
                placeholder="16000"
                min={0}
                className={inputClass(errors.securityDeposit)}
              />
            </Field>
          </div>
        </Section>

        {/* Room details */}
        <Section title="Room details">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Gender preference" error={errors.genderPreference}>
              <select
                name="genderPreference"
                value={form.genderPreference}
                onChange={handleChange}
                className={inputClass(errors.genderPreference)}
              >
                {GENDER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
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
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} sharing
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        {/* Amenities */}
        <Section title="Amenities">
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm border transition-colors",
                  form.amenities.includes(a)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400",
                ].join(" ")}
              >
                {a}
              </button>
            ))}
          </div>
        </Section>

        {/* Images — FIX #24 */}
        <Section title="Photos">
          <p className="text-xs text-gray-500 mb-3">
            Upload 1–{MAX_IMAGES} photos (JPEG / PNG / WebP, max 5 MB each).
            At least one photo is required.
          </p>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <label
              data-error={errors.images ? true : undefined}
              className={[
                "flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                errors.images
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 hover:border-blue-400 bg-gray-50",
              ].join(" ")}
            >
              <span className="text-2xl mb-1">📷</span>
              <span className="text-sm text-gray-500">
                Click to add photos ({images.length}/{MAX_IMAGES})
              </span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}

          {errors.images && (
            <p className="mt-1 text-xs text-red-600">{errors.images}</p>
          )}
        </Section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
        >
          {loading ? "Submitting…" : "Submit listing for review"}
        </button>
      </form>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h2 className="text-base font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const inputClass = (hasError) =>
  [
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent",
    hasError
      ? "border-red-400 focus:ring-red-400"
      : "border-gray-300 focus:ring-blue-500",
  ].join(" ");

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default AddPG;
