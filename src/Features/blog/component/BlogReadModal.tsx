// @ts-nocheck
/* eslint-disable */
import React from "react";
import type { BlogPost } from "../types/blogTypes"; 

interface BlogReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogPost | null;
}

export default function BlogReadModal({ isOpen, onClose, blog }: BlogReadModalProps) {
  if (!isOpen || !blog) return null;

  const authorName = blog.author || "Saa Editor";
  const initial = authorName.charAt(0).toUpperCase();

  // Ambil tipe bypass untuk menghindari error TypeScript
  const safeBlog = blog as any; 

  // --- LOGIKA PEMOTONG PARAGRAF CERDAS (BUKAN HURUF) ---
  const renderContent = () => {
    const contentStr = safeBlog.content || "";
    // Pecah teks menjadi array berdasarkan baris (Enter)
    const lines = contentStr.split("\n");
    const totalLines = lines.length;

    // Tentukan di baris ke berapa gambar akan disisipkan
    let img2Index = Math.floor(totalLines / 3);
    let img3Index = Math.floor((totalLines / 3) * 2);

    // Mencegah gambar numpuk di baris yang sama jika teksnya sangat pendek
    if (img3Index <= img2Index) {
      img3Index = img2Index + 1;
    }

    return lines.map((line: string, i: number) => {
      // 1. FORMATTING TEKS
      let textElement = null;
      if (!line.trim()) {
        // Jika baris kosong (enter), jadikan spasi
        textElement = <span key={`space-${i}`} className="block h-4"></span>;
      } else {
        // Deteksi Sub-Judul (Huruf Kapital Semua)
        const isHeading = line === line.toUpperCase() && /[A-Z]/.test(line);
        if (isHeading) {
          textElement = (
            <span key={`text-${i}`} className="block text-lg md:text-xl font-bold text-gray-900 font-sans mt-8 mb-2">
              {line}
            </span>
          );
        } else {
          // Teks Paragraf Normal
          textElement = (
            <span key={`text-${i}`} className="block text-sm md:text-base text-gray-800 leading-loose mb-2">
              {line}
            </span>
          );
        }
      }

      // 2. SISIPKAN GAMBAR TEPAT DI BAWAH PARAGRAF TERPILIH
      let imageElement = null;
      if (i === img2Index && safeBlog.imageUrl2) {
        imageElement = (
          <div key={`img2-${i}`} className="my-10 flex justify-center">
            <img 
              src={safeBlog.imageUrl2} 
              alt="Ilustrasi 2" 
              className="w-full md:w-3/4 max-h-[400px] rounded-2xl shadow-lg object-cover border border-gray-100"
            />
          </div>
        );
      }
      if (i === img3Index && safeBlog.imageUrl3) {
        imageElement = (
          <div key={`img3-${i}`} className="my-10 flex justify-center">
            <img 
              src={safeBlog.imageUrl3} 
              alt="Ilustrasi 3" 
              className="w-full md:w-3/4 max-h-[400px] rounded-2xl shadow-lg object-cover border border-gray-100"
            />
          </div>
        );
      }

      return (
        <React.Fragment key={`fragment-${i}`}>
          {textElement}
          {imageElement}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white rounded-full p-2 hover:bg-red-500 z-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto w-full h-full bg-[#fcfbf9]">
          
          {/* GAMBAR COVER UTAMA */}
          <div className="h-64 md:h-96 w-full relative">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
              <span className="w-max bg-[#F58427] text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-md mb-4">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                {blog.title}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-12 max-w-3xl mx-auto">
            {/* HEADER PENULIS */}
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {initial}
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{authorName}</p>
                <p className="text-sm text-gray-500">{blog.date}</p>
              </div>
            </div>

            {/* RENDER TEKS & GAMBAR (HASIL LOGIKA BARU) */}
            <div className="font-serif">
              {renderContent()}
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}