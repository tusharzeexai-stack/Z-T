import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Search, ChevronDown, Globe, Accessibility, Monitor,
  Phone, HelpCircle, FileText, Video, MapPin, Bell, ChevronRight,
  X, Menu, ExternalLink, ZoomIn, ZoomOut, AlertCircle,
  Eye, Wifi, Camera, Lock, Users, BookOpen, MessageSquare,
  ArrowRight, CheckCircle, Play
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: (roleHint?: string) => void;
}

const TICKER_ITEMS = [
  '📢 Z-TRACS Phase-III statewide rollout covering 180 talukas from 01 Sept 2026.',
  '🔔 All field officers must complete ANPR module training by 31 Aug 2026.',
  '📡 New camera federation integrations: Vadodara Smart City & Rajkot Municipal Cameras added.',
  '⚠️ Scheduled maintenance on GIS layer Sunday 24 Aug 2026 02:00–04:00 IST.',
  '✅ 12,482 cameras now active statewide — 95.6% uptime achieved.',
];

const ROLE_CARDS = [
  {
    id: 'STATE_ADMIN',
    title: 'State Administrator',
    titleGu: 'રાજ્ય વહીવટકર્તા',
    count: '4 Roles',
    img: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&auto=format&fit=crop&q=80',
    desc: 'Full statewide system access',
    color: '#1a3a6b',
  },
  {
    id: 'DISTRICT_ADMIN',
    title: 'District Administrator',
    titleGu: 'જિલ્લા વહીવટકર્તા',
    count: '33 Districts',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
    desc: 'District-level camera management',
    color: '#1a4a3a',
  },
  {
    id: 'CONTROL_ROOM_OPERATOR',
    title: 'Control Room Operator',
    titleGu: 'કંટ્રોલ રૂમ ઓપરેટર',
    count: 'Live 24×7',
    img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=600&auto=format&fit=crop&q=80',
    desc: 'Live video wall & alert monitoring',
    color: '#3a2a1a',
  },
  {
    id: 'POLICE_OFFICER',
    title: 'Police Field Officer',
    titleGu: 'પોલીસ ક્ષેત્ર અધિકારી',
    count: '8,492 ANPR/day',
    img: 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?w=600&auto=format&fit=crop&q=80',
    desc: 'ANPR search & vehicle journey',
    color: '#2a1a3a',
  },
];

const STATS = [
  { label: 'Active Cameras', value: '12,482', icon: Camera, color: '#0052CC' },
  { label: 'Districts Covered', value: '33 / 33', icon: MapPin, color: '#138808' },
  { label: 'ANPR Captures Today', value: '8,492', icon: Eye, color: '#7B2D8B' },
  { label: 'Live Streams', value: '347', icon: Wifi, color: '#CC4400' },
];

const FAQ_ITEMS = [
  { q: 'What is Z-TRACS?', a: 'Z-TRACS (Zonal Traffic & Road Asset Command System) is the Government of Gujarat\'s centralised CCTV surveillance and intelligent traffic monitoring platform, providing real-time video intelligence across all 33 districts.' },
  { q: 'Who can access the Z-TRACS portal?', a: 'Access is restricted to authorised Government employees with valid Badge IDs: State Administrators (IPS/IAS), District Administrators, Control Room Operators, and Police Field Officers.' },
  { q: 'How does ANPR vehicle tracking work?', a: 'Z-TRACS uses AI-powered Automatic Number Plate Recognition at over 3,200 checkpoints. Plates are read in real-time and cross-referenced against the National Vehicle Registry and Watchlist databases.' },
  { q: 'Is the data stored securely?', a: 'All footage is encrypted with AES-256, stored in NIC-certified data centres, and access is audited with full chain of custody for court-admissible evidence under SHA-256 hash verification.' },
];

const USER_MANUALS = [
  { title: 'Help file for Online Login Process', icon: BookOpen },
  { title: 'ANPR Search & Vehicle Journey Guide', icon: Search },
  { title: 'Camera Onboarding User Manual', icon: Camera },
  { title: 'Control Room Operator Manual', icon: Monitor },
];

