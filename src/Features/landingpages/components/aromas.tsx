
import { Link } from "react-router-dom";

// Mendefinisikan tipe data untuk props menggunakan TypeScript
interface AromaProps {
  id: string;
  name: string;
  desc: string;
  imageUrl: string;
}

// Komponen AromaCard menerima props sesuai dengan tipe data di atas
export default function AromaCard({ id, name, desc, imageUrl }: AromaProps) {
  return (
    <Link to={`/aroma/${id}`} className="block group cursor-pointer">
      <div className="w-full bg-white aspect-video mb-5 flex items-center justify-center overflow-hidden shadow-sm">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-gray-600 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        {desc}
      </p>
    </Link>
  );
}

