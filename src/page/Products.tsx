// File: src/page/Products.tsx
import React from "react";
import PageHeader from "../Features/product/components/PageHeader";
import ProductCard from "../Features/product/components/ProductCard";
import FilteringProduct from "../Features/product/components/filteringProduct";
import ComponentLogin from "../Features/product/components/componentLogin";
import Pagination from "../Features/product/components/Pagination";
// Import Komponen State Tampilan yang baru dibuat
import { LoadingView, ErrorView, EmptyView } from "../Features/product/components/ProductStateViews"; 
import { useProducts } from "../Features/product/api/apiProduct";
import { useProductFilters } from "../Features/product/hooks/filterringHooks";
import { useLoginState } from "../Features/product/hooks/loginHooks";

const Products: React.FC = () => {
  const { products, loading, error } = useProducts();

  const {
    searchQuery,
    setSearchQuery,
    sortPrice,
    setSortPrice,
    filterSillage,
    setFilterSillage,
    filterProjection,
    setFilterProjection,
    filterLongevity,
    setFilterLongevity,
    filterNotes,
    setFilterNotes,
    filterType,          // <-- TAMBAHAN BARU
    setFilterType,       // <-- TAMBAHAN BARU
    showFilters,
    setShowFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedProducts,
    availableNotes,
    availableSillage,
    availableProjection,
    availableLongevity,
    availableTypes,      // <-- TAMBAHAN BARU
  } = useProductFilters(products);

  const { showLoginModal, setShowLoginModal, handleAddToCart } =
    useLoginState();

  // Fungsi pembantu untuk merender konten utama agar JSX di bawah lebih rapi
  const renderContent = () => {
    if (loading) return <LoadingView />;
    if (error) return <ErrorView error={error} />;
    if (paginatedProducts.length === 0) return <EmptyView />;

    return (
      <>
        {/* GRID PRODUK */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {paginatedProducts.map((item) => (
            <ProductCard
              // UPDATE: Mengubah objectId menjadi id menyesuaikan skema Prisma
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* KONTROL PAGINATION */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </>
    );
  };

  return (
    <section className="py-20 bg-[#f4f2ee] min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <PageHeader 
          title="Curated Collection"
          subtitle="Eksplorasi mahakarya wewangian dengan performa SPL yang 'beast mode'."
        />

        {/* FILTERING */}
        <FilteringProduct
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortPrice={sortPrice}
          setSortPrice={setSortPrice}
          filterSillage={filterSillage}
          setFilterSillage={setFilterSillage}
          filterProjection={filterProjection}
          setFilterProjection={setFilterProjection}
          filterLongevity={filterLongevity}
          setFilterLongevity={setFilterLongevity}
          filterNotes={filterNotes}
          setFilterNotes={setFilterNotes}
          filterType={filterType}             // <-- TAMBAHAN BARU
          setFilterType={setFilterType}       // <-- TAMBAHAN BARU
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          availableNotes={availableNotes}
          availableSillage={availableSillage}
          availableProjection={availableProjection}
          availableLongevity={availableLongevity}
          availableTypes={availableTypes}     // <-- TAMBAHAN BARU
        />

        {/* AREA KONTEN (Loading, Error, Empty, atau Grid Data) */}
        {renderContent()}

      </div>

      {/* MODAL LOGIN */}
      <ComponentLogin
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    </section>
  );
};

export default Products;