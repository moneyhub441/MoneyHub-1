export type ProductType = "Daily" | "Welfare";


export type Product = {
  id:number;
  name:string;
  price:number;
  image:string;

  dailyIncome:number;
  totalIncome:number;
  duration:number;

  type:ProductType;
  badge?:string;
};



export const defaultProducts: Product[] = [


  // =====================
  // DAILY PRODUCTS (15)
  // =====================


  {
    id:1,
    name:"Starter Plan",
    price:300,
    image:"/products/product-1.png",

    dailyIncome:30,
    totalIncome:600,
    duration:10,

    type:"Daily",
    badge:"NEW",
  },


  {
    id:2,
    name:"Basic Plan",
    price:500,
    image:"/products/product-2.png",

    dailyIncome:45,
    totalIncome:900,
    duration:12,

    type:"Daily",
  },


  {
    id:3,
    name:"Silver Plan",
    price:700,
    image:"/products/product-3.png",

    dailyIncome:60,
    totalIncome:1200,
    duration:14,

    type:"Daily",
    badge:"POPULAR",
  },


  {
    id:4,
    name:"Gold Plan",
    price:900,
    image:"/products/product-4.png",

    dailyIncome:75,
    totalIncome:1500,
    duration:16,

    type:"Daily",
  },


  {
    id:5,
    name:"Premium Plan",
    price:1100,
    image:"/products/product-1.png",

    dailyIncome:90,
    totalIncome:1800,
    duration:18,

    type:"Daily",
  },


  {
    id:6,
    name:"Growth Plan",
    price:1300,
    image:"/products/product-2.png",

    dailyIncome:105,
    totalIncome:2100,
    duration:20,

    type:"Daily",
  },


  {
    id:7,
    name:"Business Plan",
    price:1500,
    image:"/products/product-3.png",

    dailyIncome:120,
    totalIncome:2400,
    duration:22,

    type:"Daily",
    badge:"HOT",
  },


  {
    id:8,
    name:"Advance Plan",
    price:1700,
    image:"/products/product-4.png",

    dailyIncome:135,
    totalIncome:2700,
    duration:24,

    type:"Daily",
  },


  {
    id:9,
    name:"Pro Plan",
    price:1900,
    image:"/products/product-1.png",

    dailyIncome:150,
    totalIncome:3000,
    duration:26,

    type:"Daily",
  },


  {
    id:10,
    name:"Elite Plan",
    price:2000,
    image:"/products/product-2.png",

    dailyIncome:160,
    totalIncome:3200,
    duration:28,

    type:"Daily",
    badge:"PREMIUM",
  },


  {
    id:11,
    name:"Power Plan",
    price:2200,
    image:"/products/product-3.png",

    dailyIncome:175,
    totalIncome:3500,
    duration:20,

    type:"Daily",
  },


  {
    id:12,
    name:"Smart Plan",
    price:2500,
    image:"/products/product-4.png",

    dailyIncome:190,
    totalIncome:3800,
    duration:22,

    type:"Daily",
  },


  {
    id:13,
    name:"Master Plan",
    price:2800,
    image:"/products/product-1.png",

    dailyIncome:210,
    totalIncome:4200,
    duration:25,

    type:"Daily",
  },


  {
    id:14,
    name:"Royal Plan",
    price:3000,
    image:"/products/product-2.png",

    dailyIncome:230,
    totalIncome:4600,
    duration:28,

    type:"Daily",
    badge:"ROYAL",
  },


  {
    id:15,
    name:"Legend Plan",
    price:3500,
    image:"/products/product-3.png",

    dailyIncome:250,
    totalIncome:5000,
    duration:30,

    type:"Daily",
    badge:"TOP",
  },


  // =====================
  // WELFARE PRODUCTS (VIP)
  // =====================


  {
    id:101,
    name:"VIP Silver",
    price:1000,
    image:"/products/vip-1.png",

    dailyIncome:80,
    totalIncome:2000,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:102,
    name:"VIP Gold",
    price:1500,
    image:"/products/vip-2.png",

    dailyIncome:120,
    totalIncome:3000,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:103,
    name:"VIP Platinum",
    price:2000,
    image:"/products/vip-3.png",

    dailyIncome:160,
    totalIncome:4000,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:104,
    name:"VIP Diamond",
    price:2500,
    image:"/products/vip-1.png",

    dailyIncome:200,
    totalIncome:5000,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:105,
    name:"VIP Royal",
    price:3000,
    image:"/products/vip-2.png",

    dailyIncome:250,
    totalIncome:7500,
    duration:30,

    type:"Welfare",
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
      JSON.stringify(
        defaultProducts
      )
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
    JSON.stringify(
      products
    )
  );

};