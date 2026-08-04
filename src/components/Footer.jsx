import React from "react";
import { MapPin, Github, Twitter, Linkedin, ArrowRight } from "lucide-react";

const FONT_BLOCK = `
  @import url('https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  .bd-display{ font-family:'Arvo', serif; }
  .bd-mono{ font-family:'IBM Plex Mono', monospace; }
  .bd-body{ font-family:'IBM Plex Sans', sans-serif; }
  .bd-footer{ background-color:#24402F; color:#F1ECDD; }
  .bd-hairline{ border-color: rgba(241,236,221,0.16); }
  .bd-link{ color: rgba(241,236,221,0.72); transition: color .15s ease; }
  .bd-link:hover{ color:#F1ECDD; }
  .bd-stamp{ color:#C97B6B; }
  .bd-input{ background-color:#1A3022; border:1px solid rgba(241,236,221,0.25); color:#F1ECDD; }
  .bd-input::placeholder{ color: rgba(241,236,221,0.45); }
  .bd-input:focus{ outline:2px solid #C97B6B; outline-offset:1px; }
  .bd-btn{ background-color:#A6362C; color:#F1ECDD; }
  .bd-btn:hover{ background-color:#8f2e25; }
  .bd-btn:focus-visible{ outline:2px solid #F1ECDD; outline-offset:2px; }
  .bd-icon-btn{ border:1px solid rgba(241,236,221,0.25); color: rgba(241,236,221,0.8); }
  .bd-icon-btn:hover{ background-color: rgba(241,236,221,0.08); color:#F1ECDD; }
`;



export default function BDGeoFooter() {
  return (
    <footer className="bd-footer bd-body">
      <style>{FONT_BLOCK}</style>

      {/* Top Section */}
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8 pt-14 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-b bd-hairline">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F1ECDD" }}
            >
              <MapPin className="w-5 h-5" style={{ color: "#24402F" }} />
            </div>

            <span className="bd-display text-xl font-bold">
              Bhumi<span className="bd-stamp">API</span>
            </span>
          </div>

          <p
            className="text-sm leading-7 max-w-md"
            style={{ color: "rgba(241,236,221,.72)" }}
          >
            A single, versioned REST API for Bangladesh's administrative
            hierarchy—Division, District, Upazila and Union—for logistics,
            delivery, KYC and civic applications.
          </p>

          <div className="flex gap-3 mt-7">
            <a
              href="#"
              className="bd-icon-btn w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href="#"
              className="bd-icon-btn w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <a
              href="#"
              className="bd-icon-btn w-10 h-10 rounded-full flex items-center justify-center"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="w-full md:max-w-md md:ml-auto">
          <p
            className="bd-mono text-xs uppercase tracking-[0.2em] mb-2"
            style={{ color: "rgba(241,236,221,.55)" }}
          >
            Stay Updated
          </p>

          <p
            className="text-sm mb-5"
            style={{ color: "rgba(241,236,221,.72)" }}
          >
            Receive monthly API updates, new administrative boundaries and
            feature releases.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@company.com"
              className="bd-input w-full px-4 py-3 rounded-md text-sm"
            />

            <button className="bd-btn px-5 py-3 rounded-md font-semibold flex items-center justify-center gap-2 whitespace-nowrap">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

     

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        <p
          className="bd-mono text-xs"
          style={{ color: "rgba(241,236,221,.5)" }}
        >
          © {new Date().getFullYear()} BhumiAPI. Administrative geography data
          for Bangladesh.
        </p>

        <p
          className="bd-mono text-xs"
          style={{ color: "rgba(241,236,221,.5)" }}
        >
          BD-30-DHA · v1 · All systems operational
        </p>
      </div>
    </footer>
  );
}
