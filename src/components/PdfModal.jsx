import React from "react";

export default function PdfModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl h-[95vh] bg-white rounded shadow-2xl flex flex-col overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 md:py-4 py-2 bg-[#1b3b2b] text-white">
          <h3 className="md:text-lg font-semibold tracking-wide">
            Bhumi API Documentation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl font-bold px-2 py-1 rounded transition-colors"
          >
            &times;
          </button>
        </div>

        {/* MODAL BODY (PDF VIEWER) */}
        <div className="flex-1 bg-gray-100">
          {/* Note: Place your generated PDF inside your public folder as 'Bhumi_API_Documentation.pdf' */}
          <iframe
            src={`${window.location.origin}/Bhumi_API_Docs.pdf#zoom=75`}
            title="Bhumi API Docs"
            className="w-full h-full rounded-lg border border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
