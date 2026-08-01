export type ProductType = "Daily" | "VIP";


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
  // DAILY PRODUCTS
  // =====================


  {
    id:1,
    name:"Starter Plan",
    price:300,
    image:"/products/product-1.png",

    dailyIncome:23,
    totalIncome:525,
    duration:10,

    type:"Daily",
    badge:"NEW",
  },


  {
    id:2,
    name:"Basic Plan",
    price:500,
    image:"/products/product-2.png",

    dailyIncome:38,
    totalIncome:875,
    duration:12,

    type:"Daily",
  },


  {
    id:3,
    name:"Silver Plan",
    price:700,
    image:"/products/product-3.png",

    dailyIncome:47,
    totalIncome:1225,
    duration:16,

    type:"Daily",
    badge:"POPULAR",
  },


  {
    id:4,
    name:"Gold Plan",
    price:900,
    image:"/products/product-4.png",

    dailyIncome:50,
    totalIncome:1575,
    duration:20,

    type:"Daily",
  },


  {
    id:5,
    name:"Premium Plan",
    price:1100,
    image:"/products/product-1.png",

    dailyIncome:55,
    totalIncome:1925,
    duration:25,

    type:"Daily",
  },


  {
    id:6,
    name:"Growth Plan",
    price:1300,
    image:"/products/product-2.png",

    dailyIncome:54,
    totalIncome:2275,
    duration:30,

    type:"Daily",
  },


  {
    id:7,
    name:"Business Plan",
    price:1500,
    image:"/products/product-3.png",

    dailyIncome:75,
    totalIncome:2625,
    duration:25,

    type:"Daily",
    badge:"HOT",
  },


  {
    id:8,
    name:"Advance Plan",
    price:1700,
    image:"/products/product-4.png",

    dailyIncome:85,
    totalIncome:2975,
    duration:25,

    type:"Daily",
  },


  {
    id:9,
    name:"Pro Plan",
    price:1900,
    image:"/products/product-1.png",

    dailyIncome:95,
    totalIncome:3325,
    duration:25,

    type:"Daily",
  },


  {
    id:10,
    name:"Elite Plan",
    price:2000,
    image:"/products/product-2.png",

    dailyIncome:100,
    totalIncome:3500,
    duration:30,

    type:"Daily",
    badge:"PREMIUM",
  },


  // =====================
  // VIP PRODUCTS
  // =====================


  {
    id:101,
    name:"VIP Bronze",
    price:1000,
    image:"/products/vip-1.png",

    dailyIncome:50,
    totalIncome:1750,
    duration:15,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:102,
    name:"VIP Silver",
    price:1500,
    image:"/products/vip-2.png",

    dailyIncome:75,
    totalIncome:2625,
    duration:15,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:103,
    name:"VIP Gold",
    price:2000,
    image:"/products/vip-3.png",

    dailyIncome:100,
    totalIncome:3500,
    duration:20,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:104,
    name:"VIP Platinum",
    price:2500,
    image:"/products/vip-1.png",

    dailyIncome:125,
    totalIncome:4375,
    duration:25,

    type:"VIP",
    badge:"VIP",
  },


  {
    id:105,
    name:"VIP Diamond",
    price:3000,
    image:"/products/vip-2.png",

    dailyIncome:100,
    totalIncome:5250,
    duration:30,

    type:"VIP",
    badge:"VIP",
  },

];



/* =========================
GET PRODUCTS
========================= */


export const getProducts = ():Product[] => {

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
 products:Product[]
)=>{

 localStorage.setItem(
  "products",
  JSON.stringify(products)
 );

};