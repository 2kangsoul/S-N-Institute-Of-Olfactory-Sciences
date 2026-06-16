import { Link } from "react-router-dom";

// 1. Mendefinisikan tipe data untuk props
interface HeroProps {
  backgroundImage: string;
  title?: string;
  description?: string;
  introLink?: string;
  introText?: string;
  collectionLink?: string;
  collectionText?: string;
}

// 2. Menerima props dengan nilai default persis seperti kode asli Anda
export default function Hero({
  backgroundImage,
  title = "Saa Fragrance",
  description = "Timeless scents for the modern soul",
  introLink = "/introduction",
  introText = "Introduction",
  collectionLink = "/collection",
  collectionText = "Collection",
}: HeroProps) {
  return (
    <section className="relative flex flex-col justify-center min-h-[55vh] text-center py-12 px-6 overflow-hidden bg-[#f4f2ee]">
      {/* HERO SECTION - Ketinggian disesuaikan menjadi 55vh agar pas */}

      <div
        className="absolute inset-0 z-0 bg-cover bg-center md:bg-contain md:bg-right bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {/* Gradasi menggunakan konsep responsif md: lg: xl: dengan nilai yang dipertahankan persis sama */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F54927]/15 via-[#f4f2ee]/80 via-35% md:via-35% lg:via-35% xl:via-35% to-transparent to-60% md:to-60% lg:to-60% xl:to-60%"></div>
      </div>

      {/* EFEK TRANSISI SMOOTH KE BAWAH (Menyamarkan batas potongan) */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

      {/* Kontainer Utama: Margin kiri bergeser mulus tanpa interupsi breakpoint */}
      <div
        className="relative z-10 max-w-3xl mx-auto text-left"
        style={{
          marginLeft: "clamp(0px, 8.5vw - 27px, 96px)",
        }}
      >
        {/* Judul: Ukuran font menjalar kontinu dari 36px (HP) sampai 48px (Laptop/XL) */}
        <h1
          className="font-bold mb-3 tracking-tight leading-tight text-gray-900 estedad"
          style={{
            fontSize: "clamp(2.25rem, 1.07vw + 2.03rem, 3rem)",
          }}
        >
          {title}
        </h1>

        {/* Deskripsi: Ukuran teks menjalar kontinu dari 16px sampai 18px */}
        <p
          className="text-gray-600 mb-5 font-medium"
          style={{
            fontSize: "clamp(1rem, 0.18vw + 0.96rem, 1.125rem)",
          }}
        >
          {description}
        </p>

        {/* Jarak antar tombol (Gap) menyusut secara linear */}
        <div
          className="flex justify-start"
          style={{
            gap: "clamp(0.75rem, 0.22vw + 0.7rem, 1rem)",
          }}
        >
          {/* Tombol Introduction: Ukuran font & padding bernafas mengikuti lebar viewport */}
          <Link
            to={introLink}
            className="bg-white/90 text-gray-900 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm flex items-center justify-center"
            style={{
              padding:
                "clamp(0.5rem, 0.1vw + 0.48rem, 0.5rem) clamp(1rem, 0.45vw + 0.9rem, 1.25rem)",
              fontSize: "clamp(0.875rem, 0.11vw + 0.85rem, 1rem)",
            }}
          >
            {introText}
          </Link>

          {/* Tombol Collection: Ukuran font & padding bernafas mengikuti lebar viewport */}
          <Link
            to={collectionLink}
            className="bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-all duration-300 shadow-sm flex items-center justify-center"
            style={{
              padding:
                "clamp(0.5rem, 0.1vw + 0.48rem, 0.5rem) clamp(1rem, 0.45vw + 0.9rem, 1.25rem)",
              fontSize: "clamp(0.875rem, 0.11vw + 0.85rem, 1rem)",
            }}
          >
            {collectionText}
          </Link>
        </div>
      </div>
    </section>
  );
}
