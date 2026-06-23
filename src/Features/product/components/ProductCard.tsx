// @ts-nocheck
/* eslint-disable */
import React, { useState } from "react";
import type { ProductType } from "../types/productTypes"; 
import ProductModal from "./ProductModal"; 

interface ProductCardProps {
  item: ProductType;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getImageUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/400x400?text=Saa+Fragrance";
    if (url.startsWith("http") || url.startsWith("/")) return url;
    return `/${url}`;
  };

  const renderStarRating = (value: string) => {
    return (
      <div className="flex items-center justify-center gap-0.5">
        <svg
          className="w-3 h-3 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-[10px] font-semibold text-gray-900 leading-none mt-0.5">
          {value}/10
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="card h-full bg-base-100 shadow-xl hover:-translate-y-1 transition-transform duration-300 max-w-[240px] mx-auto w-full">
        <figure 
          className="px-4 pt-4 bg-white flex flex-col w-full cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex flex-col gap-2 mb-4 w-full items-start">
            <span className="badge badge-neutral text-[10px] font-bold uppercase tracking-wider">
              {item.brand}
            </span>
            {item.stock === 0 && (
              <span className="badge badge-error text-white text-[10px] font-bold uppercase tracking-wider border-none">
                Sold Out
              </span>
            )}
          </div>

          <img
            src={getImageUrl(item.imageUrl)}
            alt={item.name}
            className={`h-48 w-full object-center object-contain mx-auto transition-opacity ${item.stock === 0 ? "opacity-50" : "opacity-100"}`}
          />
        </figure>

        <div className="card-body bg-[#f8f7f4] rounded-b-2xl p-4 flex flex-col flex-grow">
          <h2 className="card-title text-gray-900 text-lg font-bold h-[56px] shrink-0 items-start line-clamp-2 overflow-hidden leading-tight">
            {item.name}
          </h2>

          <p className="text-xs text-gray-600 line-clamp-1 mt-1 h-[20px] shrink-0 overflow-hidden font-medium">
            {item.notes}
          </p>

          <p className="text-[10px] text-gray-500 mt-1 h-[64px] shrink-0 overflow-y-auto leading-tight pr-1">
            {item.description}
          </p>

          <div className="mt-auto mb-3 grid grid-cols-3 gap-1 shrink-0">
            <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                Sillage
              </span>
              {renderStarRating(item.sillage)}
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                Projection
              </span>
              {renderStarRating(item.projection)}
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                Longevity
              </span>
              {renderStarRating(item.longevity)}
            </div>
          </div>

          <div className="card-actions justify-between items-center border-t border-gray-300 pt-3 gap-1 flex-nowrap w-full shrink-0">
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                Rp {new Intl.NumberFormat("id-ID").format(item.price)}
              </span>
              <span
                className={`text-[10px] mt-0.5 font-medium whitespace-nowrap ${
                  item.stock > 5
                    ? "text-green-600"
                    : item.stock > 0
                      ? "text-orange-600"
                      : "text-red-500"
                }`}
              >
                {item.stock > 5
                  ? `Stok: ${item.stock} pcs`
                  : item.stock > 0
                    ? `Sisa ${item.stock} pcs!`
                    : "Habis Terjual"}
              </span>
            </div>

            <button
              onClick={onAddToCart}
              className="btn btn-sm h-9 bg-gray-900 text-white hover:bg-black border-none px-3 rounded-xl cursor-pointer active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-[10px]"
              disabled={item.stock === 0}
            >
              {item.stock === 0 ? "Habis" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DIPASANG DI SINI & DIKIRIMKAN FUNGSI ADD TO CART-NYA */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={item} 
        onAddToCart={onAddToCart} // <-- PERUBAHAN DI SINI
      />
    </>
  );
};

export default ProductCard;