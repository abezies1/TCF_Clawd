export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "truffles" | "bars" | "barks" | "drinks" | "gifts";
  image: string;
}

export const products: Product[] = [
  {
    id: "truffle-dark",
    name: "Dark Chocolate Truffles",
    description:
      "Rich, velvety dark chocolate truffles made with 72% cacao. Box of 6.",
    price: 14.99,
    category: "truffles",
    image: "/images/dark-truffles.jpg",
  },
  {
    id: "truffle-salted-caramel",
    name: "Salted Caramel Truffles",
    description:
      "Smooth caramel center with a hint of Sonoran sea salt. Box of 6.",
    price: 16.99,
    category: "truffles",
    image: "/images/salted-caramel-truffles.jpg",
  },
  {
    id: "truffle-chile",
    name: "Chile Chocolate Truffles",
    description:
      "Arizona-inspired truffles with a gentle Hatch green chile kick. Box of 6.",
    price: 16.99,
    category: "truffles",
    image: "/images/chile-truffles.jpg",
  },
  {
    id: "truffle-prickly-pear",
    name: "Prickly Pear Truffles",
    description:
      "White chocolate truffles infused with real prickly pear cactus fruit. Box of 6.",
    price: 17.99,
    category: "truffles",
    image: "/images/prickly-pear-truffles.jpg",
  },
  {
    id: "bar-milk",
    name: "Classic Milk Chocolate Bar",
    description: "Creamy milk chocolate bar, hand-tempered. 3.5 oz.",
    price: 8.99,
    category: "bars",
    image: "/images/milk-bar.jpg",
  },
  {
    id: "bar-dark-72",
    name: "72% Dark Chocolate Bar",
    description: "Intense single-origin dark chocolate bar. 3.5 oz.",
    price: 9.99,
    category: "bars",
    image: "/images/dark-bar.jpg",
  },
  {
    id: "bar-almond",
    name: "Almond Toffee Crunch Bar",
    description: "Milk chocolate with roasted almonds and buttery toffee. 3.5 oz.",
    price: 10.99,
    category: "bars",
    image: "/images/almond-bar.jpg",
  },
  {
    id: "bark-peppermint",
    name: "Peppermint Bark",
    description: "Layers of dark and white chocolate with crushed peppermint. 6 oz.",
    price: 12.99,
    category: "barks",
    image: "/images/peppermint-bark.jpg",
  },
  {
    id: "bark-desert",
    name: "Desert Trail Mix Bark",
    description:
      "Dark chocolate bark loaded with pecans, dried cranberries, and pumpkin seeds. 6 oz.",
    price: 13.99,
    category: "barks",
    image: "/images/desert-bark.jpg",
  },
  {
    id: "drink-hot-cocoa",
    name: "Hot Cocoa Mix",
    description:
      "Premium hot cocoa mix made from real chocolate shavings. Makes 8 servings.",
    price: 11.99,
    category: "drinks",
    image: "/images/hot-cocoa.jpg",
  },
  {
    id: "drink-mocha",
    name: "Chocolate Mocha Mix",
    description:
      "Rich chocolate blended with roasted coffee. Just add hot water. Makes 8 servings.",
    price: 12.99,
    category: "drinks",
    image: "/images/mocha-mix.jpg",
  },
  {
    id: "gift-sampler",
    name: "TCF Sampler Box",
    description:
      "A curated selection of our bestsellers: 4 truffles, 1 bar, and a bark piece. Perfect gift.",
    price: 29.99,
    category: "gifts",
    image: "/images/sampler-box.jpg",
  },
  {
    id: "gift-deluxe",
    name: "Deluxe Gift Box",
    description:
      "The ultimate chocolate experience: 12 truffles, 2 bars, bark, and a hot cocoa mix.",
    price: 54.99,
    category: "gifts",
    image: "/images/deluxe-box.jpg",
  },
];

export const categories = [
  { id: "all", label: "All" },
  { id: "truffles", label: "Truffles" },
  { id: "bars", label: "Bars" },
  { id: "barks", label: "Barks" },
  { id: "drinks", label: "Drinks" },
  { id: "gifts", label: "Gift Boxes" },
] as const;
