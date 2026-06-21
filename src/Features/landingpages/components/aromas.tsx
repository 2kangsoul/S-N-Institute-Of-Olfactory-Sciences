// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import heroBackgroundVideo from "../../../../public/Guerlain.mp4";
// import { aromasData } from "../types/aromasData";
import { testimonialsData } from "../types/testimonialsData";
// import { aromasData } from "../../../data/aromasData";

// ─── Fragrance side images for hero bento animation ─────────────────────────
const heroSideImages = [
  {
    src: "/Byredo.jpg",
    alt: "Byredo perfume bottle",
    position: "left",
  },
  {
    src: "/thematcha.jpg",
    alt: "Le Labo perfume bottle",
    position: "left",
  },
  {
    src: "/Essential.jpg",
    alt: "Essential perfume bottle",
    position: "right",
  },
  {
    src: "/TomFord.jpg",
    alt: "Tom Ford perfume bottle",
    position: "right",
  },
];

// ─── Categories Data ─────────────────────────────────────────────────────────────
const CATEGORY_META: Record<
  string,
  {
    image: string;
    accent: string;
    vibe: string;
    icon: string;
    span: string;
    number: string;
  }
> = {
  "Best Citrus": {
    image: "/Citrus.jpg", // Pastikan gambar ini ada di folder public
    accent: "amber",
    vibe: "Fresh & Vibrant",
    icon: "🍋",
    span: "md:col-span-2 md:row-span-2",
    number: "CAT-01",
  },
  "Best Niche": {
    image: "/niche.jpg",
    accent: "violet",
    vibe: "Avant-Garde",
    icon: "🏆",
    span: "md:col-span-1 md:row-span-1",
    number: "CAT-05",
  },
  "Best Floral": {
    image: "/Floral.jpg",
    accent: "rose",
    vibe: "Elegant & Blooming",
    icon: "🌸",
    span: "md:col-span-1 md:row-span-2",
    number: "CAT-02",
  },
  "Best Fresh": {
    image: "/Pineapple.png",
    accent: "emerald",
    vibe: "Crisp & Airy",
    icon: "💨",
    span: "md:col-span-1 md:row-span-1",
    number: "CAT-03",
  },
  "Best Oriental": {
    image: "/oriental.jpg",
    accent: "orange",
    vibe: "Exotic & Warm",
    icon: "✨",
    span: "md:col-span-2 md:row-span-1",
    number: "CAT-06",
  },
  "Best Woody": {
    image: "/woody.jpg",
    accent: "amber",
    vibe: "Earthy & Structured",
    icon: "🪵",
    span: "md:col-span-1 md:row-span-3",
    number: "CAT-08",
  },
  "Best Gourmand": {
    image: "/gourmand.jpg",
    accent: "amber",
    vibe: "Sweet & Rich",
    icon: "🍫",
    span: "md:col-span-1 md:row-span-1",
    number: "CAT-04",
  },
  "Best Oud": {
    image: "/oud.jpg",
    accent: "amber",
    vibe: "Opulent & Royal",
    icon: "🌿",
    span: "md:col-span-2 md:row-span-2",
    number: "CAT-07",
  },
};

