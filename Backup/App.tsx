import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "./Features/landingpages/components/Hero"; // Mengimpor komponen Hero tanpa ekstensi .tsx agar tidak error
import heroBackground from "./assets/Logo.png"; // Jalur gambar latar belakang Hero

// IMPORT COMPONENT CARD, DATA AROMA, DAN TESTIMONIAL
import AromaCard from "./Features/landingpages/components/aromas";
import { aromasData } from "./Features/landingpages/types/aromasData";
import CompanyOverview from "./Features/landingpages/components/CompanyOverview"; // Sesuaikan path-nya jika berbeda
import TestimonialCard from "./Features/landingpages/components/TestimonialCard";
import { testimonialsData } from "./Features/landingpages/types/testimonialsData";

function App() {
  // --- MULAI KODE SENSOR SCROLL ---
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Jika layar di-scroll lebih dari 50 pixel ke bawah, state menjadi true
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // --- AKHIR KODE SENSOR SCROLL ---

  return (
    <div className="min-h-screen bg-[#f4f2ee]">
      {/* =======================================================================
          HEADER NAVIGASI (Warna disesuaikan mengikuti background + Efek Blur)
          ======================================================================= */}
      <header
        className={`flex justify-between items-center px-6 py-2 sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#f4f2ee]/90 backdrop-blur-md shadow-sm py-2" // Tampilan saat di-scroll ke bawah
            : "bg-transparent py-4" // Tampilan saat di paling atas (menyatu dengan background)
        }`}
      >
        <Link to="/" className="flex-shrink-0">
          <img
            src="/SaaFragrance.png"
            alt="Saa Fragrance Logo"
            className="h-10 object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium">
          <Link
            to="/products"
            className="hover:text-gray-500 transition-colors"
          >
            Products
          </Link>
          <Link
            to="/solutions"
            className="hover:text-gray-500 transition-colors"
          >
            Solutions
          </Link>
          <Link
            to="/community"
            className="hover:text-gray-500 transition-colors"
          >
            Community
          </Link>
          <Link
            to="/resources"
            className="hover:text-gray-500 transition-colors"
          >
            Resources
          </Link>
          <Link to="/pricing" className="hover:text-gray-500 transition-colors">
            Pricing
          </Link>
          <Link to="/contact" className="hover:text-gray-500 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
          <Link
            to="/signin"
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-3 py-1 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Register
          </Link>
        </div>
      </header>

      {/* =======================================================================
          HERO SECTION (Dipanggil menggunakan Metode Props)
          ======================================================================= */}
      <Hero backgroundImage={heroBackground} />

      {/* =======================================================================
          COMPANY OVERVIEW SECTION
          ======================================================================= */}
      <CompanyOverview />

      {/* =======================================================================
          DUA GAMBAR FEATURED 
          ======================================================================= */}
      <section className="relative w-full bg-[#f4f2ee] py-10 overflow-hidden">
        {/* LAPISAN BACKGROUND & GRADASI (z-0: di paling belakang) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F58427]/19 via-[#f4f2ee]/70 to-transparent"></div>
        </div>

        {/* EFEK TRANSISI SMOOTH DARI ATAS (Menyambung dari Hero tanpa terputus) */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

        {/* EFEK TRANSISI SMOOTH KE BAWAH (Menyambung ke Curated Aroma) */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

        {/* KONTEN KARTU (z-10: agar tampil di atas lapisan gradasi) */}
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            {/* KOTAK 1: Niche Perfume */}
            <Link
              to="/featured-1"
              className="w-[350px] h-[220px] relative bg-black rounded-xl flex flex-col justify-center overflow-hidden shadow-lg transition-transform hover:-translate-y-1 duration-300 block group"
            >
              <img
                src="/niche.png"
                alt="Niche Perfume"
                className="absolute inset-0 w-full h-full object-contain opacity-70 group-hover:opacity-60 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-end text-left">
                <h3 className="text-xl md:text-xl font-bold text-white mb-2 tracking-wide">
                  Niche Perfume
                </h3>
                <p className="mt-11 md:mt-5 text-gray-200 text-xs leading-relaxed mb-4 translate-y-3 md:translate-y-3">
                  Eksplorasi mahakarya parfum niche dengan komposisi aroma
                  kompleks dan performa beast mode untuk menemani aktivitas Anda
                  seharian.
                </p>
                <div>
                  <span className="inline-block bg-[#161616] hover:bg-black border border-gray-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md translate-y-3 md:translate-y-3">
                    Baca lebih lanjut
                  </span>
                </div>
              </div>
            </Link>

            {/* KOTAK 2: Designer Perfume */}
            <Link
              to="/featured-2"
              className="w-[350px] h-[220px] relative bg-black rounded-xl flex flex-col justify-center overflow-hidden shadow-lg transition-transform hover:-translate-y-1 duration-300 block group"
            >
              <img
                src="/niche.png"
                alt="Designer Perfume"
                className="absolute inset-0 w-full h-full object-contain opacity-70 group-hover:opacity-60 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-end text-left">
                <h3 className="text-xl md:text-xl font-bold text-white mb-2 tracking-wide">
                  Designer Perfume
                </h3>
                <p className="mt-11 md:mt-5 text-gray-200 text-xs leading-relaxed mb-4 translate-y-3 md:translate-y-3">
                  Temukan koleksi eksklusif mahakarya wewangian dengan karakter
                  aroma yang unik, anti-pasaran, dan performa SPL yang memukau.
                </p>
                <div>
                  <span className="inline-block bg-[#161616] hover:bg-black border border-gray-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md translate-y-3 md:translate-y-3">
                    Baca lebih lanjut
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =======================================================================
          CURATED AROMA DESCRIPTIONS 
          ======================================================================= */}
      <section className="relative w-full bg-[#f4f2ee] py-12 overflow-hidden">
        {/* LAPISAN BACKGROUND & GRADASI (z-0: di paling belakang) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F58427]/19 via-[#f4f2ee]/70 to-transparent"></div>
        </div>

        {/* EFEK TRANSISI SMOOTH DARI ATAS (Menyambung dari section sebelumnya) */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

        {/* KONTEN (Dibungkus max-w-5xl agar posisinya tetap di tengah) */}
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">
              Curated Aroma Descriptions
            </h2>
            <p className="text-gray-500">Experience the Essence of Saa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {/* {aromasData.map((aroma) => (
              <AromaCard
                key={aroma.id}
                id={aroma.id}
                name={aroma.name}
                desc={aroma.desc}
                imageUrl={aroma.imageUrl}
              />
            ))} */}
          </div>
        </div>
      </section>

      {/* =======================================================================
          TESTIMONIAL SECTION
          ======================================================================= */}
      <section className="py-20 bg-[#f4f2ee] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            What They Say About Us
          </h2>

          <style>
            {`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll {
                animation: scroll 40s linear infinite; 
              }
              .animate-scroll:hover {
                animation-play-state: paused; 
              }
            `}
          </style>

          <div className="relative flex overflow-x-hidden group">
            {/* EFEK FADE / GRADASI DI KIRI & KANAN */}
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-[#f4f2ee] to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-[#f4f2ee] to-transparent pointer-events-none"></div>

            {/* WADAH MARQUEE */}
            <div className="flex w-max animate-scroll items-center gap-6 py-4">
              {[...testimonialsData, ...testimonialsData].map(
                (testi, index) => (
                  <TestimonialCard
                    key={index}
                    id={testi.id}
                    name={testi.name}
                    role={testi.role}
                    text={testi.text}
                    avatar={testi.avatar}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =======================================================================
          SEPARATOR LINE & FOOTER
          ======================================================================= */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <hr className="border-t border-gray-300" />
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <img
              src="https://via.placeholder.com/40x40?text=Logo"
              alt="Logo"
              className="h-8 mb-6"
            />
            <div className="flex gap-4 text-gray-600">
              <Link to="#" className="hover:text-black">
                X
              </Link>
              <Link to="#" className="hover:text-black">
                IG
              </Link>
              <Link to="#" className="hover:text-black">
                YT
              </Link>
              <Link to="#" className="hover:text-black">
                IN
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 mb-2">Use cases</h4>
            <Link to="#" className="text-gray-600 hover:text-black">
              UI design
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              UX design
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Wireframing
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 mb-2">Explore</h4>
            <Link to="#" className="text-gray-600 hover:text-black">
              Design
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Prototyping
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Development features
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900 mb-2">Resources</h4>
            <Link to="#" className="text-gray-600 hover:text-black">
              Blog
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Best practices
            </Link>
            <Link to="#" className="text-gray-600 hover:text-black">
              Colors
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
