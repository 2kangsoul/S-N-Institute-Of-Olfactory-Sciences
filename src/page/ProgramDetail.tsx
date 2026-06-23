// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import apiClient from "../config/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type Program = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  level: "BEGINNER" | "ADVANCED" | "EXPERT";
  slug: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  order: number;
  createdAt: string;
};

type Module = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  location: string | null;
  scheduleDate: string | null;
  durationHour: number | null;
  maxParticipant: number | null;
  notes: string | null;
};

// ─── Hook: Fade-in on scroll ──────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = "" }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Parallax Aurora ──────────────────────────────────────────────────────────
function ParallaxAurora() {
  const { scrollY } = useScroll();
  const y1 = useSpring(useTransform(scrollY, [0, 2000], [0, -120]), {
    stiffness: 30,
    damping: 25,
  });
  const y2 = useSpring(useTransform(scrollY, [0, 2000], [0, -220]), {
    stiffness: 25,
    damping: 20,
  });
  const y3 = useSpring(useTransform(scrollY, [0, 2000], [0, -320]), {
    stiffness: 20,
    damping: 18,
  });
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[10%] left-[30%] w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[130px]"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/15 rounded-full blur-[150px]"
      />
    </div>
  );
}

// ─── Level config ─────────────────────────────────────────────────────────────
const levelConfig = {
  BEGINNER: {
    label: "Beginner",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.3)",
  },
  ADVANCED: {
    label: "Advanced",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
  },
  EXPERT: {
    label: "Expert",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.3)",
  },
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

