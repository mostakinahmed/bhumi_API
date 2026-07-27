import React, { useState, useMemo } from 'react';
import { MapPin, Layers, Zap, Shield, Database, Code2, ChevronRight, Check, Copy, Globe2, Search } from 'lucide-react';

/* ---------------------------------------------------------------------
   Sample dataset — 3 of 8 divisions populated for the live demo.
   Codes are illustrative, not official BBS codes.
--------------------------------------------------------------------- */
const DATA = {
  Dhaka: {
    code: '30',
    zila: {
      Dhaka: {
        code: 'DHA',
        upazila: {
          Savar: { code: 'SAV', union: [
            { name: 'Aminbazar', code: 'AMI', lat: 23.83, lng: 90.31 },
            { name: 'Ashulia', code: 'ASH', lat: 23.90, lng: 90.35 },
            { name: 'Bironagar', code: 'BIR', lat: 23.85, lng: 90.28 },
          ]},
          Dhamrai: { code: 'DHM', union: [
            { name: 'Dhamrai', code: 'DHR', lat: 23.92, lng: 90.23 },
            { name: 'Kulla', code: 'KUL', lat: 23.95, lng: 90.20 },
            { name: 'Sombhag', code: 'SOM', lat: 23.90, lng: 90.18 },
          ]},
        },
      },
      Gazipur: {
        code: 'GAZ',
        upazila: {
          Kaliakair: { code: 'KLK', union: [
            { name: 'Chandra', code: 'CHN', lat: 24.05, lng: 90.20 },
            { name: 'Mouchak', code: 'MCK', lat: 24.08, lng: 90.25 },
            { name: 'Sreefaltoli', code: 'SRF', lat: 24.02, lng: 90.22 },
          ]},
          Sreepur: { code: 'SRP', union: [
            { name: 'Barmi', code: 'BRM', lat: 24.15, lng: 90.45 },
            { name: 'Gazaria', code: 'GZR', lat: 24.18, lng: 90.48 },
            { name: 'Telihati', code: 'TLH', lat: 24.20, lng: 90.40 },
          ]},
        },
      },
    },
  },
  Chattogram: {
    code: '20',
    zila: {
      Chattogram: {
        code: 'CTG',
        upazila: {
          Patiya: { code: 'PAT', union: [
            { name: 'Kusumpura', code: 'KUS', lat: 22.30, lng: 91.95 },
            { name: 'Char Patharghata', code: 'CPG', lat: 22.28, lng: 91.90 },
            { name: 'Haidgaon', code: 'HAI', lat: 22.32, lng: 91.88 },
          ]},
          Sitakunda: { code: 'SIT', union: [
            { name: 'Baroiyadhala', code: 'BRD', lat: 22.55, lng: 91.65 },
            { name: 'Bhatiary', code: 'BHT', lat: 22.50, lng: 91.70 },
            { name: 'Kumira', code: 'KMR', lat: 22.53, lng: 91.68 },
          ]},
        },
      },
      "Cox's Bazar": {
        code: 'CXB',
        upazila: {
          Teknaf: { code: 'TEK', union: [
            { name: 'Baharchhara', code: 'BHR', lat: 20.98, lng: 92.28 },
            { name: 'Hnila', code: 'HNL', lat: 21.02, lng: 92.25 },
            { name: 'Sabrang', code: 'SBR', lat: 20.95, lng: 92.30 },
          ]},
          Ukhia: { code: 'UKH', union: [
            { name: 'Jaliapalong', code: 'JLP', lat: 21.15, lng: 92.10 },
            { name: 'Palongkhali', code: 'PLK', lat: 21.18, lng: 92.15 },
            { name: 'Raja Palong', code: 'RJP', lat: 21.20, lng: 92.08 },
          ]},
        },
      },
    },
  },
  Sylhet: {
    code: '60',
    zila: {
      Sylhet: {
        code: 'SYL',
        upazila: {
          Beanibazar: { code: 'BNB', union: [
            { name: 'Mathiura', code: 'MTH', lat: 24.75, lng: 92.10 },
            { name: 'Kurar', code: 'KUR', lat: 24.78, lng: 92.12 },
            { name: 'Dubag', code: 'DUB', lat: 24.72, lng: 92.08 },
          ]},
          Golapganj: { code: 'GLP', union: [
            { name: 'Fulbari', code: 'FLB', lat: 24.85, lng: 91.95 },
            { name: 'Lakshipasha', code: 'LKP', lat: 24.88, lng: 91.98 },
            { name: 'Baghha', code: 'BGH', lat: 24.82, lng: 91.92 },
          ]},
        },
      },
      Moulvibazar: {
        code: 'MLV',
        upazila: {
          Sreemangal: { code: 'SRM', union: [
            { name: 'Ashidron', code: 'ASD', lat: 24.30, lng: 91.73 },
            { name: 'Bhunabir', code: 'BHN', lat: 24.33, lng: 91.75 },
            { name: 'Kalapur', code: 'KLP', lat: 24.28, lng: 91.70 },
          ]},
          Kulaura: { code: 'KLR', union: [
            { name: 'Bhatera', code: 'BHT2', lat: 24.50, lng: 91.90 },
            { name: 'Karmadha', code: 'KRM', lat: 24.52, lng: 91.92 },
            { name: 'Pothiya', code: 'PTH', lat: 24.48, lng: 91.88 },
          ]},
        },
      },
    },
  },
};

