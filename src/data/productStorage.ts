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
image:"/products/vip-3.png",
    dailyIncome:135,
    totalIncome:1080,
    duration:8,

    type:"Daily",
    badge:"NEW",
  },


  {
    id:2,
    name:"Basic Plan",
    price:500,
image:"/products/vip-3.png",
    dailyIncome:225,
    totalIncome:2700,
    duration:12,

    type:"Daily",
  },


  {
    id:3,
    name:"Silver Plan",
   price:700,
    image:"/products/vip-3.png",

    dailyIncome:315,
    totalIncome:4725,
    duration:15,

    type:"Daily",
    badge:"POPULAR",
  },


  {
    id:4,
    name:"Gold Plan",
   price:900,
   image:"/products/vip-3.png",

    dailyIncome:405,
    totalIncome:7290,
    duration:18,

    type:"Daily",
  },


  {
    id:5,
    name:"Premium Plan",
    price:1100,
    image:"/products/vip-3.png",

    dailyIncome:495,
    totalIncome:9900,
    duration:20,

    type:"Daily",
  },


  {
    id:6,
    name:"Growth Plan",
    price:1300,
    image:"/products/vip-3.png",

    dailyIncome:585,
    totalIncome:12870,
    duration:22,

    type:"Daily",
  },


  {
    id:7,
    name:"Business Plan",
      price:1500,
    image:"/products/vip-3.png",

    dailyIncome:675,
    totalIncome:16875,
    duration:25,

    type:"Daily",
    badge:"HOT",
  },


  {
    id:8,
    name:"Advance Plan",
      price:1700,
    image:"/products/vip-3.png",

    dailyIncome:765,
    totalIncome:19890,
    duration:26,

    type:"Daily",
  },


  {
    id:9,
    name:"Pro Plan",
    price:1900,
    image:"/products/vip-3.png",

    dailyIncome:855,
    totalIncome:23940,
    duration:28,

    type:"Daily",
  },


  {
    id:10,
    name:"Elite Plan",
    price:2000,
    image:"/products/vip-3.png",

    dailyIncome:900,
    totalIncome:27000,
    duration:30,

    type:"Daily",
    badge:"PREMIUM",
  },


  {
    id:11,
    name:"Power Plan",
     price:1000,
    image:"/products/vip-3.png",

    dailyIncome:450,
    totalIncome:11250,
    duration:25,

    type:"Daily",
  },


  {
    id:12,
    name:"Smart Plan",
   price:1500,
    image:"/products/vip-3.png",

    dailyIncome:675,
    totalIncome:16875,
    duration:25,

    type:"Daily",
  },


  {
    id:13,
    name:"Master Plan",
     price:2000,
    image:"/products/vip-3.png",

    dailyIncome:900,
    totalIncome:22500,
    duration:25,

    type:"Daily",
  },


  {
    id:14,
    name:"Royal Plan",
     price:2500,
    image:"/products/vip-3.png",

    dailyIncome:1125,
    totalIncome:28125,
    duration:25,

    type:"Daily",
    badge:"ROYAL",
  },


  {
    id:15,
    name:"Legend Plan",
   price:3000,
    image:"/products/vip-3.png",

    dailyIncome:1350,
    totalIncome:33750,
    duration:25,

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
    image:"/products/vip-3.png",

   dailyIncome:450,
    totalIncome:11250,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:102,
    name:"VIP Gold",
    price:1500,
    image:"/products/vip-3.png",

     dailyIncome:675,
    totalIncome:16875,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:103,
    name:"VIP Platinum",
    price:2000,
    image:"/products/vip-3.png",

    dailyIncome:900,
    totalIncome:22500,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:104,
    name:"VIP Diamond",
    price:2500,
    image:"/products/vip-3.png",

     dailyIncome:1125,
    totalIncome:28125,
    duration:25,

    type:"Welfare",
    badge:"VIP",
  },


  {
    id:105,
    name:"VIP Royal",
    price:3000,
   image:"/products/vip-3.png",

    dailyIncome:1350,
    totalIncome:33750,
    duration:25,

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