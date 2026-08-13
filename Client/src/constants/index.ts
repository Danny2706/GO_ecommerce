export interface Product {
  id: string;
  name: string;
  nameAm: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  inStock: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  seller: string;
  location: string;
}

export interface Category {
  id: string;
  name: string;
  nameAm: string;
  icon: string;
  image: string;
  count: number;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "clothing",
    name: "Traditional Clothing",
    nameAm: "ባህላዊ ልብስ",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1598122666068-59b41e0a3193?w=400&h=300&fit=crop&auto=format",
    count: 1240,
    color: "#B54E28",
  },
  {
    id: "coffee",
    name: "Coffee & Tea",
    nameAm: "ቡና እና ሻይ",
    icon: "☕",
    image: "https://images.unsplash.com/photo-1540965555-ef9a836372ed?w=400&h=300&fit=crop&auto=format",
    count: 890,
    color: "#5C3D1E",
  },
  {
    id: "spices",
    name: "Spices & Food",
    nameAm: "ቅመማ ቅመም",
    icon: "🌶️",
    image: "https://images.unsplash.com/photo-1784501025488-001592b6ee31?w=400&h=300&fit=crop&auto=format",
    count: 2100,
    color: "#C0392B",
  },
  {
    id: "handcrafts",
    name: "Handcrafts & Art",
    nameAm: "የእጅ ሥራ",
    icon: "🏺",
    image: "https://images.unsplash.com/photo-1552710307-537199cd41c0?w=400&h=300&fit=crop&auto=format",
    count: 640,
    color: "#D4A017",
  },
  {
    id: "electronics",
    name: "Electronics",
    nameAm: "ኤሌክትሮኒክስ",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=400&h=300&fit=crop&auto=format",
    count: 3200,
    color: "#2C3E50",
  },
  {
    id: "beauty",
    name: "Beauty & Care",
    nameAm: "ውበት",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1633980990942-80e0da50977e?w=400&h=300&fit=crop&auto=format",
    count: 780,
    color: "#9B59B6",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Habesha Kemis — Embroidered",
    nameAm: "ሐበሻ ቀሚስ",
    category: "clothing",
    price: 1200,
    originalPrice: 1600,
    rating: 4.8,
    reviewCount: 234,
    image: "https://images.unsplash.com/photo-1598122666068-59b41e0a3193?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1598122666068-59b41e0a3193?w=600&h=700&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1633980990942-80e0da50977e?w=600&h=700&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1662894310975-bce268199aec?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Hand-embroidered traditional Habesha Kemis featuring intricate Tilet patterns along the hem and cuffs. Made from premium Ethiopian cotton, lightweight and breathable — perfect for weddings, Timkat, and cultural events. Available in white, beige, and blue.",
    inStock: true,
    isFeatured: true,
    badge: "Sale",
    seller: "Lalibela Designs",
    location: "Addis Ababa",
  },
  {
    id: "2",
    name: "Yirgacheffe Coffee — Single Origin 500g",
    nameAm: "ይርጋጨፌ ቡና",
    category: "coffee",
    price: 380,
    rating: 4.9,
    reviewCount: 512,
    image: "https://images.unsplash.com/photo-1540965555-ef9a836372ed?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1540965555-ef9a836372ed?w=600&h=700&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1587049016823-69ef9d68bd44?w=600&h=700&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Grade 1 Yirgacheffe washed coffee — floral and citrus notes with a honey-sweet finish. Sourced directly from smallholder farms in the Gedeo Zone. Medium roast, perfect for pour-over or Ethiopian jebena ceremony.",
    inStock: true,
    isFeatured: true,
    isNew: false,
    badge: "Best Seller",
    seller: "Highland Brew Co.",
    location: "Yirgacheffe, Sidama",
  },
  {
    id: "3",
    name: "Premium Berbere Spice Blend 200g",
    nameAm: "በርበሬ",
    category: "spices",
    price: 85,
    rating: 4.7,
    reviewCount: 891,
    image: "https://images.unsplash.com/photo-1784501025488-001592b6ee31?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1784501025488-001592b6ee31?w=600&h=700&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1758745464235-ccb8c1253074?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Authentic Ethiopian Berbere blend — fiery, aromatic, and complex. Stone-ground from 18 herbs and spices including korerima, rue, and long pepper. Essential for Doro Wat, Misir, and braised meats.",
    inStock: true,
    isFeatured: true,
    seller: "Awash Spice House",
    location: "Addis Ababa",
  },
  {
    id: "4",
    name: "Hand-Woven Gabi Cotton Blanket",
    nameAm: "ጋቢ",
    category: "handcrafts",
    price: 950,
    originalPrice: 1100,
    rating: 4.6,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1552710307-537199cd41c0?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1552710307-537199cd41c0?w=600&h=700&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1578509566163-068acd11b8e7?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Handloomed on traditional wooden looms in Debre Birhan, this double-weave Gabi blanket provides warmth in the Ethiopian highlands. 100% natural cotton, washed with traditional herbs. A living piece of Ethiopian craft heritage.",
    inStock: true,
    isFeatured: true,
    badge: "Sale",
    seller: "Wollo Weavers Cooperative",
    location: "Debre Birhan",
  },
  {
    id: "5",
    name: "Samsung Galaxy A35 5G — 128GB",
    nameAm: "ሳምሱንግ ጋላክሲ",
    category: "electronics",
    price: 24500,
    originalPrice: 27000,
    rating: 4.4,
    reviewCount: 1203,
    image: "https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?w=600&h=700&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "5G-enabled Samsung Galaxy A35 with 6.6\" Super AMOLED display, 50MP triple camera, and 5000mAh battery. Ships with Ethiopian warranty. Includes Amharic keyboard support and local payment apps pre-configured.",
    inStock: true,
    badge: "New",
    isNew: true,
    seller: "Ethio Tech Hub",
    location: "Addis Ababa",
  },
  {
    id: "6",
    name: "Raw Ethiopian Forest Honey 1kg",
    nameAm: "ጥሬ ማር",
    category: "spices",
    price: 220,
    rating: 4.9,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1758745464235-ccb8c1253074?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1758745464235-ccb8c1253074?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Wild-harvested Ethiopian forest honey from the Bale Mountains. Dark, complex, and mineral-rich. Collected by traditional beekeepers using cylindrical log hives. Unfiltered, unheated — maximum nutrition intact.",
    inStock: true,
    seller: "Bale Honey Collective",
    location: "Bale Mountains",
  },
  {
    id: "7",
    name: "Jebena Pottery Coffee Set",
    nameAm: "ጀበና",
    category: "handcrafts",
    price: 640,
    rating: 4.7,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Hand-thrown clay jebena coffee pot with 6 traditional sini cups. Fired in a wood kiln and finished with a natural beeswax glaze. Essential for the Ethiopian coffee ceremony — a UNESCO-recognized cultural practice.",
    inStock: true,
    isFeatured: true,
    seller: "Oromia Pottery Guild",
    location: "Jimma",
  },
  {
    id: "8",
    name: "Traditional Netela White Shawl",
    nameAm: "ነጠላ",
    category: "clothing",
    price: 480,
    rating: 4.5,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1662894310975-bce268199aec?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1662894310975-bce268199aec?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Fine Ethiopian cotton Netela with traditional Tilet border embroidery. Lightweight and versatile — worn as a shawl, head covering, or ceremonial wrap. Appropriate for religious occasions, cultural events, and everyday elegance.",
    inStock: true,
    isNew: true,
    badge: "New",
    seller: "Lalibela Designs",
    location: "Gondar",
  },
  {
    id: "9",
    name: "Habesha Silver Jewelry Set",
    nameAm: "ሐበሻ ጌጣጌጥ",
    category: "beauty",
    price: 2400,
    originalPrice: 2900,
    rating: 4.8,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1633980990942-80e0da50977e?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1633980990942-80e0da50977e?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Handcrafted sterling silver necklace, bracelet, and earrings set with traditional Lalibela cross motifs. Hammered by third-generation goldsmiths in Addis Merkato. Each piece is one-of-a-kind.",
    inStock: true,
    badge: "Sale",
    seller: "Merkato Silverworks",
    location: "Addis Ababa",
  },
  {
    id: "10",
    name: "Sidama Natural Coffee Whole Bean 1kg",
    nameAm: "ሲዳማ ቡና",
    category: "coffee",
    price: 520,
    rating: 4.8,
    reviewCount: 328,
    image: "https://images.unsplash.com/photo-1587049016823-69ef9d68bd44?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1587049016823-69ef9d68bd44?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Natural-processed Sidama coffee — bold blueberry and dark chocolate notes. Sourced from 1,800m altitude farms in the Sidama region. Light roast preserves maximum terroir character.",
    inStock: true,
    isNew: true,
    badge: "New",
    seller: "Sidama Coffee Farmers Union",
    location: "Hawassa",
  },
  {
    id: "11",
    name: "Organic Teff Flour 2kg",
    nameAm: "ጤፍ ዱቄት",
    category: "spices",
    price: 120,
    rating: 4.6,
    reviewCount: 623,
    image: "https://images.unsplash.com/photo-1672842056361-1838711c5aeb?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1672842056361-1838711c5aeb?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Certified organic brown teff flour milled from highland-grown grain. Naturally gluten-free, rich in iron and calcium. Essential for injera — Ethiopia's beloved sourdough flatbread and the foundation of every feast.",
    inStock: true,
    seller: "Tigray Organic Farms",
    location: "Axum, Tigray",
  },
  {
    id: "12",
    name: "Hand-Painted Landscape Canvas",
    nameAm: "ሥዕል",
    category: "handcrafts",
    price: 3200,
    rating: 4.9,
    reviewCount: 45,
    image: "https://images.unsplash.com/photo-1572851569977-e18b9ea6edbe?w=600&h=700&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1572851569977-e18b9ea6edbe?w=600&h=700&fit=crop&auto=format",
    ],
    description:
      "Original acrylic painting depicting the Simien Mountains at sunrise. Created by Addis-based artist Dawit Bekele using locally sourced pigments and 100% cotton canvas. Signed, numbered, and shipped with a certificate of authenticity.",
    inStock: false,
    isNew: true,
    seller: "Addis Fine Arts",
    location: "Addis Ababa",
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.isFeatured);

export const NAV_LINKS = [
  { label: "Shop", labelAm: "ሱቅ", path: "/shop" },
  { label: "Categories", labelAm: "ምድቦች", path: "/shop" },
  { label: "Deals", labelAm: "ቅናሽ", path: "/shop?filter=sale" },
  { label: "About", labelAm: "ስለ እኛ", path: "/about" },
];
