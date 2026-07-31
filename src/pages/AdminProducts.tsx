import {
  ArrowLeft,
  Package,
  Search,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import "../css/AdminProducts.css";


type Product = {
  id: string;
  name: string;
  category: string;
  validity: string;
  price: number;
  image: string;
  type: "Daily" | "Welfare";
  sales:number;
};


type FilterType =
  | "All"
  | "Daily"
  | "Welfare";


function AdminProducts(){

const navigate = useNavigate();


const [products,setProducts] =
useState<Product[]>([]);


const [loading,setLoading] =
useState(true);


const [filter,setFilter] =
useState<FilterType>("All");


const [search,setSearch] =
useState("");



useEffect(()=>{


const loadProducts = async()=>{


try{


const response =
await fetch(
`${API_URL}/api/purchases/admin/all`
);



const data =
await response.json();



if(data.success){


const map:any = {};



data.purchases.forEach(
(item:any)=>{


const id =
String(
item.productId ||
item.productName
);



if(!map[id]){


map[id]={

id,

name:
item.productName,

category:
"Premium",


validity:
`${item.duration || 0} Days`,


price:
Number(item.price || 0),


image:
item.productImage || "",


type:
"Daily",


sales:1

};


}else{


map[id].sales++;

}


});


setProducts(
Object.values(map)
);


}


}catch(error){


console.log(
"Products error",
error
);


}

finally{

setLoading(false);

}


};



loadProducts();


},[]);




const dailyCount =
products.filter(
(p)=>p.type==="Daily"
).length;



const welfareCount =
products.filter(
(p)=>p.type==="Welfare"
).length;



const filteredProducts =
useMemo(()=>{


const value =
search
.trim()
.toLowerCase();



return products.filter(
(product)=>{


const filterMatch =
filter==="All" ||
product.type===filter;



const searchMatch =
value==="" ||

product.name
.toLowerCase()
.includes(value) ||

product.category
.toLowerCase()
.includes(value) ||

String(product.price)
.includes(value);



return (
filterMatch &&
searchMatch
);


});


},[
products,
filter,
search
]);



return (

<main className="admin-products-page">


<header className="admin-products-header">


<button
type="button"
onClick={()=>navigate("/admin/dashboard")}
>

<ArrowLeft size={21}/>

</button>


<div>

<h1>
Products
</h1>


<p>
Manage application products
</p>


</div>


<span>

<Package size={20}/>

</span>


</header>



<section className="admin-products-stats">


<article>

<div>
<Package size={19}/>
</div>

<span>
Total Products
</span>


<strong>
{products.length}
</strong>


</article>




<article>

<div>
<Package size={19}/>
</div>


<span>
Daily Products
</span>


<strong>
{dailyCount}
</strong>


</article>




<article>

<div>
<ShoppingBag size={19}/>
</div>


<span>
Welfare
</span>


<strong>
{welfareCount}
</strong>


</article>


</section>





<section className="admin-products-tools">


<div className="admin-products-search">


<Search size={17}/>


<input

type="text"

value={search}

placeholder="Search product..."

onChange={(e)=>
setSearch(e.target.value)
}

/>


</div>



<div className="admin-products-filters">


{
(
[
"All",
"Daily",
"Welfare"
] as FilterType[]
)
.map(
(item)=>(


<button

key={item}

className={
filter===item
?
"active"
:
""
}

onClick={()=>
setFilter(item)
}

>

{item}

</button>


)

)

}


</div>


</section>





<section className="admin-products-card">


<div className="admin-products-title">

<h2>
Product List
</h2>


<p>
{filteredProducts.length} products found
</p>


</div>



{
loading ?

<div className="admin-products-empty">

<strong>
Loading Products...
</strong>

</div>


:

filteredProducts.map(
(product)=>(


<article

className="admin-product-item"

key={product.id}

>


<div className="admin-product-image">


{
product.image &&

<img
src={product.image}
alt={product.name}
/>

}


<Package size={28}/>


</div>




<div className="admin-product-info">


<strong>
{product.name}
</strong>


<span>
{product.validity}
</span>


<div>

<small>
{product.type}
</small>


<small>
{product.sales} Sales
</small>


</div>


</div>




<div className="admin-product-right">


<strong>

₹
{product.price.toLocaleString("en-IN")}

</strong>


<span>
#{product.id}
</span>


</div>



</article>


)

)



}


</section>


</main>


);


}


export default AdminProducts;