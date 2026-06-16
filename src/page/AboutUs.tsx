import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#161722] transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-black">
        <img
          src="/FotoAboutUs.png"
          alt="Saa Fragrance Hero"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%] opacity-68"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-wide">
            Tentang Saa Fragrance
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 italic font-serif">
            "Wewangian yang Berbicara, Pengalaman yang Nyata."
          </p>
        </div>
      </div>

      {/* INTRO & VISI SECTION */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-16">
          Di{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            Saa Fragrance
          </span>
          , kami percaya bahwa setiap aroma membawa cerita. Parfum bukan sekadar
          cairan wangi di dalam botol; ia adalah identitas, memori, dan
          pernyataan diri. Namun, kami memahami bahwa menemukan aroma yang tepat
          sering kali menjadi tantangan, terutama di dunia{" "}
          <span className="italic">blind buy</span> yang penuh ketidakpastian.
        </p>

        <div className="inline-block mb-4">
          <span className="w-12 h-1 bg-gray-900 dark:bg-white block mx-auto rounded-full"></span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
          Visi Kami
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Kami hadir untuk menjembatani jarak antara keinginan dan kenyamanan
          Anda. Misi kami sederhana: memastikan setiap orang dapat menemukan
          parfum yang benar-benar mewakili diri mereka tanpa harus merasa cemas
          atau takut salah pilih.
        </p>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <div className="bg-gray-100 dark:bg-[#25273D] py-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-900 dark:text-white mb-16">
            Mengapa Memilih Saa Fragrance?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#161722] p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-transparent dark:border-gray-800">
              <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Mewah Namun Terjangkau
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kami percaya bahwa kemewahan tidak harus menguras kantong. Saa
                Fragrance menghadirkan kualitas premium yang dapat dinikmati
                oleh siapa saja.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#161722] p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-transparent dark:border-gray-800">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Solusi Anti-Blind Buy
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Kami berkomitmen penuh untuk meminimalisir risiko belanja
                "buta". Melalui kurasi produk dan ulasan yang jujur, kami
                membantu Anda memahami karakter setiap parfum.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#161722] p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-transparent dark:border-gray-800">
              <div className="w-16 h-16 mx-auto bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pengalaman Personal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Baik Anda seorang pekerja sibuk, kolektor teliti, atau sekadar
                mencari tanda pengenal diri, kami siap memandu Anda menemukan{" "}
                <span className="italic">"the one"</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PENDEKATAN KAMI SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 w-full">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square md:aspect-video lg:aspect-square">
            <img
              src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=1000"
              alt="Pendekatan Saa Fragrance"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 w-full">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6">
            Pendekatan Kami
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Kami tidak sekadar menjual produk; kami membangun komunitas. Dengan
            pendekatan yang hangat dan ramah, kami ingin Anda merasa seperti
            sedang berdiskusi dengan teman dekat saat memilih aroma Anda
            berikutnya.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Kami di sini untuk mendengarkan kebutuhan Anda, memberikan
            rekomendasi yang jujur, dan memastikan bahwa setiap semprotan yang
            Anda gunakan memberikan kebahagiaan.
          </p>

          <blockquote className="border-l-4 border-gray-900 dark:border-white pl-6 italic text-xl text-gray-800 dark:text-gray-200 font-serif mb-10">
            "Karena bagi kami, kepuasan Anda adalah prioritas utama. Mari
            temukan aroma yang akan menjadi bagian dari cerita Anda bersama Saa
            Fragrance."
          </blockquote>

          <Link
            to="/products"
            className="inline-block bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            Jelajahi Koleksi Kami
          </Link>
        </div>
      </div>
    </div>
  );
}