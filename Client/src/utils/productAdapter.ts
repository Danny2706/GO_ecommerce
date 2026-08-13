import type { Product } from "../constants";
import type { BackendProduct, BackendCategory } from "../services/api";

const CATEGORY_IMAGES: Record<string, string[]> = {
  clothing: [
    "https://images.unsplash.com/photo-1598122666068-59b41e0a3193?w=600&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1662894310975-bce268199aec?w=600&h=700&fit=crop&auto=format",
  ],
  coffee: [
    "https://images.unsplash.com/photo-1540965555-ef9a836372ed?w=600&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1587049016823-69ef9d68bd44?w=600&h=700&fit=crop&auto=format",
  ],
  spices: [
    "https://images.unsplash.com/photo-1784501025488-001592b6ee31?w=600&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1758745464235-ccb8c1253074?w=600&h=700&fit=crop&auto=format",
  ],
  handcrafts: [
    "https://images.unsplash.com/photo-1552710307-537199cd41c0?w=600&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1596626417050-39c7f6ddd2c9?w=600&h=700&fit=crop&auto=format",
  ],
  electronics: [
    "https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2f?w=600&h=700&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=600&h=700&fit=crop&auto=format",
  ],
  beauty: [
    "https://images.unsplash.com/photo-1633980990942-80e0da50977e?w=600&h=700&fit=crop&auto=format",
  ],
  default: [
    "https://images.unsplash.com/photo-1572851569977-e18b9ea6edbe?w=600&h=700&fit=crop&auto=format",
  ],
};

const LOCATIONS = ["Addis Ababa", "Yirgacheffe", "Debre Birhan", "Gondar", "Bale Mountains", "Hawassa"];
const SELLERS = ["Lalibela Designs", "Highland Brew Co.", "Awash Spice House", "Wollo Weavers", "Ethio Tech Hub"];

export function normalizeBackendProduct(
  bp: BackendProduct,
  categories: BackendCategory[] = []
): Product {
  const catObj = categories.find((c) => c.id === bp.category_id);
  const catSlug = catObj ? catObj.slug.toLowerCase() : "general";

  const imagesForCat = CATEGORY_IMAGES[catSlug] || CATEGORY_IMAGES.default;
  const imageIndex = bp.id % imagesForCat.length;
  const primaryImage = imagesForCat[imageIndex];

  // Rating generation based on product ID for consistent rendering
  const rating = Number((4.2 + (bp.id % 8) * 0.1).toFixed(1));
  const reviewCount = 45 + (bp.id * 37) % 450;
  const location = LOCATIONS[bp.id % LOCATIONS.length];
  const seller = SELLERS[bp.id % SELLERS.length];

  return {
    id: String(bp.id),
    name: bp.title,
    category: catSlug,
    price: bp.price,
    rating,
    reviewCount,
    image: primaryImage,
    images: imagesForCat,
    description: bp.description || "Authentic quality product from Ethiopian artisans and suppliers.",
    inStock: bp.stock > 0 && bp.is_active,
    seller,
    location,
    isFeatured: bp.id % 2 === 0,
    isNew: bp.id % 3 === 0,
  };
}
