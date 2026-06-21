import { useParams } from "react-router-dom";
import { aromasData } from "../Features/landingpages/types/aromasData";

export default function AromaDetail() {
  const { slug } = useParams();

  const aroma = aromasData.find((item) => item.slug === slug);

  if (!aroma) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#080808] text-white">
        <p>Produk tidak ditemukan.</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#080808] via-[#0d0b09] to-[#080808] py-24 min-h-screen">
      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-700/10 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 blur-[150px]" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* IMAGE */}
          <div className="group relative flex justify-center">
            <div className="absolute w-72 h-72 rounded-full bg-yellow-600/20 blur-3xl group-hover:scale-110 transition-all duration-700" />

            <img
              src={aroma.image}
              alt={aroma.name}
              className="relative z-10 max-w-[380px] object-contain transition-all duration-700 group-hover:-translate-y-3 group-hover:scale-105"
            />
          </div>

          {/* CONTENT */}
          <div className="space-y-8">
            <div>
              <span className="uppercase tracking-[4px] text-yellow-500 text-sm">
                {aroma.subtitle}
              </span>

              <h1 className="mt-4 text-5xl lg:text-7xl font-serif text-white">
                {aroma.name}
              </h1>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              {aroma.description}
            </p>

            {/* NOTES */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-yellow-500/20 bg-white/5 backdrop-blur-md rounded-xl p-4">
                <p className="text-yellow-500 text-sm">TOP</p>
                <h3 className="text-white mt-2">{aroma.notes.top}</h3>
              </div>

              <div className="border border-yellow-500/20 bg-white/5 backdrop-blur-md rounded-xl p-4">
                <p className="text-yellow-500 text-sm">HEART</p>
                <h3 className="text-white mt-2">{aroma.notes.heart}</h3>
              </div>

              <div className="border border-yellow-500/20 bg-white/5 backdrop-blur-md rounded-xl p-4">
                <p className="text-yellow-500 text-sm">BASE</p>
                <h3 className="text-white mt-2">{aroma.notes.base}</h3>
              </div>
            </div>

            <button className="px-8 py-4 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300">
              Explore Notes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
