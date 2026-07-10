export type Aroma = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  description: string;
  notes: {
    top: string;
    heart: string;
    base: string;
  };
};

export const aromasData: Aroma[] = [
  {
    slug: "iris-flower",
    name: "Iris Flower",
    subtitle: "Floral • Powdery • Soft",
    image: "/images/iris-flower-perfume.png",
    description:
      "Aroma iris yang lembut dengan karakter powdery elegan. Sentuhan violet dan white musk menciptakan kesan bersih, mewah, dan menenangkan.",
    notes: {
      top: "Iris",
      heart: "Violet",
      base: "White Musk",
    },
  },

  {
    slug: "musk",
    name: "Musk",
    subtitle: "Clean • Soft • Warm",
    image: "/images/musk.png",
    description:
      "White musk yang bersih dengan sentuhan cashmeran dan amber yang hangat dan nyaman di kulit.",
    notes: {
      top: "White Musk",
      heart: "Cashmeran",
      base: "Amber",
    },
  },
];