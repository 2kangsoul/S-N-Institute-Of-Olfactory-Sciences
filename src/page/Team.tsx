// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from "react";

// Tipe data untuk anggota tim
interface TeamMember {
  id: string;
  name: string;
  photo: string;
  role: string;
  bio: string;
}

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Daftar Role dan Bio buatan kita untuk disuntikkan ke data random API
  const roles = [
    "Master Perfumer",
    "Scent Designer",
    "Head of Quality Control",
    "Brand Director",
    "Fragrance Evaluator",
    "Creative Director"
  ];
  
  const bios = [
    "Ahli meracik aroma kompleks dengan performa beast mode yang tak terlupakan.",
    "Memiliki ketajaman insting dalam memadukan notes klasik dan modern.",
    "Memastikan setiap tetes parfum memenuhi standar kualitas tertinggi industri.",
    "Mengatur visi dan arah koleksi eksklusif untuk pasar yang spesifik.",
    "Spesialis dalam mengevaluasi sillage dan longevity dari setiap formula.",
    "Otak di balik visual dan estetika brand yang elegan dan berkelas."
  ];

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // Mengambil 6 data user random dari API
        const response = await fetch("https://randomuser.me/api/?results=6");
        const data = await response.json();

        // Mapping (mencocokkan) data API dengan Role dan Bio kita
        const formattedTeam = data.results.map((user: any, index: number) => ({
          id: user.login.uuid,
          name: `${user.name.first} ${user.name.last}`,
          photo: user.picture.large,
          role: roles[index % roles.length],
          bio: bios[index % bios.length],
        }));

        setTeam(formattedTeam);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data tim:", error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f2ee] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Meet The Artisans
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Di balik setiap botol mahakarya SNN Institute Of Olfactory Sciences, terdapat dedikasi, ketelitian, dan keahlian dari para profesional terbaik di industri wewangian.
          </p>
        </div>

        {/* TEAM GRID SECTION */}
        {loading ? (
          // Animasi Loading (Skeleton) saat fetching data
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-40 h-40 bg-gray-300 rounded-full mb-6"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-gray-300 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          // Menampilkan Data Tim dari randomuser.me
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member) => (
              <div key={member.id} className="flex flex-col items-center text-center group">
                
                {/* PHOTO */}
                <div className="relative mb-6 overflow-hidden rounded-full w-40 h-40 border-4 border-white shadow-lg transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* NAME & ROLE */}
                <h3 className="text-xl font-bold text-gray-900 capitalize mb-1">
                  {member.name}
                </h3>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F58427] mb-4">
                  {member.role}
                </span>

                {/* SHORT BIO */}
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
                  "{member.bio}"
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}