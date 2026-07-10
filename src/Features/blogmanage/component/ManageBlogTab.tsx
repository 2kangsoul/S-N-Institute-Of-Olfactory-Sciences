// @ts-nocheck
/* eslint-disable */
import React from "react";
import type { BlogItem } from "../types/blogManagerTypes";

interface ManageBlogTabProps {
  currentPending: BlogItem[];
  handleEditClick: (blog: BlogItem) => void;
  handleDeleteClick: (id: string) => void; // UPDATE: objectId menjadi id
  setPendingPage: React.Dispatch<React.SetStateAction<number>>;
  pendingPage: number;
  totalPendingPages: number;
  isLoadingBlogs: boolean;
  currentPublished: BlogItem[];
  setPublishedPage: React.Dispatch<React.SetStateAction<number>>;
  publishedPage: number;
  totalPublishedPages: number;
}

export default function ManageBlogTab({
  currentPending,
  handleEditClick,
  handleDeleteClick,
  setPendingPage,
  pendingPage,
  totalPendingPages,
  isLoadingBlogs,
  currentPublished,
  setPublishedPage,
  publishedPage,
  totalPublishedPages,
}: ManageBlogTabProps) {
  return (
    <div className="flex-1 overflow-hidden p-6 bg-[#f4f2ee]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        {/* KOLOM KIRI (APPROVAL BLOG) */}
        <div className="lg:col-span-5 flex flex-col h-full border border-red-200 rounded-xl overflow-hidden bg-white shadow-md">
          <div className="bg-red-50 px-4 py-3 border-b border-red-200 shrink-0">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Approval Blog
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {currentPending.length > 0 ? (
              currentPending.map((item) => (
                <div
                  key={item.id} // UPDATE: objectId diganti id
                  className="p-4 border border-gray-100 rounded-lg flex justify-between items-center shadow-sm hover:border-red-300 transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">
                      Oleh: {item.author || "User"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-4 py-2 bg-[#800000] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-900 transition-colors shadow-sm"
                    >
                      Full Review
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id!)} // UPDATE: objectId diganti id
                      className="px-4 py-2 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-200 transition-colors shadow-sm"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-xs font-medium">
                  Belum ada pengajuan artikel baru...
                </span>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
            <button
              onClick={() => setPendingPage((p) => Math.max(1, p - 1))}
              disabled={pendingPage === 1}
              className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500 font-medium">
              Page {pendingPage} of {totalPendingPages}
            </span>
            <button
              onClick={() =>
                setPendingPage((p) => Math.min(totalPendingPages, p + 1))
              }
              disabled={pendingPage === totalPendingPages}
              className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {/* KOLOM KANAN (MANAGE BLOG) */}
        <div className="lg:col-span-7 flex flex-col h-full border border-blue-200 rounded-xl overflow-hidden bg-white shadow-md">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 shrink-0">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Manage Blog
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 relative">
            {isLoadingBlogs ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <span className="animate-pulse font-bold text-blue-600">
                  Memuat Data...
                </span>
              </div>
            ) : currentPublished.length > 0 ? (
              currentPublished.map((blog) => (
                <div
                  key={blog.id} // UPDATE: objectId diganti id
                  className="p-4 border border-gray-100 rounded-lg flex justify-between items-center shadow-sm hover:border-blue-300 transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1 line-clamp-1 pr-4">
                      {blog.title}
                    </p>
                    <div className="flex gap-2 items-center">
                      <span className="text-[9px] bg-gray-900 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {blog.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {blog.publishDate || "Tanggal tidak diketahui"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEditClick(blog)}
                      className="px-4 py-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-yellow-200 transition-colors shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog.id!)} // UPDATE: objectId diganti id
                      className="px-4 py-2 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-red-200 transition-colors shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                <span className="text-xs font-medium">
                  Data blog Anda masih kosong.
                </span>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
            <button
              onClick={() => setPublishedPage((p) => Math.max(1, p - 1))}
              disabled={publishedPage === 1}
              className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500 font-medium">
              Page {publishedPage} of {totalPublishedPages}
            </span>
            <button
              onClick={() =>
                setPublishedPage((p) => Math.min(totalPublishedPages, p + 1))
              }
              disabled={publishedPage === totalPublishedPages}
              className="px-4 py-1.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}