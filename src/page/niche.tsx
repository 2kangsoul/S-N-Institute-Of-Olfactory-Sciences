import { Link } from "react-router-dom";

export default function NicheGuide() {
  return (
    <div className="min-h-screen bg-[#f4f2ee] py-16 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        
        {/* HERO IMAGE SECTION */}
        <div className="h-64 sm:h-80 w-full relative group overflow-hidden">
          {/* Gambar ini sudah menggunakan object-cover sesuai perbaikan Anda sebelumnya */}
          <img
            src="/NichePerfume.png" 
            alt="Niche Perfume Collection"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6 text-center z-10">
            <span className="text-[#F58427] text-xs font-bold uppercase tracking-widest mb-3">
              Panduan Eksklusif
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              Memasuki Dunia Parfum Niche
            </h1>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-8 md:p-14">
          
          {/* BAGIAN 1: PENJELASAN APA ITU NICHE */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-5 border-b-2 border-[#F58427] inline-block pb-2">
              Apa Itu Parfum Niche?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Berbeda dengan parfum desainer yang diproduksi secara massal untuk memuaskan selera mayoritas pasar, parfum <span className="font-semibold italic">niche</span> adalah murni sebuah mahakarya seni olfaktori. Diciptakan oleh rumah parfum spesialis (artisan), parfum jenis ini mengutamakan kebebasan berekspresi sang <span className="italic">Perfumer</span> tanpa dibatasi oleh tren komersial.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Mereka menggunakan bahan-bahan baku langka, premium, dan alami untuk menciptakan komposisi aroma yang sangat kompleks. Memakai parfum niche bukan sekadar agar wangi, melainkan tentang memakai sebuah cerita, karakter personal, dan identitas unik yang tidak akan Anda cium pada sembarang orang di jalan.
            </p>
          </section>

          <hr className="border-gray-200 mb-12" />

          {/* BAGIAN 2: PANDUAN UNTUK PEMULA */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Panduan Pemula: Cara Memilih Parfum Niche
            </h2>
            
            <div className="space-y-10">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Pahami "Notes" Favorit Anda</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    Sebelum terjun terlalu dalam, ketahui keluarga aroma (olfactory family) yang hidung Anda sukai. Apakah Anda menyukai nuansa woody, kehangatan spicy, manisnya gourmand, atau kesegaran citrus? Parfum niche sering kali memiliki transisi aroma yang sangat dinamis dari <span className="font-semibold">Top notes</span> saat pertama disemprot, hingga <span className="font-semibold">Base notes</span> yang mengendap berjam-jam kemudian.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Evaluasi Performa SPL</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    Banyak pecinta wewangian mencari performa yang <span className="italic">beast mode</span> agar aromanya meninggalkan jejak kuat. Pastikan Anda memperhatikan tiga pilar utama: seberapa jauh parfum tersebut memproyeksikan aromanya ke udara (<span className="font-semibold text-gray-900">Projection</span>), jejak yang ditinggalkan saat Anda berjalan (<span className="font-semibold text-gray-900">Sillage</span>), dan ketahanannya di kulit Anda (<span className="font-semibold text-gray-900">Longevity</span>).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Hindari Blind Buy</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    Karena bahan-bahannya yang kompleks, parfum niche akan bereaksi sangat berbeda pada <span className="italic">body chemistry</span> (suhu dan pH kulit) masing-masing orang. Selalu mulai dengan membeli ukuran vial, decant, atau discovery set sebelum berkomitmen mengeluarkan dana untuk botol penuh (full bottle).
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-md">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Eksplorasi House Lokal & Internasional</h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    Jangan hanya terpaku pada rumah parfum dari Eropa atau Timur Tengah. Saat ini, sangat banyak brand artisan lokal Indonesia yang meracik karya luar biasa dengan kualitas setara <span className="italic">house</span> ternama. Cobalah mengeksplorasi berbagai rumah parfum untuk menemukan DNA racikan yang paling pas dengan karakter Anda.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FOOTER CALL TO ACTION */}
          <div className="bg-[#f8f7f4] rounded-2xl p-8 text-center border border-gray-200 mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Siap Menemukan Signature Scent Anda?</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Jelajahi kurasi parfum niche terbaik kami yang telah lolos uji performa dan kualitas bahan yang ketat.
            </p>
            <Link 
              to="/products" 
              state={{ filterType: "Niche" }} /* <-- TAMBAHAN INI */
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              Lihat Koleksi Parfum
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}