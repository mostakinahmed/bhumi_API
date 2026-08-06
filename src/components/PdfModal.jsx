import React from "react";

export default function PdfModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const pdfUrl = "/Bhumi_API_Docs.pdf"; // Update this if your filename is different

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

        {/* MODAL BODY (OBJECT VIEWER WITH FALLBACK) */}
        <div className="flex-1 bg-gray-100 flex flex-col p-2">
          <object
            data={`${pdfUrl}#zoom=75`}
            type="application/pdf"
            className="w-full h-full rounded border border-gray-300 bg-white"
          >
            {/* Fallback if Vercel blocks inline rendering */}
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-gray-700 mb-4">
                Unable to display PDF directly in this browser frame.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#1b3b2b] text-white font-semibold rounded shadow hover:bg-[#2c5e43] transition-all"
              >
                Open / Download Documentation PDF
              </a>
            </div>
          </object>
        </div>
      </div>
    </div>
  );
}
