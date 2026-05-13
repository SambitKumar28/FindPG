import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "user", label: "Tenant — I'm looking for a PG" },
  { value: "owner", label: "Owner — I want to list my PG" },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      // FIX #20 — single API call; register endpoint now returns the access
      // token directly, no second /auth/login call needed
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      });

      navigate(form.role === "owner" ? "/owner/dashboard" : "/", {
        replace: true,
      });
    } catch (err) {
      // Surface server-side validation errors (Zod field errors)
      const serverErrors = err.response?.data?.errors;
      if (serverErrors?.length > 0) {
        const mapped = {};
        serverErrors.forEach((e) => {
          if (e.field) mapped[e.field] = e.message;
        });
        setFieldErrors(mapped);
      } else {
        setError(
          err.response?.data?.message || "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Create your account
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Find your perfect paying guest accommodation
        </p>

        {/* FIX #21 — Actual error display, no commented-out blocks */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Name */}
          <Field label="Full name" error={fieldErrors.name}>
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ravi Kumar"
              className={inputClass(fieldErrors.name)}
            />
          </Field>

          {/* Email — FIX #11: type="email" */}
          <Field label="Email address" error={fieldErrors.email}>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ravi@example.com"
              className={inputClass(fieldErrors.email)}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone number (optional)" error={fieldErrors.phone}>
            <input
              id="phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={inputClass(fieldErrors.phone)}
            />
          </Field>

          {/* Role */}
          <Field label="I am a…" error={fieldErrors.role}>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputClass(fieldErrors.role)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          {/* Password */}
          <Field label="Password" error={fieldErrors.password}>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={inputClass(fieldErrors.password)}
            />
          </Field>

          {/* Confirm password */}
          <Field label="Confirm password" error={fieldErrors.confirmPassword}>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={inputClass(fieldErrors.confirmPassword)}
            />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        {/* FIX #23 — Social login buttons removed until OAuth is implemented */}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

export default Register;
