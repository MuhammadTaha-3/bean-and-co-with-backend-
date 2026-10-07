// Starter menu, loaded into MongoDB only when the database is completely empty.
// `image` values are paths served by the frontend (frontend/public/images).
export type SeedProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  notes: string;
  description: string;
  roast: string;
  best?: boolean;
};

const latte = "/images/p-latte.jpg";
const black = "/images/p-black.jpg";
const mocha = "/images/p-mocha.jpg";
const espresso = "/images/p-espresso.jpg";
const tiramisu = "/images/p-tiramisu.jpg";
const beans = "/images/p-beans.jpg";
const icedMacchiato = "/images/iced-macchiato.jpg";
const icedFrappe = "/images/iced-frappe.jpg";
const icedTonic = "/images/iced-tonic.jpg";

const starter: SeedProduct[] = [
  {
    id: "caramel-latte",
    name: "Caramel Cloud Latte",
    category: "Signature",
    price: 1450,
    image: latte,
    notes: "Salted caramel · Oat milk",
    description:
      "Slow-pulled espresso layered over cold oat milk and a ribbon of house salted caramel. Sweet, silky, never cloying.",
    roast: "Medium roast",
    best: true,
  },
  {
    id: "black-iced",
    name: "Midnight Black Iced",
    category: "Cold Brew",
    price: 950,
    image: black,
    notes: "18h steeped · Low acidity",
    description:
      "Eighteen hours of cold steeping brings out cocoa and dark cherry, poured over clear ice with an optional cream fall.",
    roast: "Dark roast",
    best: true,
  },
  {
    id: "coffee-mocha",
    name: "Velvet Coffee Mocha",
    category: "Signature",
    price: 1150,
    image: mocha,
    notes: "70% cacao · Steamed milk",
    description:
      "Single-origin cacao melted into espresso and finished with a cloud of microfoam and a chocolate lattice.",
    roast: "Medium-dark roast",
    best: true,
  },
  {
    id: "double-espresso",
    name: "Double Ristretto",
    category: "Espresso",
    price: 650,
    image: espresso,
    notes: "Short pull · Thick crema",
    description:
      "A concentrated pull with a syrupy body, hazelnut sweetness and a long, clean finish. Our purest expression.",
    roast: "Dark roast",
  },
  {
    id: "tiramisu",
    name: "Espresso Tiramisu",
    category: "Bakery",
    price: 1250,
    image: tiramisu,
    notes: "Mascarpone · Cocoa dust",
    description:
      "Ladyfingers soaked in our house espresso, layered with mascarpone cream and a heavy dust of bitter cocoa.",
    roast: "Dessert",
  },
  {
    id: "house-beans",
    name: "House Roast Beans",
    category: "Beans",
    price: 3400,
    image: beans,
    notes: "100% Arabica · 340g",
    description:
      "Our everyday blend, roasted weekly in small batches. Balanced brown sugar, toasted almond and dried fig.",
    roast: "Medium roast",
  },
];

const iced: SeedProduct[] = [
  {
    id: "iced-caramel-macchiato",
    name: "Iced Caramel Macchiato",
    category: "Cold Brew",
    price: 1350,
    image: icedMacchiato,
    notes: "House caramel · Cold milk",
    description:
      "Chilled milk poured over clear ice, marked with a double shot and finished with slow ribbons of house caramel.",
    roast: "Medium roast",
  },
  {
    id: "coffee-frappe",
    name: "Classic Coffee Frappé",
    category: "Cold Brew",
    price: 1150,
    image: icedFrappe,
    notes: "Blended · Whipped cream",
    description:
      "Espresso blended thick with ice and milk, crowned with whipped cream, cocoa dust and a single roasted bean.",
    roast: "Medium-dark roast",
  },
  {
    id: "espresso-tonic",
    name: "Espresso Tonic",
    category: "Cold Brew",
    price: 1050,
    image: icedTonic,
    notes: "Sparkling · Orange peel",
    description:
      "A bright double shot floated over sparkling tonic and clear ice, lifted with fresh orange. Sharp, fizzy, alive.",
    roast: "Light roast",
  },
];

export const seedProducts: SeedProduct[] = [...starter, ...iced];
