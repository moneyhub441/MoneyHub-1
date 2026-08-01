export type ProductType = "Daily" | "VIP";


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

  // =====================
  // NORMAL PRODUCTS
  // =====================

  {
    id:1,
    name:"Starter Plan",
    price:290,
    image:"/products/product-1.png",

    dailyIncome:8,
    totalIncome:400,
    duration:50,

    type:"Daily",
    badge:"NEW",
  },


  {
    id:2,
    name:"Basic Plan",
    price:500,
    image:"/products/product-2.png",

    dailyIncome:15,
    totalIncome:750,
    duration:50,

    type:"Daily",
  },


  {
    id:3,
    name:"Silver Plan",
    price:800,
    image:"/products/product-3.png",

    dailyIncome:25,
    totalIncome:1250,
    duration:50,

    type:"Daily",
    badge:"POPULAR",
  },


  {
    id:4,
    name:"Gold Plan",
    price:1200,
    image:"/products/product-4.png",

    dailyIncome:40,
    totalIncome:2000,
    duration:50,

    type:"Daily",
  },


  {
    id:5,
    name:"Premium Plan",
    price:2000,
    image:"/products/product-1.png",

    dailyIncome:70,
    totalIncome:3500,
    duration:50,

    type:"Daily",
  },


  {
    id:6,
    name:"Growth Plan",
    price:3000,
    image:"/products/product-2.png",

    dailyIncome:110,
    totalIncome:5500,
    duration:50,

    type:"Daily",
  },


  {
    id:7,
    name:"Business Plan",
    price:5000,
    image:"/products/product-3.png",

    dailyIncome:180,
    totalIncome:9000,
    duration:50,

    type:"Daily",
    badge:"HOT",
  },


  {
    id:8,
    name:"Advance Plan",
    price:7500,
    image:"/products/product-4.png",

    dailyIncome:260,
    totalIncome:13000,
    duration:50,

    type:"Daily",
  },


  {
    id:9,
    name:"Pro Plan",
    price:10000,
    image:"/products/product-1.png",

    dailyIncome:350,
    totalIncome:17500,
    duration:50,

    type:"Daily",
  },


  {
    id:10,
    name:"Elite Plan",
    price:15000,
    image:"/products/product-2.png",

    dailyIncome:520,
    totalIncome:26000,
    duration:50,

    type:"Daily",
    badge:"PREMIUM",
  },


  // =====================
  // VIP PRODUCTS
  // =====================


  {
    id:101,
    name:"VIP Silver",
    price:25000,
    image:"/products/vip-1.png",

    dailyIncome:900,
    totalIncome:45000,
    duration:50,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:102,
    name:"VIP Gold",
    price:50000,
    image:"/products/vip-2.png",

    dailyIncome:1800,
    totalIncome:90000,
    duration:50,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:103,
    name:"VIP Platinum",
    price:75000,
    image:"/products/vip-3.png",

    dailyIncome:2800,
    totalIncome:140000,
    duration:50,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:104,
    name:"VIP Diamond",
    price:100000,
    image:"/products/vip-1.png",

    dailyIncome:4000,
    totalIncome:200000,
    duration:50,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:105,
    name:"VIP Royal",
    price:150000,
    image:"/products/vip-2.png",

    dailyIncome:6000,
    totalIncome:300000,
    duration:50,

    type:"VIP",
    badge:"VIP",
  },

];



/* =========================
   GET PRODUCTS
========================= */

export const getProducts = (): Product[] => {

  try {

    const saved =
      localStorage.getItem(
        "products"
      );


    if(saved){

      const parsed =
        JSON.parse(saved);


      if(Array.isArray(parsed)){

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
)=>{

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

};