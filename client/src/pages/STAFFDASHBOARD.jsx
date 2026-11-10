
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5001";

const GENERATE_TOKEN_URL =
    `${API_BASE_URL}/queueapi/generate-token`;

const QUEUE_STATUS_URL =
    `${API_BASE_URL}/queueapi/public-status`;

const ADVANCE_QUEUE_URL =
    `${API_BASE_URL}/queueapi/advance-queue`;

const initialQueue = {
    currentToken: null,
    nextToken: null,
    waitingCount: 0,
    patients: []
};

function getToken(item) {
    if (item === null || item === undefined) {
        return "—";
    }

    if (typeof item === "object") {
        return item.tokenNumber ?? item.token ?? "—";
    }

    return item;
}

function STAFFDASHBOARD() {

    // Patient form state
    const [formData, setFormData] = useState({
        name: "",
        mobile: ""
    });

    // Generated token state
    const [generatedToken, setGeneratedToken] = useState(null);

    // Queue state
    const [queue, setQueue] = useState(initialQueue);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [advancing, setAdvancing] = useState(false);

    const [queueError, setQueueError] = useState("");

    // Fetch queue information from backend
    const fetchQueue = async () => {
        try {
            const response = await axios.get(
                QUEUE_STATUS_URL,
                {
                    withCredentials: true,
                    timeout: 10000
                }
            );

            const data = response.data?.data ?? response.data;

            setQueue({
                currentToken: data.currentToken ?? null,
                nextToken: data.nextToken ?? null,
                waitingCount: data.waitingCount ?? 0,
                patients: Array.isArray(data.patients)
                    ? data.patients
                    : []
            });

            setQueueError("");

        } catch (error) {
            console.error("Queue fetching error:", error);

            setQueueError(
                error.response?.data?.message ||
                "Unable to load queue information."
            );

        } finally {
            setLoading(false);
        }
    };

    // Fetch queue when page loads and every 10 seconds
    useEffect(() => {
        fetchQueue();

        const interval = setInterval(() => {
            fetchQueue();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Generate patient token
    const handleGenerateToken = async (e) => {
        e.preventDefault();

        setGenerating(true);
        setGeneratedToken(null);

        try {
            const response = await axios.post(
                GENERATE_TOKEN_URL,
                {
                    name: formData.name.trim(),
                    mobile: formData.mobile.trim()
                },
                {
                    withCredentials: true
                }
            );

            const token = response.data.patient.token;

            setGeneratedToken(token);

            setFormData({
                name: "",
                mobile: ""
            });

            toast.success("Patient token generated successfully!");

            // Refresh queue immediately
            await fetchQueue();

        } catch (error) {
            console.error("Token generation error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to generate token"
            );

        } finally {
            setGenerating(false);
        }
    };

    // Complete current patient and call next patient
    const handleAdvanceQueue = async () => {

        setAdvancing(true);

        try {
            const response = await axios.put(
                ADVANCE_QUEUE_URL,
                {},
                {
                    withCredentials: true
                }
            );

            toast.success(
                response.data.message || "Queue updated successfully!"
            );

            // Refresh queue immediately
            await fetchQueue();

        } catch (error) {
            console.error("Advance queue error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to advance queue"
            );

        } finally {
            setAdvancing(false);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("mediqueue_token");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-base-200">

            <Toaster position="top-right" />

            {/* Navbar */}
            <div className="navbar bg-base-100 shadow-md px-5 lg:px-12">

                <div className="flex-1">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-primary"
                    >
                        ✚ MediQueue
                    </Link>
                    <span className="ml-3 badge badge-primary">
                        Staff Dashboard
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        className="btn btn-outline btn-error btn-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

            </div>

            <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">

                {/* Dashboard Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Staff Dashboard
                    </h1>

                    <p className="text-base-content/60 mt-2">
                        Generate patient tokens and manage the hospital queue.
                    </p>
                </div>

                {/* Generate Token and Current Serving */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Generate Token Form */}
                    <div className="card bg-base-100 shadow-lg lg:col-span-1">

                        <div className="card-body">

                            <h2 className="card-title text-xl">
                                Generate Patient Token
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Enter patient details to generate a token.
                            </p>

                            <form
                                onSubmit={handleGenerateToken}
                                className="space-y-4 mt-3"
                            >

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Patient Full Name
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter patient name"
                                        className="input input-bordered w-full"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Mobile Number
                                        </span>
                                    </label>

                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="10-digit mobile number"
                                        className="input input-bordered w-full"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full"
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Token"
                                    )}
                                </button>

                            </form>

                            {/* Generated Token */}
                            {generatedToken !== null && (
                                <div className="alert alert-success mt-5 flex flex-col items-center">

                                    <p className="font-semibold">
                                        Token Generated Successfully!
                                    </p>

                                    <h2 className="text-5xl font-bold">
                                        {String(generatedToken).padStart(3, "0")}
                                    </h2>

                                    <p className="text-sm">
                                        Give this token number to the patient.
                                    </p>

                                </div>
                            )}

                        </div>
                    </div>

                    {/* Current Serving */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div className="stat bg-base-100 shadow-lg rounded-xl p-6">

                            <div className="stat-title">
                                Currently Serving
                            </div>

                            <div className="stat-value text-primary">
                                {loading
                                    ? "..."
                                    : getToken(queue.currentToken)}
                            </div>

                            <div className="stat-desc">
                                Patient currently with the doctor
                            </div>

                        </div>

                        <div className="stat bg-base-100 shadow-lg rounded-xl p-6">

                            <div className="stat-title">
                                Next Token
                            </div>

                            <div className="stat-value text-success">
                                {loading
                                    ? "..."
                                    : getToken(queue.nextToken)}
                            </div>

                            <div className="stat-desc">
                                Next patient in line
                            </div>

                        </div>

                        <div className="stat bg-base-100 shadow-lg rounded-xl p-6">

                            <div className="stat-title">
                                Waiting Patients
                            </div>

                            <div className="stat-value">
                                {loading ? "..." : queue.waitingCount}
                            </div>

                            <div className="stat-desc">
                                Total patients waiting
                            </div>

                        </div>

                        <div className="stat bg-base-100 shadow-lg rounded-xl p-6">

                            <div className="stat-title">
                                Queue Status
                            </div>

                            <div className="stat-value text-success text-2xl">
                                {queueError ? "Offline" : "Live"}
                            </div>

                            <div className="stat-desc">
                                Refreshes every 10 seconds
                            </div>

                        </div>

                    </div>

                </div>

                {/* Queue Management */}
                <div className="card bg-base-100 shadow-lg mt-8">

                    <div className="card-body">

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                            <div>
                                <h2 className="card-title text-2xl">
                                    Queue Management
                                </h2>

                                <p className="text-sm text-base-content/60">
                                    Complete the current consultation and call the next patient.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">

                                <button
                                    className="btn btn-outline btn-primary"
                                    onClick={fetchQueue}
                                    disabled={loading}
                                >
                                    Refresh Queue
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={handleAdvanceQueue}
                                    disabled={advancing || queue.waitingCount === 0}
                                >
                                    {advancing ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Complete & Call Next"
                                    )}
                                </button>

                            </div>

                        </div>

                        {queueError && (
                            <div className="alert alert-error mt-4">
                                {queueError}
                            </div>
                        )}

                        {/* Patient Queue Table */}
                        <div className="overflow-x-auto mt-5">

                            <table className="table table-zebra">

                                <thead>
                                    <tr>
                                        <th>Token Number</th>
                                        <th>Queue Position</th>
                                        <th>Estimated Waiting Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {queue.patients.length > 0 ? (

                                        queue.patients.map((patient, index) => (

                                            <tr
                                                key={
                                                    patient._id ||
                                                    patient.tokenNumber ||
                                                    index
                                                }
                                            >

                                                <td className="font-bold text-primary">
                                                    {getToken(patient)}
                                                </td>

                                                <td>
                                                    {patient.queuePosition ?? index + 1}
                                                </td>

                                                <td>
                                                    {patient.estimatedWaitMinutes === 0
                                                        ? "Your turn"
                                                        : `${patient.estimatedWaitMinutes ?? "—"} min`}
                                                </td>

                                                <td>
                                                    <span className="badge badge-info">
                                                        {patient.status || "waiting"}
                                                    </span>
                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-8"
                                            >
                                                {loading
                                                    ? "Loading queue..."
                                                    : "No patients are waiting."}
                                            </td>
                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                        <p className="text-xs text-base-content/50 mt-3">
                            Patient queue information is refreshed automatically every 10 seconds.
                        </p>

                    </div>

                </div>

            </main>

            {/* Footer */}
            <footer className="footer footer-center bg-base-300 text-base-content p-5 mt-10">

                <aside>
                    <p className="font-semibold">
                        MediQueue - Hospital Queue Management System
                    </p>

                    <p className="text-sm">
                        © 2026 MediQueue. All rights reserved.
                    </p>
                </aside>

            </footer>

        </div>
    );
}

export default STAFFDASHBOARD;
