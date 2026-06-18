import { Link } from "react-router-dom";

// Define data types for props using TypeScript
interface AromaProps {
  id: string;
  name: string;
  desc: string;
  imageUrl: string;
}

// The AromaCard component receives props according to the data type above
export default function AromaCard({ id, name, desc, imageUrl }: AromaProps) {
  return (
    <Link to={`/aroma/${id}`} className="block group cursor-pointer">
      <div className="w-full bg-stone-100 aspect-[3/4] mb-5 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <h3 className="text-sm uppercase tracking-[0.2em] text-stone-800 mb-2 transition-colors group-hover:text-stone-400">
        {name}
      </h3>
      <p className="text-sm text-stone-500 leading-relaxed font-light">
        {desc}
      </p>
    </Link>
  );
}
