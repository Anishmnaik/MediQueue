import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const REGISTER_URL = `${API_BASE_URL}/adminapi/adminregister`;

function REGISTERPAGE() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      // These property names follow the payload your original code appeared
      // to intend. Confirm they match the register controller on your server.
      const payload = {
        username: formData.name.trim(),
        email: formData.email.trim(),
        ph: formData.phone.trim(),
        pass: formData.password,
      };

      const response = await axios.post(
        REGISTER_URL,
        payload,
        { withCredentials: true, timeout: 15000 }
      );

      toast.success(response.data?.message || "Registration successful.");
      navigate("/login");
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        (status === 409 ? "An account with these details already exists." :
          error.code === "ECONNABORTED" ? "The server took too long to respond." :
          "Registration failed. Check the server and try again.");

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="card bg-base-100 w-full max-w-md shadow-xl">
        <div className="card-body p-8">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <div className="bg-primary text-white p-3 rounded-xl text-2xl">✚</div>
            <div>
              <h1 className="text-xl font-bold text-primary">MediQueue</h1>
              <p className="text-xs text-gray-500">Hospital Management System</p>
            </div>
          </Link>

          <div className="mb-3">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-gray-500 mt-2">Register a hospital staff account.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="label" htmlFor="name">
                <span className="label-text font-semibold">Full name</span>
              </label>
              <input
                id="name" name="name" type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className="input input-bordered w-full"
                value={formData.name} onChange={handleChange} required
              />
            </div>

            <div>
              <label className="label" htmlFor="email">
                <span className="label-text font-semibold">Email address</span>
              </label>
              <input
                id="email" name="email" type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={formData.email} onChange={handleChange} required
              />
            </div>

            <div>
              <label className="label" htmlFor="phone">
                <span className="label-text font-semibold">Phone number</span>
              </label>
              <input
                id="phone" name="phone" type="tel"
                autoComplete="tel"
                placeholder="10-digit phone number"
                className="input input-bordered w-full"
                value={formData.phone} onChange={handleChange}
                pattern="[0-9]{10}" maxLength={10} required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                id="password" name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password (minimum 8 characters)"
                className="input input-bordered w-full"
                value={formData.password} onChange={handleChange}
                minLength={8} required
              />
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">
                <span className="label-text font-semibold">Confirm password</span>
              </label>
              <input
                id="confirmPassword" name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                className="input input-bordered w-full"
                value={formData.confirmPassword} onChange={handleChange}
                minLength={8} required
              />
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer py-1">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
              />
              Show passwords
            </label>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
            </button>
          </form>

          <div className="divider">OR</div>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default REGISTERPAGE;
