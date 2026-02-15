/**
 * Rich product catalog with tasting notes, origin stories, and pairing data.
 * Extends the base product model with the "chocolate experience" layer.
 */

export interface TastingNote {
  intensity: number; // 1-5
  sweetness: number;
  bitterness: number;
  acidity: number;
  fruitiness: number;
  nuttiness: number;
  spiciness: number;
  creaminess: number;
  primaryFlavors: string[];
  finishNotes: string;
}

export interface OriginStory {
  region: string;
  country: string;
  farm?: string;
  altitude?: string;
  cacaoVariety: string;
  harvestSeason: string;
  story: string;
}

export interface Pairing {
  category: "wine" | "coffee" | "cheese" | "spirits" | "other";
  name: string;
  description: string;
}

export interface RichProduct {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: "truffles" | "bars" | "barks" | "drinks" | "gifts" | "seasonal" | "limited";
  image: string;
  gallery: string[];
  cacaoPercentage?: number;
  weight: string;
  ingredients: string[];
  allergens: string[];
  tastingNotes: TastingNote;
  origin?: OriginStory;
  pairings: Pairing[];
  tags: string[];
  isNew: boolean;
  isLimited: boolean;
  isMembersOnly: boolean;
  isPreOrder: boolean;
  preOrderDate?: string;
  availableQuantity?: number;
  flavorProfile: string[]; // for quiz matching
}

