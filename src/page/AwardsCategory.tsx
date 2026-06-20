// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../config/api";
import { useAuthStore } from "../stores/useAuthStore";

interface Perfume {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  imageUrl: string;
  gender: string;
  year: number;
  totalLikes: number;
  _count: { likes: number };
}

const AwardsCategory = () => {
  const { category } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const decodedCategory = decodeURIComponent(category || "");

  useEffect(() => {
    if (!decodedCategory) return;
    apiClient
      .get(`/perfumes/category/${encodeURIComponent(decodedCategory)}`)
      .then((res) => setPerfumes(res.data?.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [decodedCategory]);

  // Check which perfumes user already liked
  useEffect(() => {
    if (!isAuthenticated || perfumes.length === 0) return;

    const checkLiked = async () => {
      const results = await Promise.allSettled(
        perfumes.map((p) => apiClient.get(`/perfumes/${p.id}/liked`)),
      );
      results.forEach((result, i) => {
        if (result.status === "fulfilled" && result.value.data?.data?.liked) {
          setLikedIds((prev) => new Set([...prev, perfumes[i].id]));
        }
      });
    };

    checkLiked();
  }, [perfumes, isAuthenticated]);

  const handleLike = async (perfumeId: string) => {
    if (!isAuthenticated) {
      toast.error("Silakan login untuk memberikan like.");
      return;
    }
    try {
      const res = await apiClient.post(`/perfumes/${perfumeId}/like`);
      const { liked } = res.data?.data;
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (liked) next.add(perfumeId);
        else next.delete(perfumeId);
        return next;
      });
      setPerfumes((prev) =>
        prev
          .map((p) =>
            p.id === perfumeId
              ? {
                  ...p,
                  totalLikes: liked ? p.totalLikes + 1 : p.totalLikes - 1,
                }
              : p,
          )
          .sort((a, b) => b.totalLikes - a.totalLikes),
      );
    } catch (error) {
      console.error("Error liking perfume:", error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Manrope:wght@400;700&display=swap');
        .ff-display { font-family: 'Playfair Display', serif; }
        .ff-body { font-family: 'Manrope', system-ui, sans-serif; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <div className="w-full bg-[#0a0a0a] pt-20 pb-12 border-b border-[#1e1e1e]">
          <div className="max-w-5xl mx-auto px-6">
            <Link
              to="/awards"
              className="ff-body text-xs text-[#9b8aa8] tracking-[0.2em] uppercase hover:text-white transition-colors mb-6 inline-flex items-center gap-2"
            >
              ← Back to Awards
            </Link>
            <p className="ff-body text-xs tracking-[0.4em] text-[#9b8aa8] uppercase mb-3 mt-4">
              Category
            </p>
            <h1 className="ff-display text-4xl md:text-5xl text-white">
              {decodedCategory}
            </h1>
            <p className="ff-body text-sm text-[#6b6b6b] mt-3">
              Top 10 most loved fragrances — voted by the community
            </p>
          </div>
        </div>

        {/* Perfume List */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#9b8aa8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : perfumes.length === 0 ? (
            <div className="text-center py-20">
              <p className="ff-body text-[#6b6b6b] text-sm">
                No perfumes in this category yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {perfumes.map((perfume, i) => (
                <div
                  key={perfume.id}
                  className="flex items-center gap-6 p-5 border border-[#1e1e1e] rounded-lg hover:border-[#2e2e2e] transition-all duration-300"
                >
                  {/* Rank */}
                  <span className="ff-display text-3xl text-[#9b8aa8] opacity-40 min-w-[50px] text-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Image */}
                  {perfume.imageUrl ? (
                    <img
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      className="w-16 h-24 object-contain rounded-md border border-[#2e2e2e] flex-shrink-0 bg-[#1a1a1a]"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#1e1e1e] rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌸</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="ff-display text-white text-lg">
                      {perfume.name}
                    </p>
                    <p className="ff-body text-[#9b8aa8] text-sm mt-0.5">
                      {perfume.brand}
                    </p>
                    {perfume.description && (
                      <p className="ff-body text-[#6b6b6b] text-xs mt-1 line-clamp-1">
                        {perfume.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {perfume.gender && (
                        <span className="ff-body text-[10px] text-[#6b6b6b] border border-[#2e2e2e] px-2 py-0.5 rounded">
                          {perfume.gender}
                        </span>
                      )}
                      {perfume.year && (
                        <span className="ff-body text-[10px] text-[#6b6b6b]">
                          {perfume.year}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Like Button */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleLike(perfume.id)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                        likedIds.has(perfume.id)
                          ? "border-[#9b8aa8] bg-[#9b8aa8]/20 text-[#9b8aa8]"
                          : "border-[#2e2e2e] text-[#6b6b6b] hover:border-[#9b8aa8] hover:text-[#9b8aa8]"
                      }`}
                    >
                      ♥
                    </button>
                    <span className="ff-body text-xs text-[#6b6b6b]">
                      {perfume.totalLikes.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AwardsCategory;
