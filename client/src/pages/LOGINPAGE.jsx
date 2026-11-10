import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const LOGIN_URL = `${API_BASE_URL}/adminapi/adminlogin`;

function LOGINPAGE() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        { login, password },
        { withCredentials: true, timeout: 15000 }
      );

      const data = response.data?.data ?? response.data;

      // Supports common token response names. If your backend uses an
      // HttpOnly cookie, the browser stores it through withCredentials.
      const token = data?.token || data?.accessToken || data?.jwt;
      if (token) {
        localStorage.setItem("mediqueue_token", token);
      }

      toast.success(data?.message || "Login successful");
      navigate("/STAFFDASHBOARD");
    } catch (error) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        (status === 401 ? "Invalid email/phone or password." :
          error.code === "ECONNABORTED" ? "The server took too long to respond." :
          "Unable to connect to the server. Check whether your backend is running.");

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
          <Link to="/" className="flex items-center gap-3 mb-6">
            <div className="bg-primary text-white p-3 rounded-xl text-2xl">✚</div>
            <div>
              <h1 className="text-xl font-bold text-primary">MediQueue</h1>
              <p className="text-xs text-gray-500">Hospital Management System</p>
            </div>
          </Link>

          <div className="mb-5">
            <h2 className="text-3xl font-bold">Welcome back!</h2>
            <p className="text-gray-500 mt-2">Sign in to manage the hospital queue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="login">
                <span className="label-text font-semibold">username or phone number</span>
              </label>
              <input
                id="login"
                type="text"
                autoComplete="username"
                placeholder="Enter email or phone number"
                className="input input-bordered w-full"
                value={login}
                onChange={(event) => setLogin(event.target.value)}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-16"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
            </button>
          </form>

          <div className="divider">OR</div>
          <p className="text-center text-sm text-gray-500">
            Need a staff account?{" "}
            <Link to="/register" className="link link-primary font-semibold">
              Register
            </Link>
          </p>
          <p className="text-center text-xs text-gray-500 mt-3">
            Access is intended for authorized hospital staff.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LOGINPAGE;
