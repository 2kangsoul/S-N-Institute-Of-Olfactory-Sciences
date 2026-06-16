// File: src/Features/landingpages/components/Products.tsx
import React, { useEffect, useState } from 'react';
import backendlessApi from '../../../config/api'; // Sesuaikan path ini jika posisi folder berbeda
import { Link } from 'react-router-dom';

// Interface wajib disamakan persis dengan nama kolom di Dashboard Backendless
export interface ProductType {
  objectId: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  imageUrl: string;
  sillage: string;
  projection: string;
  longevity: string;
  notes: string;
  description: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE UNTUK FITUR LOGIN MODAL ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // --- STATE UNTUK FITUR PENCARIAN & FILTER ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortPrice, setSortPrice] = useState<string>('');
  const [filterSillage, setFilterSillage] = useState<string>('');
  const [filterProjection, setFilterProjection] = useState<string>('');
  const [filterLongevity, setFilterLongevity] = useState<string>('');
  const [filterNotes, setFilterNotes] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // --- STATE UNTUK FITUR PAGINATION (NEXT PAGE) ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Menampilkan 10 item (2 baris) per halaman

  // Reset ke halaman 1 setiap kali user menggunakan filter atau search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortPrice, filterSillage, filterProjection, filterLongevity, filterNotes]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Tetap menarik seluruh data agar Filter dinamis tetap membaca semua opsi
        const response = await backendlessApi.get<ProductType[]>('Product?pageSize=100');
        setProducts(response.data);
      } catch (err: any) {
        console.error("Gagal mengambil data produk dari Backendless:", err);
        setError("Koneksi ke database terputus. Silakan coba muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      console.log("Produk berhasil ditambahkan ke keranjang!");
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/400x400?text=Saa+Fragrance";
    if (url.startsWith('http') || url.startsWith('/')) return url;
    return `/${url}`;
  };

  // =======================================================================
  // FUNGSI RENDER BINTANG SPL (MAX RATE 10)
  // =======================================================================
  const renderStarRating = (value: string) => {
    return (
      <div className="flex items-center justify-center gap-0.5">
        <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-[10px] font-semibold text-gray-900 leading-none mt-0.5">{value}/10</span>
      </div>
    );
  };

  // =======================================================================
  // LOGIKA PENCARIAN, FILTERING, DAN PAGINATION
  // =======================================================================
  
  const uniqueSillage = Array.from(new Set(products.map(p => p.sillage).filter(Boolean)));
  const uniqueProjection = Array.from(new Set(products.map(p => p.projection).filter(Boolean)));
  const uniqueLongevity = Array.from(new Set(products.map(p => p.longevity).filter(Boolean)));
  const uniqueNotes = Array.from(new Set(products.map(p => p.notes).filter(Boolean)));

  // 1. Eksekusi Filter & Sort
  const filteredProducts = products
    .filter((item) => {
      const matchName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSillage = filterSillage ? item.sillage === filterSillage : true;
      const matchProjection = filterProjection ? item.projection === filterProjection : true;
      const matchLongevity = filterLongevity ? item.longevity === filterLongevity : true;
      const matchNotes = filterNotes ? item.notes === filterNotes : true;
      
      return matchName && matchSillage && matchProjection && matchLongevity && matchNotes;
    })
    .sort((a, b) => {
      if (sortPrice === 'asc') return a.price - b.price;
      if (sortPrice === 'desc') return b.price - a.price;
      return 0;
    });

  // 2. Eksekusi Pagination dari data yang sudah di-filter
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="py-20 bg-[#f4f2ee] min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Halaman */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Curated Collection</h1>
          <p className="text-gray-600">Eksplorasi mahakarya wewangian dengan performa SPL yang "beast mode".</p>
        </div>

        {/* =======================================================================
            AREA PENCARIAN & FILTER
            ======================================================================= */}
        <div className="mb-6 flex flex-col md:flex-row gap-3 justify-between items-center bg-white py-2.5 px-4 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Text Box Search */}
          <div className="w-full md:w-1/2 relative">
            <input 
              type="text" 
              placeholder="Cari nama parfum..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400 pl-4 rounded-xl h-9 min-h-0 text-sm"
            />
          </div>

          {/* Tombol Toggle Filter */}
          <div className="w-full md:w-auto flex gap-3">
            <select 
              value={sortPrice}
              onChange={(e) => setSortPrice(e.target.value)}
              className="select select-bordered bg-[#f8f7f4] border-gray-200 focus:outline-none rounded-xl h-9 min-h-0 text-sm w-full md:w-auto font-medium"
            >
              <option value="">Urutkan Harga</option>
              <option value="asc">Terendah - Tertinggi</option>
              <option value="desc">Tertinggi - Terendah</option>
            </select>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`btn h-9 min-h-0 border-none px-5 rounded-xl text-sm font-medium ${showFilters ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {showFilters ? 'Tutup Filter' : 'Filter Spesifik'}
            </button>
          </div>
        </div>

        {/* Panel Filter Spesifik */}
        {showFilters && (
          <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 bg-white py-4 px-5 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
            {/* Filter Notes */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Aroma Notes</label>
              {/* DITAMBAHKAN text-xs PADA SELECT DI BAWAH INI */}
              <select value={filterNotes} onChange={(e) => setFilterNotes(e.target.value)} className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none">
                <option value="">Semua Notes</option>
                {uniqueNotes.map((note, idx) => (<option key={idx} value={note}>{note}</option>))}
              </select>
            </div>
            {/* Filter Sillage */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Sillage</label>
              {/* DITAMBAHKAN text-xs PADA SELECT DI BAWAH INI */}
              <select value={filterSillage} onChange={(e) => setFilterSillage(e.target.value)} className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none">
                <option value="">Semua Sillage</option>
                {uniqueSillage.map((item, idx) => (<option key={idx} value={item}>⭐ {item}/10</option>))}
              </select>
            </div>
            {/* Filter Projection */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Projection</label>
              {/* DITAMBAHKAN text-xs PADA SELECT DI BAWAH INI */}
              <select value={filterProjection} onChange={(e) => setFilterProjection(e.target.value)} className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none">
                <option value="">Semua Projection</option>
                {uniqueProjection.map((item, idx) => (<option key={idx} value={item}>⭐ {item}/10</option>))}
              </select>
            </div>
            {/* Filter Longevity */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wider">Longevity</label>
              {/* DITAMBAHKAN text-xs PADA SELECT DI BAWAH INI */}
              <select value={filterLongevity} onChange={(e) => setFilterLongevity(e.target.value)} className="select select-bordered select-sm text-xs rounded-lg bg-[#f8f7f4] focus:outline-none">
                <option value="">Semua Longevity</option>
                {uniqueLongevity.map((item, idx) => (<option key={idx} value={item}>⭐ {item}/10</option>))}
              </select>
            </div>
            {/* Tombol Reset */}
            <div className="col-span-2 md:col-span-4 mt-1 flex justify-end">
              <button 
                onClick={() => { setFilterSillage(''); setFilterProjection(''); setFilterLongevity(''); setFilterNotes(''); setSearchQuery(''); setSortPrice(''); }}
                className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:underline"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}

        {/* State Handling (Loading & Error) */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-gray-900"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg max-w-lg mx-auto">
            <span>{error}</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-800">Parfum tidak ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          
          /* =======================================================================
             AREA GRID PRODUK (MENGGUNAKAN paginatedProducts)
             ======================================================================= */
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
              {paginatedProducts.map((item) => (
                
                /* DaisyUI Card Container */
                <div key={item.objectId} className="card h-full bg-base-100 shadow-xl hover:-translate-y-1 transition-transform duration-300 max-w-[240px] mx-auto w-full">
                  
                  {/* Gambar & Merek */}
                  <figure className="px-4 pt-4 bg-white flex flex-col w-full">
                    <div className="flex flex-col gap-2 mb-4 w-full items-start">
                      <span className="badge badge-neutral text-[10px] font-bold uppercase tracking-wider">{item.brand}</span>
                      {item.stock === 0 && (
                        <span className="badge badge-error text-white text-[10px] font-bold uppercase tracking-wider border-none">Sold Out</span>
                      )}
                    </div>
                    
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      className={`h-48 w-full object-center object-contain mx-auto transition-opacity ${item.stock === 0 ? 'opacity-50' : 'opacity-100'}`} 
                    />
                  </figure>
                  
                  {/* Informasi Produk */}
                  <div className="card-body bg-[#f8f7f4] rounded-b-2xl p-4 flex flex-col flex-grow">
                    
                    <h2 className="card-title text-gray-900 text-lg font-bold h-[56px] shrink-0 items-start line-clamp-2 overflow-hidden leading-tight">
                      {item.name}
                    </h2>
                    
                    <p className="text-xs text-gray-600 line-clamp-1 mt-1 h-[20px] shrink-0 overflow-hidden font-medium">{item.notes}</p>

                    <p className="text-[10px] text-gray-500 mt-1 h-[64px] shrink-0 overflow-y-auto leading-tight pr-1">{item.description}</p>
                    
                    <div className="mt-auto mb-3 grid grid-cols-3 gap-1 shrink-0">
                      <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mb-1">Sillage</span>
                        {renderStarRating(item.sillage)}
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mb-1">Projection</span>
                        {renderStarRating(item.projection)}
                      </div>
                      <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mb-1">Longevity</span>
                        {renderStarRating(item.longevity)}
                      </div>
                    </div>

                    <div className="card-actions justify-between items-center border-t border-gray-300 pt-3 gap-1 flex-nowrap w-full shrink-0">
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                          Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                        </span>
                        <span className={`text-[10px] mt-0.5 font-medium whitespace-nowrap ${
                          item.stock > 5 ? 'text-green-600' : 
                          item.stock > 0 ? 'text-orange-600' : 
                          'text-red-500'
                        }`}>
                          {item.stock > 5 ? `Stok: ${item.stock} pcs` : 
                           item.stock > 0 ? `Sisa ${item.stock} pcs!` : 
                           'Habis Terjual'}
                        </span>
                      </div>
                      
                      <button 
                        onClick={handleAddToCart}
                        className="btn btn-sm h-9 bg-gray-900 text-white hover:bg-black border-none px-3 rounded-xl cursor-pointer active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-[10px]"
                        disabled={item.stock === 0}
                      >
                        {item.stock === 0 ? 'Habis' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* =======================================================================
                KONTROL PAGINATION (NEXT / PREV)
                ======================================================================= */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-6">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn btn-sm h-10 px-6 bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-40 disabled:bg-gray-50 rounded-xl"
                >
                  ❮ Sebelumnya
                </button>
                <span className="text-sm font-semibold text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn btn-sm h-10 px-6 bg-white border border-gray-200 text-gray-800 hover:bg-gray-100 disabled:opacity-40 disabled:bg-gray-50 rounded-xl"
                >
                  Selanjutnya ❯
                </button>
              </div>
            )}
          </>
        )}

      </div>

      {/* =======================================================================
          MODAL LOGIN
          ======================================================================= */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-white relative rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
            
            <button 
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:bg-gray-100"
              onClick={() => setShowLoginModal(false)}
            >
              ✕
            </button>
            
            <div className="text-center mb-6 mt-2">
              <h3 className="font-bold text-2xl text-gray-900 mb-2">Sign in required</h3>
              <p className="text-sm text-gray-500">
                Silakan masuk untuk menambahkan parfum incaran ke keranjang Anda.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="label text-xs font-semibold text-gray-600 px-1 py-1">Email</label>
                <input 
                  type="email" 
                  placeholder="Masukkan email Anda" 
                  className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400" 
                />
              </div>
              <div>
                <label className="label text-xs font-semibold text-gray-600 px-1 py-1">Password</label>
                <input 
                  type="password" 
                  placeholder="Masukkan kata sandi" 
                  className="input input-bordered w-full bg-[#f8f7f4] border-gray-200 focus:outline-none focus:border-gray-400" 
                />
              </div>
              
              <button className="btn bg-gray-900 text-white hover:bg-black border-none w-full mt-4 rounded-xl cursor-pointer active:scale-95">
                Sign in
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              Belum punya akun?{' '}
              <Link to="/register" className="text-gray-900 font-bold hover:underline transition-all">
                Daftar sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
      
    </section>
  );
};

export default Products;