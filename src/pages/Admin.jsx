import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSales = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Resend states
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);

  // --------------------------------------------------
  // FETCH SALES
  // --------------------------------------------------
  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/salelist");

      setSalesData(response.data.sales || []);
    } catch (err) {
      console.error("Failed to fetch sales", err);
      setSalesData([]);
    }
  };

  // --------------------------------------------------
  // INITIAL AUTH CHECK
  // --------------------------------------------------
  useEffect(() => {
    const handleInitialCheck = async () => {
      const savedAuth = localStorage.getItem("admin_auth");

      if (savedAuth === "true") {
        // Already verified
        setIsAuthenticated(true);
        await fetchSalesData();
      } else {
        // Not verified - send login/security alert
        try {
          await axios.post("http://localhost:5000/api/send-login-alert");
        } catch (err) {
          console.error("Failed to send login alert", err);
        }
      }
    };

    handleInitialCheck();
  }, []);

  // --------------------------------------------------
  // RESEND COUNTDOWN
  // --------------------------------------------------
  useEffect(() => {
    // Don't run timer if already authenticated
    if (isAuthenticated) {
      return;
    }

    // Timer finished
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer, isAuthenticated]);

  // --------------------------------------------------
  // VERIFY SECURITY CODE
  // --------------------------------------------------
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      setError("Please enter your security code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/verify-security",
        {
          code,
        },
      );

      if (response.data.success) {
        setIsAuthenticated(true);

        // Save session
        localStorage.setItem("admin_auth", "true");

        // Use sales returned by verification API
        setSalesData(response.data.sales || []);

        // Clear code
        setCode("");
      } else {
        setError(
          response.data.message || "Invalid security code. Please try again.",
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid security code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // RESEND SECURITY CODE
  // --------------------------------------------------
  const handleResendCode = async () => {
    // Prevent clicking while countdown is active
    if (resendTimer > 0 || resending) {
      return;
    }

    try {
      setResending(true);
      setError("");

      /*
       * IMPORTANT:
       * Change this endpoint if your backend
       * uses a different resend endpoint.
       */
      await axios.post("http://localhost:5000/api/resend-security-code");

      // Clear old code
      setCode("");

      // Reset timer to 30 seconds
      setResendTimer(30);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend the code. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  // --------------------------------------------------
  // LOGOUT / LOCK SESSION
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("admin_auth");

    setIsAuthenticated(false);
    setSalesData([]);
    setCode("");
    setError("");

    // Start a fresh 30-second countdown
    setResendTimer(30);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      {/* ==================================================
          SECURITY MODAL
      ================================================== */}
      {!isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center md:-mt-40 justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="p-5 sm:p-6">
              {/* HEADER */}
              <div className="flex items-center justify-center gap-3">
                {/* Security Icon */}
                <div className="flex h-11 w-11 shrink-0 -ml-13 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.5 12l1.7 1.7 3.5-3.5"
                    />
                  </svg>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Hey, Mostakin
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Verify your identity to continue
                  </p>
                </div>
              </div>
             
              {/* FORM */}
              <form onSubmit={handleVerify} className="mt-5 space-y-4">
                {/* SECURITY CODE */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Enter 6-digit security code
                  </label>

                  <div className="flex justify-center gap-2 sm:gap-2.5">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`security-code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={code[index] || ""}
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        autoFocus={index === 0}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");

                          if (!value) {
                            const newCode = code.split("");
                            newCode[index] = "";
                            setCode(newCode.join(""));
                            return;
                          }

                          const newCode = code.split("");
                          newCode[index] = value;
                          setCode(newCode.join("").slice(0, 6));

                          // Move to next input
                          if (index < 5) {
                            document
                              .getElementById(`security-code-${index + 1}`)
                              ?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          // Backspace → move to previous box
                          if (
                            e.key === "Backspace" &&
                            !code[index] &&
                            index > 0
                          ) {
                            document
                              .getElementById(`security-code-${index - 1}`)
                              ?.focus();
                          }

                          // Arrow left
                          if (e.key === "ArrowLeft" && index > 0) {
                            document
                              .getElementById(`security-code-${index - 1}`)
                              ?.focus();
                          }

                          // Arrow right
                          if (e.key === "ArrowRight" && index < 5) {
                            document
                              .getElementById(`security-code-${index + 1}`)
                              ?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();

                          const pastedCode = e.clipboardData
                            .getData("text")
                            .replace(/\D/g, "")
                            .slice(0, 6);

                          if (!pastedCode) return;

                          setCode(pastedCode);

                          const nextIndex = Math.min(pastedCode.length, 5);

                          document
                            .getElementById(`security-code-${nextIndex}`)
                            ?.focus();
                        }}
                        className={`h-12 w-10 rounded-xl border bg-slate-50 text-center text-xl font-bold text-slate-900 outline-none transition-all sm:h-13 sm:w-11 ${
                          error
                            ? "border-rose-300 bg-rose-50/50 text-rose-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
                            : "border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                        }`}
                      />
                    ))}
                  </div>

                  {/* ERROR */}
                  {error && (
                    <p className="mt-2 text-center text-[11px] font-medium text-rose-600">
                      {error}
                    </p>
                  )}
                </div>

                {/* VERIFY BUTTON */}
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </button>
              </form>
              
              {/* RESEND */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-xs">
                <span className="text-slate-400">Didn't receive it?</span>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || resending}
                  className={`font-semibold transition-colors ${
                    resendTimer > 0 || resending
                      ? "cursor-not-allowed text-slate-500"
                      : "text-emerald-600 hover:text-emerald-700"
                  }`}
                >
                  {resending
                    ? "Sending..."
                    : resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend code"}
                </button>
              </div>
              {/* SECURITY NOTE */}
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3.5 w-3.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5A.75.75 0 0 1 10 1.75ZM4.22 4.22a.75.75 0 0 1 1.06 0l.36.36a.75.75 0 1 1-1.06 1.06l-.36-.36a.75.75 0 0 1 0-1.06ZM1.75 10a.75.75 0 0 1 .75-.75H3a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM16.86 4.22a.75.75 0 0 1 0 1.06l-.36.36a.75.75 0 1 1-1.06-1.06l.36-.36a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                Keep your verification code private
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          SALES LIST
      ================================================== */}
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Protected Sales List
          </h1>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Verified Access
              </span>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              Lock Session
            </button>
          </div>
        </div>

        {/* SALES TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="whitespace-nowrap px-6 py-4">Invoice ID</th>

                  <th className="whitespace-nowrap px-6 py-4">Customer</th>

                  <th className="whitespace-nowrap px-6 py-4">Amount</th>

                  <th className="whitespace-nowrap px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {salesData.length > 0 ? (
                  salesData.map((sale, index) => (
                    <tr
                      key={sale.id || index}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                        {sale.id}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        {sale.customer}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                        {sale.amount}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-12 text-center text-slate-400"
                    >
                      {isAuthenticated
                        ? "No sales records available."
                        : "Complete verification above to view data."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;
