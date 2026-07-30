export type ProductType = "Daily" | "Welfare";

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;

  dailyIncome: number;
  totalIncome: number;
  duration: number;

  type: ProductType;
  badge?: string;
};

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Special Product",
    price: 700,
    image: "/products/product-1.png",

    dailyIncome: 270,
    totalIncome: 13500,
    duration: 50,

    type: "Daily",
    badge: "POPULAR",
  },

  {
    id: 2,
    name: "Product 2",
    price: 1200,
    image: "/products/product-2.png",

    dailyIncome: 450,
    totalIncome: 22500,
    duration: 50,

    type: "Daily",
  },

  {
    id: 3,
    name: "Product 3",
    price: 2500,
    image: "/products/product-3.png",

    dailyIncome: 900,
    totalIncome: 45000,
    duration: 50,

    type: "Daily",
  },

  {
    id: 4,
    name: "Product 4",
    price: 5000,
    image: "/products/product-4.png",

    dailyIncome: 1800,
    totalIncome: 90000,
    duration: 50,

    type: "Daily",
  },

  {
    id: 101,
    name: "Welfare Product 1",
    price: 500,
    image: "/products/product-1.png",

    dailyIncome: 180,
    totalIncome: 9000,
    duration: 50,

    type: "Welfare",
  },

  {
    id: 102,
    name: "Welfare Product 2",
    price: 1000,
    image: "/products/product-2.png",

    dailyIncome: 360,
    totalIncome: 18000,
    duration: 50,

    type: "Welfare",
  },
];

/* =========================
   GET PRODUCTS
========================= */

export const getProducts = (): Product[] => {
  try {
    const saved =
      localStorage.getItem("products");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    localStorage.setItem(
      "products",
      JSON.stringify(defaultProducts)
    );

    return defaultProducts;
  } catch {
    return defaultProducts;
  }
};

/* =========================
   SAVE PRODUCTS
========================= */

export const saveProducts = (
  products: Product[]
) => {
  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );
};