// @ts-nocheck
/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Compass, Award, ArrowUpRight } from "lucide-react";
import apiClient from "../config/api";

interface Category {
  category: string;
  _count: { category: number };
}

// ─── Accent color maps (Tailwind must see these strings at build time) ───────
const ACCENT_TEXT: Record<string, string> = {
  amber: "text-amber-300",
  rose: "text-rose-300",
  emerald: "text-emerald-300",
  orange: "text-orange-300",
  violet: "text-violet-300",
  sky: "text-sky-300",
};

const ACCENT_DOT: Record<string, string> = {
  amber: "bg-amber-400",
  rose: "bg-rose-400",
  emerald: "bg-emerald-400",
  orange: "bg-orange-400",
  violet: "bg-violet-400",
  sky: "bg-sky-400",
};

const ACCENT_GLOW: Record<string, string> = {
  amber: "group-hover:shadow-[0_0_60px_-12px_rgba(251,191,36,0.45)]",
  rose: "group-hover:shadow-[0_0_60px_-12px_rgba(251,113,133,0.45)]",
  emerald: "group-hover:shadow-[0_0_60px_-12px_rgba(52,211,153,0.45)]",
  orange: "group-hover:shadow-[0_0_60px_-12px_rgba(251,146,60,0.45)]",
  violet: "group-hover:shadow-[0_0_60px_-12px_rgba(167,139,250,0.45)]",
  sky: "group-hover:shadow-[0_0_60px_-12px_rgba(56,189,248,0.45)]",
};

// ─── Per-category metadata (image, accent, vibe, span) ──────────────────────
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
    image: "/Citrus.jpg",
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

const FALLBACK_META = {
  image:
    "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80",
  accent: "amber",
  vibe: "Distinctive",
  icon: "🏆",
  span: "md:col-span-1 md:row-span-1",
  number: "CAT-??",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-serif text-2xl text-white sm:text-3xl">
        {value}
      </span>
      <span className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </span>
    </div>
  );
}

function AwardsHero({
  totalCategories,
  totalPerfumes,
}: {
  totalCategories: number;
  totalPerfumes: number;
}) {
  return (
    <header className="relative mx-auto max-w-4xl px-6 pt-20 pb-12 text-center sm:pt-28">
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-gradient-to-b from-amber-400/15 to-amber-400/5 px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-amber-200 shadow-[0_0_30px_-8px_rgba(251,191,36,0.5)] backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Fragrance Awards
        </span>
      </div>

      <h1 className="mt-8 font-serif text-5xl leading-[1.05] text-balance text-white sm:text-6xl md:text-7xl">
        The Art of{" "}
        <span className="bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 bg-clip-text italic text-transparent">
          Scent
        </span>
        , Honored
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-lg">
        Vote for your favourite fragrances. The most loved perfumes in each
        category earn their place in the hall of fame.
      </p>

      <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-6 text-center">
        <Stat value={String(totalCategories)} label="Categories" />
        <span className="h-8 w-px bg-white/10" aria-hidden="true" />
        <Stat value={String(totalPerfumes)} label="Perfumes" />
        <span className="h-8 w-px bg-white/10" aria-hidden="true" />
        <Stat value="2026" label="Edition" />
      </div>
    </header>
  );
}

