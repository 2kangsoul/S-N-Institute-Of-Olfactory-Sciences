import { useEffect } from "react";
import heroBackground from "../../../assets/Logo.png"; // Ganti ke foto hero gelap kamu jika ada
import { aromasData } from "../types/aromasData";
import { testimonialsData } from "../types/testimonialsData";
import { Link } from "react-router-dom";

const Home = () => {
  // Ambil satu testimonial untuk banner — data tidak diubah, hanya cara render-nya
  const featuredTestimonial = testimonialsData[0];

  // Fade-in saat elemen ber-class .reveal-on-scroll masuk ke viewport
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
      {/* THEME: font + animasi (referensi L'Essence Violette) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Manrope:wght@400;700&display=swap');
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
        @media (prefers-reduced-motion: reduce) {
          .reveal-on-scroll { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      {/* HERO SECTION */}
      {/* Diubah: Menggunakan h-screen agar full 1 layar penuh */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
        <img
          src={heroBackground}
          alt="S&N Institute of Olfactory Sciences"
          /* Diubah: Dikembalikan ke object-cover agar memenuhi seluruh background tanpa ruang kosong */
          // className="absolute inset-0 w-full h-full object-contain"

          className="absolute inset-0 w-full h-full object-cover overflow-hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-[#050505]/90" />
        <div className="relative z-10 px-6 text-center max-w-3xl">
          <h1 className="ff-display text-4xl md:text-6xl text-[#e5e2e1] tracking-tight leading-tight drop-shadow-2xl">
            S&N Institute of Olfactory Sciences
          </h1>
          <p className="ff-body mt-6 text-[#cdc3d6] text-xs md:text-sm uppercase tracking-[0.25em] font-light">
            The intersection of molecular precision and artistic intuition.
          </p>
          <button className="ff-body mt-10 bg-[#d5bbff] text-[#270057] text-xs uppercase tracking-[0.2em] font-bold px-8 py-4 transition-all hover:scale-105 active:scale-95">
            Explore the Science of Scent
          </button>
        </div>
      </section>

      {/* COMPANY OVERVIEW */}
      <section className="w-full bg-[#131313] py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="ff-body text-lg md:text-xl text-[#cdc3d6] leading-relaxed">
            Founded on the intersection of molecular precision and artistic
            intuition, the S&N Institute of Olfactory Sciences explores the
            profound relationship between scent and the subconscious. We craft
            molecular signatures that transcend traditional perfumery.
          </p>
        </div>
      </section>

      {/* SPLIT COLLECTION SECTION — blok teks + gambar (alternating / zig-zag) */}
      <section className="w-full bg-[#131313] pb-24">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10 md:gap-14">
          {/* BARIS 1 — KIRI: teks penjelasan collection | KANAN: gambar Isolate 01 */}
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

          {/* BARIS 2 — KIRI: gambar Isolate 02 | KANAN: Current Isolates (diperkecil) */}
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
                    key={aroma.id}
                    className="flex items-start justify-between gap-5 border-b border-[#4b4454] py-3"
                  >
                    <div className="min-w-0">
                      <h3 className="ff-display text-base text-[#e5e2e1] mb-0.5">
                        {aroma.name}
                      </h3>
                      <p className="ff-body text-[13px] text-[#968d9f] font-light leading-snug line-clamp-2">
                        {aroma.desc}
                      </p>
                    </div>
                    <span className="ff-body shrink-0 pt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#e9c349]">
                      [ 50 ML ]
                    </span>
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

      {/* SLEEK REVIEW BANNER */}
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

      {/* FOOTER */}
      <footer className="w-full bg-[#0e0e0e] border-t border-[#4b4454]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="ff-display text-sm uppercase tracking-[0.2em] text-[#d5bbff]">
            S&N Institute of Olfactory Sciences
          </p>
          <p className="ff-body text-[11px] tracking-wide text-[#968d9f]">
            © {new Date().getFullYear()} S&N Institute of Olfactory Sciences.
            All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Home;
