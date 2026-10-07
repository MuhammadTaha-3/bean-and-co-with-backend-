// Static marketing copy only. Products, categories, stock and orders come from the backend API.
export const formatPrice = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-PK")}`;

export const reviews = [
  {
    name: "Amara Osei",
    role: "Regular since 2021",
    quote:
      "The Caramel Cloud is the only reason my mornings function. Every cup tastes like someone cared about it.",
    rating: 5,
  },
  {
    name: "Daniyal Khan",
    role: "Coffee nerd",
    quote:
      "Their cold brew has zero bitterness and real fruit clarity. I've stopped brewing at home entirely.",
    rating: 5,
  },
  {
    name: "Lena Fischer",
    role: "Designer",
    quote: "Warm room, quiet music, ridiculous tiramisu. It became my second studio within a week.",
    rating: 5,
  },
];
