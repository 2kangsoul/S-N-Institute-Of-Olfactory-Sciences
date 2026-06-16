// 1. Kita buat dan export Type-nya agar bisa dipakai oleh komponen lain
export interface AromaType {
  id: string;
  name: string;
  desc: string;
  imageUrl: string;
}

// 2. Kita pindahkan data dummy dari App.tsx ke sini, lalu di-export
export const aromasData: AromaType[] = [
  {
    id: "Iris Flower",
    name: "Iris Flower",
    desc: "A blend of fresh damask rose with layers of warm amber and sensual vanilla.",
    imageUrl: "Iris.png",
  },
  {
    id: "Musk",
    name: "Musk",
    desc: "Calming sandalwood combined with soft white musk for a gentle, enduring scent.",
    imageUrl: "Musk.png",
  },
  {
    id: "Saffron",
    name: "Saffron",
    desc: "Effervescent mandarin and bergamot, lifted by touches of jasmine and neroli.",
    imageUrl: "Saffron.png",
  },
  {
    id: "Vanila",
    name: "Vanilla",
    desc: "The soothing properties of French Lavender, Enhanced by sage and bergamot.",
    imageUrl: "Vanila.png",
  },
  {
    id: "Pineapple",
    name: "Pineapple",
    desc: "Rich, bold oud wood, deepened with black pepper and cardamom.",
    imageUrl: "Pineapple.png",
  },
  {
    id: "Bergamot",
    name: "Bergamot",
    desc: "The crispness of salty sea air with the herbal freshness of sage and ambrette.",
    imageUrl: "Bergamot.png",
  },
];