// ─── Scroll Reveal Text ──────────────────────────────────────────────────────
function ScrollRevealText({ text }: { text: string }) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.9;
      const endOffset = windowHeight * 0.1;
      const totalDistance = startOffset - endOffset;
      const currentPosition = startOffset - rect.top;
      setProgress(Math.max(0, Math.min(1, currentPosition / totalDistance)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = text.split(" ");

  return (
    <p
      ref={containerRef}
      className="ff-display text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium"
    >
      {words.map((word, index) => {
        const wordProgress = index / words.length;
        const isRevealed = progress > wordProgress;
        return (
          <span
            key={index}
            className="transition-colors duration-150"
            style={{ color: isRevealed ? "#e5e2e1" : "#3a3040" }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
const Home = () => {
  const featuredTestimonial = testimonialsData[0];

  // ── Hero scroll animation state ──────────────
  const heroRef = useRef<HTMLElement>(null);
  const [heroScrollProgress, setHeroScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const scrollableHeight = window.innerHeight * 2;
      const scrolled = -rect.top;
      setHeroScrollProgress(
        Math.max(0, Math.min(1, scrolled / scrollableHeight)),
      );
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textOpacity = Math.max(0, 1 - heroScrollProgress / 0.2);
  const imageProgress = Math.max(
    0,
    Math.min(1, (heroScrollProgress - 0.2) / 0.8),
  );
  const centerWidth = 100 - imageProgress * 58;
  const centerHeight = 100 - imageProgress * 30;
  const sideWidth = imageProgress * 22;
  const sideOpacity = imageProgress;
  const sideTranslateLeft = -100 + imageProgress * 100;
  const sideTranslateRight = 100 - imageProgress * 100;
  const borderRadius = imageProgress * 24;
  const gap = imageProgress * 16;
  const sideTranslateY = -(imageProgress * 15);

  // ── Philosophy scroll animation ─────────
  const philosophyRef = useRef<HTMLDivElement>(null);
  const [leftTranslateX, setLeftTranslateX] = useState(-100);
  const [rightTranslateX, setRightTranslateX] = useState(100);
  const [philosophyTitleOpacity, setPhilosophyTitleOpacity] = useState(1);
  const rafRef = useRef<number | null>(null);

  const updatePhilosophyTransforms = useCallback(() => {
    if (!philosophyRef.current) return;
    const rect = philosophyRef.current.getBoundingClientRect();
    const sectionHeight = philosophyRef.current.offsetHeight;
    const scrollableRange = sectionHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableRange));
    setLeftTranslateX((1 - progress) * -100);
    setRightTranslateX((1 - progress) * 100);
    setPhilosophyTitleOpacity(1 - progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updatePhilosophyTransforms);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updatePhilosophyTransforms();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updatePhilosophyTransforms]);

  // ── Gallery horizontal scroll ──────────────
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const [galleryHeight, setGalleryHeight] = useState("100vh");
  const [translateX, setTranslateX] = useState(0);
  const galleryRafRef = useRef<number | null>(null);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
      alt: "Luxury perfume",
    },
    {
      src: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&q=80",
      alt: "Fragrance bottle",
    },
    {
      src: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
      alt: "Perfume collection",
    },
    {
      src: "https://images.unsplash.com/photo-1518049869260-4f71e3d1ab51?w=800&q=80",
      alt: "Olfactory lab",
    },
    {
      src: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800&q=80",
      alt: "Niche fragrance",
    },
    {
      src: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80",
      alt: "Perfume art",
    },
  ];

  useEffect(() => {
    const calculateHeight = () => {
      if (!galleryContainerRef.current) return;
      const containerWidth = galleryContainerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      setGalleryHeight(
        `${viewportHeight + (containerWidth - viewportWidth)}px`,
      );
    };
    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener("resize", calculateHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const updateGalleryTransform = useCallback(() => {
    if (!galleryRef.current || !galleryContainerRef.current) return;
    const rect = galleryRef.current.getBoundingClientRect();
    const containerWidth = galleryContainerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const totalScrollDistance = containerWidth - viewportWidth;
    const scrolled = Math.max(0, -rect.top);
    const progress = Math.min(1, scrolled / totalScrollDistance);
    setTranslateX(progress * -totalScrollDistance);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRafRef.current) cancelAnimationFrame(galleryRafRef.current);
      galleryRafRef.current = requestAnimationFrame(updateGalleryTransform);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateGalleryTransform();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (galleryRafRef.current) cancelAnimationFrame(galleryRafRef.current);
    };
  }, [updateGalleryTransform]);

  // ── Reveal on scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Manrope:wght@400;500;700&display=swap');
        .ff-display { font-family: 'Playfair Display', serif; }
        .ff-body { font-family: 'Manrope', system-ui, sans-serif; }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: none;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-on-scroll { opacity: 1; transform: none; transition: none; }
          .animate-marquee { animation: none; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — HERO                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative bg-[#050505]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="flex h-full w-full items-center justify-center">
            <div
              className="relative flex h-full w-full items-stretch justify-center"
              style={{
                gap: `${gap}px`,
                padding: `${imageProgress * 16}px`,
                paddingBottom: `${60 + imageProgress * 40}px`,
              }}
            >
              <div
                className="flex flex-col will-change-transform"
                style={{
                  width: `${sideWidth}%`,
                  gap: `${gap}px`,
                  transform: `translateX(${sideTranslateLeft}%) translateY(${sideTranslateY}%)`,
                  opacity: sideOpacity,
                }}
              >
                {heroSideImages
                  .filter((img) => img.position === "left")
                  .map((img, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden will-change-transform"
                      style={{ flex: 1, borderRadius: `${borderRadius}px` }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ))}
              </div>

              <div
                className="relative overflow-hidden will-change-transform"
                style={{
                  width: `${centerWidth}%`,
                  height: `${centerHeight}%`,
                  flex: "0 0 auto",
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <video
                  src={heroBackgroundVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-[#050505]/85" />

                <div
                  className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                  style={{ opacity: textOpacity }}
                >
                  <p className="ff-body text-[#cdc3d6] text-[0.65rem] md:text-xs uppercase tracking-[0.35em] font-light mb-6">
                    Est. 2020 · Olfactory Excellence
                  </p>
                  <h1 className="ff-display text-[13vw] md:text-[11vw] lg:text-[9vw] font-medium leading-[0.85] tracking-tighter text-white drop-shadow-2xl">
                    {"S&N".split("").map((letter, i) => (
                      <span
                        key={i}
                        className="inline-block"
                        style={{
                          animation: `slideUp 0.8s ease-out ${i * 0.08}s forwards`,
                          opacity: 0,
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </h1>
                  <p className="ff-body mt-6 text-[#cdc3d6] text-xs md:text-sm uppercase tracking-[0.25em] font-light max-w-sm">
                    The intersection of molecular precision and artistic
                    intuition.
                  </p>
                  <button className="ff-body mt-8 bg-[#d5bbff] text-[#270057] text-xs uppercase tracking-[0.2em] font-bold px-8 py-4 transition-all hover:scale-105 active:scale-95">
                    Explore the Science of Scent
                  </button>
                </div>
              </div>

              <div
                className="flex flex-col will-change-transform"
                style={{
                  width: `${sideWidth}%`,
                  gap: `${gap}px`,
                  transform: `translateX(${sideTranslateRight}%) translateY(${sideTranslateY}%)`,
                  opacity: sideOpacity,
                }}
              >
                {heroSideImages
                  .filter((img) => img.position === "right")
                  .map((img, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden will-change-transform"
                      style={{ flex: 1, borderRadius: `${borderRadius}px` }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[200vh]" />
        <div className="px-6 pt-32 pb-28 md:pt-48 md:px-12 md:pb-36 lg:px-20 lg:pt-56 lg:pb-44 bg-[#050505]">
          <p className="ff-display mx-auto max-w-2xl text-center text-2xl leading-relaxed text-[#6b5f75] md:text-3xl lg:text-[2.5rem] lg:leading-snug italic">
            Where science meets soul — every molecule a story worth telling.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — CATEGORIES (Bento Grid)                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#131313] py-24 overflow-hidden">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          {/* Title */}
          <div className="text-center mb-16 reveal-on-scroll">
            <p className="ff-body text-xs tracking-[0.3em] text-[#9b8aa8] uppercase mb-3">
              Recognition
            </p>
            <h2 className="ff-display text-3xl md:text-4xl text-white">
              Awards &amp; Accolades
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px] mb-12">
            {Object.entries(CATEGORY_META).map(([title, data], index) => {
              const dotColor =
                data.accent === "amber"
                  ? "#f59e0b"
                  : data.accent === "violet"
                    ? "#8b5cf6"
                    : data.accent === "rose"
                      ? "#f43f5e"
                      : data.accent === "emerald"
                        ? "#10b981"
                        : data.accent === "orange"
                          ? "#f97316"
                          : "#e9c349";

              return (
                <div
                  key={title}
                  className={`reveal-on-scroll relative overflow-hidden rounded-[2rem] group border border-white/10 ${data.span}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <img
                    src={data.image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/95" />

                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                    <span className="ff-body text-[10px] tracking-[0.2em] text-white/60 uppercase">
                      {data.number}
                    </span>
                    <div className="flex items-center gap-1.5 border border-[#e9c349]/40 bg-[#e9c349]/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <span className="text-[#e9c349] text-[10px] uppercase tracking-wider font-medium">
                        {data.icon} 17 PERFUMES
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span
                        className="ff-body text-[10px] tracking-[0.2em] uppercase font-bold"
                        style={{ color: dotColor }}
                      >
                        {data.vibe}
                      </span>
                    </div>

                    <h3 className="ff-display text-3xl md:text-4xl text-white mb-5 drop-shadow-md">
                      {title}
                    </h3>

                    <div className="border-t border-white/20 pt-4 flex justify-between items-center transition-all duration-300">
                      <span className="ff-body text-xs text-white/60 group-hover:text-white transition-colors">
                        Vote now
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="19" x2="19" y2="5"></line>
                          <polyline points="10 5 19 5 19 14"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center reveal-on-scroll">
            <a
              href="/awards"
              className="inline-flex items-center gap-2 px-8 py-3 border border-[#9b8aa8] text-[#9b8aa8] ff-body text-sm tracking-[0.2em] uppercase hover:bg-[#9b8aa8] hover:text-white transition-all duration-300 rounded-sm"
            >
              View All Categories <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — PHILOSOPHY SPLIT                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div
        ref={philosophyRef}
        className="relative bg-[#131313]"
        style={{ height: "200vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full">
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              style={{ opacity: philosophyTitleOpacity }}
            >
              <h2 className="ff-display text-[12vw] font-medium leading-[0.95] tracking-tighter text-white text-center px-6">
                Meet our Collections.
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-4 px-6 md:grid-cols-2 md:px-12 lg:px-20 max-w-7xl mx-auto">
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${leftTranslateX}%, 0, 0)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src="/Amouage.jpg"
                  alt="Niche Perfume"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6"></div>
              </div>

              <div
                className="relative aspect-[4/3] overflow-hidden rounded-2xl"
                style={{
                  transform: `translate3d(${rightTranslateX}%, 0, 0)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <img
                  src="/Mancera.jpg"
                  alt="Current Isolates"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4 — SPLIT COLLECTION                                      */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#131313] pb-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10 md:gap-14">
          <div className="reveal-on-scroll flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-full md:w-2/3">
              <h2 className="ff-display text-xl md:text-2xl text-[#e5e2e1] tracking-wide mb-3">
                Niche Perfume
              </h2>
              <p className="ff-body text-sm text-[#cdc3d6] leading-relaxed mb-5 max-w-md">
                Eksplorasi mahakarya parfum niche dengan komposisi aroma
                kompleks dan performa beast mode.
              </p>
              <Link
                to="/niche"
                className="ff-body inline-block border border-[#e9c349] text-[#e9c349] text-[11px] uppercase tracking-[0.2em] px-6 py-2.5 transition-colors hover:bg-[#e9c349]/10"
              >
                Baca lebih lanjut
              </Link>
            </div>

            <Link
              to="/niche"
              className="group relative block w-full md:w-1/3 aspect-[16/10] overflow-hidden border border-[#d5bbff]/10"
            >
              <img
                src="/NichePerfume.png"
                alt="Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm border border-[#d5bbff]/20 px-3 py-1.5">
                <p className="ff-body text-[10px] uppercase tracking-[0.25em] text-[#e9c349]">
                  [ Isolate 01 ]
                </p>
              </div>
            </Link>
          </div>

          <div className="reveal-on-scroll flex flex-col md:flex-row items-start gap-6 md:gap-10">
            <Link
              to="/featured-2"
              className="group relative block w-full md:w-1/3 aspect-[16/10] overflow-hidden border border-[#d5bbff]/10"
            >
              <img
                src="/NichePerfume.png"
                alt="Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm border border-[#d5bbff]/20 px-3 py-1.5">
                <p className="ff-body text-[10px] uppercase tracking-[0.25em] text-[#e9c349]">
                  [ Isolate 02 ]
                </p>
              </div>
            </Link>

            <div className="w-full md:w-2/3">
              <h2 className="ff-display text-xl md:text-2xl text-[#e5e2e1] tracking-wide mb-5">
                Current Isolates
              </h2>
              <ul>
                {aromasData.map((aroma) => (
                  <li
                    key={aroma.slug}
                    className="border-b border-[#4b4454] py-3"
                  >
                    <Link
                      to={`/aroma/${aroma.slug}`}
                      className="flex items-start justify-between gap-5"
                    >
                      <div className="min-w-0">
                        <h3 className="ff-display text-base text-[#e5e2e1] mb-0.5">
                          {aroma.name}
                        </h3>

                        <p className="ff-body text-[13px] text-[#968d9f] font-light leading-snug line-clamp-2">
                          {aroma.description}
                        </p>
                      </div>

                      <span className="ff-body shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#e9c349]">
                        [ 50 ML ]
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button className="ff-body mt-7 border border-[#e9c349] text-[#e9c349] text-[11px] uppercase tracking-[0.2em] px-7 py-2.5 transition-colors hover:bg-[#e9c349]/10">
                View Complete Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5 — HORIZONTAL GALLERY                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div
        ref={galleryRef}
        className="relative bg-[#0e0e0e]"
        style={{ height: galleryHeight }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute top-8 left-6 z-20">
            <p className="ff-body text-[0.65rem] uppercase tracking-[0.35em] text-[#9b8aa8]">
              Gallery
            </p>
          </div>
          <div className="flex h-full items-center">
            <div
              ref={galleryContainerRef}
              className="flex gap-6 px-6"
              style={{
                transform: `translate3d(${translateX}px, 0, 0)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-[70vh] w-[85vw] flex-shrink-0 overflow-hidden rounded-2xl md:w-[60vw] lg:w-[45vw]"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="ff-body text-[10px] uppercase tracking-[0.25em] text-[#e9c349]">
                      [ {String(index + 1).padStart(2, "0")} ]
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 6 — SCROLL REVEAL MANIFESTO                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#131313] px-6 py-28 md:px-12 md:py-36 lg:px-20 lg:py-44">
        <div className="max-w-4xl mx-auto">
          <p className="ff-body text-[0.65rem] uppercase tracking-[0.35em] text-[#9b8aa8] mb-10">
            Our Philosophy
          </p>
          <ScrollRevealText text="We believe that scent is the most intimate of the senses. Every fragrance we create begins in the laboratory and ends in a memory — a precise orchestration of molecules that awakens something deeply human." />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 7 — TESTIMONIAL BANNER                                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#131313] pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="border border-[#d5bbff]/20 bg-[#0e0e0e] px-8 py-14 md:px-16 md:py-16 text-center">
            <span className="ff-display block text-5xl leading-none text-[#d5bbff]/40 mb-4">
              &ldquo;
            </span>
            <blockquote className="ff-display italic text-xl md:text-2xl text-[#cdc3d6] leading-relaxed max-w-2xl mx-auto">
              {featuredTestimonial?.text}
            </blockquote>
            <p className="ff-body mt-8 text-xs uppercase tracking-[0.25em] text-[#e9c349]">
              {featuredTestimonial?.name}
              {featuredTestimonial?.role
                ? ` — ${featuredTestimonial.role}`
                : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MARQUEE TICKER                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="w-full bg-[#0e0e0e] border-t border-b border-[#2a2a2a] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <span
              key={i}
              className="ff-body text-[#3a3040] text-xs uppercase tracking-[0.3em] pr-12"
            >
              OUD · FLORAL · WOODY · CITRUS · ORIENTAL · GOURMAND · NICHE ·
              FRESH · MOLECULAR · OUD · FLORAL · WOODY · CITRUS · ORIENTAL ·
              GOURMAND · NICHE · FRESH · MOLECULAR ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
