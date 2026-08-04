import React, { useState, useMemo, useEffect } from "react";
import {
  MapPin,
  Layers,
  Zap,
  Shield,
  Database,
  Code2,
  ChevronRight,
  Check,
  Copy,
  Globe2,
  Search,
} from "lucide-react";
import axios from "axios";
import BuyModal from "./BuyModal";

const ENDPOINTS = [
  { method: "GET", path: "/v1/divisions", desc: "List all 8 divisions" },
  {
    method: "GET",
    path: "/v1/divisions/:code/zila",
    desc: "List zila within a division",
  },
  {
    method: "GET",
    path: "/v1/zila/:code/upazila",
    desc: "List upazila within a zila",
  },
  {
    method: "GET",
    path: "/v1/upazila/:code/union",
    desc: "List unions within an upazila",
  },
  {
    method: "GET",
    path: "/v1/search?q=savar",
    desc: "Full-text search across every level",
  },
  {
    method: "GET",
    path: "/v1/geocode?lat=23.83&lng=90.31",
    desc: "Reverse-geocode coordinates to a union",
  },
];

const PLANS = [
  {
    name: "Basic",
    price: "৳50",
    period: "/month",
    limit: "1,000 lookups/month",
    features: [
      "All 8 divisions",
      "Community support",
      "Rate-limited to 10 req/s",
    ],
  },
  {
    name: "Builder",
    price: "৳500",
    period: "/year",
    limit: "250,000 lookups/year",
    features: [
      "Geocoding endpoint",
      "Bengali + English names",
      "Email support",
    ],
    highlight: true,
  },

  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    limit: "Unlimited",
    features: ["Dedicated infra", "Bulk export", "SLA & onboarding"],
    active: false,
  },
];

const FONT_BLOCK = `
  @import url('https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  .bd-display{ font-family:'Arvo', serif; }
  .bd-mono{ font-family:'IBM Plex Mono', monospace; }
  .bd-body{ font-family:'IBM Plex Sans', sans-serif; }
  .bd-root{ background-color:#F1ECDD; color:#1F2A22; }
  .bd-hairline{ border-color:#C9BFA0; }
  .bd-card{ background-color:#FAF7EE; border:1px solid #C9BFA0; }
  .bd-forest{ background-color:#24402F; }
  .bd-forest-text{ color:#24402F; }
  .bd-stamp{ color:#A6362C; }
  .bd-stamp-bg{ background-color:#A6362C; }
  .bd-gold{ color:#B98A3E; }
  .bd-gold-bg{ background-color:#B98A3E; }
  .bd-select{ background-color:#FAF7EE; border:1px solid #C9BFA0; color:#1F2A22; }
  .bd-select:focus{ outline:2px solid #24402F; outline-offset:1px; }
  .bd-btn-primary{ background-color:#24402F; color:#F1ECDD; }
  .bd-btn-primary:hover{ background-color:#1a3022; }
  .bd-btn-primary:focus-visible{ outline:2px solid #A6362C; outline-offset:2px; }
  .bd-btn-outline{ border:1.5px solid #24402F; color:#24402F; background:transparent; }
  .bd-btn-outline:hover{ background-color:#24402F; color:#F1ECDD; }
  .bd-btn-outline:focus-visible{ outline:2px solid #A6362C; outline-offset:2px; }
  .bd-json{ background-color:#1F2A22; color:#EAE4CE; }
  .bd-json .k{ color:#8FBF9F; }
  .bd-json .s{ color:#E3B96A; }
  .bd-plan-highlight{ border:2px solid #A6362C; }
  .bd-stamp-wrap{ width:168px; height:168px; }
  @media (max-width:380px){
    .bd-stamp-wrap{ width:140px; height:140px; }
  }
  @media (prefers-reduced-motion: no-preference){
    .bd-fade-in{ animation: bdFade .5s ease-out; }
  }
  @keyframes bdFade{ from{ opacity:0; transform:translateY(4px);} to{ opacity:1; transform:translateY(0);} }
`;

