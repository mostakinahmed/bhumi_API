import React, { useState } from "react";
import { X, ShieldCheck, CreditCard, User, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function BuyModal({ isOpen, onClose, selectedPlan }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    paymentMethod: "bkash",
    transactionNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://api-bhumi.mostakinahmed.com/api/submit-sale",
        {
          plan: selectedPlan?.name,
          price: selectedPlan?.price,
          ...formData,
        },
      );

      if (response.data.success) {
        resetForm();
        setSuccess(true);
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      console.log(formData);
      setError("Failed to connect to payment server.");
    } finally {
      setLoading(false);
    }
  };

  function resetForm() {
    setFormData({
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      paymentMethod: "",
      transactionNo: "",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:p-4 p-2 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bd-root bd-card w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden border border-[#C9BFA0] flex flex-col max-h-[80vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bd-hairline bg-[#FAF7EE]">
          <div>
            <h3 className="bd-display text-lg font-bold">
              Checkout: {selectedPlan?.name} Plan
            </h3>
            <p className="text-xs opacity-70">
              Complete your details and payment to receive your API key.
            </p>
          </div>

          <button
            onClick={() => {
              onClose(); // First function
              resetForm(); // Second function
            }}
            className="p-1 rounded-sm hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-4 my-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
            <h4 className="bd-display text-2xl font-bold">
              Payment & Order Successful!
            </h4>
            <p className="text-sm opacity-80 max-w-md">
              Thank you for subscribing. We have sent your active API key and
              receipt to <span className="font-semibold">{formData.email}</span>
              .
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="bd-btn-primary px-6 py-2.5 rounded-sm text-sm font-semibold mt-4"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-6 md:p-6 p-3 overflow-y-auto"
          >
            {/* LEFT PORTION: Payment Information */}
            <div className="space-y-4 bg-[#F5F0E1] p-5 rounded-sm border bd-hairline">
              <div className="flex items-center gap-2 border-b bd-hairline pb-2">
                <CreditCard className="w-4 h-4 bd-stamp" />
                <h4 className="bd-display text-sm font-bold uppercase tracking-wider">
                  Payment Information
                </h4>
              </div>

              <div className="text-sm mb-3">
                <span className="opacity-70 text-xs block"></span>
                <span className="text-xl font-bold">
                  <span className="font-medium text-sm">Plan Price: </span>
                  {selectedPlan?.price}
                </span>
                <span className="text-xs opacity-65">
                  {" "}
                  {selectedPlan?.period}
                </span>
              </div>

              <label className="block text-sm">
                <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                  Payment Method
                </span>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="bd-select w-full px-3 py-2 rounded-sm text-sm"
                >
                  <option value="bkash">
                    bKash Merchant (Personal/Merchant)
                  </option>
                  <option value="nagad">Nagad Personal</option>
                  <option value="sslcommerz">
                    SSLCommerz (Card / Net Banking)
                  </option>
                </select>
              </label>

              <div className="bg-amber-100/60 border border-amber-300 p-3 rounded-sm text-xs space-y-1">
                <p className="font-semibold text-amber-900">Instructions:</p>
                <p className="text-amber-800">
                  Send money to{" "}
                  <span className="font-mono font-bold">01700000000</span> via
                  Send Money / Payment, <br /> Then enter your Transaction ID
                  below.
                </p>
              </div>

              <label className="block text-sm">
                <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                  Transaction ID (TrxID)
                </span>
                <input
                  type="text"
                  required
                  name="transactionNo"
                  value={formData.transactionNo}
                  onChange={handleChange}
                  placeholder="e.g. 9N87AH62KS"
                  maxLength={10}
                  className="bd-select w-full px-3 py-2 rounded-sm text-sm font-mono uppercase"
                />
              </label>

              <div className="flex items-center gap-2 pt-2 text-xs opacity-70">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Secured SSL Encryption & Manual Verification</span>
              </div>
            </div>

            {/* RIGHT PORTION: User Information */}
            <div className="space-y-4 bg-[#F5F0E1] p-5 rounded-sm border bd-hairline">
              <div className="flex items-center gap-2 border-b bd-hairline pb-2">
                <User className="w-4 h-4 bd-forest-text" />
                <h4 className="bd-display text-sm font-bold uppercase tracking-wider">
                  User Information
                </h4>
              </div>

              <label className="block text-sm">
                <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                  Full Name
                </span>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Mostakin Ahmed"
                  className="bd-select w-full px-3 py-2 rounded-sm text-sm"
                />
              </label>

              <label className="block text-sm">
                <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                  Email Address
                </span>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="me@mostakinahmed.com"
                  className="bd-select w-full px-3 py-2 rounded-sm text-sm"
                />
              </label>

              <label className="block text-sm">
                <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                  Phone Number
                </span>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="017xxxxxxxx"
                  maxLength={11}
                  className="bd-select w-full px-3 py-2 rounded-sm text-sm font-mono"
                />
              </label>

              <label className="block text-sm">
                <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                  Organization / Project Name
                </span>
                <input
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  placeholder="Victus Byte / University Project"
                  className="bd-select w-full px-3 py-2 rounded-sm text-sm"
                />
              </label>

              {error && (
                <p className="text-xs text-red-600 font-semibold">{error}</p>
              )}

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bd-btn-primary w-full py-2.5 rounded-sm text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {loading
                    ? "Verifying & Generating Key..."
                    : "Confirm & Subscribe"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