// ─── Main Component ───────────────────────────────────────────────────────────
const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeModuleIdx, setActiveModuleIdx] = useState<number | null>(null);

  // Timeline scroll progress
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const height = timelineRef.current.offsetHeight;
      const scrolled = window.innerHeight - rect.top;
      setTimelineProgress(
        Math.max(
          0,
          Math.min(1, scrolled / (height + window.innerHeight * 0.3)),
        ),
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const progRes = await apiClient.get(`/programs/slug/${slug}`);
        const prog = progRes.data?.data;
        if (!prog) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setProgram(prog);

        const modsRes = await apiClient.get(`/programs/${prog.id}/modules`);
        setModules(modsRes.data?.data || []);
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-300 rounded-full"
        />
      </div>
    );

  if (notFound || !program)
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <p
          className="text-white text-2xl"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Program tidak ditemukan.
        </p>
        <Link
          to="/program"
          className="text-xs uppercase tracking-widest text-zinc-400 border border-zinc-700 px-6 py-3 hover:border-white transition-all duration-300"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ← Kembali ke Program
        </Link>
      </div>
    );

  const level = levelConfig[program.level] || levelConfig.BEGINNER;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        .ff-display { font-family: 'Playfair Display', serif; }
        .ff-body { font-family: 'Inter', system-ui, sans-serif; }
        .metallic { background: linear-gradient(135deg, #f4f4f5, #a1a1aa, #f4f4f5); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .transition-std { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <main className="ff-body bg-slate-950 text-[#e5e1e4] min-h-screen relative overflow-x-hidden">
        <ParallaxAurora />

        {/* ── BACK BUTTON ─────────────────────────────────────────────── */}
        <div className="relative z-10 px-6 md:px-16 pt-10">
          <Link
            to="/program"
            className="ff-body inline-flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-widest hover:text-white transition-all duration-300"
          >
            ← Kembali ke Program
          </Link>
        </div>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section className="relative z-10 px-6 md:px-16 pt-12 pb-20 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Info */}
            <div>
              <FadeIn delay={0}>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className="ff-body text-[10px] font-semibold uppercase tracking-[0.25em] px-3 py-1.5 border"
                    style={{
                      color: level.color,
                      backgroundColor: level.bg,
                      borderColor: level.border,
                    }}
                  >
                    {level.label}
                  </span>
                  <span className="ff-body text-[10px] text-zinc-600 uppercase tracking-widest">
                    Program {program.order} dari 6
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={80}>
                <h1 className="ff-display text-3xl md:text-4xl lg:text-5xl font-semibold metallic leading-tight tracking-tight mb-4">
                  {program.title}
                </h1>
              </FadeIn>

              <FadeIn delay={140}>
                <p className="ff-body text-base text-zinc-400 italic mb-8">
                  {program.subtitle}
                </p>
              </FadeIn>

              <FadeIn delay={180}>
                <p className="ff-body text-sm text-zinc-400 leading-relaxed mb-10 max-w-lg">
                  {program.description}
                </p>
              </FadeIn>

              <FadeIn delay={220}>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Price */}
                  <div className="bg-zinc-900/60 border border-zinc-800 px-6 py-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.07)]">
                    <p className="ff-body text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                      Biaya Program
                    </p>
                    <p className="ff-display text-2xl font-medium metallic">
                      {program.price
                        ? formatPrice(program.price)
                        : "Hubungi Kami"}
                    </p>
                  </div>
                  {/* CTA */}
                  <button className="relative px-8 py-4 bg-zinc-200 text-black font-semibold rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs uppercase tracking-widest">
                    Daftar Sekarang
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right: Image */}
            <FadeIn delay={100} className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[40px] rounded-br-[40px] rounded-tr-lg rounded-bl-lg border border-zinc-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.07)]">
                {program.imageUrl ? (
                  <img
                    src={program.imageUrl}
                    alt={program.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-slate-900 flex items-center justify-center">
                    <span className="ff-display text-6xl metallic opacity-30">
                      {program.order}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                {/* Level badge on image */}
                <div
                  className="absolute top-5 left-5 ff-body text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 backdrop-blur-sm border"
                  style={{
                    color: level.color,
                    backgroundColor: level.bg,
                    borderColor: level.border,
                  }}
                >
                  {level.label}
                </div>
              </div>
              {/* Decorative glow behind image */}
              <div
                className="absolute inset-0 -z-10 blur-[60px] opacity-20 rounded-full"
                style={{ backgroundColor: level.color }}
              />
            </FadeIn>
          </div>
        </section>

        {/* ── DIVIDER ─────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* ── STATS BAR ───────────────────────────────────────────────── */}
        <section className="relative z-10 py-10 px-6 md:px-16 max-w-7xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Modul",
                  value:
                    modules.length > 0 ? `${modules.length} Modul` : "6 Modul",
                },
                { label: "Level", value: level.label },
                { label: "Format", value: "Offline · Lab" },
                { label: "Sertifikasi", value: "Kompetensi Resmi" },
              ].map((stat, i) => (
                <FadeIn key={stat.label} delay={i * 60}>
                  <div className="bg-zinc-900/40 border border-zinc-800 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.07)] rounded-lg">
                    <p className="ff-body text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                      {stat.label}
                    </p>
                    <p className="ff-display text-lg font-medium text-white">
                      {stat.value}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── DIVIDER ─────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* ── MODULES TIMELINE ────────────────────────────────────────── */}
        {modules.length > 0 && (
          <section className="relative z-10 py-20 px-6 md:px-16 max-w-7xl mx-auto">
            <FadeIn>
              <div className="mb-14">
                <span className="ff-body text-[10px] uppercase tracking-[0.4em] text-zinc-500 block mb-3">
                  Silabus Program
                </span>
                <h2 className="ff-display text-2xl md:text-3xl font-medium metallic tracking-tight">
                  Modul Pembelajaran
                </h2>
                <p className="ff-body text-sm text-zinc-400 mt-3 max-w-lg leading-relaxed">
                  Setiap sesi dirancang progresif — membangun keahlian secara
                  sistematis dari fondasi hingga keahlian lanjutan.
                </p>
              </div>
            </FadeIn>

            <div ref={timelineRef} className="relative">
              {/* Background line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-zinc-800" />
              {/* Progress line */}
              <div
                className="absolute left-6 md:left-8 top-0 w-[1px] bg-gradient-to-b from-zinc-300 via-zinc-400 to-transparent transition-all duration-150"
                style={{ height: `${timelineProgress * 100}%` }}
              />

              <div className="flex flex-col">
                {modules.map((mod, i) => {
                  const activated =
                    timelineProgress > (i / modules.length) * 0.85;
                  const isOpen = activeModuleIdx === i;
                  return (
                    <FadeIn key={mod.id} delay={i * 60}>
                      <div
                        className="relative flex items-start gap-8 pb-10 cursor-pointer group"
                        onClick={() => setActiveModuleIdx(isOpen ? null : i)}
                      >
                        {/* Node */}
                        <div className="relative flex-shrink-0 mt-1">
                          <div
                            className="relative w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ml-[14px] md:ml-[18px]"
                            style={{
                              borderColor: activated ? "#d4d4d8" : "#3f3f46",
                              backgroundColor: activated
                                ? "rgba(212,212,216,0.1)"
                                : "transparent",
                              boxShadow: isOpen
                                ? "0 0 14px rgba(212,212,216,0.6), 0 0 28px rgba(212,212,216,0.2)"
                                : activated
                                  ? "0 0 6px rgba(212,212,216,0.3)"
                                  : "none",
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                              style={{
                                backgroundColor: activated
                                  ? "#f4f4f5"
                                  : "#52525b",
                              }}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div
                          className="flex-1 transition-all duration-300"
                          style={{ opacity: activated ? 1 : 0.4 }}
                        >
                          {/* Header row */}
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <div className="flex items-center gap-3 mb-1.5">
                                <span className="ff-body text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                  Modul {mod.order}
                                </span>
                                {mod.durationHour && (
                                  <span className="ff-body text-[10px] text-zinc-600 border border-zinc-800 px-2 py-0.5">
                                    {mod.durationHour} Jam
                                  </span>
                                )}
                                <span
                                  className="ff-body text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border"
                                  style={{
                                    color:
                                      mod.status === "PUBLISHED"
                                        ? "#10b981"
                                        : "#71717a",
                                    borderColor:
                                      mod.status === "PUBLISHED"
                                        ? "rgba(16,185,129,0.3)"
                                        : "#27272a",
                                    backgroundColor:
                                      mod.status === "PUBLISHED"
                                        ? "rgba(16,185,129,0.08)"
                                        : "transparent",
                                  }}
                                >
                                  {mod.status === "PUBLISHED"
                                    ? "Tersedia"
                                    : mod.status === "DRAFT"
                                      ? "Segera"
                                      : "Arsip"}
                                </span>
                              </div>
                              <h3 className="ff-display text-lg md:text-xl font-medium text-white group-hover:text-zinc-200 transition-colors duration-300">
                                {mod.title}
                              </h3>
                            </div>
                            {/* Expand icon */}
                            <motion.span
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-zinc-500 text-lg flex-shrink-0 mt-1"
                            >
                              ↓
                            </motion.span>
                          </div>

                          {/* Expandable detail */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.35,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="pt-3 pb-4 border-t border-zinc-800 mt-3">
                                  {mod.description && (
                                    <p className="ff-body text-sm text-zinc-400 leading-relaxed mb-4">
                                      {mod.description}
                                    </p>
                                  )}
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {mod.location && (
                                      <div>
                                        <p className="ff-body text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
                                          Lokasi
                                        </p>
                                        <p className="ff-body text-sm text-zinc-300">
                                          {mod.location}
                                        </p>
                                      </div>
                                    )}
                                    {mod.scheduleDate && (
                                      <div>
                                        <p className="ff-body text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
                                          Jadwal
                                        </p>
                                        <p className="ff-body text-sm text-zinc-300">
                                          {new Date(
                                            mod.scheduleDate,
                                          ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </p>
                                      </div>
                                    )}
                                    {mod.maxParticipant && (
                                      <div>
                                        <p className="ff-body text-[10px] uppercase tracking-widest text-zinc-600 mb-1">
                                          Maks. Peserta
                                        </p>
                                        <p className="ff-body text-sm text-zinc-300">
                                          {mod.maxParticipant} orang
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  {mod.notes && (
                                    <div className="mt-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
                                      <p className="ff-body text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                                        Catatan
                                      </p>
                                      <p className="ff-body text-xs text-zinc-400 leading-relaxed">
                                        {mod.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── DIVIDER ─────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* ── PRICING CTA ─────────────────────────────────────────────── */}
        <section className="relative z-10 py-20 px-6 md:px-16">
          <FadeIn>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900/80 to-slate-950/80 border border-zinc-800 rounded-2xl p-10 md:p-16 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.07)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div
                  className="absolute top-[-30%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-10"
                  style={{ backgroundColor: level.color }}
                />
              </div>
              <div className="relative z-10">
                <span className="ff-body text-[10px] uppercase tracking-[0.4em] text-zinc-500 block mb-4">
                  Investasi Karir Anda
                </span>
                <h2 className="ff-display text-3xl md:text-5xl font-semibold metallic tracking-tight mb-4 leading-tight">
                  {program.price ? formatPrice(program.price) : "Hubungi Kami"}
                </h2>
                <p className="ff-body text-sm text-zinc-400 max-w-md mx-auto mb-10 leading-relaxed">
                  Satu investasi untuk membuka pintu karir di industri wewangian
                  global. Termasuk akses lab, materi, dan sertifikasi resmi.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="relative px-10 py-4 bg-zinc-200 text-black font-semibold rounded-full shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs uppercase tracking-widest">
                    Daftar Program Ini
                  </button>
                  <Link
                    to="/program"
                    className="relative px-10 py-4 border border-zinc-700 text-zinc-300 rounded-full hover:border-white hover:text-white transition-all duration-300 ff-body text-xs uppercase tracking-widest"
                  >
                    Lihat Program Lain
                  </Link>
                </div>
                <p className="ff-body text-[10px] text-zinc-600 uppercase tracking-widest mt-8">
                  Konsultasi gratis tersedia · Respon dalam 24 jam
                </p>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </>
  );
};

export default ProgramDetail;