export default function BDGeoAPI() {
  // State for raw data lists from backend
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);

  // Full master lists from backend for instant client-side cascading
  const [allDistricts, setAllDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [allUnions, setAllUnions] = useState([]);

  // State for currently selected IDs/Names
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [selectedUnion, setSelectedUnion] = useState("");

  const [navOpen, setNavOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const API_BASE_URL = "http://localhost:5000/api";

  // Load all data sets simultaneously when web loads
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [divRes, distRes, upaRes, unionRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/divisions`),
          axios.get(`${API_BASE_URL}/districts`),
          axios.get(`${API_BASE_URL}/upazilas`),
          axios.get(`${API_BASE_URL}/unions`),
        ]);

        if (divRes.data.success) setDivisions(divRes.data.data);
        if (distRes.data.success) setAllDistricts(distRes.data.data);
        if (upaRes.data.success) setAllUpazilas(upaRes.data.data);
        if (unionRes.data.success) setAllUnions(unionRes.data.data);
      } catch (error) {
        console.error("Error loading geographic data from backend:", error);
      }
    }

    loadInitialData();
  }, []);

  // Filter Districts when selectedDivision changes & reset children
  useEffect(() => {
    if (!selectedDivision) {
      setDistricts([]);
      setSelectedDistrict("");
      setUpazilas([]);
      setSelectedUpazila("");
      setUnions([]);
      setSelectedUnion("");
      return;
    }
    const filtered = allDistricts.filter(
      (d) => String(d.divisionId || d.division_id) === String(selectedDivision),
    );
    setDistricts(filtered);
    setSelectedDistrict(""); // Reset district
    setUpazilas([]); // Reset upazila
    setSelectedUpazila(""); // Reset upazila selection
    setUnions([]); // Reset union
    setSelectedUnion(""); // Reset union selection
  }, [selectedDivision, allDistricts]);

  // Filter Upazilas when selectedDistrict changes & reset children
  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      setSelectedUpazila("");
      setUnions([]);
      setSelectedUnion("");
      return;
    }
    const filtered = allUpazilas.filter(
      (u) =>
        String(u.districtId || u.district_id || u.dist_id) ===
        String(selectedDistrict),
    );
    setUpazilas(filtered);
    setSelectedUpazila(""); // Reset upazila
    setUnions([]); // Reset union
    setSelectedUnion(""); // Reset union selection
  }, [selectedDistrict, allUpazilas]);

  // Filter Unions when selectedUpazila changes
  useEffect(() => {
    if (!selectedUpazila) {
      setUnions([]);
      setSelectedUnion("");
      return;
    }
    const filtered = allUnions.filter(
      (un) =>
        String(un.upazilaId || un.upazila_id || un.upa_id) ===
        String(selectedUpazila),
    );
    setUnions(filtered);
    setSelectedUnion(""); // Reset union selection
  }, [selectedUpazila, allUnions]);

  return (
    <div className="bd-root bd-body min-h-screen overflow-x-hidden">
      <style>{FONT_BLOCK}</style>

      {/* NAV */}
      <header className="shadow-lg border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bd-forest w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "#F1ECDD" }}
              />
            </div>
            <span className="bd-display text-base sm:text-lg font-bold tracking-tight">
              Bhumi<span className="bd-stamp">API</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#endpoints" className="hover:opacity-70">
              Endpoints
            </a>
            <a href="#demo" className="hover:opacity-70">
              Live demo
            </a>
            <a href="#pricing" className="hover:opacity-70">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="bd-btn-primary text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-sm">
              Get API key
            </button>
            <button
              className="md:hidden bd-btn-outline w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
              aria-label="Toggle menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <span className="bd-mono text-xs">{navOpen ? "×" : "≡"}</span>
            </button>
          </div>
        </div>
        {navOpen && (
          <nav className="md:hidden border-t  bd-hairline px-4 sm:px-6 py-3 flex flex-col gap-3 text-sm font-medium">
            <a
              href="#endpoints"
              onClick={() => setNavOpen(false)}
              className="hover:opacity-70"
            >
              Endpoints
            </a>
            <a
              href="#demo"
              onClick={() => setNavOpen(false)}
              className="hover:opacity-70"
            >
              Live demo
            </a>
            <a
              href="#pricing"
              onClick={() => setNavOpen(false)}
              className="hover:opacity-70"
            >
              Pricing
            </a>
          </nav>
        )}
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-10 sm:pb-14 flex flex-col md:flex-row md:items-start justify-between gap-10 md:gap-12">
        <div className="md:max-w-[65%]">
          <div className="inline-flex w-full md:w-auto items-center gap-2 bd-card md:px-3 px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold bd-mono mb-6">
            <Globe2 className="w-3.5 h-3.5 bd-forest-text flex-shrink-0" />8
            DIVISIONS · 64 ZILA · 495 UPAZILA · 4,571 UNIONS
          </div>
          <h1 className="bd-display text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5">
            Every zila, upazila and union of Bangladesh{" "}
            <span className="bd-stamp">
              {" "}
              <br className="md:hidden" />— one lookup away.
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg opacity-80 leading-relaxed mb-8 ">
            A single, versioned REST API for Bangladesh's full administrative
            hierarchy, from division down to union parishad. Built for
            logistics, KYC, delivery and civic apps that need to know exactly
            where they stand.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bd-btn-primary font-semibold px-5 sm:px-6 py-3 rounded-sm text-sm">
              Start for free
            </button>
            <a
              href="#demo"
              className="bd-btn-outline font-semibold px-5 sm:px-6 py-3 rounded-sm text-sm inline-block"
            >
              Try the live demo
            </a>
          </div>
        </div>

        {/* Signature: stamp card */}
        <div className="bd-card rounded-sm p-6 shadow-sm w-full md:w-auto md:min-w-[320px] md:max-w-sm">
          <p className="bd-mono text-xs uppercase tracking-widest opacity-60 mb-4">
            Record lookup
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm border-b bd-hairline pb-2 gap-3">
              <span className="opacity-60">Division</span>
              <span className="font-semibold text-right">Rajshahi</span>
            </div>
            <div className="flex justify-between text-sm border-b bd-hairline pb-2 gap-3">
              <span className="opacity-60">Zila</span>
              <span className="font-semibold text-right">Rajshahi</span>
            </div>
            <div className="flex justify-between text-sm border-b bd-hairline pb-2 gap-3">
              <span className="opacity-60">Upazila</span>
              <span className="font-semibold text-right">Puthia</span>
            </div>
            <div className="flex justify-between text-sm gap-3">
              <span className="opacity-60">Union</span>
              <span className="font-semibold text-right">Baneshwar</span>
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <div
              className="bd-stamp-wrap rounded-full flex flex-col items-center justify-center bd-fade-in"
              style={{
                border: "3px solid #A6362C",
                boxShadow: "inset 0 0 0 3px rgba(166,54,44,0.15)",
                transform: "rotate(-6deg)",
              }}
            >
              <span className="bd-mono text-[9px] sm:text-[10px] tracking-widest bd-stamp font-semibold">
                OFFICIAL RECORD
              </span>
              <span className="bd-display text-sm sm:text-base font-bold bd-stamp mt-1 px-2 text-center break-all">
                BD-30-DHA-SAV-AMI
              </span>
              <span className="bd-mono text-[9px] sm:text-[10px] tracking-widest bd-stamp font-semibold mt-1">
                VERIFIED
              </span>
            </div>
          </div>
          <p className="text-center bd-mono text-xs opacity-50">
            generated live from selections below
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y bd-hairline bd-forest">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6"
          style={{ color: "#F1ECDD" }}
        >
          {[
            ["8", "Divisions"],
            ["64", "Zila"],
            ["495", "Upazila"],
            ["4,571", "Unions"],
          ].map(([n, l]) => (
            <div
              key={l}
              className="text-center md:text-left md:border-l md:pl-6 first:md:border-l-0 first:md:pl-0"
              style={{ borderColor: "rgba(241,236,221,0.25)" }}
            >
              <div className="bd-display text-2xl sm:text-3xl font-bold">
                {n}
              </div>
              <div className="bd-mono text-[10px] sm:text-xs uppercase tracking-widest opacity-70 mt-1">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="bd-display text-xl sm:text-2xl font-bold mb-2">
          Built for how Bangladesh is actually organized
        </h2>
        <p className="opacity-70 mb-8 sm:mb-10  text-sm sm:text-base">
          Four levels of the real administrative hierarchy, kept current and
          queryable in milliseconds.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Layers,
              title: "Full hierarchy",
              desc: "Division → zila → upazila → union, correctly nested and cross-referenced.",
            },
            {
              icon: Zap,
              title: "Sub-40ms lookups",
              desc: "Edge-cached responses for every level, no cold starts.",
            },
            {
              icon: Search,
              title: "Bilingual search",
              desc: "Query in English or Bengali script and get the same record.",
            },
            {
              icon: Shield,
              title: "99.95% uptime",
              desc: "Versioned endpoints so integrations never break silently.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bd-card rounded-sm p-5">
              <Icon className="w-5 h-5 bd-stamp mb-3" />
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm opacity-70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ENDPOINTS */}
      <section
        id="endpoints"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      >
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-5 h-5 bd-forest-text flex-shrink-0" />
          <h2 className="bd-display text-xl sm:text-2xl font-bold">
            API reference
          </h2>
        </div>
        <p className="opacity-70 mb-6 sm:mb-8 text-sm sm:text-base">
          Six endpoints cover the entire hierarchy plus search and reverse
          geocoding.
        </p>
        <div className="bd-card rounded-sm overflow-hidden">
          {ENDPOINTS.map((e, i) => (
            <div
              key={e.path}
              className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 px-4 sm:px-5 py-3.5 sm:py-4 ${i !== 0 ? "border-t bd-hairline" : ""}`}
            >
              <span
                className="bd-mono text-xs font-semibold px-2 py-1 rounded-sm w-fit"
                style={{ backgroundColor: "#24402F", color: "#F1ECDD" }}
              >
                {e.method}
              </span>
              <span className="bd-mono text-xs sm:text-sm font-medium break-all">
                {e.path}
              </span>
              <span className="text-xs sm:text-sm opacity-60 sm:ml-auto">
                {e.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE DEMO */}
      <section
        id="demo"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      >
        <h2 className="bd-display text-xl sm:text-2xl font-bold mb-2">
          Try it live
        </h2>
        <p className="opacity-70 mb-6 sm:mb-8 text-sm sm:text-base">
          Drill down sequentially through the hierarchy and watch the response
          update in real time.
        </p>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT SIDE: Dropdowns (Matched Height & Styled) */}
          <div className="bd-card rounded-sm p-5 sm:p-6 flex flex-col justify-between h-[320px] sm:h-[350px]">
            <div>
              <div className="flex items-center justify-between border-b bd-hairline pb-3 mb-4">
                <span className="bd-mono uppercase tracking-widest text-[10px] opacity-60 font-semibold">
                  Hierarchy Selection
                </span>
                <span className="text-[10px] bd-mono bd-forest-text bg-[#E5DFCC] px-2 py-0.5 rounded border bd-hairline">
                  Interactive
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Division Dropdown */}
                <label className="text-sm">
                  <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                    Division
                  </span>
                  <select
                    className="bd-select w-full px-3 py-2 rounded-sm text-sm"
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                  >
                    <option value="" disabled>
                      Select division
                    </option>
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 2. District / Zila Dropdown */}
                <label className="text-sm">
                  <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                    Zila
                  </span>
                  <select
                    className={`bd-select w-full px-3 py-2 rounded-sm text-sm ${!selectedDivision ? "opacity-50 cursor-not-allowed bg-stone-100" : ""}`}
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedDivision}
                  >
                    <option value="" disabled>
                      Select zila
                    </option>
                    {districts.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 3. Upazila Dropdown */}
                <label className="text-sm">
                  <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                    Upazila
                  </span>
                  <select
                    className={`bd-select w-full px-3 py-2 rounded-sm text-sm ${!selectedDistrict ? "opacity-50 cursor-not-allowed bg-stone-100" : ""}`}
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="" disabled>
                      Select upazila
                    </option>
                    {upazilas.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </label>

                {/* 4. Union Dropdown */}
                <label className="text-sm">
                  <span className="block bd-mono text-[11px] uppercase tracking-wide opacity-60 mb-1">
                    Union
                  </span>
                  <select
                    className={`bd-select w-full px-3 py-2 rounded-sm text-sm ${!selectedUpazila ? "opacity-50 cursor-not-allowed bg-stone-100" : ""}`}
                    value={selectedUnion}
                    onChange={(e) => setSelectedUnion(e.target.value)}
                    disabled={!selectedUpazila}
                  >
                    <option value="" disabled>
                      Select union
                    </option>
                    {unions.map((uni) => (
                      <option key={uni.id || uni.name} value={uni.name}>
                        {uni.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div
              className="flex items-start sm:items-center gap-2 bd-mono text-[11px] sm:text-xs px-3 py-2 rounded-sm break-all mt-3"
              style={{
                backgroundColor: "#EFE7CB",
                border: "1px solid #C9BFA0",
              }}
            >
              <ChevronRight className="w-3.5 h-3.5 bd-stamp flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>GET /api/unions?upazilaId={selectedUpazila || "ID"}</span>
            </div>
          </div>

          {/* RIGHT SIDE: Fixed-Height Live Output Response Box */}
          <div className="bd-json rounded-sm p-5 sm:p-6 shadow-sm font-mono text-xs sm:text-sm flex flex-col h-[320px] sm:h-[350px]">
            <div className="flex items-center justify-between border-b border-stone-700 pb-3 mb-3 flex-shrink-0">
              <span className="text-stone-400 uppercase tracking-widest text-[10px] font-semibold">
                Live API Response
              </span>
              <span className="text-emerald-400 text-[12px] bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                200 OK
              </span>
            </div>

            {/* Scrollable JSON Content Area */}
            <div className="overflow-y-auto flex-grow pr-2 custom-scrollbar">
              <pre className="text-sm leading-relaxed">
                {JSON.stringify(
                  {
                    success: true,
                    query: {
                      divisionId: selectedDivision || null,
                      districtId: selectedDistrict || null,
                      upazilaId: selectedUpazila || null,
                      selectedUnion: selectedUnion || null,
                    },
                    matchedUnionsCount: unions.length,
                    data: unions.map((u) => ({
                      id: u.id,
                      name: u.name,
                      upazilaId: u.upazilaId || u.upazila_id,
                    })),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16"
      >
        <h2 className="bd-display text-xl sm:text-2xl font-bold mb-2">
          Pricing
        </h2>
        <p className="opacity-70 mb-8 sm:mb-10 text-sm sm:text-base">
          Start free, scale as your lookup volume grows.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 group">
          {PLANS.map((p, index) => (
            <div
              key={p.name}
              className={`bd-card rounded-sm p-6 transition-all duration-300 relative ${
                p.highlight
                  ? "group-hover:not(:hover):border-[#C9BFA0] group-hover:not(:hover):shadow-none"
                  : ""
              } hover:border-[#A6362C] hover:shadow-md hover:-translate-y-1`}
            >
            
              <h3 className="bd-display text-lg font-bold mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-2xl font-bold">{p.price}</span>
                <span className="text-sm opacity-60">{p.period}</span>
              </div>
              <p className="bd-mono text-xs opacity-60 mb-5">{p.limit}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 bd-forest-text mt-0.5 flex-shrink-0" />
                    <span className="opacity-80">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleOpenModal(p)}
                disabled={p.active === false}
                className={`w-full py-2.5 rounded-sm text-sm font-semibold transition-all ${
                  p.active === false
                    ? "opacity-50 cursor-not-allowed bg-stone-300 border border-stone-300 text-stone-600 hover:bg-stone-200"
                    : "bd-btn-outline"
                }`}
              >
                {p.active === false ? "Unavailable" : `Choose ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Render the modal at the bottom of your main layout container */}
      <BuyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
