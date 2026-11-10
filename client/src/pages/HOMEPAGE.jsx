import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const QUEUE_STATUS_URL =
  import.meta.env.VITE_QUEUE_STATUS_URL || `${API_BASE_URL}/queueapi/public-status`;

const initialQueue = {
  currentToken: null,
  nextToken: null,
  waitingCount: 0,
  patients: [],
};

function getToken(item) {
  return item?.tokenNumber ?? item?.token ?? item?.tokenNo ?? "—";
}

function getWait(item) {
  const value = item?.estimatedWaitMinutes ?? item?.estimatedWait ?? item?.waitMinutes;
  if (value === 0) return "Your turn";
  if (value === null || value === undefined) return "Not available";
  return typeof value === "number" ? `${value} min` : value;
}

function HOMEPAGE() {
  const [queue, setQueue] = useState(initialQueue);
  const [loading, setLoading] = useState(true);
  const [queueError, setQueueError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchQueue = async () => {
      try {
        const response = await axios.get(QUEUE_STATUS_URL, { timeout: 10000 });
        // Expected response: { currentToken, nextToken, waitingCount, patients: [] }
        const data = response.data?.data ?? response.data;

        if (!active) return;

        setQueue({
          currentToken: data.currentToken ?? data.nowServing ?? null,
          nextToken: data.nextToken ?? null,
          waitingCount: data.waitingCount ?? data.waitingPatients?.length ?? 0,
          patients: Array.isArray(data.patients)
            ? data.patients
            : Array.isArray(data.waitingPatients)
              ? data.waitingPatients
              : [],
        });
        setQueueError("");
      } catch (error) {
        if (!active) return;
        setQueueError(
          error.response?.data?.message ||
          "Live queue is currently unavailable."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQueue();
    const intervalId = window.setInterval(fetchQueue, 10000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const patients = queue.patients;

  return (
    <div className="min-h-screen bg-base-100">
      <Toaster position="top-right" />

      <header className="navbar bg-base-100 shadow-sm px-5 lg:px-16">
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-primary">
            ✚ MediQueue
          </Link>
        </div>
        <nav className="flex gap-2">
          <Link to="/login" className="btn btn-ghost">Staff Login</Link>
          <Link to="/register" className="btn btn-primary">Register Staff</Link>
        </nav>
      </header>

      <section className="bg-blue-50">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="badge badge-primary badge-outline mb-4">
              Smart Hospital Queue System
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-slate-900">
              Skip the waiting. <span className="text-primary">Know your turn.</span>
            </h1>
            <p className="text-slate-600 mt-5 text-lg">
              Follow the hospital queue, see which token is being served,
              and check an estimated waiting time before your turn.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a href="#queue" className="btn btn-primary">Check Live Queue</a>
              <Link to="/login" className="btn btn-outline btn-primary">Staff Login</Link>
            </div>
          </div>
          <div className="rounded-2xl bg-blue-100 min-h-64 flex items-center justify-center p-10">
            <div className="text-center">
              <div className="text-7xl mb-4">✚</div>
              <p className="text-2xl font-bold text-blue-900">MediQueue</p>
              <p className="text-blue-700">A simpler hospital visit</p>
            </div>
          </div>
        </div>
      </section>

      <main>
        <section id="queue" className="max-w-5xl mx-auto px-6 py-14">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Live Queue Status</h2>
            <p className="text-base-content/60 mt-2">
              Queue information refreshes automatically every 10 seconds.
            </p>
          </div>

          {queueError && (
            <div className="alert alert-warning mb-5">
              <span>{queueError} Check that the backend route is running.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="stat bg-base-200 rounded-xl shadow-sm">
              <div className="stat-title">Now Serving</div>
              <div className="stat-value text-primary">
                {loading ? "…" : getToken(queue.currentToken)}
              </div>
              <div className="stat-desc">Currently being consulted</div>
            </div>
            <div className="stat bg-base-200 rounded-xl shadow-sm">
              <div className="stat-title">Next Token</div>
              <div className="stat-value text-success">
                {loading ? "…" : getToken(queue.nextToken)}
              </div>
              <div className="stat-desc">Next in line</div>
            </div>
            <div className="stat bg-base-200 rounded-xl shadow-sm">
              <div className="stat-title">Waiting Patients</div>
              <div className="stat-value">
                {loading ? "…" : queue.waitingCount}
              </div>
              <div className="stat-desc">Patients waiting</div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Estimated Waiting Time</h2>
            <p className="text-base-content/60 mt-2">
              Estimated time for each waiting token. Times may change.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-base-300">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Queue Position</th>
                  <th>Estimated Wait</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? patients.map((patient, index) => (
                  <tr key={patient._id || patient.id || getToken(patient) || index}>
                    <td className="font-bold text-primary">{getToken(patient)}</td>
                    <td>{patient.queuePosition ?? patient.position ?? index + 1}</td>
                    <td className="font-semibold">{getWait(patient)}</td>
                    <td>
                      <span className={`badge ${
                        patient.status === "serving" ? "badge-success" : "badge-info"
                      }`}>
                        {patient.status || "Waiting"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-base-content/60">
                      {loading ? "Loading queue…" : "No waiting tokens are currently available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-base-content/50 text-center mt-4">
            Only token numbers are displayed publicly to protect patient privacy.
          </p>
        </section>

        <section className="bg-base-200 py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center">How MediQueue Works</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                ["🎫", "Get Your Token", "Register at the reception and receive a queue token."],
                ["📱", "Track Your Queue", "Check the current token and estimated waiting time."],
                ["🩺", "Visit the Doctor", "Proceed when your token is called."]
              ].map(([icon, title, description]) => (
                <div className="card bg-base-100 shadow-sm" key={title}>
                  <div className="card-body items-center text-center">
                    <div className="text-4xl">{icon}</div>
                    <h3 className="card-title">{title}</h3>
                    <p className="text-base-content/60">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer footer-center bg-base-300 text-base-content p-6">
        <aside>
          <p className="font-bold text-lg text-primary">✚ MediQueue</p>
          <p>Making hospital visits simpler and smarter.</p>
          <p className="text-sm">© 2026 MediQueue</p>
        </aside>
      </footer>
    </div>
  );
}

export default HOMEPAGE;
