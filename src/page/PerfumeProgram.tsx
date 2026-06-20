// @ts-nocheck
/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useScroll,
} from "framer-motion";

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

// ─── Parallax Aurora Component ───────────────────────────────────────────────
function ParallaxAurora() {
  const { scrollY } = useScroll();

  // Setiap blob bergerak dengan kecepatan berbeda — ilusi kedalaman 3D
  // Blob 1 (biru, depan): paling lambat — terasa paling jauh
  const y1 = useTransform(scrollY, [0, 3000], [0, -180]);
  // Blob 2 (amber, tengah): kecepatan sedang
  const y2 = useTransform(scrollY, [0, 3000], [0, -300]);
  // Blob 3 (ungu, belakang): paling cepat — terasa paling dekat
  const y3 = useTransform(scrollY, [0, 3000], [0, -450]);

  // Spring untuk gerakan yang lebih smooth dan natural
  const smooth1 = useSpring(y1, { stiffness: 30, damping: 25 });
  const smooth2 = useSpring(y2, { stiffness: 25, damping: 20 });
  const smooth3 = useSpring(y3, { stiffness: 20, damping: 18 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Blob 1 — Biru (layer paling jauh, parallax paling lambat) */}
      <motion.div
        style={{ y: smooth1 }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]"
      />
      {/* Blob 2 — Amber (layer tengah) */}
      <motion.div
        style={{ y: smooth2 }}
        className="absolute top-[10%] left-[30%] w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[130px]"
      />
      {/* Blob 3 — Ungu (layer paling dekat, parallax paling cepat) */}
      <motion.div
        style={{ y: smooth3 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-900/15 rounded-full blur-[150px]"
      />
      {/* Bonus: blob ke-4 biru muda bergerak horizontal saat scroll */}
      <motion.div
        style={{
          y: useSpring(useTransform(scrollY, [0, 3000], [0, -220]), {
            stiffness: 35,
            damping: 22,
          }),
          x: useSpring(useTransform(scrollY, [0, 3000], [0, 80]), {
            stiffness: 35,
            damping: 22,
          }),
        }}
        className="absolute top-[50%] right-[-5%] w-[30vw] h-[30vw] bg-indigo-900/10 rounded-full blur-[100px]"
      />
    </div>
  );
}

// ─── Floating Particles Component ────────────────────────────────────────────
const HexagonSVG = ({ size = 120, opacity = 0.06 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
  >
    <polygon
      points="60,8 104,32 104,88 60,112 16,88 16,32"
      stroke="#d4d4d8"
      strokeWidth="1"
      fill="none"
    />
    <polygon
      points="60,24 90,40 90,80 60,96 30,80 30,40"
      stroke="#d4d4d8"
      strokeWidth="0.5"
      fill="none"
    />
    <circle cx="60" cy="60" r="3" fill="#d4d4d8" fillOpacity="0.3" />
    <line x1="60" y1="57" x2="60" y2="27" stroke="#d4d4d8" strokeWidth="0.5" />
    <line x1="60" y1="63" x2="60" y2="93" stroke="#d4d4d8" strokeWidth="0.5" />
    <line x1="57" y1="58" x2="31" y2="43" stroke="#d4d4d8" strokeWidth="0.5" />
    <line x1="63" y1="58" x2="89" y2="43" stroke="#d4d4d8" strokeWidth="0.5" />
    <line x1="57" y1="62" x2="31" y2="77" stroke="#d4d4d8" strokeWidth="0.5" />
    <line x1="63" y1="62" x2="89" y2="77" stroke="#d4d4d8" strokeWidth="0.5" />
    <circle
      cx="60"
      cy="24"
      r="3"
      stroke="#d4d4d8"
      strokeWidth="0.8"
      fill="none"
    />
    <circle
      cx="60"
      cy="96"
      r="3"
      stroke="#d4d4d8"
      strokeWidth="0.8"
      fill="none"
    />
    <circle
      cx="30"
      cy="40"
      r="3"
      stroke="#d4d4d8"
      strokeWidth="0.8"
      fill="none"
    />
    <circle
      cx="90"
      cy="40"
      r="3"
      stroke="#d4d4d8"
      strokeWidth="0.8"
      fill="none"
    />
    <circle
      cx="30"
      cy="80"
      r="3"
      stroke="#d4d4d8"
      strokeWidth="0.8"
      fill="none"
    />
    <circle
      cx="90"
      cy="80"
      r="3"
      stroke="#d4d4d8"
      strokeWidth="0.8"
      fill="none"
    />
  </svg>
);

const PetalSVG = ({ size = 100, opacity = 0.05 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity }}
  >
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <ellipse
        key={angle}
        cx="50"
        cy="50"
        rx="12"
        ry="28"
        stroke="#d4d4d8"
        strokeWidth="0.6"
        fill="none"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
    <circle
      cx="50"
      cy="50"
      r="4"
      stroke="#d4d4d8"
      strokeWidth="0.8"
      fill="none"
    />
    <circle cx="50" cy="50" r="1.5" fill="#d4d4d8" fillOpacity="0.4" />
  </svg>
);

const particlesData = [
  {
    id: 1,
    type: "hex",
    size: 280,
    opacity: 0.05,
    top: "5%",
    left: "3%",
    right: null,
    rotate: 15,
    floatY: 18,
    floatDur: 7,
    ps: 0.015,
  },
  {
    id: 2,
    type: "petal",
    size: 220,
    opacity: 0.06,
    top: "15%",
    left: null,
    right: "4%",
    rotate: -20,
    floatY: 14,
    floatDur: 9,
    ps: 0.02,
  },
  {
    id: 3,
    type: "hex",
    size: 180,
    opacity: 0.04,
    top: "40%",
    left: "1%",
    right: null,
    rotate: 30,
    floatY: 20,
    floatDur: 11,
    ps: 0.01,
  },
  {
    id: 4,
    type: "petal",
    size: 260,
    opacity: 0.05,
    top: "55%",
    left: null,
    right: "2%",
    rotate: 10,
    floatY: 16,
    floatDur: 8,
    ps: 0.018,
  },
  {
    id: 5,
    type: "hex",
    size: 200,
    opacity: 0.04,
    top: "75%",
    left: "5%",
    right: null,
    rotate: -10,
    floatY: 22,
    floatDur: 10,
    ps: 0.012,
  },
  {
    id: 6,
    type: "petal",
    size: 160,
    opacity: 0.06,
    top: "85%",
    left: null,
    right: "6%",
    rotate: 25,
    floatY: 12,
    floatDur: 6,
    ps: 0.022,
  },
];

function FloatingParticles() {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });
  const [smooth, setSmooth] = React.useState({ x: 0, y: 0 });
  const animRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let frame;
    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      setSmooth((prev) => ({
        x: lerp(prev.x, mouse.x, 0.05),
        y: lerp(prev.y, mouse.y, 0.05),
      }));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [mouse]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particlesData.map((p) => {
        const tx = smooth.x * p.ps;
        const ty = smooth.y * p.ps;
        const posStyle = {
          position: "absolute",
          top: p.top,
          ...(p.left ? { left: p.left } : { right: p.right }),
          transform: `translate(${tx}px, ${ty}px) rotate(${p.rotate}deg)`,
          transition: "transform 0.1s linear",
        };
        return (
          <motion.div
            key={p.id}
            style={posStyle}
            animate={{ y: [0, p.floatY, 0] }}
            transition={{
              duration: p.floatDur,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {p.type === "hex" ? (
              <HexagonSVG size={p.size} opacity={p.opacity} />
            ) : (
              <PetalSVG size={p.size} opacity={p.opacity} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Fade Wrapper ─────────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const foundationPrograms = [
  {
    no: "01",
    title: "Sertifikasi Kompetensi Kompounding",
    desc: "Pelajari teknik pencampuran presisi dan manajemen bahan baku olfaktori sesuai standar laboratorium internasional.",
  },
  {
    no: "02",
    title: "Penjaminan Mutu Olfaktori",
    desc: "Kuasai protokol Quality Control untuk memastikan integritas aroma dan stabilitas formulasi dalam skala industri.",
  },
  {
    no: "03",
    title: "Evaluasi Sensorik Dasar",
    desc: "Asah indra penciuman untuk mendeteksi profil aroma kompleks melalui metodologi deskriptif dan diskriminatif.",
  },
];

const advancedPrograms = [
  {
    no: "04",
    title: "Rekayasa Formulasi Lanjut",
    desc: "Perancangan molekuler aroma untuk aplikasi Fine Fragrance dan Personal Care dengan pendekatan kimia hijau.",
  },
  {
    no: "05",
    title: "Inovasi Desain Olfaktori Lanjut",
    desc: "Integrasi AI dalam penciptaan wewangian dan strategi branding berbasis neuro-olfaktori untuk pasar global.",
  },
];

const methods = [
  {
    icon: "🔬",
    title: "Kurikulum Praktis Industri",
    desc: "Materi yang disusun bersama pakar industri parfum global untuk memastikan relevansi keahlian di dunia kerja.",
  },
  {
    icon: "🎓",
    title: "Mentor Pakar Berpengalaman",
    desc: "Bimbingan intensif dari Senior Perfumer dan Olfactory Technologist dengan pengalaman lebih dari 15 tahun.",
  },
  {
    icon: "🧬",
    title: "Fasilitas Lab Terstandar",
    desc: "Akses ke laboratorium formulasi dan kromatografi gas (GC-MS) tercanggih untuk simulasi produksi nyata.",
  },
];

const pricingPlans = [
  {
    label: "EARLY BIRD",
    price: "Rp 12.5M",
    desc: "Terbatas untuk 5 pendaftar pertama per angkatan.",
    popular: false,
  },
  {
    label: "TERM 1 PAYMENT",
    price: "Rp 15.0M",
    desc: "Cicilan 3x dengan biaya pendaftaran awal terjangkau.",
    popular: true,
  },
  {
    label: "TERM 2 PAYMENT",
    price: "Rp 16.5M",
    desc: "Pilihan pembayaran bertahap selama masa studi.",
    popular: false,
  },
  {
    label: "HARGA NORMAL",
    price: "Rp 18.0M",
    desc: "Pembayaran penuh di muka sebelum kelas dimulai.",
    popular: false,
  },
];

const partners = [
  "GOJEK",
  "TOKOPEDIA",
  "AJAIB",
  "SHOPEE",
  "TIKTOK",
  "HALODOC",
  "GIVAUDAN",
  "IFF",
  "SYMRISE",
  "FIRMENICH",
];

const faqs = [
  {
    q: "Apakah saya membutuhkan latar belakang pendidikan Kimia?",
    a: "Tidak selalu. Untuk level Beginner, kami terbuka untuk semua latar belakang pendidikan. Namun, untuk program Advanced dan Magister, pengetahuan dasar kimia organik akan sangat membantu proses belajar Anda.",
  },
  {
    q: "Bagaimana sistem pengiriman bahan praktik untuk kelas Online?",
    a: 'Setiap peserta Online akan menerima "Olfactory Lab Kit" yang berisi 50+ raw materials, timbangan presisi, dan botol laboratorium yang dikirimkan langsung ke alamat Anda sebelum kelas dimulai.',
  },
  {
    q: "Apakah sertifikat SNIOS diakui secara internasional?",
    a: "Ya, SNIOS bekerja sama dengan berbagai aliansi industri fragrance global. Lulusan kami telah bekerja di berbagai perusahaan multinasional di Singapura, Perancis, dan Amerika Serikat.",
  },
  {
    q: "Apakah tersedia opsi beasiswa bagi mahasiswa berprestasi?",
    a: 'Kami menyediakan "Olfactory Excellence Grant" bagi 2 kandidat terbaik di setiap angkatan yang mencakup potongan biaya hingga 50% untuk level Advanced.',
  },
];

// ─── Timeline Data ────────────────────────────────────────────────────────────
const timelineModules = [
  {
    module: "Modul 1",
    title: "Pengantar Dunia Olfaktori",
    duration: "2 Minggu",
    desc: "Memahami sejarah, terminologi, dan anatomi penciuman manusia. Pengenalan 20 raw material dasar dan cara membaca formula sederhana.",
    tags: ["Teori", "Pengenalan"],
  },
  {
    module: "Modul 2",
    title: "Kimia Aroma & Raw Materials",
    duration: "3 Minggu",
    desc: "Klasifikasi bahan kimia wewangian: Aldehida, Musks, Terpenes, dan Lactones. Sesi lab GC-MS pertama untuk analisis komponen aroma.",
    tags: ["Lab", "Kimia"],
  },
  {
    module: "Modul 3",
    title: "Teknik Kompounding Presisi",
    duration: "3 Minggu",
    desc: "Praktek pencampuran skala laboratorium menggunakan timbangan analitik. Standar kebersihan dan keselamatan kerja di ruang formulasi.",
    tags: ["Praktek", "Lab"],
  },
  {
    module: "Modul 4",
    title: "Struktur Piramida Aroma",
    duration: "2 Minggu",
    desc: "Membangun komposisi Top, Heart, dan Base notes yang harmonis. Workshop merancang brief aroma pertama Anda dari konsep hingga produk.",
    tags: ["Desain", "Workshop"],
  },
  {
    module: "Modul 5",
    title: "Evaluasi Sensorik Lanjut",
    duration: "3 Minggu",
    desc: "Metodologi blind test, panel evaluation, dan discriminative testing. Mengembangkan kemampuan deskripsi aroma secara ilmiah dan artistik.",
    tags: ["Sensorik", "Evaluasi"],
  },
  {
    module: "Modul 6",
    title: "Formulasi & Capstone Project",
    duration: "3 Minggu",
    desc: "Merancang dan mempresentasikan formulasi parfum orisinal di hadapan panel pakar industri. Persiapan sertifikasi kompetensi akhir.",
    tags: ["Proyek", "Sertifikasi"],
  },
];

// ─── Timeline Section Component ───────────────────────────────────────────────
function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = windowHeight - rect.top;
      const progress = Math.max(
        0,
        Math.min(1, scrolled / (sectionHeight + windowHeight * 0.3)),
      );
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-4 md:px-16 py-16 max-w-7xl mx-auto relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
        {/* ─── KIRI: Timeline (3 kolom) ─────────────────────── */}
        <div className="lg:col-span-3">
          {/* Header */}
          <FadeIn>
            <div className="mb-12">
              <span className="ff-body text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-500 block mb-3">
                Jalur Silabus
              </span>
              <h2 className="ff-display text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight">
                Perjalanan Pembelajaran Terstruktur
              </h2>
              <p className="ff-body text-sm text-zinc-400 mt-4 max-w-md leading-relaxed">
                Setiap modul dirancang sebagai tahapan yang saling terhubung —
                dari fondasi sensorik hingga penciptaan karya orisinal.
              </p>
            </div>
          </FadeIn>

          {/* Timeline */}
          <div className="relative">
            {/* Background line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-zinc-800" />

            {/* Glowing progress line */}
            <div
              className="absolute left-6 md:left-8 top-0 w-[1px] bg-gradient-to-b from-zinc-300 via-zinc-400 to-transparent transition-all duration-100"
              style={{ height: `${scrollProgress * 100}%` }}
            />

            {/* Modules */}
            <div className="flex flex-col gap-0">
              {timelineModules.map((mod, i) => {
                const nodeActivated =
                  scrollProgress > (i / timelineModules.length) * 0.85;
                const isHovered = hoveredIndex === i;

                return (
                  <FadeIn key={mod.module} delay={i * 60}>
                    <div
                      className="relative flex items-start gap-6 md:gap-8 pb-12 group cursor-default"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Node */}
                      <div className="relative flex-shrink-0 mt-1">
                        <div
                          className="absolute inset-0 rounded-full transition-all duration-500"
                          style={{
                            boxShadow: isHovered
                              ? "0 0 0 6px rgba(212,212,216,0.08), 0 0 20px rgba(212,212,216,0.2)"
                              : "none",
                            borderRadius: "50%",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                        <div
                          className="relative w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ml-[14px] md:ml-[18px]"
                          style={{
                            borderColor: nodeActivated ? "#d4d4d8" : "#3f3f46",
                            backgroundColor: nodeActivated
                              ? "rgba(212,212,216,0.1)"
                              : "transparent",
                            boxShadow: isHovered
                              ? "0 0 12px rgba(212,212,216,0.5), 0 0 24px rgba(212,212,216,0.2)"
                              : nodeActivated
                                ? "0 0 6px rgba(212,212,216,0.3)"
                                : "none",
                          }}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                            style={{
                              backgroundColor: nodeActivated
                                ? "#f4f4f5"
                                : "#52525b",
                            }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 pb-2 transition-all duration-300"
                        style={{ opacity: nodeActivated ? 1 : 0.4 }}
                      >
                        <div className="flex items-center gap-4 mb-2">
                          <span className="ff-body text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            {mod.module}
                          </span>
                          <span className="ff-body text-[10px] text-zinc-600 border border-zinc-800 px-2 py-0.5">
                            {mod.duration}
                          </span>
                        </div>

                        <h3
                          className="ff-display text-lg md:text-xl font-medium mb-2 transition-all duration-300"
                          style={{
                            color: isHovered
                              ? "#f4f4f5"
                              : nodeActivated
                                ? "#e4e4e7"
                                : "#71717a",
                          }}
                        >
                          {mod.title}
                        </h3>

                        <p className="ff-body text-sm text-zinc-400 leading-relaxed mb-3">
                          {mod.desc}
                        </p>

                        <div className="flex gap-2 flex-wrap">
                          {mod.tags.map((tag) => (
                            <span
                              key={tag}
                              className="ff-body text-[10px] font-semibold uppercase tracking-widest px-3 py-1 border transition-all duration-300"
                              style={{
                                borderColor: isHovered ? "#52525b" : "#27272a",
                                color: isHovered ? "#d4d4d8" : "#52525b",
                                backgroundColor: isHovered
                                  ? "rgba(39,39,42,0.5)"
                                  : "transparent",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── KANAN: Metode Pembelajaran (2 kolom, sticky) ─── */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <FadeIn delay={100}>
            <div className="bg-slate-950/40 border border-zinc-800 rounded-2xl p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <div className="mb-8">
                <span className="ff-body text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-500 block mb-3">
                  Metode
                </span>
                <h2 className="ff-display text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight">
                  Metode Pembelajaran
                </h2>
              </div>

              <div className="flex flex-col gap-8">
                {methods.map((m, i) => (
                  <FadeIn key={m.title} delay={150 + i * 80}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-4 rounded-full border border-zinc-800 transition-standard hover:border-zinc-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        <span className="text-2xl">{m.icon}</span>
                      </div>
                      <div>
                        <h4 className="ff-display text-base font-medium text-white mb-1.5">
                          {m.title}
                        </h4>
                        <p className="ff-body text-xs text-zinc-400 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Mentors Data ────────────────────────────────────────────────────────────
const mentorsData = [
  {
    name: "Dr. Isabelle Moreau",
    role: "Senior Perfumer & Olfactory Scientist",
    specialty: "Fine Fragrance · Molecular Design",
    company: "Givaudan",
    experience: "20+ Years",
    tags: ["Niche", "R&D"],
  },
  {
    name: "Arjun Mehta",
    role: "Head of Flavor & Fragrance Innovation",
    specialty: "Biotechnology Aroma · Green Chemistry",
    company: "Firmenich",
    experience: "15+ Years",
    tags: ["Bio", "Lab"],
  },
  {
    name: "Yuki Tanaka",
    role: "Olfactory Technologist & Brand Strategist",
    specialty: "Neuro-Olfaction · Asian Markets",
    company: "Symrise",
    experience: "18+ Years",
    tags: ["Brand", "Asia"],
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const ProgramPerfume = () => {
  const [activeTab, setActiveTab] = useState<"online" | "hybrid">("online");
  const [activeIntake, setActiveIntake] = useState<"aug" | "nov">("aug");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        .ff-display { font-family: 'Playfair Display', serif; }
        .ff-body { font-family: 'Inter', system-ui, sans-serif; }
        .metallic-border {
          border: 1px solid transparent;
          background: linear-gradient(#09090b, #09090b) padding-box,
                      linear-gradient(135deg, #F4F4F5, #3F3F46, #F4F4F5) border-box;
        }
        .scrolling-wrapper {
          display: flex;
          width: fit-content;
          animation: scroll-marquee 40s linear infinite;
        }
        @keyframes scroll-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .transition-standard {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, padding 0.3s ease;
        }
        .faq-content.open {
          max-height: 200px;
        }
      `}</style>

      <main className="ff-body overflow-x-hidden bg-slate-950 relative overflow-hidden text-[#e5e1e4]">
        {/* Aurora/Mesh Gradient Background — Scroll Parallax */}
        <ParallaxAurora />

        {/* Parallax Floating Particles */}
        <FloatingParticles />

        {/* ══ SECTION 1: HERO ══════════════════════════════════════════════ */}
        <section className="relative min-h-[716px] flex flex-col justify-center items-center text-center px-4 md:px-16 py-28 md:py-36 overflow-hidden z-10">
          {/* [1] Ambient Glow */}
          <div className="absolute w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[120px] top-0 left-10 pointer-events-none z-0" />
          <div className="absolute w-[30vw] h-[30vw] bg-zinc-600/10 rounded-full blur-[120px] bottom-0 right-10 pointer-events-none z-0" />

          <div className="max-w-6xl mx-auto relative z-10">
            <FadeIn delay={0}>
              <span className="ff-body text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-6 block">
                The S&N Curriculum
              </span>
            </FadeIn>
            <FadeIn delay={100}>
              {/* [2] Metallic Text */}
              <h1 className="ff-display text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 mb-8">
                Katalog Program & Sertifikasi Olfaktori
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="ff-body text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Pilih jalur pembelajaran komprehensif di S&N Institute Of
                Olfactory Sciences. Dari dasar formulasi hingga penguasaan
                teknologi sensorik tingkat lanjut untuk karir prestisius di
                industri wewangian global.
              </p>
            </FadeIn>
            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* [5] Glow CTA Button */}
                <button className="relative px-8 py-4 bg-zinc-200 text-black font-medium rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs font-semibold uppercase tracking-widest">
                  Mulai Eksplorasi
                </button>
                <button className="border border-zinc-700 text-[#e5e1e4] ff-body text-xs font-semibold px-8 py-4 rounded-full uppercase tracking-widest transition-standard hover:border-white">
                  Unduh Katalog PDF
                </button>
              </div>
            </FadeIn>
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-30 z-10" />
        </section>

        {/* [3] Glassmorphism Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

        {/* ══ SECTION 2: PROGRAM CATALOG ═══════════════════════════════════ */}
        <section className="px-4 md:px-16 py-16 max-w-6xl mx-auto relative">
          {/* [1] Ambient Glow */}
          <div className="absolute w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[120px] top-0 left-10 pointer-events-none z-0" />

          <div className="relative z-10">
            {/* Foundation */}
            <div className="mb-20">
              <FadeIn>
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-12 h-[1px] bg-zinc-600" />
                  {/* [2] Metallic Text */}
                  <h2 className="ff-body text-xs font-semibold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">
                    Foundation Levels
                  </h2>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-start">
                {foundationPrograms.map((p, i) => (
                  <FadeIn key={p.no} delay={i * 80}>
                    {/* [4] Inner Shadow + Staggered + Asymmetrical border radius */}
                    <div
                      className="bg-zinc-900/70 border border-zinc-800 p-8 flex flex-col h-full transition-standard hover:border-zinc-500 cursor-default shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-tl-[40px] rounded-br-[40px] rounded-tr-lg rounded-bl-lg"
                      style={{
                        marginTop: i === 1 ? "3rem" : i === 2 ? "6rem" : "0",
                      }}
                    >
                      <div className="text-zinc-600 mb-6 ff-display text-2xl font-medium">
                        {p.no}
                      </div>
                      <h3 className="ff-display text-xl font-medium text-white mb-4">
                        {p.title}
                      </h3>
                      <p className="ff-body text-sm text-zinc-400 mb-8 flex-grow leading-relaxed">
                        {p.desc}
                      </p>
                      {/* [5] Glow CTA */}
                      <button className="relative w-fit px-8 py-4 bg-zinc-200 text-black font-medium rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs font-semibold uppercase tracking-widest">
                        Lihat Silabus
                      </button>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* [3] Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

            {/* Advanced */}
            <div className="mb-20">
              <FadeIn>
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-12 h-[1px] bg-zinc-400" />
                  {/* [2] Metallic Text */}
                  <h2 className="ff-body text-xs font-semibold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">
                    Professional Mastery
                  </h2>
                </div>
              </FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-start">
                {advancedPrograms.map((p, i) => (
                  <FadeIn key={p.no} delay={i * 100}>
                    {/* [4] Inner Shadow + Asymmetrical border radius + stagger */}
                    <div
                      className="bg-zinc-900/70 border border-zinc-700 p-10 flex flex-col h-full transition-standard hover:border-zinc-400 shadow-[0_0_20px_rgba(244,244,255,0.05)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-tl-[40px] rounded-br-[40px] rounded-tr-lg rounded-bl-lg"
                      style={{ marginTop: i === 1 ? "3rem" : "0" }}
                    >
                      <div className="text-zinc-400 mb-6 ff-display text-2xl font-medium">
                        {p.no}
                      </div>
                      <h3 className="ff-display text-2xl md:text-3xl font-medium text-white mb-6">
                        {p.title}
                      </h3>
                      <p className="ff-body text-base text-zinc-400 mb-10 flex-grow leading-relaxed">
                        {p.desc}
                      </p>
                      {/* [5] Glow CTA */}
                      <button className="relative w-fit px-8 py-4 bg-zinc-200 text-black font-medium rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs font-semibold uppercase tracking-widest">
                        Lihat Silabus
                      </button>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* [3] Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

            {/* Expert / Magister */}
            <div>
              <FadeIn>
                <div className="flex items-center gap-4 mb-10">
                  <span className="w-12 h-[2px] bg-white" />
                  {/* [2] Metallic Text */}
                  <h2 className="ff-body text-xs font-semibold uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">
                    Academic Excellence
                  </h2>
                </div>
              </FadeIn>
              <FadeIn delay={100}>
                <div className="metallic-border p-1 md:p-2">
                  {/* [4] Inner Shadow */}
                  <div className="bg-zinc-900/70 p-8 md:p-16 flex flex-col md:flex-row justify-between items-center gap-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-white text-lg">★</span>
                        <span className="ff-body text-xs font-semibold uppercase tracking-widest text-white">
                          Postgraduate Program
                        </span>
                      </div>
                      {/* [2] Metallic Text */}
                      <h3 className="ff-display text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight mb-6 leading-tight">
                        Magister Terapan Inovasi Teknologi Olfaktori
                      </h3>
                      <p className="ff-body text-base text-zinc-400 leading-relaxed">
                        Program magister pertama yang berfokus pada R&D
                        molekuler, bio-teknologi aroma, dan kepemimpinan
                        visioner dalam industri flavors and fragrances.
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-6 flex-shrink-0">
                      <div className="text-center">
                        <div className="ff-body text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">
                          Durasi
                        </div>
                        <div className="ff-display text-2xl font-medium text-white">
                          24 Bulan
                        </div>
                      </div>
                      {/* [5] Glow CTA */}
                      <button className="relative px-8 py-4 bg-zinc-200 text-black font-medium rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
                        Lihat Silabus Lengkap
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* [3] Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

        {/* ══ SECTION 3: PERJALANAN PEMBELAJARAN + METODE (2 kolom) ════════ */}
        <TimelineSection />

        {/* [3] Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

        {/* ══ SECTION: EXPERT MENTORS ══════════════════════════════════════ */}
        <section className="px-4 md:px-16 py-16 max-w-6xl mx-auto relative z-10">
          {/* [1] Ambient Glow */}
          <div className="absolute w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[120px] top-0 right-10 pointer-events-none z-0" />
          <div className="relative z-10">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="ff-body text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-500 block mb-3">
                  Our Mentors
                </span>
                <h2 className="ff-display text-2xl md:text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight">
                  Dibimbing oleh Praktisi Industri Global
                </h2>
                <p className="ff-body text-sm text-zinc-400 mt-4 max-w-xl mx-auto leading-relaxed">
                  Belajar langsung dari para ahli yang telah membentuk lanskap
                  industri wewangian dunia selama puluhan tahun.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mentorsData.map((mentor, i) => (
                <FadeIn key={mentor.name} delay={i * 100}>
                  <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    {/* Image Area */}
                    <div className="relative h-64 w-full overflow-hidden">
                      <div className="h-full w-full bg-zinc-800 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out flex items-center justify-center">
                        {/* Placeholder avatar */}
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center border border-zinc-600">
                            <span className="ff-display text-2xl font-medium text-zinc-400">
                              {mentor.name.charAt(0)}
                            </span>
                          </div>
                          <div className="w-16 h-1 bg-zinc-600 rounded" />
                          <div className="w-10 h-1 bg-zinc-700 rounded" />
                        </div>
                      </div>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent" />
                      {/* Experience badge */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-zinc-700 px-3 py-1">
                        <span className="ff-body text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
                          {mentor.experience}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="ff-display text-xl font-medium text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-zinc-100 group-hover:via-zinc-300 group-hover:to-zinc-500 transition-all duration-500">
                        {mentor.name}
                      </h3>
                      <p className="ff-body text-sm text-zinc-400 mb-1">
                        {mentor.role}
                      </p>
                      <p className="ff-body text-xs text-zinc-500 mb-4">
                        {mentor.specialty}
                      </p>

                      {/* Divider */}
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent mb-4" />

                      {/* Company logo placeholder + expertise tags */}
                      <div className="flex items-center justify-between">
                        <div className="bg-zinc-800 border border-zinc-700 px-4 py-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-zinc-500" />
                          <span className="ff-body text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                            {mentor.company}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {mentor.tags.map((tag) => (
                            <span
                              key={tag}
                              className="ff-body text-[9px] uppercase tracking-wider text-zinc-600 border border-zinc-800 px-2 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* [3] Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

        {/* ══ SECTION 4: JADWAL & HARGA ════════════════════════════════════ */}
        <section className="px-4 md:px-16 py-16 max-w-6xl mx-auto relative">
          {/* [1] Ambient Glow */}
          <div className="absolute w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[120px] top-0 left-10 pointer-events-none z-0" />
          <div className="relative z-10">
            <FadeIn>
              <div className="text-center mb-16">
                <span className="ff-body text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-500">
                  JADWAL & BIAYA
                </span>
                {/* [2] Metallic Text */}
                <h2 className="ff-display text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight mt-4">
                  Jadwal kelas yang dapat kamu ikuti
                </h2>
              </div>
            </FadeIn>

            {/* Tabs */}
            <FadeIn delay={100}>
              <div className="flex flex-col items-center gap-8 mb-16">
                {/* Tab Online / Hybrid — sliding pill dengan layoutId */}
                <div className="bg-zinc-900/70 p-1 rounded-full flex border border-zinc-800 relative">
                  {(["online", "hybrid"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="relative px-8 py-2 rounded-full ff-body text-xs font-semibold z-10 transition-colors duration-200"
                      style={{ color: activeTab === tab ? "#000" : "#a1a1aa" }}
                    >
                      {/* Sliding pill background */}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="active-tab-pill"
                          className="absolute inset-0 bg-white rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 35,
                          }}
                        />
                      )}
                      <span className="relative z-10">
                        {tab === "online" ? "Online Livestream" : "Hybrid"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Intake tabs — sliding underline dengan layoutId */}
                <div className="flex gap-6 relative">
                  {(
                    [
                      { key: "aug", label: "August 2026 Intake" },
                      { key: "nov", label: "November 2026 Intake" },
                    ] as const
                  ).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveIntake(key)}
                      className="relative ff-body text-xs font-semibold pb-2 transition-colors duration-200"
                      style={{
                        color: activeIntake === key ? "#f4f4f5" : "#71717a",
                      }}
                    >
                      {label}
                      {/* Sliding underline */}
                      {activeIntake === key && (
                        <motion.div
                          layoutId="active-intake-underline"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-300"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 35,
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Schedule Bar */}
            <FadeIn delay={150}>
              {/* [4] Inner Shadow */}
              <div className="bg-zinc-900/70 border border-zinc-700 p-8 flex flex-col md:flex-row justify-between items-center gap-8 mb-16 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-zinc-800">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <div className="ff-body text-[10px] font-semibold uppercase text-zinc-500 tracking-widest mb-1">
                      Periode Program
                    </div>
                    <div className="ff-display text-xl font-medium text-white">
                      {activeIntake === "aug"
                        ? "5 Aug - 18 Nov 2026"
                        : "3 Nov 2026 - 28 Feb 2027"}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block w-[1px] h-12 bg-zinc-700" />
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-zinc-800">
                    <span className="text-xl">🕐</span>
                  </div>
                  <div>
                    <div className="ff-body text-[10px] font-semibold uppercase text-zinc-500 tracking-widest mb-1">
                      Waktu Sesi
                    </div>
                    <div className="ff-display text-xl font-medium text-white">
                      Senin - Kamis, 19:00 - 22:00
                    </div>
                  </div>
                </div>
                <button className="bg-zinc-800 border border-zinc-600 px-8 py-3 ff-body text-xs font-semibold uppercase tracking-widest hover:bg-zinc-700 transition-standard whitespace-nowrap text-white">
                  Sync to Calendar
                </button>
              </div>
            </FadeIn>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {pricingPlans.map((plan, i) => (
                <FadeIn key={plan.label} delay={i * 80}>
                  {/* [4] Inner Shadow */}
                  <div
                    className={`relative flex flex-col p-8 h-full transition-standard shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]
                    ${
                      plan.popular
                        ? "bg-zinc-900/70 border-2 border-white md:-translate-y-4 shadow-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                        : "bg-slate-900/60 border border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                        Most Popular
                      </div>
                    )}
                    <span
                      className={`ff-body text-[10px] font-semibold uppercase tracking-widest mb-4 ${plan.popular ? "text-white" : "text-zinc-500"}`}
                    >
                      {plan.label}
                    </span>
                    {/* [2] Metallic Text for price */}
                    <div className="ff-display text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight mb-2">
                      {plan.price}
                    </div>
                    <p className="ff-body text-sm text-zinc-400 flex-grow leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Bottom Actions */}
            <FadeIn delay={100}>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <a
                  href="#"
                  className="ff-body text-sm text-zinc-400 hover:text-white underline underline-offset-4 transition-standard"
                >
                  Lihat Benefit & Rincian Fasilitas
                </a>
                <button className="border border-zinc-700 px-8 py-3 ff-body text-xs font-semibold uppercase tracking-widest hover:border-white transition-standard text-white">
                  Info Scholarship
                </button>
                {/* [5] Glow CTA */}
                <button className="relative px-8 py-4 bg-zinc-200 text-black font-medium rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs font-semibold uppercase tracking-widest flex items-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.025 3.334l-.795 2.898 2.966-.778c1.026.549 2.129.86 3.57.86 3.181 0 5.768-2.586 5.769-5.766 0-3.18-2.587-5.714-5.767-5.714zm3.107 8.163c-.126.353-.728.674-1.003.712-.254.038-.582.062-1.428-.276-1.047-.417-1.722-1.481-1.774-1.55-.052-.068-.423-.563-.423-1.082 0-.519.271-.774.368-.881.096-.107.211-.133.28-.133h.203c.068 0 .157-.026.241.176.084.203.291.712.316.764.026.052.043.111.009.181-.034.068-.052.111-.103.176-.051.065-.11.144-.157.193-.052.052-.107.107-.046.211.06.103.268.441.575.713.395.351.727.461.83.513.103.052.164.043.224-.026.06-.068.258-.299.327-.402.068-.103.138-.086.233-.052.096.034.603.284.707.336.103.052.172.078.198.121.026.043.026.25-.1.603z" />
                  </svg>
                  Hubungi Kami
                </button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* [3] Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

        {/* ══ SECTION 5: PARTNERS MARQUEE ══════════════════════════════════ */}
        <section className="bg-slate-950/80 py-16 overflow-hidden border-y border-zinc-800 relative">
          <div className="absolute w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[120px] top-0 right-0 pointer-events-none z-0" />
          <FadeIn>
            <div className="px-4 md:px-16 mb-10 relative z-10">
              <h5 className="ff-body text-[10px] font-semibold text-center text-zinc-500 uppercase tracking-widest">
                Dipercaya oleh lulusan dari institusi terkemuka
              </h5>
            </div>
          </FadeIn>
          <div className="relative flex items-center overflow-hidden z-10">
            <div className="scrolling-wrapper flex gap-20 items-center opacity-40 grayscale hover:grayscale-0 transition-standard">
              {[...partners, ...partners].map((name, i) => (
                <span
                  key={i}
                  className="text-2xl font-bold ff-body tracking-tighter text-[#e5e1e4] whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="text-center mt-10 relative z-10">
            <span className="ff-body text-xs text-zinc-600">
              +perusahaan global lainnya
            </span>
          </div>
        </section>

        {/* [3] Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

        {/* ══ SECTION 6: FAQ ════════════════════════════════════════════════ */}
        <section className="px-4 md:px-16 py-16 max-w-3xl mx-auto relative">
          <div className="absolute w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[120px] top-0 left-10 pointer-events-none z-0" />
          <div className="relative z-10">
            <FadeIn>
              <div className="text-center mb-16">
                {/* [2] Metallic Text */}
                <h2 className="ff-display text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight mb-4">
                  Pertanyaan Umum
                </h2>
                <p className="ff-body text-sm text-zinc-400">
                  Segala hal yang perlu Anda ketahui tentang proses belajar di
                  SNIOS.
                </p>
              </div>
            </FadeIn>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 60}>
                  {/* [4] Inner Shadow */}
                  <div
                    className={`bg-zinc-900/70 border transition-standard shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ${openFaq === i ? "border-zinc-600" : "border-zinc-800"}`}
                  >
                    <button
                      className="w-full flex justify-between items-center p-6 text-left cursor-pointer"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="ff-body text-xs font-semibold uppercase tracking-widest text-white pr-4">
                        {faq.q}
                      </span>
                      <span
                        className="text-white text-xl flex-shrink-0 transition-transform duration-300"
                        style={{
                          transform:
                            openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        ↓
                      </span>
                    </button>
                    <div
                      className={`faq-content ${openFaq === i ? "open" : ""}`}
                    >
                      <div className="px-6 pb-6 ff-body text-sm text-zinc-400 border-t border-zinc-800 pt-4 leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* [3] Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-16" />

        {/* ══ SECTION 7: FINAL CTA ═════════════════════════════════════════ */}
        <section className="px-4 md:px-16 py-16 md:py-28">
          <FadeIn>
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-12 md:p-24 text-center rounded-xl relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              {/* [1] Ambient Glow inside CTA */}
              <div className="absolute w-[40vw] h-[40vw] bg-zinc-600/10 rounded-full blur-[120px] top-0 left-10 pointer-events-none z-0" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-500 opacity-5 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                {/* [2] Metallic Text */}
                <h2 className="ff-display text-2xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600 tracking-tight mb-8 leading-tight">
                  Siap Memulai Perjalanan Olfaktori Anda?
                </h2>
                <p className="ff-body text-base text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed">
                  Dapatkan panduan kurikulum yang tepat sesuai dengan tujuan
                  karir dan minat spesifik Anda dalam dunia sensorik.
                </p>
                <div className="flex flex-col items-center">
                  {/* [5] Glow CTA */}
                  <button className="relative px-8 py-4 bg-zinc-200 text-black font-medium rounded-full overflow-hidden shadow-[0_0_15px_rgba(212,212,216,0.1)] hover:shadow-[0_0_30px_rgba(212,212,216,0.4)] hover:bg-white hover:scale-105 transition-all duration-300 ease-out ff-body text-xs font-semibold uppercase tracking-widest flex items-center gap-4">
                    Konsultasi Program dengan Advisor Kami
                    <span>→</span>
                  </button>
                  <p className="mt-8 ff-body text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                    Respon dalam waktu kurang dari 24 jam
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </>
  );
};

export default ProgramPerfume;
