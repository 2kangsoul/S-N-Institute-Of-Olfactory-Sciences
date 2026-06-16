import Hero from "./Hero";
import heroBackground from "../../../assets/Logo.png"; // Sesuaikan jalur foldernya jika bergeser
import CompanyOverview from "./CompanyOverview";
import AromaCard from "./aromas";
import { aromasData } from "../types/aromasData";
import TestimonialCard from "./TestimonialCard";
import { testimonialsData } from "../types/testimonialsData";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <Hero backgroundImage={heroBackground} />

      {/* COMPANY OVERVIEW SECTION */}
      <CompanyOverview />

      {/* DUA GAMBAR FEATURED */}
      <section className="relative w-full bg-[#f4f2ee] py-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F58427]/19 via-[#f4f2ee]/70 to-transparent"></div>
        </div>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <Link
              to="/niche"
              className="w-[350px] h-[220px] relative bg-black rounded-xl flex flex-col justify-center overflow-hidden shadow-lg transition-transform hover:-translate-y-1 duration-300 block group"
            >
              <img
                src="/NichePerfume.png"
                alt="Niche Perfume"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-end text-left">
                {/* PERUBAHAN HANYA DI BARIS INI */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-wide -translate-y-8 md:-translate-y-4">
                  Niche Perfume
                </h3>
                <p className="mt-5 text-gray-200 text-xs leading-relaxed mb-4 translate-y-3">
                  Eksplorasi mahakarya parfum niche dengan komposisi aroma
                  kompleks dan performa beast mode.
                </p>
                <div>
                  <span className="inline-block bg-[#161616] hover:bg-black border border-gray-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md translate-y-3">
                    Baca lebih lanjut
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/featured-2"
              className="w-[350px] h-[220px] relative bg-black rounded-xl flex flex-col justify-center overflow-hidden shadow-lg transition-transform hover:-translate-y-1 duration-300 block group"
            >
              <img
                src="/NichePerfume.png"
                alt="Niche Perfume"
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-black/60 p-5 flex flex-col justify-end text-left">
                {/* PERUBAHAN HANYA DI BARIS INI */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-wide -translate-y-8 md:-translate-y-4">
                  Designer Perfume
                </h3>
                <p className="mt-5 text-gray-200 text-xs leading-relaxed mb-4 translate-y-3">
                  Temukan koleksi eksklusif mahakarya wewangian dengan karakter
                  aroma yang unik, anti-pasaran.
                </p>
                <div>
                  <span className="inline-block bg-[#161616] hover:bg-black border border-gray-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md translate-y-3">
                    Baca lebih lanjut
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CURATED AROMA DESCRIPTIONS */}
      <section className="relative w-full bg-[#f4f2ee] py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F58427]/19 via-[#f4f2ee]/70 to-transparent"></div>
        </div>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">
              Curated Aroma Descriptions
            </h2>
            <p className="text-gray-500">Experience the Essence of Saa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {aromasData.map((aroma) => (
              <AromaCard
                key={aroma.id}
                id={aroma.id}
                name={aroma.name}
                desc={aroma.desc}
                imageUrl={aroma.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="py-20 bg-[#f4f2ee] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            What They Say About Us
          </h2>
          <style>{`
            @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .animate-scroll { animation: scroll 40s linear infinite; }
            .animate-scroll:hover { animation-play-state: paused; }
          `}</style>
          <div className="relative flex overflow-x-hidden group">
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-[#f4f2ee] to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-[#f4f2ee] to-transparent pointer-events-none"></div>
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
    </>
  );
};

export default Home;
