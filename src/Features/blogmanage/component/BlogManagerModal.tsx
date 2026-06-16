import { useBlogManager } from "../hooks/useBlogManager";
import type { BlogManagerModalProps } from "../types/blogManagerTypes";
import AIGeneratorTab from "./AIGeneratorTab";
import ManageBlogTab from "./ManageBlogTab";

export default function BlogManagerModal({
  isOpen,
  onClose,
}: BlogManagerModalProps) {
  const {
    activeTab,
    setActiveTab,
    pendingPage,
    setPendingPage,
    publishedPage,
    setPublishedPage,
    formData,
    handleChange,
    isGenerating,
    isSaving,
    handleGenerateAI,
    handleSaveBlog,
    handleEditClick,
    handleDeleteClick,
    handleCancelEdit,
    editId,
    isEditingPending,
    isAdminOrOwner,
    isLoadingBlogs,
    currentPending,
    totalPendingPages,
    currentPublished,
    totalPublishedPages,
  } = useBlogManager(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 z-10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* HEADER DENGAN TAB KONTROL */}
        <div className="px-6 py-4 border-b border-gray-100 shrink-0 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === "ai"
                ? editId
                  ? isEditingPending
                    ? "🔍 Review & Approve Artikel"
                    : "✏️ Mode Edit Artikel"
                  : "✍️ Pembuat Artikel Blog AI"
                : "⚙️ Dashboard Admin Blog"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {activeTab === "ai"
                ? "Isi referensi singkat, biarkan Llama 3.3 merangkai sisanya."
                : "Pusat kontrol untuk meninjau, menyetujui, dan mengelola artikel."}
            </p>
          </div>

          <div className="flex bg-gray-200 p-1 rounded-lg mr-8">
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeTab === "ai"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              AI Generator
            </button>

            {isAdminOrOwner && (
              <button
                onClick={() => setActiveTab("manage")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === "manage"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Manage Blog
              </button>
            )}
          </div>
        </div>

        {/* PEMANGGILAN KOMPONEN BERDASARKAN TAB */}
        {activeTab === "ai" ? (
          <AIGeneratorTab
            formData={formData}
            handleChange={handleChange}
            isGenerating={isGenerating}
            handleGenerateAI={handleGenerateAI}
            editId={editId}
            isAdminOrOwner={isAdminOrOwner}
            handleCancelEdit={handleCancelEdit}
            handleSaveBlog={handleSaveBlog}
            isSaving={isSaving}
            isEditingPending={isEditingPending}
          />
        ) : (
          <ManageBlogTab
            currentPending={currentPending}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            setPendingPage={setPendingPage}
            pendingPage={pendingPage}
            totalPendingPages={totalPendingPages}
            isLoadingBlogs={isLoadingBlogs}
            currentPublished={currentPublished}
            setPublishedPage={setPublishedPage}
            publishedPage={publishedPage}
            totalPublishedPages={totalPublishedPages}
          />
        )}
      </div>
    </div>
  );
}