function AwardsSidebar({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = useState(
    categories[0] ? encodeURIComponent(categories[0].category) : "",
  );

  const isClickScrolling = useRef(false);
  const visibleCards = useRef(new Map());
  const activeIdRef = useRef(activeId);

  // Menyimpan ID yang sedang aktif agar bisa digunakan sebagai penentu prioritas
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    visibleCards.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrolling.current) return;

        // Mencatat persentase setiap card yang terlihat di layar
        for (const entry of entries) {
          visibleCards.current.set(entry.target.id, entry.intersectionRatio);
        }

        let maxRatio = 0;
        let bestId = "";

        // Mencari card mana yang paling banyak terlihat di layar
        visibleCards.current.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestId = id;
          } else if (ratio === maxRatio && maxRatio > 0) {
            // TIE-BREAKER: Jika ada 2 card yang sama-sama terlihat jelas di layar,
            // Prioritaskan card yang sedang kita klik/aktif saat ini!
            if (id === activeIdRef.current) {
              bestId = id;
            }
          }
        });

        if (bestId && maxRatio > 0 && bestId !== activeIdRef.current) {
          setActiveId(bestId);
        }
      },
      // Menggunakan multi-threshold agar pembacaan lebih akurat saat di-scroll
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    );

    for (const cat of categories) {
      const el = document.getElementById(encodeURIComponent(cat.category));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [categories]);

  // Smooth scroll ke card yang dipilih
  const handleScrollTo = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    // Kunci observer sementara agar tidak bentrok dengan scroll
    isClickScrolling.current = true;
    setActiveId(id);
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Waktu tunggu ditingkatkan ke 1200ms agar animasi scroll selesai sempurna
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1200);
  };

  // Diperbarui: Pindahkan "sticky top-24" ke aside langsung & tambah self-start
  return (
    <aside className="hidden lg:block sticky top-24 self-start">
      <div>
        <div className="mb-6 flex items-center gap-2 text-amber-200/80">
          <Compass className="h-4 w-4" aria-hidden="true" />
          <span className="text-[0.7rem] uppercase tracking-[0.3em]">
            The Index
          </span>
        </div>

        <nav aria-label="Award categories">
          <ol className="relative ml-1 border-l border-white/10">
            {categories.map((cat, i) => {
              const id = encodeURIComponent(cat.category);
              const isActive = id === activeId;
              const meta = CATEGORY_META[cat.category] ?? FALLBACK_META;
              return (
                <li key={cat.category} className="relative pl-5">
                  <a
                    href={`#${id}`}
                    onClick={(e) => handleScrollTo(e, id)}
                    className="group flex items-center gap-3 py-2.5 transition-colors"
                  >
                    <span
                      className={`absolute -left-[5px] h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                        isActive
                          ? "scale-125 border-amber-300 bg-amber-300 shadow-[0_0_12px_2px_rgba(251,191,36,0.6)]"
                          : "border-white/20 bg-slate-950 group-hover:border-amber-300/60"
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`font-mono text-[0.65rem] tracking-widest ${
                        isActive ? "text-amber-300" : "text-zinc-600"
                      }`}
                    >
                      {meta.number}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    >
                      {cat.category.replace("Best ", "")}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4 backdrop-blur-md">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">
            Voting Open
          </p>
          <p className="mt-2 font-serif text-lg text-white">Year 2026</p>
          <p className="mt-1 text-xs text-zinc-500">Cast your vote now</p>
        </div>
      </div>
    </aside>
  );
}

function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const meta = CATEGORY_META[cat.category] ?? {
    ...FALLBACK_META,
    number: `CAT-${String(index + 1).padStart(2, "0")}`,
  };
  const dot = ACCENT_DOT[meta.accent] ?? ACCENT_DOT.amber;
  const text = ACCENT_TEXT[meta.accent] ?? ACCENT_TEXT.amber;
  const glow = ACCENT_GLOW[meta.accent] ?? ACCENT_GLOW.amber;

  // Deteksi saat card ini jadi target (via :target pseudo) atau IntersectionObserver
  useEffect(() => {
    const id = encodeURIComponent(cat.category);
    const el = document.getElementById(id);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          setIsHighlighted(true);
          setTimeout(() => setIsHighlighted(false), 1200);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cat.category]);

  return (
    <Link
      id={encodeURIComponent(cat.category)}
      to={`/awards/${encodeURIComponent(cat.category)}`}
      className={`group relative flex scroll-mt-28 flex-col overflow-hidden rounded-3xl border bg-zinc-900/40 backdrop-blur-md transition-all duration-500 ease-out hover:scale-[1.02] hover:border-amber-500/30 ${meta.span} ${glow} ${
        isHighlighted
          ? "border-amber-400/70 shadow-[0_0_40px_-8px_rgba(251,191,36,0.6)] scale-[1.015]"
          : "border-zinc-800/50"
      }`}
    >
      {/* Image layer */}
      <div className="absolute inset-0">
        <img
          src={meta.image}
          alt={cat.category}
          className="h-full w-full object-cover opacity-70 transition-all duration-700 ease-out group-hover:scale-110 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-transparent" />
      </div>

      {/* Top row */}
      <div className="relative z-10 flex items-start justify-between p-5">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-zinc-400">
          {meta.number}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-amber-200 backdrop-blur-sm">
          <Award className="h-3 w-3" aria-hidden="true" />
          {cat._count.category} perfumes
        </span>
      </div>

      {/* Bottom content */}
      <div className="relative z-10 mt-auto flex flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${dot}`}
            aria-hidden="true"
          />
          <span className={`text-xs uppercase tracking-[0.22em] ${text}`}>
            {meta.vibe}
          </span>
        </div>

        <h3 className="font-serif text-2xl leading-tight text-balance text-white sm:text-3xl">
          {cat.category}
        </h3>

        <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
            Vote now
          </span>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-all duration-500 group-hover:border-amber-400/40 group-hover:bg-amber-400/10 group-hover:text-amber-200">
            <ArrowUpRight className="h-4 w-4" />
            <span className="sr-only">View {cat.category}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

const Awards = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Aktifkan smooth scroll native di level dokumen
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    apiClient
      .get("/perfumes/categories")
      .then((res) => setCategories(res.data?.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const totalPerfumes = categories.reduce(
    (sum, c) => sum + c._count.category,
    0,
  );

  // Diperbarui: Menghapus overflow-hidden agar fitur sticky sidebar berfungsi
  return (
    <main className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Ambient glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[32rem] w-[32rem] rounded-full bg-rose-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute top-2/3 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(2,6,23,0.85)_100%)]" />
      </div>

      <div className="relative z-10">
        <AwardsHero
          totalCategories={categories.length}
          totalPerfumes={totalPerfumes}
        />

        <section className="mx-auto max-w-7xl px-6 pb-28">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/60 border-t-transparent" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm text-zinc-500">No categories yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <AwardsSidebar categories={categories} />

              <div>
                <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-5">
                  <h2 className="font-serif text-2xl text-white sm:text-3xl">
                    The Categories
                  </h2>
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                    {categories.length} Honors
                  </span>
                </div>

                {/* Bento grid */}
                <div className="grid auto-rows-[14rem] grid-cols-1 gap-5 sm:auto-rows-[16rem] md:grid-cols-3 md:grid-flow-dense">
                  {categories.map((cat, i) => (
                    <CategoryCard key={cat.category} cat={cat} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
            <p className="font-serif text-lg italic text-zinc-300">
              Fragrance Awards
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
              Olfactory Excellence &middot; MMXXVI
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Awards;
