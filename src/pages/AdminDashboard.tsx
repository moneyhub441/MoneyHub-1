import {
  BanknoteArrowDown,
  Bell,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  Users,
  WalletCards,
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
import "../css/AdminDashboard.css";


/* =========================
   TYPES
========================= */

type Customer = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
};


type WalletData = {
  id: string;
  userId: string;

  balance: number;
  totalAdded: number;
  totalWithdrawn: number;
  totalIncome: number;
};


type Withdrawal = {
  id: string;
  userId: string;

  user?: Customer | null;

  amount: number;

  upiId?: string;

  status:
  | "Pending"
  | "Approved"
  | "Rejected";

  createdAt: string;
};


type Purchase = {
  id: string;

  userId: string;

  customer?: Customer | null;

  productName: string;

  price: number;

  status: string;

  createdAt: string;
};



/* =========================
   COMPONENT
========================= */


function AdminDashboard() {


const navigate =
useNavigate();







/* =========================
   STATES
========================= */


const [
customers,
setCustomers
] =
useState<Customer[]>([]);



const [
wallets,
setWallets
] =
useState<WalletData[]>([]);



const [
withdrawals,
setWithdrawals
] =
useState<Withdrawal[]>([]);



const [
purchases,
setPurchases
] =
useState<Purchase[]>([]);



const [
loading,
setLoading
] =
useState(true);



const [
error,
setError
] =
useState("");



/* =========================
   LOAD DATA
========================= */


useEffect(()=>{


const loadDashboard =
async()=>{


try {


setLoading(true);



const [
usersResponse,
walletResponse,
withdrawResponse,
purchaseResponse

] =
await Promise.all([


fetch(
`${API_URL}/api/auth`
),


fetch(
`${API_URL}/api/wallet/admin/all`
),


fetch(
`${API_URL}/api/withdrawals/admin/all`
),


fetch(
`${API_URL}/api/purchases/admin/all`
),


]);



const usersData =
await usersResponse.json();


const walletData =
await walletResponse.json();


const withdrawData =
await withdrawResponse.json();


const purchaseData =
await purchaseResponse.json();



if(usersData.success){

setCustomers(
usersData.users || []
);

}



if(walletData.success){

setWallets(
walletData.wallets || []
);

}



if(withdrawData.success){

setWithdrawals(
withdrawData.withdrawals || []
);

}



if(purchaseData.success){

setPurchases(
purchaseData.purchases || []
);

}



}
catch(error){


console.log(
"Admin dashboard error:",
error
);


setError(
"Unable to load dashboard data"
);



}
finally{


setLoading(false);


}



};



loadDashboard();


},[API_URL]);



/* =========================
   CALCULATIONS
========================= */


const totalCustomers =
customers.length;



const totalWalletBalance =
wallets.reduce(
(total,item)=>
total +
Number(
item.balance || 0
),
0
);



const pendingWithdrawals =
withdrawals.filter(
(item)=>
item.status === "Pending"
);



const approvedWithdrawals =
withdrawals.filter(
(item)=>
item.status === "Approved"
);



const rejectedWithdrawals =
withdrawals.filter(
(item)=>
item.status === "Rejected"
);



const pendingWithdrawalAmount =
pendingWithdrawals.reduce(
(total,item)=>
total +
Number(
item.amount || 0
),
0
);



const approvedWithdrawalAmount =
approvedWithdrawals.reduce(
(total,item)=>
total +
Number(
item.amount || 0
),
0
);



const totalPurchasedProducts =
purchases.length;



const totalProductSales =
purchases.reduce(
(total,item)=>
total +
Number(
item.price || 0
),
0
);



const recentWithdrawals =
useMemo(()=>{

return [
...withdrawals
]
.sort(
(a,b)=>
new Date(
b.createdAt
).getTime()
-
new Date(
a.createdAt
).getTime()
)
.slice(0,5);


},[
withdrawals
]);



const handleLogout = ()=>{


sessionStorage.removeItem(
"adminLoggedIn"
);


navigate(
"/admin/login"
);


};
return (
<main className="admin-dashboard-page">


{/* =========================
    HEADER
========================= */}

<header className="admin-dashboard-header">


<div className="admin-dashboard-brand">


<div>
<ShieldCheck size={22}/>
</div>


<section>

<h1>
MONEY HUB
</h1>


<p>
ADMIN PANEL
</p>


</section>


</div>




<div className="admin-dashboard-actions">


<button
type="button"
onClick={()=>
navigate("/admin/notifications")
}
>

<Bell size={19}/>


{
pendingWithdrawals.length > 0 &&

<span>
{pendingWithdrawals.length}
</span>

}

</button>




<button
type="button"
onClick={handleLogout}
>

<LogOut size={19}/>

</button>


</div>


</header>






{/* =========================
    ERROR
========================= */}


{
error &&

<div className="admin-dashboard-error">

{error}

</div>

}






{/* =========================
    WELCOME
========================= */}


<section className="admin-welcome">


<div>

<span>
ADMINISTRATION
</span>


<h2>
Welcome Admin
</h2>


<p>
Manage customers, wallets,
withdrawals and products.
</p>


</div>



<div className="admin-welcome-icon">

<UserRound size={31}/>

</div>


</section>








{/* =========================
    MAIN STATS
========================= */}



<section className="admin-stats">



<article
onClick={()=>
navigate("/admin/customers")
}
>


<div className="admin-stat-icon">

<Users size={20}/>

</div>



<span>
Total Customers
</span>



<strong>

{
totalCustomers
}

</strong>


</article>







<article
onClick={()=>
navigate("/admin/wallets")
}
>


<div className="admin-stat-icon">

<WalletCards size={20}/>

</div>



<span>
Total Wallet Balance
</span>



<strong>

₹
{
totalWalletBalance.toLocaleString(
"en-IN"
)
}

</strong>


</article>







<article
onClick={()=>
navigate("/admin/withdrawals")
}
>


<div className="admin-stat-icon">

<BanknoteArrowDown size={20}/>

</div>



<span>
Pending Withdrawals
</span>



<strong>

{
pendingWithdrawals.length
}

</strong>


</article>







<article
onClick={()=>
navigate("/admin/orders")
}
>


<div className="admin-stat-icon">

<ShoppingBag size={20}/>

</div>



<span>
Purchased Products
</span>



<strong>

{
totalPurchasedProducts
}

</strong>


</article>



</section>








{/* =========================
 FINANCIAL OVERVIEW
========================= */}



<section className="admin-dashboard-summary">



<div className="admin-section-title">


<h2>
Financial Overview
</h2>


<p>
Current application activity
</p>


</div>







<div className="admin-summary-grid">





<article>


<div>

<ShoppingBag size={18}/>

</div>



<span>
Product Sales
</span>



<strong>

₹
{
totalProductSales.toLocaleString(
"en-IN"
)
}

</strong>


</article>







<article>


<div>

<Clock3 size={18}/>

</div>



<span>
Pending Withdrawal
</span>



<strong>

₹
{
pendingWithdrawalAmount.toLocaleString(
"en-IN"
)
}

</strong>


</article>







<article>


<div>

<BanknoteArrowDown size={18}/>

</div>



<span>
Approved Withdrawal
</span>



<strong>

₹
{
approvedWithdrawalAmount.toLocaleString(
"en-IN"
)
}

</strong>


</article>







<article>


<div>

<CircleDollarSign size={18}/>

</div>



<span>
Balance Requests
</span>



<strong>

₹0

</strong>


</article>



</div>



</section>








{/* =========================
 MANAGEMENT
========================= */}



<section className="admin-management">


<div className="admin-section-title">

<h2>
Management
</h2>


<p>
Manage application data
</p>


</div>






<button
type="button"
className="admin-management-item"
onClick={()=>
navigate("/admin/customers")
}
>


<div className="admin-management-icon">

<Users size={21}/>

</div>



<div className="admin-management-text">


<strong>
Customers
</strong>


<span>

{
totalCustomers
}
registered customers

</span>


</div>


<ChevronRight size={19}/>


</button>








<button
type="button"
className="admin-management-item"
onClick={()=>
navigate("/admin/wallets")
}
>


<div className="admin-management-icon">

<WalletCards size={21}/>

</div>



<div className="admin-management-text">


<strong>
Wallets
</strong>


<span>

Manage customer wallets

</span>


</div>


<ChevronRight size={19}/>


</button>








<button
type="button"
className="admin-management-item"
onClick={()=>
navigate("/admin/withdrawals")
}
>


<div className="admin-management-icon">

<BanknoteArrowDown size={21}/>

</div>



<div className="admin-management-text">


<strong>
Withdrawal Requests
</strong>


<span>

{
pendingWithdrawals.length
}
pending requests

</span>


</div>


<ChevronRight size={19}/>


</button>








<button
type="button"
className="admin-management-item"
onClick={()=>
navigate("/admin/orders")
}
>


<div className="admin-management-icon">

<ShoppingBag size={21}/>

</div>



<div className="admin-management-text">


<strong>
Orders
</strong>


<span>

{
totalPurchasedProducts
}
total purchases

</span>


</div>


<ChevronRight size={19}/>


</button>




</section>
{/* =========================
    WITHDRAWAL STATUS
========================= */}


<section className="admin-dashboard-request-summary">


<div className="admin-section-title">


<h2>
Withdrawal Status
</h2>


<p>
Overview of all withdrawal requests
</p>


</div>





<div className="admin-request-status-grid">



<article
onClick={()=>
navigate("/admin/withdrawals")
}
>

<span>
Pending
</span>


<strong>
{
pendingWithdrawals.length
}
</strong>


</article>






<article
onClick={()=>
navigate("/admin/withdrawals")
}
>

<span>
Approved
</span>


<strong>
{
approvedWithdrawals.length
}
</strong>


</article>






<article
onClick={()=>
navigate("/admin/withdrawals")
}
>

<span>
Rejected
</span>


<strong>
{
rejectedWithdrawals.length
}
</strong>


</article>



</div>



</section>









{/* =========================
    RECENT WITHDRAWALS
========================= */}



<section className="admin-recent-section">



<div className="admin-section-title admin-recent-title">



<div>

<h2>
Recent Withdrawals
</h2>


<p>
Latest customer withdrawal requests
</p>


</div>




<button
type="button"
onClick={()=>
navigate("/admin/withdrawals")
}
>

View All

<ChevronRight
size={15}
/>


</button>



</div>







{
loading ? (


<div className="admin-recent-empty">


<Clock3
size={32}
/>


<strong>
Loading Data...
</strong>


<span>
Please wait while dashboard loads.
</span>


</div>



) : recentWithdrawals.length === 0 ? (



<div className="admin-recent-empty">


<BanknoteArrowDown
size={32}
/>


<strong>
No Withdrawals
</strong>


<span>
Customer withdrawal requests will appear here.
</span>


</div>




) : (




<div className="admin-recent-list">



{
recentWithdrawals.map(
(request)=>(



<button

type="button"

className="admin-recent-item"

key={
request.id
}


onClick={()=>
navigate(
`/admin/withdrawals/${request.id}`
)
}


>




<div className="admin-recent-icon">


<BanknoteArrowDown
size={19}
/>


</div>







<div className="admin-recent-info">



<strong>

{
request.user?.name ||
"Unknown Customer"
}

</strong>




<span>

{
request.user?.mobile ||
"Mobile not available"
}

</span>





<small>

{
new Date(
request.createdAt
).toLocaleDateString(
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







<div className="admin-recent-right">



<strong>

₹
{
Number(
request.amount
).toLocaleString(
"en-IN"
)
}

</strong>





<span
className={
request.status.toLowerCase()
}
>

{
request.status
}

</span>



</div>




</button>



)

)

}



</div>




)

}



</section>








{/* =========================
    SECURITY INFO
========================= */}



<section className="admin-dashboard-info">


<ShieldCheck
size={20}
/>


<div>


<strong>
Administrator Access
</strong>


<span>
All wallet and withdrawal actions are tracked securely.
</span>


</div>



</section>





</main>

);

}


export default AdminDashboard;