import {
  ArrowLeft,
  CalendarDays,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";
import API_URL from "../config/api";
import "../css/AdminCustomerDetails.css";

type Customer = {
   id: string;
  name: string;
  email: string;
  mobile: string;
  status: "Active" | "Blocked";
  joinedAt: string;
};

type PurchasedProduct = {
  id: number;
  purchaseId: number;
  name: string;
  price: number;
};

type WithdrawRequest = {
  id: number;
  amount: number;
  upiId?: string;
  status: "Pending" | "Approved" | "Rejected";
};

function AdminCustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================
  // LOAD CUSTOMERS
  // =========================




const [customer,setCustomer] =
useState<Customer | null>(null);


useEffect(()=>{

const loadCustomer = async()=>{

try{

const response =
await fetch(
`${API_URL}/api/auth/users/${id}`
);


const data =
await response.json();


if(data.success){

setCustomer(
data.user
);

}


}catch(error){

console.log(
"Customer error",
error
);

}

};


if(id){

loadCustomer();

}


},[id]);
  // =========================
  // FIND CUSTOMER
  // =========================

 

  // =========================
  // NOT FOUND
  // =========================

  if (!customer) {
    return (
      <main className="admin-customer-detail-page">
        <header className="admin-customer-detail-header">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/customers")
            }
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1>Customer Details</h1>
            <p>Customer account information</p>
          </div>

          <span>
            <UserRound size={20} />
          </span>
        </header>

        <section className="admin-customer-not-found">
          <UserRound size={40} />

          <h2>Customer Not Found</h2>

          <p>
            This customer account could not be
            found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/customers")
            }
          >
            Back to Customers
          </button>
        </section>
      </main>
    );
  }

  // =========================
  // WALLET
  // =========================

  let walletBalance = 0;

  try {
    walletBalance = Number(
      localStorage.getItem("walletBalance") || "0"
    );
  } catch {
    walletBalance = 0;
  }

  // =========================
  // PRODUCTS
  // =========================

  let products: PurchasedProduct[] = [];

  try {
    products = JSON.parse(
      localStorage.getItem("myProducts") || "[]"
    );
  } catch {
    products = [];
  }

  // =========================
  // WITHDRAWALS
  // =========================

  let withdrawals: WithdrawRequest[] = [];

  try {
    withdrawals = JSON.parse(
      localStorage.getItem("withdrawRequests") || "[]"
    );
  } catch {
    withdrawals = [];
  }

  const pendingWithdrawals =
    withdrawals.filter(
      (item) => item.status === "Pending"
    ).length;

  // =========================
  // JOIN DATE
  // =========================

  const joinedDate = customer.joinedAt
    ? new Date(
        customer.joinedAt
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <main className="admin-customer-detail-page">

      {/* HEADER */}

      <header className="admin-customer-detail-header">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/customers")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Customer Details</h1>
          <p>Customer account information</p>
        </div>

        <span>
          <UserRound size={20} />
        </span>
      </header>

      {/* PROFILE */}

      <section className="admin-customer-profile">

        <div className="admin-customer-profile-avatar">
          <UserRound size={35} />
        </div>

        <span
          className={`admin-customer-profile-status ${customer.status.toLowerCase()}`}
        >
          <ShieldCheck size={13} />
          {customer.status}
        </span>

        <h2>{customer.name}</h2>

        <p>Money Hub Customer</p>

      </section>

      {/* ACCOUNT STATS */}

      <section className="admin-customer-detail-stats">

        <article>
          <WalletCards size={20} />

          <span>Wallet</span>

          <strong>
            ₹
            {walletBalance.toLocaleString(
              "en-GB"
            )}
          </strong>
        </article>

        <article>
          <Package size={20} />

          <span>Products</span>

          <strong>
            {products.length}
          </strong>
        </article>

        <article>
          <WalletCards size={20} />

          <span>Pending</span>

          <strong>
            {pendingWithdrawals}
          </strong>
        </article>

      </section>

      {/* PERSONAL INFORMATION */}

      <section className="admin-customer-info-card">

        <div className="admin-customer-info-title">
          <h2>Personal Information</h2>

          <p>
            Registered customer details
          </p>
        </div>

        <div className="admin-customer-detail-row">
          <div>
            <UserRound size={18} />
          </div>

          <section>
            <span>Full Name</span>
            <strong>{customer.name}</strong>
          </section>
        </div>

        <div className="admin-customer-detail-row">
          <div>
            <Phone size={18} />
          </div>

          <section>
            <span>Mobile Number</span>
            <strong>{customer.mobile}</strong>
          </section>
        </div>

        <div className="admin-customer-detail-row">
          <div>
            <Mail size={18} />
          </div>

          <section>
            <span>Email Address</span>
            <strong>{customer.email}</strong>
          </section>
        </div>

        <div className="admin-customer-detail-row">
          <div>
            <CalendarDays size={18} />
          </div>

          <section>
            <span>Joined On</span>
            <strong>{joinedDate}</strong>
          </section>
        </div>

        <div className="admin-customer-detail-row">
          <div>
            <ShieldCheck size={18} />
          </div>

          <section>
            <span>Account Status</span>

            <strong
              className={`admin-customer-status-text ${customer.status.toLowerCase()}`}
            >
              {customer.status}
            </strong>
          </section>
        </div>

      </section>

      {/* ACTIVITY */}

      <section className="admin-customer-activity">

        <div>
          <h2>Account Activity</h2>

          <p>
            Current customer account summary
          </p>
        </div>

        <article>
          <span>Purchased Products</span>
          <strong>{products.length}</strong>
        </article>

        <article>
          <span>Withdrawal Requests</span>
          <strong>{withdrawals.length}</strong>
        </article>

        <article>
          <span>Pending Withdrawals</span>
          <strong>{pendingWithdrawals}</strong>
        </article>

      </section>

    </main>
  );
}

export default AdminCustomerDetails;