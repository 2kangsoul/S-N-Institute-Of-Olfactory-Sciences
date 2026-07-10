// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; 
  onAddToCart?: () => void; 
}

export default function ProductModal({ isOpen, onClose, product, onAddToCart }: ProductModalProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [reviewText, setReviewText] = useState("");
  
  const [testimonials, setTestimonials] = useState([
    { text: "Wangi banget, SPL benar-benar beast mode!", author: "Pembeli Terverifikasi" },
    { text: "Aromanya elegan dan tahan lama seharian.", author: "Kolektor Parfum" }
  ]);

  // Mengunci body dan html sekaligus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden"; 
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const getImageUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/400x400?text=Saa+Fragrance";
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return `/${url}`;
  };

  // =======================================================================
  // LOGIKA BARU: Filter kata kasar SUPER KETAT & KOMPREHENSIF
  // =======================================================================
  const BAD_WORDS = [
    // Umpatan, Kata Kotor & Bahasa Kebun Binatang (Termasuk Singkatan)
    "anjing", "anj", "njing", "babi", "monyet", "asu", "bajingan", "bangsat", "bgst",
    "keparat", "bedebah", "setan", "iblis", "dajjal", "jembut", "peler", "plr",
    "ngentot", "ngewe", "memek", "mmk", "memeq", "kontol", "kntl", "titit",
    "perek", "pelacur", "jablay", "lonte", "sundel", "tai", "taik", "najis", "jijik",
    
    // Hinaan & Makian
    "bego", "bodoh", "tolol", "tlol", "goblok", "gblk", "dungu", "idiot",
    "sinting", "gila", "cacat", "autis", "kampungan", "burik",
    
    // Sentimen Negatif Produk & Tuduhan
    "jelek", "buruk", "sampah", "bau", "kecewa", "gajelas", "ga jelas", "gak jelas",
    "busuk", "palsu", "mahal", "penipu", "nipu", "scam", "rugi", "nyesel", "menyesal",
    "parah", "hancur", "rusak", "basi", "kw", "tiruan", "oplosan", "abal", "abal-abal",
    "bohong", "bohongan", "zonk"
  ];

  const handleSubmitTestimoni = () => {
    if (reviewText.trim() !== "") {
      // 1. Pengecekan Kata Kasar/Kurang Mengenakan
      const isBadWord = BAD_WORDS.some(word => reviewText.toLowerCase().includes(word));
      
      if (isBadWord) {
        alert("Sistem mendeteksi kata yang kurang pantas. Mohon gunakan bahasa yang lebih sopan.");
        return; 
      }

      // 2. Tambahkan Testimoni & Batasi Maksimal 7
      setTestimonials(prev => {
        const newList = [...prev, { text: reviewText, author: user?.name || "Pengguna" }];
        return newList.slice(-7); 
      });
      
      setReviewText(""); 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: flex;
          min-width: 100%;
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused; 
        }
      `}</style>

      {/* CONTAINER MODAL */}
      <div className="bg-[#f4f2ee] rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10 transition-colors bg-white/50 rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* SISI KIRI */}
        <div className="w-full md:w-2/5 bg-white p-8 flex flex-col items-center justify-center border-r border-gray-200 shrink-0">
          <h3 className="text-gray-500 uppercase tracking-widest text-sm mb-6 font-semibold">
            {product.brand || "BRAND"}
          </h3>
          <div className="w-full h-64 flex items-center justify-center">
            <img 
              src={getImageUrl(product.imageUrl)} 
              alt={product.name} 
              className="max-h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* SISI KANAN */}
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto">
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 shrink-0">
            {product.name}
          </h2>

          <div className="mb-6 shrink-0">
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.description || product.description_notes || "Sebuah mahakarya wewangian yang diracik sempurna untuk menemani setiap momen berharga Anda."}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100 shrink-0">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fragrance Notes</h4>
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              {product.notes || "Belum ada detail notes."}
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-6 shrink-0">
            
            {/* TAMPILAN TESTIMONI BERGERAK */}
            <div className="bg-gray-900 text-white p-4 rounded-xl shadow-md overflow-hidden relative flex items-center h-[72px]">
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"></div>
              
              <div className="animate-marquee gap-8 whitespace-nowrap px-4 cursor-default">
                {testimonials.map((t, index) => (
                  <div key={index} className="flex items-center gap-2 shrink-0">
                    <span className="text-lg">⭐</span>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-xs text-[#F58427] leading-none">{t.author}</h4>
                      <p className="text-xs text-gray-300 italic mt-1 leading-none">"{t.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AREA INPUT TESTIMONI */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <h4 className="text-xs font-bold text-gray-800 mb-2">Tulis Testimoni Anda</h4>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Bagaimana pendapat Anda tentang parfum ini?"
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none bg-gray-50"
                    rows={2}
                  />
                  <button 
                    onClick={handleSubmitTestimoni}
                    disabled={!reviewText.trim()}
                    className="self-end bg-gray-900 text-white text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-lg hover:bg-black transition-colors disabled:bg-gray-400"
                  >
                    Kirim Testimoni
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-xs text-gray-500 mb-3 text-center">Silakan login untuk membagikan pengalaman Anda.</p>
                  <a href="/login" className="text-[10px] uppercase tracking-wider bg-white border border-gray-300 text-gray-800 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                    Login
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* AREA TOMBOL BAWAH */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                Rp {new Intl.NumberFormat("id-ID").format(product.price)}
              </span>
              <span className={`text-[10px] mt-0.5 font-bold uppercase tracking-wider ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `Tersedia ${product.stock} pcs` : "Sold Out"}
              </span>
            </div>

            <button
              onClick={onAddToCart}
              disabled={product.stock === 0}
              className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition-all shadow-md active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {product.stock === 0 ? "Habis Terjual" : "Add to Cart"}
              {product.stock > 0 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}