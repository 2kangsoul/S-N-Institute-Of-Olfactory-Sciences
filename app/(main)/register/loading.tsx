export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>

        <p className="text-lg font-medium text-white">
          Loading...
        </p>
      </div>
    </div>
  );
}