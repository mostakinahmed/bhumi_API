import React from "react";
import { X, FileText, ExternalLink, Download } from "lucide-react";

export default function PdfModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const pdfUrl = "/Bhumi_API_Docs.pdf";
  const enhancedPdfUrl = `${pdfUrl}#view=Fit&toolbar=0&navpanes=0&scrollbar=0`;
  const title = "Bhumi API Documentation";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 backdrop-blur-sm bg-black/60">
      <div className="bg-slate-800 w-full max-w-4xl h-[90vh] md:h-[95vh] rounded border border-slate-700 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-700 flex justify-between items-center bg-[#1b3b2b]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <FileText className="text-emerald-400" size={20} />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-base md:text-lg text-white truncate">
                {title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              download
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
              title="Download"
            >
              <Download size={20} />
            </a>
            <button
              onClick={onClose}
              className="ml-2 p-2 bg-slate-700/50 hover:bg-red-500/20 hover:text-red-500 rounded-lg text-slate-300 transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-900 relative">
          <object
            data={enhancedPdfUrl}
            type="application/pdf"
            className="w-full h-full block"
            style={{ minHeight: "100%" }}
          >
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <FileText size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-300 mb-6">
                Your browser is unable to display the PDF inside this window.
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2 bg-[#1b3b2b] hover:bg-[#2c5e43] text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow"
              >
                <ExternalLink size={18} />
                Open PDF in New Tab
              </a>
            </div>
          </object>
        </div>

      </div>
    </div>
  );
}