export const richProducts: RichProduct[] = [
  {
    id: "truffle-dark",
    name: "Dark Chocolate Truffles",
    description: "Rich, velvety dark chocolate truffles made with 72% cacao. Box of 6.",
    longDescription: "Our signature dark chocolate truffles are handcrafted daily using single-origin Ecuadorian cacao. Each truffle features a silky ganache center enrobed in a thin dark chocolate shell, finished with a light dusting of Dutch cocoa powder. The result is a deeply satisfying chocolate experience that melts on the tongue with notes of dark cherry and toasted walnut.",
    price: 14.99,
    category: "truffles",
    image: "/images/dark-truffles.jpg",
    gallery: ["/images/dark-truffles.jpg", "/images/dark-truffles-box.jpg", "/images/dark-truffles-close.jpg"],
    cacaoPercentage: 72,
    weight: "4.2 oz",
    ingredients: ["Ecuadorian cacao", "cocoa butter", "cream", "vanilla", "Dutch cocoa powder"],
    allergens: ["milk", "soy"],
    tastingNotes: {
      intensity: 4, sweetness: 2, bitterness: 3, acidity: 2,
      fruitiness: 3, nuttiness: 2, spiciness: 1, creaminess: 4,
      primaryFlavors: ["dark cherry", "toasted walnut", "vanilla"],
      finishNotes: "Long, smooth finish with lingering dark fruit notes"
    },
    origin: {
      region: "Esmeraldas", country: "Ecuador", farm: "Hacienda Victoria",
      altitude: "200m", cacaoVariety: "Nacional", harvestSeason: "June - November",
      story: "From the lush coastal province of Esmeraldas, our Nacional cacao beans are grown at Hacienda Victoria, a third-generation family farm. The volcanic soil and tropical humidity create beans with exceptional depth and a distinctive floral aroma that defines our signature truffle."
    },
    pairings: [
      { category: "wine", name: "Cabernet Sauvignon", description: "The tannins complement the dark chocolate intensity" },
      { category: "coffee", name: "Ethiopian Yirgacheffe", description: "Fruity coffee notes echo the cherry in the truffle" },
      { category: "spirits", name: "Aged Rum", description: "Caramel notes of rum enhance the chocolate's warmth" },
      { category: "cheese", name: "Manchego", description: "Nutty, firm cheese creates a savory-sweet contrast" }
    ],
    tags: ["bestseller", "signature", "single-origin"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["dark", "intense", "fruity", "classic"]
  },
  {
    id: "truffle-salted-caramel",
    name: "Salted Caramel Truffles",
    description: "Smooth caramel center with a hint of Sonoran sea salt. Box of 6.",
    longDescription: "A perfect balance of sweet and savory. Our salted caramel truffles begin with a buttery caramel made from scratch, seasoned with hand-harvested Sonoran sea salt. This liquid gold center is encased in our house milk chocolate blend, creating a truffle that bursts with flavor from the first bite.",
    price: 16.99,
    category: "truffles",
    image: "/images/salted-caramel-truffles.jpg",
    gallery: ["/images/salted-caramel-truffles.jpg"],
    cacaoPercentage: 38,
    weight: "4.2 oz",
    ingredients: ["milk chocolate", "cream", "butter", "sugar", "Sonoran sea salt", "vanilla"],
    allergens: ["milk", "soy"],
    tastingNotes: {
      intensity: 3, sweetness: 4, bitterness: 1, acidity: 1,
      fruitiness: 1, nuttiness: 1, spiciness: 0, creaminess: 5,
      primaryFlavors: ["butterscotch", "sea salt", "cream"],
      finishNotes: "Sweet-salty finish that lingers pleasantly"
    },
    pairings: [
      { category: "coffee", name: "Colombian Medium Roast", description: "Smooth coffee pairs perfectly with the caramel" },
      { category: "spirits", name: "Bourbon", description: "Vanilla and oak notes amplify the caramel" },
      { category: "wine", name: "Moscato d'Asti", description: "Light sweetness echoes the caramel without overpowering" },
      { category: "cheese", name: "Brie", description: "Creamy brie and caramel create an indulgent pairing" }
    ],
    tags: ["bestseller", "customer-favorite"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["sweet", "salty", "creamy", "indulgent"]
  },
  {
    id: "truffle-chile",
    name: "Chile Chocolate Truffles",
    description: "Arizona-inspired truffles with a gentle Hatch green chile kick. Box of 6.",
    longDescription: "Our love letter to the Southwest. These truffles feature a dark chocolate ganache infused with roasted Hatch green chiles from New Mexico. The heat builds slowly — a gentle warmth that enhances rather than overwhelms the chocolate. Finished with a flake of red Aleppo pepper on top.",
    price: 16.99,
    category: "truffles",
    image: "/images/chile-truffles.jpg",
    gallery: ["/images/chile-truffles.jpg"],
    cacaoPercentage: 65,
    weight: "4.2 oz",
    ingredients: ["dark chocolate", "cream", "Hatch green chile", "Aleppo pepper", "vanilla"],
    allergens: ["milk", "soy"],
    tastingNotes: {
      intensity: 4, sweetness: 2, bitterness: 2, acidity: 1,
      fruitiness: 2, nuttiness: 1, spiciness: 4, creaminess: 3,
      primaryFlavors: ["roasted chile", "dark chocolate", "smoky heat"],
      finishNotes: "Slow-building warmth with a smoky, earthy chocolate finish"
    },
    origin: {
      region: "Hatch Valley", country: "USA (New Mexico)",
      cacaoVariety: "Trinitario blend", harvestSeason: "August - September",
      story: "The chiles in these truffles come from Hatch Valley, New Mexico — the chile capital of the world. Each August, we source freshly roasted green chiles and infuse them into our ganache within 48 hours of roasting for maximum flavor."
    },
    pairings: [
      { category: "spirits", name: "Mezcal", description: "Smoky mezcal amplifies the chile's warmth" },
      { category: "wine", name: "Malbec", description: "Bold red wine stands up to the spice" },
      { category: "coffee", name: "Mexican Chiapas", description: "Earthy coffee complements the southwestern flavors" },
      { category: "cheese", name: "Pepper Jack", description: "A spicy pairing for the bold palate" }
    ],
    tags: ["local-favorite", "southwestern", "spicy"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["spicy", "bold", "dark", "adventurous"]
  },
  {
    id: "truffle-prickly-pear",
    name: "Prickly Pear Truffles",
    description: "White chocolate truffles infused with real prickly pear cactus fruit. Box of 6.",
    longDescription: "A taste of the Sonoran Desert. These stunning magenta truffles are made with real prickly pear cactus fruit harvested from the desert around Tucson. The naturally vibrant color needs no artificial dyes — the fruit provides both the gorgeous hue and a delicate, watermelon-like sweetness that pairs beautifully with our white chocolate.",
    price: 17.99,
    category: "truffles",
    image: "/images/prickly-pear-truffles.jpg",
    gallery: ["/images/prickly-pear-truffles.jpg"],
    cacaoPercentage: 33,
    weight: "4.2 oz",
    ingredients: ["white chocolate", "cream", "prickly pear puree", "lemon zest"],
    allergens: ["milk", "soy"],
    tastingNotes: {
      intensity: 2, sweetness: 4, bitterness: 0, acidity: 2,
      fruitiness: 5, nuttiness: 0, spiciness: 0, creaminess: 4,
      primaryFlavors: ["prickly pear", "watermelon", "citrus"],
      finishNotes: "Light, refreshing finish with tropical fruit notes"
    },
    origin: {
      region: "Sonoran Desert", country: "USA (Arizona)",
      cacaoVariety: "White chocolate blend", harvestSeason: "September - October",
      story: "Every fall, we forage prickly pear fruit from the Sonoran Desert surrounding Tucson. The bright magenta fruit is carefully processed to extract its jewel-toned juice, which we fold into our white chocolate ganache. It's a truffle that could only come from Arizona."
    },
    pairings: [
      { category: "wine", name: "Rosé", description: "A perfect pink-on-pink pairing" },
      { category: "spirits", name: "Prickly Pear Margarita", description: "Double down on the desert flavor" },
      { category: "cheese", name: "Fresh Chèvre", description: "Tangy goat cheese and sweet fruit" },
      { category: "coffee", name: "Cold Brew", description: "Smooth cold brew lets the fruit shine" }
    ],
    tags: ["local-favorite", "arizona", "unique", "instagram-worthy"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["fruity", "sweet", "light", "unique"]
  },
  {
    id: "bar-dark-72",
    name: "72% Dark Chocolate Bar",
    description: "Intense single-origin dark chocolate bar. 3.5 oz.",
    longDescription: "Our bean-to-bar dark chocolate starts with carefully selected Criollo cacao from Peru's Marañón Canyon — home to the rarest cacao in the world. We roast, crack, winnow, and conche the beans in our Tucson workshop, producing a bar with remarkable complexity: notes of dried fig, dark berry, and a whisper of tobacco.",
    price: 9.99,
    category: "bars",
    image: "/images/dark-bar.jpg",
    gallery: ["/images/dark-bar.jpg", "/images/dark-bar-snap.jpg"],
    cacaoPercentage: 72,
    weight: "3.5 oz",
    ingredients: ["Peruvian cacao", "cane sugar", "cocoa butter"],
    allergens: [],
    tastingNotes: {
      intensity: 5, sweetness: 1, bitterness: 4, acidity: 3,
      fruitiness: 3, nuttiness: 2, spiciness: 1, creaminess: 1,
      primaryFlavors: ["dried fig", "dark berry", "tobacco"],
      finishNotes: "Complex, evolving finish — fruit gives way to earth and spice"
    },
    origin: {
      region: "Marañón Canyon", country: "Peru", farm: "Cooperativa Norandino",
      altitude: "1,200m", cacaoVariety: "Criollo (Pure Nacional)", harvestSeason: "April - July",
      story: "In 2011, scientists discovered a population of pure Nacional cacao trees in Peru's remote Marañón Canyon — a variety thought to be extinct. We're privileged to work directly with the Cooperativa Norandino to bring this rare cacao to Tucson, where we transform it into bars that showcase its extraordinary complexity."
    },
    pairings: [
      { category: "wine", name: "Zinfandel", description: "Bold, jammy wine with dark chocolate is classic" },
      { category: "coffee", name: "Sumatra Mandheling", description: "Earthy, full-bodied coffee matches the intensity" },
      { category: "spirits", name: "Single Malt Scotch", description: "Smoky and complex — a sophisticated pairing" },
      { category: "cheese", name: "Aged Gouda", description: "Caramel notes in the cheese complement the dark bar" }
    ],
    tags: ["bean-to-bar", "single-origin", "vegan", "rare"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["dark", "intense", "complex", "sophisticated"]
  },
  {
    id: "bar-milk",
    name: "Classic Milk Chocolate Bar",
    description: "Creamy milk chocolate bar, hand-tempered. 3.5 oz.",
    longDescription: "Our classic milk chocolate bar is the one that started it all. Made with whole milk from a local Arizona dairy and Ghanaian cacao, this bar is everything milk chocolate should be — creamy, smooth, and deeply satisfying. Hand-tempered for a perfect snap.",
    price: 8.99,
    category: "bars",
    image: "/images/milk-bar.jpg",
    gallery: ["/images/milk-bar.jpg"],
    cacaoPercentage: 38,
    weight: "3.5 oz",
    ingredients: ["Ghanaian cacao", "whole milk powder", "cane sugar", "cocoa butter", "vanilla"],
    allergens: ["milk"],
    tastingNotes: {
      intensity: 2, sweetness: 4, bitterness: 1, acidity: 1,
      fruitiness: 1, nuttiness: 2, spiciness: 0, creaminess: 5,
      primaryFlavors: ["cream", "malt", "honey"],
      finishNotes: "Smooth, milky finish with a hint of vanilla"
    },
    pairings: [
      { category: "coffee", name: "Latte", description: "Creamy meets creamy for the ultimate comfort pairing" },
      { category: "wine", name: "Riesling", description: "Light, sweet wine balances the milk chocolate" },
      { category: "spirits", name: "Irish Cream", description: "An indulgent dessert pairing" },
      { category: "cheese", name: "Mascarpone", description: "Double cream dream" }
    ],
    tags: ["classic", "crowd-pleaser", "kid-friendly"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["sweet", "creamy", "classic", "mild"]
  },
  {
    id: "bar-almond",
    name: "Almond Toffee Crunch Bar",
    description: "Milk chocolate with roasted almonds and buttery toffee. 3.5 oz.",
    longDescription: "Crunchy, buttery, and irresistible. We roast California almonds in-house, fold them into our handmade English-style toffee, then cover the whole thing in milk chocolate. The result is a bar with incredible texture — every bite delivers a satisfying crunch followed by smooth, creamy milk chocolate.",
    price: 10.99,
    category: "bars",
    image: "/images/almond-bar.jpg",
    gallery: ["/images/almond-bar.jpg"],
    cacaoPercentage: 38,
    weight: "3.5 oz",
    ingredients: ["milk chocolate", "almonds", "butter", "sugar", "sea salt"],
    allergens: ["milk", "tree nuts"],
    tastingNotes: {
      intensity: 3, sweetness: 4, bitterness: 1, acidity: 0,
      fruitiness: 0, nuttiness: 5, spiciness: 0, creaminess: 3,
      primaryFlavors: ["roasted almond", "butter toffee", "caramel"],
      finishNotes: "Buttery toffee aftertaste with lingering toasted nut"
    },
    pairings: [
      { category: "coffee", name: "Hazelnut Coffee", description: "Nut-on-nut perfection" },
      { category: "spirits", name: "Amaretto", description: "Almond liqueur amplifies the nutty notes" },
      { category: "wine", name: "Tawny Port", description: "Caramel and nut notes mirror the bar" },
      { category: "cheese", name: "Gruyère", description: "Nutty cheese with nutty chocolate" }
    ],
    tags: ["crunchy", "textured", "crowd-pleaser"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["nutty", "sweet", "crunchy", "indulgent"]
  },
  {
    id: "seasonal-lavender-honey",
    name: "Lavender Honey Truffles",
    description: "Spring collection — Arizona lavender and Sonoran honey in white chocolate.",
    longDescription: "A taste of spring in the Sonoran Desert. These ethereal truffles combine locally grown lavender from a farm in Oracle, AZ with raw mesquite honey from Sonoran bees. The result is a floral, herbaceous truffle that's both sophisticated and deeply connected to our Arizona terroir.",
    price: 19.99,
    category: "seasonal",
    image: "/images/lavender-honey.jpg",
    gallery: ["/images/lavender-honey.jpg"],
    cacaoPercentage: 33,
    weight: "4.2 oz",
    ingredients: ["white chocolate", "cream", "Arizona lavender", "mesquite honey", "vanilla"],
    allergens: ["milk", "soy"],
    tastingNotes: {
      intensity: 2, sweetness: 4, bitterness: 0, acidity: 1,
      fruitiness: 2, nuttiness: 0, spiciness: 1, creaminess: 4,
      primaryFlavors: ["lavender", "honey", "vanilla cream"],
      finishNotes: "Floral and sweet with a herbal, calming quality"
    },
    pairings: [
      { category: "wine", name: "Gewürztraminer", description: "Floral wine with floral chocolate" },
      { category: "coffee", name: "Lavender Latte", description: "Go all-in on the lavender theme" },
      { category: "spirits", name: "Gin & Tonic", description: "Botanical gin mirrors the herbal notes" },
      { category: "cheese", name: "Honey Goat Cheese", description: "Honey and floral in perfect harmony" }
    ],
    tags: ["seasonal", "spring", "floral", "local"],
    isNew: true, isLimited: true, isMembersOnly: false, isPreOrder: false,
    availableQuantity: 200,
    flavorProfile: ["floral", "sweet", "light", "unique"]
  },
  {
    id: "limited-mole",
    name: "Oaxacan Mole Bar",
    description: "Limited edition — dark chocolate with traditional mole spices.",
    longDescription: "Inspired by the complex mole sauces of Oaxaca, this limited-edition bar weaves together dark chocolate with cinnamon, ancho chile, toasted sesame, and a hint of banana. Each batch is hand-numbered and limited to 150 bars.",
    price: 14.99,
    category: "limited",
    image: "/images/mole-bar.jpg",
    gallery: ["/images/mole-bar.jpg"],
    cacaoPercentage: 68,
    weight: "3.5 oz",
    ingredients: ["dark chocolate", "cinnamon", "ancho chile", "sesame seeds", "banana", "clove"],
    allergens: ["sesame"],
    tastingNotes: {
      intensity: 5, sweetness: 2, bitterness: 3, acidity: 1,
      fruitiness: 2, nuttiness: 3, spiciness: 4, creaminess: 2,
      primaryFlavors: ["cinnamon", "ancho chile", "toasted sesame"],
      finishNotes: "Complex spiced finish that evolves with each bite"
    },
    origin: {
      region: "Oaxaca", country: "Mexico",
      cacaoVariety: "Criollo blend", harvestSeason: "November - March",
      story: "We developed this recipe alongside a Oaxacan mole master, spending weeks balancing the spice blend to complement rather than compete with the chocolate. Each bar captures the soul of a mole negro — deep, complex, and unforgettable."
    },
    pairings: [
      { category: "spirits", name: "Añejo Tequila", description: "Aged tequila's depth matches the mole's complexity" },
      { category: "wine", name: "Tempranillo", description: "Spanish red with Mexican-inspired chocolate" },
      { category: "coffee", name: "Oaxacan Pluma", description: "Stay in Oaxaca — coffee from the same region" },
      { category: "cheese", name: "Cotija", description: "Salty, crumbly cheese balances the spice" }
    ],
    tags: ["limited-edition", "numbered", "complex", "spicy"],
    isNew: true, isLimited: true, isMembersOnly: false, isPreOrder: false,
    availableQuantity: 150,
    flavorProfile: ["spicy", "complex", "bold", "adventurous"]
  },
  {
    id: "members-midnight",
    name: "Midnight Reserve Truffles",
    description: "Members-only — our darkest, most intense truffle. 85% cacao.",
    longDescription: "Reserved exclusively for our loyalty members. The Midnight Reserve is our boldest creation — an 85% cacao truffle made with a blend of three single-origin beans from Madagascar, Peru, and Tanzania. It's not for the faint of heart, but for true chocolate lovers, it's transcendent.",
    price: 22.99,
    category: "truffles",
    image: "/images/midnight-reserve.jpg",
    gallery: ["/images/midnight-reserve.jpg"],
    cacaoPercentage: 85,
    weight: "4.2 oz",
    ingredients: ["Madagascar cacao", "Peruvian cacao", "Tanzanian cacao", "cocoa butter", "cream"],
    allergens: ["milk"],
    tastingNotes: {
      intensity: 5, sweetness: 1, bitterness: 5, acidity: 3,
      fruitiness: 3, nuttiness: 2, spiciness: 2, creaminess: 2,
      primaryFlavors: ["red berries", "tobacco", "espresso"],
      finishNotes: "Extraordinarily long finish — evolving from bitter to fruity to earthy"
    },
    pairings: [
      { category: "coffee", name: "Double Espresso", description: "Intensity meets intensity" },
      { category: "spirits", name: "Cognac XO", description: "A pairing worthy of the truffle's depth" },
      { category: "wine", name: "Barolo", description: "Noble wine for a noble truffle" },
      { category: "cheese", name: "Roquefort", description: "Bold blue cheese for bold chocolate" }
    ],
    tags: ["members-only", "exclusive", "ultra-dark", "limited"],
    isNew: true, isLimited: true, isMembersOnly: true, isPreOrder: false,
    availableQuantity: 100,
    flavorProfile: ["dark", "intense", "bold", "sophisticated"]
  },
  {
    id: "preorder-summer-collection",
    name: "Summer Citrus Collection",
    description: "Pre-order — arriving June 2026. Lemon, blood orange, and yuzu truffles.",
    longDescription: "Our upcoming summer collection celebrates citrus in all its forms. Three varieties of truffle — bright Meyer lemon with white chocolate, blood orange with dark chocolate, and Japanese yuzu with milk chocolate. Available for pre-order now, shipping in June.",
    price: 24.99,
    category: "seasonal",
    image: "/images/summer-citrus.jpg",
    gallery: ["/images/summer-citrus.jpg"],
    cacaoPercentage: undefined,
    weight: "6.3 oz (18 pieces)",
    ingredients: ["assorted chocolate", "cream", "Meyer lemon", "blood orange", "yuzu"],
    allergens: ["milk", "soy"],
    tastingNotes: {
      intensity: 3, sweetness: 3, bitterness: 2, acidity: 4,
      fruitiness: 5, nuttiness: 0, spiciness: 0, creaminess: 3,
      primaryFlavors: ["Meyer lemon", "blood orange", "yuzu"],
      finishNotes: "Bright, citrusy finish that refreshes the palate"
    },
    pairings: [
      { category: "wine", name: "Prosecco", description: "Bubbles and citrus are a perfect match" },
      { category: "spirits", name: "Limoncello", description: "Italian sunshine in a glass" },
      { category: "coffee", name: "Iced Pour-Over", description: "Light, bright coffee for summer" },
      { category: "cheese", name: "Ricotta", description: "Fresh, light cheese complements the citrus" }
    ],
    tags: ["pre-order", "summer", "citrus", "upcoming"],
    isNew: true, isLimited: true, isMembersOnly: false, isPreOrder: true,
    preOrderDate: "2026-06-01",
    availableQuantity: 500,
    flavorProfile: ["fruity", "light", "refreshing", "bright"]
  },
  {
    id: "bark-peppermint",
    name: "Peppermint Bark",
    description: "Layers of dark and white chocolate with crushed peppermint. 6 oz.",
    longDescription: "A holiday favorite available year-round by popular demand. Layers of rich dark chocolate and creamy white chocolate are studded with crushed candy cane for a festive crunch. Each piece is hand-broken for a rustic, artisan look.",
    price: 12.99,
    category: "barks",
    image: "/images/peppermint-bark.jpg",
    gallery: ["/images/peppermint-bark.jpg"],
    weight: "6 oz",
    ingredients: ["dark chocolate", "white chocolate", "peppermint candy", "peppermint oil"],
    allergens: ["milk", "soy"],
    tastingNotes: {
      intensity: 2, sweetness: 4, bitterness: 1, acidity: 0,
      fruitiness: 0, nuttiness: 0, spiciness: 2, creaminess: 3,
      primaryFlavors: ["peppermint", "dark chocolate", "vanilla"],
      finishNotes: "Cool, refreshing peppermint with creamy chocolate"
    },
    pairings: [
      { category: "coffee", name: "Peppermint Mocha", description: "Go full peppermint" },
      { category: "spirits", name: "Crème de Menthe", description: "Minty cocktail with minty bark" },
      { category: "wine", name: "Champagne", description: "Festive pairing for a festive treat" },
      { category: "other", name: "Hot Cocoa", description: "Crumble the bark into your cocoa" }
    ],
    tags: ["holiday", "festive", "crunchy"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["minty", "sweet", "refreshing", "classic"]
  },
  {
    id: "bark-desert",
    name: "Desert Trail Mix Bark",
    description: "Dark chocolate bark loaded with pecans, dried cranberries, and pumpkin seeds. 6 oz.",
    longDescription: "Our Arizona-inspired bark is packed with the flavors of the Southwest — roasted pecans, tart dried cranberries, toasted pumpkin seeds, and a sprinkle of chipotle salt over rich dark chocolate. It's trail mix reimagined as a chocolate experience.",
    price: 13.99,
    category: "barks",
    image: "/images/desert-bark.jpg",
    gallery: ["/images/desert-bark.jpg"],
    weight: "6 oz",
    ingredients: ["dark chocolate", "pecans", "dried cranberries", "pumpkin seeds", "chipotle salt"],
    allergens: ["tree nuts"],
    tastingNotes: {
      intensity: 3, sweetness: 3, bitterness: 2, acidity: 2,
      fruitiness: 2, nuttiness: 5, spiciness: 2, creaminess: 1,
      primaryFlavors: ["roasted pecan", "cranberry", "smoky salt"],
      finishNotes: "Nutty crunch gives way to a gentle smoky warmth"
    },
    pairings: [
      { category: "wine", name: "Pinot Noir", description: "Fruity red wine with dried cranberry notes" },
      { category: "coffee", name: "Pecan Flavored Coffee", description: "Double the nutty goodness" },
      { category: "spirits", name: "Rye Whiskey", description: "Spice and smoke with nuts and chocolate" },
      { category: "cheese", name: "Smoked Cheddar", description: "Smoky cheese with smoky bark" }
    ],
    tags: ["southwestern", "crunchy", "nutritious"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["nutty", "complex", "crunchy", "bold"]
  },
  {
    id: "drink-hot-cocoa",
    name: "Hot Cocoa Mix",
    description: "Premium hot cocoa mix made from real chocolate shavings. Makes 8 servings.",
    longDescription: "Forget the powdered stuff. Our hot cocoa mix is made by shaving real chocolate and blending it with Dutch cocoa, whole milk powder, and a touch of cinnamon. Just add hot water or milk for the richest, most chocolatey hot cocoa you've ever had.",
    price: 11.99,
    category: "drinks",
    image: "/images/hot-cocoa.jpg",
    gallery: ["/images/hot-cocoa.jpg"],
    weight: "8 oz",
    ingredients: ["chocolate shavings", "Dutch cocoa", "milk powder", "cane sugar", "cinnamon"],
    allergens: ["milk"],
    tastingNotes: {
      intensity: 3, sweetness: 3, bitterness: 2, acidity: 0,
      fruitiness: 0, nuttiness: 1, spiciness: 1, creaminess: 4,
      primaryFlavors: ["rich cocoa", "cream", "cinnamon"],
      finishNotes: "Warm, comforting finish like a chocolate hug"
    },
    pairings: [
      { category: "other", name: "Marshmallows", description: "The classic topping" },
      { category: "spirits", name: "Kahlúa", description: "Coffee liqueur makes it an adult treat" },
      { category: "other", name: "Churros", description: "For dipping, obviously" },
      { category: "other", name: "Peppermint Bark", description: "Crumble our bark on top" }
    ],
    tags: ["cozy", "comfort", "year-round"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["sweet", "creamy", "classic", "mild"]
  },
  {
    id: "gift-sampler",
    name: "TCF Sampler Box",
    description: "A curated selection of our bestsellers: 4 truffles, 1 bar, and a bark piece.",
    longDescription: "The perfect introduction to Tucson Chocolate Factory. This beautifully packaged sampler includes one of each of our four signature truffles, a half-size milk chocolate bar, and a generous piece of desert trail mix bark. Gift wrapped and ready to delight.",
    price: 29.99,
    category: "gifts",
    image: "/images/sampler-box.jpg",
    gallery: ["/images/sampler-box.jpg"],
    weight: "10 oz",
    ingredients: ["assorted chocolates"],
    allergens: ["milk", "soy", "tree nuts"],
    tastingNotes: {
      intensity: 3, sweetness: 3, bitterness: 2, acidity: 1,
      fruitiness: 2, nuttiness: 2, spiciness: 1, creaminess: 3,
      primaryFlavors: ["assorted"],
      finishNotes: "A journey through all our flavor profiles"
    },
    pairings: [
      { category: "wine", name: "Wine Flight", description: "Pair each chocolate with a different wine" },
      { category: "coffee", name: "Pour-Over", description: "Clean coffee lets each chocolate shine" },
      { category: "spirits", name: "Tasting Flight", description: "Match spirits to chocolates" },
      { category: "other", name: "Cheese Board", description: "Build a full tasting experience" }
    ],
    tags: ["gift", "bestseller", "sampler", "perfect-introduction"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["classic", "balanced", "varied"]
  },
  {
    id: "gift-deluxe",
    name: "Deluxe Gift Box",
    description: "The ultimate chocolate experience: 12 truffles, 2 bars, bark, and a hot cocoa mix.",
    longDescription: "Go all out with our deluxe gift box. This premium package includes a dozen assorted truffles (3 of each variety), two full-size bars (milk and dark), a bag of desert trail mix bark, and our signature hot cocoa mix. Presented in a handmade wooden box with our TCF brand.",
    price: 54.99,
    category: "gifts",
    image: "/images/deluxe-box.jpg",
    gallery: ["/images/deluxe-box.jpg"],
    weight: "2 lbs",
    ingredients: ["assorted chocolates", "hot cocoa mix"],
    allergens: ["milk", "soy", "tree nuts"],
    tastingNotes: {
      intensity: 3, sweetness: 3, bitterness: 2, acidity: 1,
      fruitiness: 2, nuttiness: 2, spiciness: 1, creaminess: 3,
      primaryFlavors: ["assorted"],
      finishNotes: "The complete TCF experience"
    },
    pairings: [
      { category: "wine", name: "Full Wine Pairing", description: "Get a bottle for the occasion" },
      { category: "spirits", name: "Dessert Wine or Port", description: "A luxurious evening" },
      { category: "other", name: "Dinner Party", description: "Share after a special meal" },
      { category: "other", name: "Movie Night", description: "Elevate your next movie night" }
    ],
    tags: ["gift", "premium", "deluxe", "special-occasion"],
    isNew: false, isLimited: false, isMembersOnly: false, isPreOrder: false,
    flavorProfile: ["classic", "balanced", "varied", "indulgent"]
  },
];

// Collections for curated browsing
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productIds: string[];
  featured: boolean;
}

export const collections: Collection[] = [
  {
    id: "col-bestsellers",
    name: "Bestsellers",
    slug: "bestsellers",
    description: "Our most-loved chocolates, chosen by you.",
    image: "/images/col-bestsellers.jpg",
    productIds: ["truffle-dark", "truffle-salted-caramel", "bar-milk", "gift-sampler"],
    featured: true,
  },
  {
    id: "col-single-origin",
    name: "Single Origin",
    slug: "single-origin",
    description: "Chocolates made from beans sourced from a single farm or region.",
    image: "/images/col-single-origin.jpg",
    productIds: ["truffle-dark", "bar-dark-72", "members-midnight"],
    featured: true,
  },
  {
    id: "col-arizona",
    name: "Taste of Arizona",
    slug: "taste-of-arizona",
    description: "Flavors inspired by the Sonoran Desert and Southwest.",
    image: "/images/col-arizona.jpg",
    productIds: ["truffle-chile", "truffle-prickly-pear", "bark-desert", "seasonal-lavender-honey"],
    featured: true,
  },
  {
    id: "col-gift-sets",
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Beautifully packaged sets perfect for any occasion.",
    image: "/images/col-gifts.jpg",
    productIds: ["gift-sampler", "gift-deluxe"],
    featured: true,
  },
  {
    id: "col-seasonal",
    name: "Seasonal Releases",
    slug: "seasonal",
    description: "Limited-time flavors that celebrate the seasons.",
    image: "/images/col-seasonal.jpg",
    productIds: ["seasonal-lavender-honey", "preorder-summer-collection"],
    featured: true,
  },
  {
    id: "col-dark-lovers",
    name: "Dark Chocolate Lovers",
    slug: "dark-chocolate",
    description: "For those who like it bold and intense.",
    image: "/images/col-dark.jpg",
    productIds: ["truffle-dark", "truffle-chile", "bar-dark-72", "limited-mole", "members-midnight"],
    featured: false,
  },
  {
    id: "col-vip",
    name: "VIP Exclusives",
    slug: "vip-exclusives",
    description: "Special releases available only to loyalty members.",
    image: "/images/col-vip.jpg",
    productIds: ["members-midnight"],
    featured: false,
  },
];

// Subscription tiers
export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "quarterly";
  description: string;
  includes: string[];
  itemCount: number;
  savings: string;
  popular: boolean;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "sub-explorer",
    name: "The Explorer",
    price: 29.99,
    interval: "monthly",
    description: "A curated selection of our favorites — perfect for discovering new flavors.",
    includes: [
      "4 assorted truffles",
      "1 chocolate bar",
      "Tasting card with notes & pairings",
      "Free shipping",
    ],
    itemCount: 5,
    savings: "Save 15% vs buying individually",
    popular: false,
  },
  {
    id: "sub-connoisseur",
    name: "The Connoisseur",
    price: 49.99,
    interval: "monthly",
    description: "Our most popular box. A deep dive into artisan chocolate each month.",
    includes: [
      "8 assorted truffles (including seasonal)",
      "2 chocolate bars",
      "1 bark or specialty item",
      "Detailed tasting guide",
      "Early access to new releases",
      "Free shipping",
    ],
    itemCount: 11,
    savings: "Save 20% vs buying individually",
    popular: true,
  },
  {
    id: "sub-grand-cru",
    name: "Grand Cru",
    price: 89.99,
    interval: "monthly",
    description: "The ultimate chocolate experience. Everything we make, plus members-only exclusives.",
    includes: [
      "12 assorted truffles (all varieties)",
      "3 chocolate bars (including limited editions)",
      "2 barks or specialty items",
      "Members-only exclusive truffle",
      "Bean-to-bar origin story booklet",
      "Wine/spirits pairing suggestions card",
      "VIP early access to everything",
      "Free shipping",
    ],
    itemCount: 17,
    savings: "Save 30% vs buying individually",
    popular: false,
  },
  {
    id: "sub-quarterly",
    name: "Seasonal Discovery",
    price: 79.99,
    interval: "quarterly",
    description: "A seasonal celebration box delivered four times a year.",
    includes: [
      "Seasonal collection (6-8 seasonal items)",
      "2 signature bars",
      "1 seasonal drink mix",
      "Seasonal recipe card",
      "Free shipping",
    ],
    itemCount: 10,
    savings: "Best value for seasonal lovers",
    popular: false,
  },
];

// Events
export interface TCFEvent {
  id: string;
  title: string;
  type: "tasting" | "class" | "private" | "special";
  description: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  capacity: number;
  spotsRemaining: number;
  image: string;
  includes: string[];
  location: string;
}

export const events: TCFEvent[] = [
  {
    id: "evt-intro-tasting",
    title: "Introduction to Craft Chocolate",
    type: "tasting",
    description: "Learn to taste chocolate like a pro. We'll guide you through five single-origin chocolates, teaching you to identify flavor notes, understand cacao percentages, and discover your personal preferences.",
    date: "2026-03-15",
    time: "2:00 PM",
    duration: "1.5 hours",
    price: 35,
    capacity: 20,
    spotsRemaining: 8,
    image: "/images/evt-tasting.jpg",
    includes: ["5 chocolate tastings", "Tasting guide to take home", "10% off purchases that day"],
    location: "TCF Congress Street Shop",
  },
  {
    id: "evt-truffle-making",
    title: "Truffle Making Workshop",
    type: "class",
    description: "Roll up your sleeves and learn to make truffles from scratch. You'll temper chocolate, make ganache, and hand-roll your own box of truffles to take home.",
    date: "2026-03-22",
    time: "10:00 AM",
    duration: "2 hours",
    price: 65,
    capacity: 12,
    spotsRemaining: 4,
    image: "/images/evt-workshop.jpg",
    includes: ["All materials", "Box of 12 truffles you made", "Recipe card", "Apron to keep"],
    location: "TCF Congress Street Shop",
  },
  {
    id: "evt-wine-pairing",
    title: "Chocolate & Wine Pairing Evening",
    type: "tasting",
    description: "An evening of indulgence. We've partnered with a local Tucson winery to pair five wines with five chocolates, guided by our chocolatier and their sommelier.",
    date: "2026-04-05",
    time: "6:00 PM",
    duration: "2 hours",
    price: 55,
    capacity: 30,
    spotsRemaining: 12,
    image: "/images/evt-wine.jpg",
    includes: ["5 wine pours", "5 chocolate pairings", "Charcuterie board", "Pairing guide"],
    location: "TCF Congress Street Shop",
  },
  {
    id: "evt-bean-to-bar",
    title: "Bean-to-Bar Experience",
    type: "class",
    description: "Follow the complete journey from raw cacao bean to finished chocolate bar. You'll roast beans, crack & winnow, grind, conche, and temper — then mold your own bar to take home.",
    date: "2026-04-12",
    time: "9:00 AM",
    duration: "4 hours",
    price: 95,
    capacity: 8,
    spotsRemaining: 3,
    image: "/images/evt-bean.jpg",
    includes: ["Full bean-to-bar process", "2 custom bars you made", "Cacao bean sample bag", "Certificate of completion"],
    location: "TCF Congress Street Shop",
  },
  {
    id: "evt-private",
    title: "Private Chocolate Party",
    type: "private",
    description: "Book the shop for a private group event — perfect for birthdays, bachelorette parties, team building, or any celebration. Custom menu and experience designed just for you.",
    date: "By appointment",
    time: "Flexible",
    duration: "2-3 hours",
    price: 45,
    capacity: 20,
    spotsRemaining: 20,
    image: "/images/evt-private.jpg",
    includes: ["Private venue", "Guided tasting", "Truffle-making activity", "Custom chocolate favors", "Minimum 8 guests"],
    location: "TCF Congress Street Shop",
  },
  {
    id: "evt-kids",
    title: "Kids Chocolate Camp",
    type: "special",
    description: "A fun, hands-on chocolate experience for kids ages 6-12. They'll learn where chocolate comes from, decorate their own bars, and make chocolate dipped treats.",
    date: "2026-03-29",
    time: "10:00 AM",
    duration: "1.5 hours",
    price: 25,
    capacity: 15,
    spotsRemaining: 7,
    image: "/images/evt-kids.jpg",
    includes: ["Chocolate-making activity", "Decorated bar to take home", "Chocolate dipped fruit", "TCF kid's apron"],
    location: "TCF Congress Street Shop",
  },
];

// Flavor quiz data
export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; traits: string[] }[];
}

export const flavorQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "How do you take your coffee?",
    options: [
      { label: "Black, no sugar", value: "black", traits: ["dark", "intense", "bold"] },
      { label: "With a splash of cream", value: "cream", traits: ["balanced", "classic"] },
      { label: "Loaded with cream and sugar", value: "sweet", traits: ["sweet", "creamy", "mild"] },
      { label: "I prefer tea or juice", value: "tea", traits: ["light", "fruity", "floral"] },
    ],
  },
  {
    id: "q2",
    question: "Pick a vacation destination:",
    options: [
      { label: "Oaxaca, Mexico", value: "oaxaca", traits: ["spicy", "bold", "adventurous"] },
      { label: "Paris, France", value: "paris", traits: ["classic", "sophisticated", "creamy"] },
      { label: "Bali, Indonesia", value: "bali", traits: ["fruity", "unique", "light"] },
      { label: "Napa Valley, California", value: "napa", traits: ["indulgent", "nutty", "balanced"] },
    ],
  },
  {
    id: "q3",
    question: "Your ideal dessert is:",
    options: [
      { label: "Rich flourless chocolate cake", value: "cake", traits: ["dark", "intense", "indulgent"] },
      { label: "Salted caramel ice cream", value: "caramel", traits: ["sweet", "salty", "creamy"] },
      { label: "Fresh fruit tart", value: "tart", traits: ["fruity", "light", "refreshing"] },
      { label: "Spiced churros with dipping chocolate", value: "churros", traits: ["spicy", "sweet", "crunchy"] },
    ],
  },
  {
    id: "q4",
    question: "Pick a music genre for a dinner party:",
    options: [
      { label: "Jazz — smooth and complex", value: "jazz", traits: ["complex", "sophisticated", "dark"] },
      { label: "Bossa nova — light and breezy", value: "bossa", traits: ["light", "sweet", "classic"] },
      { label: "Reggaeton — bold and energetic", value: "reggaeton", traits: ["bold", "spicy", "adventurous"] },
      { label: "Indie folk — warm and earthy", value: "indie", traits: ["nutty", "balanced", "unique"] },
    ],
  },
  {
    id: "q5",
    question: "You're at a cheese counter. You reach for:",
    options: [
      { label: "Aged Parmigiano-Reggiano", value: "parm", traits: ["intense", "complex", "bold"] },
      { label: "Triple-cream Brie", value: "brie", traits: ["creamy", "mild", "indulgent"] },
      { label: "Tangy goat cheese with herbs", value: "goat", traits: ["light", "unique", "refreshing"] },
      { label: "Smoked Gouda", value: "gouda", traits: ["nutty", "sweet", "crunchy"] },
    ],
  },
];

export function getProductById(id: string): RichProduct | undefined {
  return richProducts.find((p) => p.id === id);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getProductsForCollection(slug: string): RichProduct[] {
  const collection = getCollectionBySlug(slug);
  if (!collection) return [];
  return collection.productIds
    .map((id) => getProductById(id))
    .filter((p): p is RichProduct => !!p);
}

export function getQuizRecommendations(traits: string[]): RichProduct[] {
  const traitCounts = traits.reduce<Record<string, number>>((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const scored = richProducts
    .filter((p) => !p.isMembersOnly && !p.isPreOrder)
    .map((product) => {
      const score = product.flavorProfile.reduce(
        (sum, trait) => sum + (traitCounts[trait] || 0),
        0
      );
      return { product, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map((s) => s.product);
}
