import React from "react";
import { Link } from "react-router-dom";
// Menggunakan 'import type' untuk memastikan interface dari file .tsx terbaca sempurna tanpa error
import type { CompanyOverviewProps } from "../types/companyOverviewTypes";

const CompanyOverview: React.FC<CompanyOverviewProps> = ({
  title = "Our Story & Culture",
  description1 = "Saa Fragrance lahir dari semangat untuk menciptakan wewangian yang tidak hanya harum, tetapi juga memiliki jiwa. Latar belakang kami berakar pada tradisi perfumery klasik yang dipadukan dengan sentuhan inovasi modern untuk gaya hidup masa kini.",
  description2 = "Tim kami terdiri dari para artisan dan ahli parfum berdedikasi yang menjunjung tinggi budaya kerja kolaboratif, ketelitian, dan eksplorasi. Kami believe bahwa setiap tetes wewangian adalah sebuah mahakarya yang mencerminkan cinta dan dedikasi kami.",
  buttonText = "Kenali Kami Lebih Dekat",
  buttonLink = "/aboutus",
  imageSrc = "/SaaFragrancexLogo.png",
  imageAlt = "Saa Fragrance Team and Culture",
}) => {
  return (
    <section className="relative w-full bg-[#f4f2ee] py-1 overflow-hidden">
      {/* EFEK TRANSISI SMOOTH DARI ATAS */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

      {/* EFEK TRANSISI SMOOTH KE BAWAH */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f4f2ee] to-transparent z-0 pointer-events-none"></div>

      {/* Jarak disesuaikan agar menyatu rapi dengan seksi lain */}
      <div className="relative z-10 max-w-3xl mx-auto px-3 -mt-8">
        <div className="flex flex-col md:flex-row items-center gap-5">
          {/* KONTEN TEKS (Kiri) */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 tracking-wide">
              {title}
            </h2>
            <p className="text-gray-600 mb-2 text-[11px] md:text-xs leading-relaxed">
              {description1}
            </p>
            <p className="text-gray-600 text-[11px] md:text-xs leading-relaxed">
              {description2}
            </p>

            <div className="mt-3">
              <Link
                to={buttonLink}
                className="inline-block border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xs font-medium px-4 py-1.5 rounded-md transition-colors"
              >
                {buttonText}
              </Link>
            </div>
          </div>

          {/* GAMBAR PROFIL/TIM (Kanan) */}
          <div className="w-full md:w-1/2">
            {/* Ditambahkan bg-white, p-2, flex, items-center, dan justify-center agar kontainer membentuk kartu tempat gambar pas di tengah */}
            <div className="relative w-full max-w-xs md:max-w-none mx-auto aspect-[2.2/1] rounded-xl overflow-hidden shadow-md group bg-white flex items-center justify-center p-2">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;
