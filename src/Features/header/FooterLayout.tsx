export default function Footer() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-4 mt-10">
        <hr className="border-t border-gray-300" />
      </div>

      <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-center text-gray-500">
        <div className="flex flex-col items-center justify-center gap-2">
          <img
            src="/SaaFragrance.png"
            alt="Saa Fragrance Logo"
            className="h-8 object-contain grayscale opacity-60"
          />
          <p className="mt-2">Timeless scents for the modern soul.</p>
          <p>
            &copy; {new Date().getFullYear()} Saa Fragrance. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
