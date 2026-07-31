import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";
import API_URL from "../config/api";
import "../css/AdminOrders.css";


/* =========================
 TYPES
========================= */

type Customer = {
  id:string;
  name:string;
  mobile:string;
  email?:string;
};


type PurchasedProduct = {

  id:string;

  userId:string;

  customer?:Customer | null;


  productName:string;

  productImage?:string;


  price:number;

  dailyIncome:number;

  totalIncome:number;

  duration:number;

  earnedIncome:number;


  status:string;


  purchasedAt:string;

  createdAt:string;

};





function AdminOrders() {


const navigate =
useNavigate();







const [search,setSearch] =
useState("");



const [
orders,
setOrders
]=
useState<PurchasedProduct[]>([]);



const [
loading,
setLoading
]=
useState(true);




/* =========================
 LOAD ORDERS
========================= */


useEffect(()=>{


const loadOrders =
async()=>{


try{


const response =
await fetch(
`${API_URL}/api/purchases/admin/all`
);



const data =
await response.json();



if(data.success){

setOrders(
data.purchases || []
);

}



}catch(error){


console.log(
"Admin orders error:",
error
);


}
finally{

setLoading(false);

}



};


loadOrders();


},[API_URL]);





/* =========================
 TOTAL SALES
========================= */


const totalSales =
orders.reduce(
(total,order)=>

total +
Number(
order.price || 0
),

0
);





/* =========================
 FILTER
========================= */


const filteredOrders =
useMemo(()=>{


const searchValue =
search
.trim()
.toLowerCase();



return orders
.filter(
(order)=>{


const customer =
order.customer;



return (

searchValue === "" ||


order.productName
.toLowerCase()
.includes(
searchValue
) ||


String(
order.id
)
.includes(
searchValue
) ||


String(
order.price
)
.includes(
searchValue
) ||


(
customer?.name ||
""
)
.toLowerCase()
.includes(
searchValue
) ||


(
customer?.mobile ||
""
)
.includes(
searchValue
)

);


}

)
.sort(
(a,b)=>

new Date(
b.createdAt
).getTime()

-

new Date(
a.createdAt
).getTime()

);



},[
orders,
search
]);





return (

<main className="admin-orders-page">



{/* HEADER */}


<header className="admin-orders-header">


<button

type="button"

onClick={()=>
navigate(
"/admin/dashboard"
)
}

>

<ArrowLeft size={21}/>

</button>



<div>

<h1>
Orders
</h1>


<p>
Customer product purchases
</p>


</div>



<span>

<ShoppingBag size={20}/>

</span>



</header>







{/* STATS */}


<section className="admin-orders-stats">


<article>


<div>

<ShoppingBag size={20}/>

</div>



<span>
Total Orders
</span>



<strong>

{
orders.length
}

</strong>


</article>





<article>


<div>

<CheckCircle2 size={20}/>

</div>



<span>
Total Sales
</span>



<strong>

₹
{
totalSales.toLocaleString(
"en-IN"
)
}

</strong>


</article>



</section>








{/* SEARCH */}



<section className="admin-orders-tools">


<div className="admin-orders-search">


<Search size={17}/>



<input

type="text"

value={search}

onChange={(event)=>
setSearch(
event.target.value
)
}

placeholder="Search customer, product or order ID..."

/>


</div>



</section>








{/* ORDERS LIST */}



<section className="admin-orders-card">



<div className="admin-orders-title">


<div>

<h2>
All Orders
</h2>


<p>

{
filteredOrders.length
}

records found

</p>


</div>



</div>






{
loading ? (


<div className="admin-orders-empty">


<ShoppingBag size={37}/>


<strong>
Loading Orders...
</strong>


<span>
Please wait.
</span>


</div>



)

:

filteredOrders.length === 0 ? (


<div className="admin-orders-empty">


<ShoppingBag size={37}/>


<strong>
No Orders Found
</strong>


<span>
Customer product purchases will appear here.
</span>


</div>



)

:

(



<div className="admin-orders-list">



{
filteredOrders.map(
(order)=>(


<article

className="admin-order-item"

key={
order.id
}

onClick={()=>
navigate(
`/admin/orders/${order.id}`
)
}

>



{/* ICON */}


<div className="admin-order-icon">


<Package size={21}/>


</div>






{/* INFO */}



<div className="admin-order-info">



<strong>

{
order.productName
}

</strong>





<div>


<UserRound size={11}/>


<span>

{
order.customer?.name ||
"Unknown Customer"
}

</span>



</div>






<span>

{
order.customer?.mobile ||
"Mobile not available"
}

</span>







<small>

Order #
{
order.id
}

</small>







<small>

{
new Date(
order.purchasedAt ||
order.createdAt
)
.toLocaleDateString(
"en-GB",
{
day:"2-digit",
month:"short",
year:"numeric"
}
)

}

</small>






</div>








{/* RIGHT */}



<div className="admin-order-right">


<strong>

₹
{
Number(
order.price
)
.toLocaleString(
"en-IN"
)
}

</strong>




<span>

{
order.status ||
"Active"
}

</span>



</div>





</article>



)

)



}



</div>


)

}




</section>






</main>


);

}


export default AdminOrders;