const ENDPOINTS = [
  { method: 'GET', path: '/v1/divisions', desc: 'List all 8 divisions' },
  { method: 'GET', path: '/v1/divisions/:code/zila', desc: 'List zila within a division' },
  { method: 'GET', path: '/v1/zila/:code/upazila', desc: 'List upazila within a zila' },
  { method: 'GET', path: '/v1/upazila/:code/union', desc: 'List unions within an upazila' },
  { method: 'GET', path: '/v1/search?q=savar', desc: 'Full-text search across every level' },
  { method: 'GET', path: '/v1/geocode?lat=23.83&lng=90.31', desc: 'Reverse-geocode coordinates to a union' },
];

const PLANS = [
  { name: 'Free', price: '৳0', period: '/mo', limit: '1,000 lookups', features: ['All 8 divisions', 'Community support', 'Rate-limited to 10 req/s'] },
  { name: 'Builder', price: '৳1,900', period: '/mo', limit: '250,000 lookups', features: ['Geocoding endpoint', 'Bengali + English names', 'Email support'], highlight: true },
  { name: 'Enterprise', price: 'Custom', period: '', limit: 'Unlimited', features: ['Dedicated infra', 'Bulk export', 'SLA & onboarding'] },
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
  @media (prefers-reduced-motion: no-preference){
    .bd-fade-in{ animation: bdFade .5s ease-out; }
  }
  @keyframes bdFade{ from{ opacity:0; transform:translateY(4px);} to{ opacity:1; transform:translateY(0);} }
`;

function fmtCode(divCode, zilaCode, upzCode, uniCode) {
  return `BD-${divCode}-${zilaCode}-${upzCode}${uniCode ? '-' + uniCode : ''}`;
}

export default function BDGeoAPI() {
  const divisions = Object.keys(DATA);
  const [division, setDivision] = useState(divisions[0]);
  const zilas = Object.keys(DATA[division].zila);
  const [zila, setZila] = useState(zilas[0]);
  const upazilas = Object.keys(DATA[division].zila[zila]?.upazila || {});
  const [upazila, setUpazila] = useState(upazilas[0]);
  const unions = DATA[division].zila[zila]?.upazila[upazila]?.union || [];
  const [unionName, setUnionName] = useState(unions[0]?.name || '');
  const [copied, setCopied] = useState(false);

  function onDivision(v) {
    setDivision(v);
    const z0 = Object.keys(DATA[v].zila)[0];
    setZila(z0);
    const u0 = Object.keys(DATA[v].zila[z0].upazila)[0];
    setUpazila(u0);
    setUnionName(DATA[v].zila[z0].upazila[u0].union[0].name);
  }
  function onZila(v) {
    setZila(v);
    const u0 = Object.keys(DATA[division].zila[v].upazila)[0];
    setUpazila(u0);
    setUnionName(DATA[division].zila[v].upazila[u0].union[0].name);
  }
  function onUpazila(v) {
    setUpazila(v);
    setUnionName(DATA[division].zila[zila].upazila[v].union[0].name);
  }

  const divCode = DATA[division].code;
  const zilaCode = DATA[division].zila[zila].code;
  const upzCode = DATA[division].zila[zila].upazila[upazila].code;
  const unionObj = useMemo(
    () => unions.find((u) => u.name === unionName) || unions[0],
    [unions, unionName]
  );
  const fullCode = fmtCode(divCode, zilaCode, upzCode, unionObj?.code);

  const jsonResponse = useMemo(() => {
    return `{
  "status": "ok",
  "query": {
    "division": "${division}",
    "zila": "${zila}",
    "upazila": "${upazila}",
    "union": "${unionObj?.name}"
  },
  "result": {
    "code": "${fullCode}",
    "coordinates": { "lat": ${unionObj?.lat}, "lng": ${unionObj?.lng} },
    "level": "union"
  }
}`;
  }, [division, zila, upazila, unionObj, fullCode]);

  function copyJson() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(jsonResponse).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="bd-root bd-body min-h-screen">
      <style>{FONT_BLOCK}</style>

      {/* NAV */}
      <header className="border-b bd-hairline">
        <div className="max-w-[65%] mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bd-forest w-9 h-9 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5" style={{ color: '#F1ECDD' }} />
            </div>
            <span className="bd-display text-lg font-bold tracking-tight">Bhumi<span className="bd-stamp">API</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#endpoints" className="hover:opacity-70">Endpoints</a>
            <a href="#demo" className="hover:opacity-70">Live demo</a>
            <a href="#pricing" className="hover:opacity-70">Pricing</a>
          </nav>
          <button className="bd-btn-primary text-sm font-semibold px-4 py-2 rounded-sm">Get API key</button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-[65%] mx-auto px-6 pt-16 pb-14 flex justify-between gap-12 ">
        <div className='max-w-[70%]'>
          <div className="inline-flex items-center gap-2 bd-card px-3 py-1 rounded-full text-xs font-semibold bd-mono mb-6">
            <Globe2 className="w-3.5 h-3.5 bd-forest-text" />
            8 DIVISIONS · 64 ZILA · 495 UPAZILA · 4,571 UNIONS
          </div>
          <h1 className="bd-display text-4xl md:text-5xl font-bold leading-tight mb-5">
            Every zila, upazila and union of Bangladesh — one lookup away.
          </h1>
          <p className="text-base md:text-lg opacity-80 leading-relaxed mb-8 max-w-lg">
            A single, versioned REST API for Bangladesh's full administrative hierarchy,
            from division down to union parishad. Built for logistics, KYC, delivery
            and civic apps that need to know exactly where they stand.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bd-btn-primary font-semibold px-6 py-3 rounded-sm text-sm">Start for free</button>
            <a href="#demo" className="bd-btn-outline font-semibold px-6 py-3 rounded-sm text-sm inline-block">Try the live demo</a>
          </div>
        </div>

        {/* Signature: stamp card */}
        <div className="h-120 bd-card rounded-sm p-6 shadow-sm">
          <p className="bd-mono text-xs uppercase tracking-widest opacity-60 mb-4">Record lookup</p>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm border-b bd-hairline pb-2">
              <span className="opacity-60">Division</span><span className="font-semibold">{division}</span>
            </div>
            <div className="flex justify-between text-sm border-b bd-hairline pb-2">
              <span className="opacity-60">Zila</span><span className="font-semibold">{zila}</span>
            </div>
            <div className="flex justify-between text-sm border-b bd-hairline pb-2">
              <span className="opacity-60">Upazila</span><span className="font-semibold">{upazila}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="opacity-60">Union</span><span className="font-semibold">{unionObj?.name}</span>
            </div>
          </div>
          <div className="flex items-center justify-center py-4">
            <div
              className="rounded-full flex flex-col items-center justify-center bd-fade-in"
              style={{
                width: 168,
                height: 168,
                border: '3px solid #A6362C',
                boxShadow: 'inset 0 0 0 3px rgba(166,54,44,0.15)',
                transform: 'rotate(-6deg)',
              }}
              key={fullCode}
            >
              <span className="bd-mono text-[10px] tracking-widest bd-stamp font-semibold">OFFICIAL RECORD</span>
              <span className="bd-display text-base font-bold bd-stamp mt-1 px-2 text-center">{fullCode}</span>
              <span className="bd-mono text-[10px] tracking-widest bd-stamp font-semibold mt-1">VERIFIED</span>
            </div>
          </div>
          <p className="text-center bd-mono text-xs opacity-50">generated live from selections below</p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y bd-hairline bd-forest">
        <div className="max-w-[65%] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6" style={{ color: '#F1ECDD' }}>
          {[
            ['8', 'Divisions'],
            ['64', 'Zila'],
            ['495', 'Upazila'],
            ['4,571', 'Unions'],
          ].map(([n, l]) => (
            <div key={l} className="text-center md:text-left md:border-l md:pl-6 first:md:border-l-0 first:md:pl-0" style={{ borderColor: 'rgba(241,236,221,0.25)' }}>
              <div className="bd-display text-3xl font-bold">{n}</div>
              <div className="bd-mono text-xs uppercase tracking-widest opacity-70 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-[65%] mx-auto px-6 py-16">
        <h2 className="bd-display text-2xl font-bold mb-2">Built for how Bangladesh is actually organized</h2>
        <p className="opacity-70 mb-10 max-w-xl">Four levels of the real administrative hierarchy, kept current and queryable in milliseconds.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Layers, title: 'Full hierarchy', desc: 'Division → zila → upazila → union, correctly nested and cross-referenced.' },
            { icon: Zap, title: 'Sub-40ms lookups', desc: 'Edge-cached responses for every level, no cold starts.' },
            { icon: Search, title: 'Bilingual search', desc: 'Query in English or Bengali script and get the same record.' },
            { icon: Shield, title: '99.95% uptime', desc: 'Versioned endpoints so integrations never break silently.' },
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
      <section id="endpoints" className="max-w-[65%] mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-5 h-5 bd-forest-text" />
          <h2 className="bd-display text-2xl font-bold">API reference</h2>
        </div>
        <p className="opacity-70 mb-8 max-w-xl">Six endpoints cover the entire hierarchy plus search and reverse geocoding.</p>
        <div className="bd-card rounded-sm overflow-hidden">
          {ENDPOINTS.map((e, i) => (
            <div key={e.path} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4 ${i !== 0 ? 'border-t bd-hairline' : ''}`}>
              <span className="bd-mono text-xs font-semibold px-2 py-1 rounded-sm w-fit" style={{ backgroundColor: '#24402F', color: '#F1ECDD' }}>
                {e.method}
              </span>
              <span className="bd-mono text-sm font-medium">{e.path}</span>
              <span className="text-sm opacity-60 sm:ml-auto">{e.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="demo" className="max-w-[65%] mx-auto px-6 py-16">
        <h2 className="bd-display text-2xl font-bold mb-2">Try it live</h2>
        <p className="opacity-70 mb-8 max-w-xl">Drill down through the hierarchy and watch the response update. Sample coverage: Dhaka, Chattogram and Sylhet divisions.</p>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bd-card rounded-sm p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="text-sm">
                <span className="block bd-mono text-xs uppercase tracking-wide opacity-60 mb-1.5">Division</span>
                <select className="bd-select w-full px-3 py-2 rounded-sm text-sm" value={division} onChange={(e) => onDivision(e.target.value)}>
                  {divisions.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="block bd-mono text-xs uppercase tracking-wide opacity-60 mb-1.5">Zila</span>
                <select className="bd-select w-full px-3 py-2 rounded-sm text-sm" value={zila} onChange={(e) => onZila(e.target.value)}>
                  {zilas.map((z) => <option key={z} value={z}>{z}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="block bd-mono text-xs uppercase tracking-wide opacity-60 mb-1.5">Upazila</span>
                <select className="bd-select w-full px-3 py-2 rounded-sm text-sm" value={upazila} onChange={(e) => onUpazila(e.target.value)}>
                  {upazilas.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <span className="block bd-mono text-xs uppercase tracking-wide opacity-60 mb-1.5">Union</span>
                <select className="bd-select w-full px-3 py-2 rounded-sm text-sm" value={unionName} onChange={(e) => setUnionName(e.target.value)}>
                  {unions.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-2 bd-mono text-xs px-3 py-2 rounded-sm" style={{ backgroundColor: '#EFE7CB', border: '1px solid #C9BFA0' }}>
              <ChevronRight className="w-3.5 h-3.5 bd-stamp" />
              GET /v1/union?path={division}/{zila}/{upazila}/{unionName}
            </div>
          </div>

          <div className="bd-json rounded-sm p-5 relative">
            <button onClick={copyJson} className="absolute top-4 right-4 flex items-center gap-1.5 text-xs bd-mono opacity-70 hover:opacity-100">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <pre className="bd-mono text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{jsonResponse}</pre>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-[65%] mx-auto px-6 py-16">
        <h2 className="bd-display text-2xl font-bold mb-2">Pricing</h2>
        <p className="opacity-70 mb-10 max-w-xl">Start free, scale as your lookup volume grows.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div key={p.name} className={`bd-card rounded-sm p-6 ${p.highlight ? 'bd-plan-highlight' : ''}`}>
              {p.highlight && <div className="bd-mono text-xs bd-stamp font-semibold mb-3 uppercase tracking-wide">Most used</div>}
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
              <button className={`w-full py-2.5 rounded-sm text-sm font-semibold ${p.highlight ? 'bd-btn-primary' : 'bd-btn-outline'}`}>
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t bd-hairline">
        <div className="max-w-[65%] mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 bd-forest-text" />
            <span className="bd-mono text-xs opacity-60">BhumiAPI — administrative geography data for Bangladesh</span>
          </div>
          <div className="flex gap-6 text-xs bd-mono opacity-60">
            <a href="#endpoints" className="hover:opacity-100">Docs</a>
            <a href="#" className="hover:opacity-100">Status</a>
            <a href="#" className="hover:opacity-100">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}