const QUICK_LINKS = [
  { icon: AlertCircle, label: 'Grievance', color: '#FF9933', sub: 'File a complaint' },
  { icon: Phone, label: 'Help Line', color: '#0052CC', sub: '1800-233-5500' },
  { icon: HelpCircle, label: 'Portal Help', color: '#138808', sub: '1800-233-5500' },
  { icon: FileText, label: 'Citizen Charter', color: '#7B2D8B', sub: 'View guidelines' },
];

const PARTNER_LOGOS = [
  { name: 'Government of Gujarat', abbr: 'GoG' },
  { name: 'Digital India', abbr: 'DI' },
  { name: 'NIC', abbr: 'NIC' },
  { name: 'india.gov.in', abbr: 'NPI' },
  { name: 'MeitY', abbr: 'MeT' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTickerIndex(i => (i + 1) % TICKER_ITEMS.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden" style={{ fontSize }}>

      {/* ══ 1. GOI TOP ACCESSIBILITY BAR ══ */}
      <div className="bg-[#1a2744] border-b border-[#243560] py-1.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-[11px] text-slate-300">
            <a href="#" className="flex items-center space-x-1 hover:text-white transition">
              <Globe className="w-3 h-3" />
              <span className="font-semibold">Government of Gujarat</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 hidden xs:inline" />
            </a>
            <span className="text-slate-600">|</span>
            <a href="#main" className="hover:text-white transition hidden xs:inline">Skip to Main Content</a>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-[11px] text-slate-300">
            {/* Font Size Controls */}
            <div className="flex items-center space-x-1">
              <span className="text-slate-500 hidden sm:inline">A</span>
              <button onClick={() => setFontSize(f => Math.max(12, f - 1))} className="w-5 h-5 border border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-[9px] font-bold rounded-sm">A-</button>
              <button onClick={() => setFontSize(14)} className="w-5 h-5 border border-slate-600 bg-slate-600 text-white flex items-center justify-center text-[9px] font-bold rounded-sm">A</button>
              <button onClick={() => setFontSize(f => Math.min(18, f + 1))} className="w-6 h-5 border border-slate-600 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-[10px] font-bold rounded-sm">A+</button>
            </div>
            <span className="text-slate-600">|</span>
            {/* Color theme buttons */}
            <div className="hidden sm:flex items-center space-x-1">
              <button className="w-4 h-4 rounded-sm border border-slate-500" style={{ background: 'linear-gradient(90deg,#FF9933,#fff,#138808)' }} title="Default" />
              <button className="w-4 h-4 rounded-sm border border-slate-500 bg-slate-900" title="Dark" />
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="flex items-center space-x-1 text-slate-300 font-semibold">
              <span>English</span>
            </span>
          </div>
        </div>
      </div>

      {/* ══ 2. MAIN HEADER ══ */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#0052CC] flex items-center justify-center shadow-md flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Government of Gujarat</div>
              <div className="text-base sm:text-lg font-black text-[#0052CC] leading-tight tracking-tight">
                Z-TRACS
              </div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-medium hidden xs:block">Zonal Traffic & Road Asset Command System</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cameras, districts, alerts..."
                className="w-full pl-9 pr-4 py-1.5 sm:py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-blue-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Login Dropdown */}
            <div className="relative" ref={loginRef}>
              <button
                onClick={() => setLoginMenuOpen(o => !o)}
                className="flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0052CC] text-white rounded text-xs font-bold hover:bg-[#0041A8] transition shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${loginMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {loginMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="bg-[#0052CC] px-3 py-2">
                    <p className="text-white text-[10px] font-bold uppercase tracking-wider">Select Official Persona</p>
                  </div>
                  {[
                    { label: 'State Administrator (IPS/IAS)', hint: 'STATE_ADMIN', icon: Shield },
                    { label: 'District Administrator', hint: 'DISTRICT_ADMIN', icon: Globe },
                    { label: 'Control Room Operator', hint: 'CONTROL_ROOM_OPERATOR', icon: Monitor },
                    { label: 'Police Field Officer', hint: 'POLICE_OFFICER', icon: Users },
                  ].map(opt => (
                    <button
                      key={opt.hint}
                      onClick={() => { setLoginMenuOpen(false); onNavigateToLogin(opt.hint); }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-blue-50 transition border-b border-slate-100 last:border-0"
                    >
                      <opt.icon className="w-4 h-4 text-[#0052CC] shrink-0" />
                      <span className="text-xs font-medium text-slate-700">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Register Button (Desktop) */}
            <button
              onClick={() => onNavigateToLogin()}
              className="hidden sm:inline-flex px-3.5 py-1.5 sm:py-2 border-2 border-[#0052CC] text-[#0052CC] rounded text-xs font-bold hover:bg-blue-50 transition"
            >
              Register
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              title="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* ── Desktop Navigation Bar ── */}
        <div className="bg-[#0052CC] border-t border-blue-700 hidden md:block">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center space-x-0 overflow-x-auto no-scrollbar">
              {['Home', 'About Z-TRACS', 'Camera Network', 'Districts & Coverage', 'ANPR Analytics', 'Reports & Data', 'Help & Support'].map((item, i) => (
                <a
                  key={item}
                  href="#"
                  className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition border-b-2 flex-shrink-0 ${
                    i === 0
                      ? 'text-white border-amber-400 bg-blue-700'
                      : 'text-blue-100 border-transparent hover:text-white hover:bg-blue-700 hover:border-blue-400'
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer Menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0041A8] border-t border-blue-600 text-white p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search cameras, districts..."
                className="w-full pl-9 pr-3 py-2 bg-white text-slate-900 rounded text-xs focus:outline-none"
              />
            </div>

            {/* Nav Links */}
            <div className="grid grid-cols-2 gap-2 text-xs font-medium border-t border-blue-500/50 pt-3">
              {['Home', 'About Z-TRACS', 'Camera Network', 'Districts & Coverage', 'ANPR Analytics', 'Reports & Data', 'Help & Support'].map((item, i) => (
                <a key={item} href="#" className={`p-2 rounded hover:bg-blue-700 transition ${i === 0 ? 'bg-blue-800 font-bold text-amber-300' : 'text-blue-100'}`}>
                  {item}
                </a>
              ))}
            </div>

            {/* Quick Login Role Options */}
            <div className="border-t border-blue-500/50 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-200 mb-2">Quick Official Login:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'State Admin', hint: 'STATE_ADMIN' },
                  { label: 'District Admin', hint: 'DISTRICT_ADMIN' },
                  { label: 'Control Room', hint: 'CONTROL_ROOM_OPERATOR' },
                  { label: 'Police Officer', hint: 'POLICE_OFFICER' },
                ].map(r => (
                  <button
                    key={r.hint}
                    onClick={() => { setMobileMenuOpen(false); onNavigateToLogin(r.hint); }}
                    className="p-2 bg-blue-700 hover:bg-blue-600 rounded text-xs text-left font-semibold text-white flex items-center justify-between"
                  >
                    <span>{r.label}</span>
                    <ArrowRight className="w-3 h-3 text-amber-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ 3. NEWS TICKER ══ */}
      <div className="bg-[#CC2200] text-white text-[10px] sm:text-[11px] flex items-center overflow-hidden">
        <div className="bg-[#990000] px-3 sm:px-4 py-2 font-black uppercase tracking-wider whitespace-nowrap flex-shrink-0 flex items-center space-x-1.5">
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Latest Update</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div
            key={tickerIndex}
            className="py-2 px-3 sm:px-6 font-medium animate-pulse truncate"
          >
            {TICKER_ITEMS[tickerIndex]}
          </div>
        </div>
      </div>

      {/* ══ 4. HERO: ROLE GRID ══ */}
      <main id="main">
        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* Hero Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] sm:text-[11px] text-[#0052CC] font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Operational — 31 Live Feeds Active</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 mb-2 leading-tight">
              Centralised Video Surveillance Command
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto">
              Select your official role to access the Z-TRACS surveillance dashboard
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0 rounded-xl overflow-hidden sm:border border-slate-200 shadow-lg mb-8">
            {ROLE_CARDS.map((card, i) => (
              <button
                key={card.id}
                onClick={() => onNavigateToLogin(card.id)}
                className={`relative group overflow-hidden text-left rounded-xl sm:rounded-none border border-slate-200 sm:border-0 ${
                  i < 3 ? 'sm:border-r border-slate-700/30' : ''
                }`}
                style={{ minHeight: 240 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)' }}></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-5">
                  <div>
                    <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider rounded mb-2">
                      {card.count}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base sm:text-lg leading-tight mb-0.5">{card.title.toUpperCase()}</h3>
                    <p className="text-white/70 text-[11px] mb-2">{card.titleGu}</p>
                    <p className="text-white/80 text-[11px] mb-3 line-clamp-2">{card.desc}</p>
                    <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] font-bold group-hover:text-white transition">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Secure Login</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Live Stats Strip ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-xs flex items-center space-x-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color + '15' }}>
                  <s.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 font-mono leading-tight">{s.value}</div>
                  <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ 5. ABOUT + FAQ + USER MANUALS ══ */}
        <div className="bg-slate-50 border-y border-slate-200 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">

            {/* Left: About + Mission + Vision */}
            <div>
              <h2 className="text-[11px] font-black text-[#0052CC] uppercase tracking-widest mb-1">About Z-TRACS</h2>
              <div className="w-12 h-1 bg-amber-500 mb-4 rounded"></div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                Z-TRACS is the Government of Gujarat's unified platform for centralised CCTV surveillance, ANPR analytics, and video intelligence across all 33 districts. It provides real-time monitoring, AI-driven vehicle tracking, and court-compliant evidence management.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-xs sm:text-sm text-[#0052CC]">MISSION</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mt-0.5">
                      Z-TRACS aims to make <span className="text-[#0052CC] font-semibold">public safety monitoring simpler, faster, and more accountable</span> by using technology to connect the Government directly with field law enforcement.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">👁</span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-xs sm:text-sm text-[#0052CC]">VISION</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mt-0.5">
                      To establish a <span className="text-[#0052CC] font-semibold">transparent, efficient, and technologically advanced</span> surveillance command platform for seamless public safety delivery across Gujarat.
                    </p>
                  </div>
                </div>
              </div>

              {/* Map visual */}
              <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center space-x-4 sm:space-x-5 shadow-xs">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
                  <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF9933] opacity-60" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 mb-1">Gujarat State Coverage</div>
                  <div className="flex flex-wrap gap-1">
                    {['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', '+ 28 More'].map(d => (
                      <span key={d} className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-[9px] sm:text-[10px] text-[#0052CC] font-semibold rounded-full">{d}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: FAQ + User Manuals */}
            <div className="space-y-6">
              {/* FAQ */}
              <div>
                <h2 className="text-[11px] font-black text-[#0052CC] uppercase tracking-widest mb-1">Frequently Asked Questions</h2>
                <div className="w-12 h-1 bg-amber-500 mb-4 rounded"></div>
                <div className="space-y-2">
                  {FAQ_ITEMS.map((f, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${openFaq === i ? 'bg-[#0052CC] text-white' : 'hover:bg-slate-50 text-slate-800'}`}
                      >
                        <span className="text-xs font-semibold pr-2">{f.q}</span>
                        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                      </button>
                      {openFaq === i && (
                        <div className="px-4 py-3 text-xs text-slate-600 leading-relaxed bg-blue-50 border-t border-blue-100">
                          {f.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* User Manuals */}
              <div>
                <h2 className="text-[11px] font-black text-slate-700 uppercase tracking-widest mb-1">User Manuals</h2>
                <div className="w-12 h-1 bg-amber-500 mb-4 rounded"></div>
                <div className="space-y-2">
                  {USER_MANUALS.map(m => (
                    <a
                      key={m.title}
                      href="#"
                      className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-[#0052CC] hover:bg-blue-50 transition group shadow-xs"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0052CC] flex items-center justify-center flex-shrink-0">
                        <m.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-700 group-hover:text-[#0052CC] transition flex-1">{m.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052CC] transition shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ 6. QUICK LINKS / SUPPORT CARDS ══ */}
        <div className="py-8 sm:py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {QUICK_LINKS.map(ql => (
                <a
                  key={ql.label}
                  href="#"
                  className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col items-center text-center hover:shadow-md hover:border-slate-300 transition"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform shrink-0" style={{ borderColor: ql.color, color: ql.color }}>
                    <ql.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="font-black text-slate-800 text-xs sm:text-sm mb-0.5">{ql.label}</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500">{ql.sub}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ══ 7. PARTNER LOGOS ══ */}
        <div className="bg-slate-50 border-y border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-8">
              {PARTNER_LOGOS.map(p => (
                <div key={p.name} className="flex flex-col items-center space-y-1 group cursor-pointer">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-xs group-hover:border-[#0052CC] transition">
                    <span className="text-[10px] font-black text-slate-600 group-hover:text-[#0052CC] transition text-center leading-tight">{p.abbr}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 text-center max-w-[60px] leading-tight">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ══ 8. FOOTER ══ */}
      <footer className="bg-[#0d1f3c]">

        {/* Social Media Bar */}
        <div className="border-b border-[#1a2f55] py-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-slate-300 font-semibold">
              <span>Follow Us :</span>
            </div>
            <div className="flex items-center space-x-4">
              {['Instagram', 'Facebook', 'X', 'LinkedIn'].map(s => (
                <a key={s} href="#" className="text-slate-400 hover:text-white text-[11px] font-medium transition">{s}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white p-2 flex-shrink-0">
                <div className="w-full h-full bg-[#0052CC] rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <div className="text-white font-black text-base">Z-TRACS</div>
                <div className="text-slate-400 text-[10px]">Govt. of Gujarat</div>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              © 2026. This is the official website of the Government of Gujarat. Designed, Developed, and Maintained by – NIC Gujarat.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {['Website Policy', 'Copyright Policy', 'Sitemap'].map(l => (
                <li key={l}><a href="#" className="text-slate-400 hover:text-white text-[11px] transition">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Policies</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms & Conditions', 'Hyperlinking Policy', 'FAQ'].map(l => (
                <li key={l}><a href="#" className="text-slate-400 hover:text-white text-[11px] transition">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Contact</h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>📍 Police HQ, Sector 18, Gandhinagar</li>
              <li>📞 Helpline: 1800-233-5500</li>
              <li>📧 support@ztracsgujarat.gov.in</li>
              <li className="pt-1">
                <span className="px-2 py-0.5 bg-emerald-900/40 border border-emerald-700/50 text-emerald-400 rounded text-[10px] font-bold">SYSTEM ONLINE</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1a2f55] bg-[#090f1e] py-3">
          {/* GOI tricolor */}
          <div className="flex h-1 w-full mb-3">
            <div className="flex-1" style={{ background: '#FF9933' }}></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1" style={{ background: '#138808' }}></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 text-center sm:text-left">
            <span>© 2026 Gujarat Police Department & Government of Gujarat. All rights reserved.</span>
            <div className="flex items-center justify-center space-x-3">
              {['Privacy Policy', 'Terms of Use', 'Accessibility', 'Site Map'].map((l, i) => (
                <React.Fragment key={l}>
                  {i > 0 && <span>|</span>}
                  <a href="#" className="hover:text-slate-300 transition">{l}</a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
