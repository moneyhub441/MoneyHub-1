import {
  ArrowLeft,
  CalendarDays,
  Hash,
  IndianRupee,
  Package,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  UserRound,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import "../css/AdminOrderDetails.css";

type PurchasedProduct = {
  id: number;
  purchaseId: number;
  userId: number;
  name: string;
  category?: string;
  validity?: string;
  price: number;
  image?: string;
  status: string;
  purchasedAt?: string;
};

type Customer = {
  id: number;
  name: string;
  mobile: string;
  email?: string;
};

function AdminOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================
  // LOAD ORDERS
  // =========================

  let orders: PurchasedProduct[] = [];

  try {
    const saved =
      localStorage.getItem("myProducts");

    orders = saved
      ? JSON.parse(saved)
      : [];
  } catch {
    orders = [];
  }

  // =========================
  // FIND ORDER
  // =========================

  const order = orders.find(
    (item) =>
      Number(item.purchaseId) === Number(id)
  );

  // =========================
  // LOAD CUSTOMERS
  // =========================

  let customers: Customer[] = [];

  try {
    const saved =
      localStorage.getItem("customers");

    customers = saved
      ? JSON.parse(saved)
      : [];
  } catch {
    customers = [];
  }

  // =========================
  // CUSTOMER
  // =========================

  const customer = customers.find(
    (item) =>
      Number(item.id) ===
      Number(order?.userId)
  );

  // =========================
  // NOT FOUND
  // =========================

  if (!order) {
    return (
      <main className="admin-order-detail-page">

        <header className="admin-order-detail-header">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1>Order Details</h1>
            <p>Purchase information</p>
          </div>

          <span>
            <ShoppingBag size={20} />
          </span>

        </header>

        <section className="admin-order-not-found">

          <ShoppingBag size={40} />

          <h2>Order Not Found</h2>

          <p>
            This purchase could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Back to Orders
          </button>

        </section>

      </main>
    );
  }

  // =========================
  // DATE
  // =========================

  const formattedDate =
    order.purchasedAt
      ? new Date(
          order.purchasedAt
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "Not Available";

  const formattedTime =
    order.purchasedAt
      ? new Date(
          order.purchasedAt
        ).toLocaleTimeString(
          "en-GB",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "";

  return (
    <main className="admin-order-detail-page">

      {/* HEADER */}

      <header className="admin-order-detail-header">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Order Details</h1>

          <p>
            Customer purchase information
          </p>
        </div>

        <span>
          <ShoppingBag size={20} />
        </span>

      </header>

      {/* HERO */}

      <section className="admin-order-detail-hero">

        <div className="admin-order-detail-main-icon">
          <Package size={31} />
        </div>

        <span>PURCHASE AMOUNT</span>

        <h2>
          ₹
          {Number(
            order.price
          ).toLocaleString("en-GB")}
        </h2>

        <div className="admin-order-detail-status">
          <ShieldCheck size={13} />

          {order.status || "Active"}
        </div>

      </section>

      {/* PRODUCT INFORMATION */}

      <section className="admin-order-detail-card">

        <div className="admin-order-detail-title">

          <h2>Product Information</h2>

          <p>
            Purchased product details
          </p>

        </div>

        {/* PRODUCT */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <Package size={18} />
          </div>

          <div>
            <span>Product Name</span>

            <strong>
              {order.name}
            </strong>
          </div>

        </div>

        {/* PRODUCT ID */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <Hash size={18} />
          </div>

          <div>
            <span>Product ID</span>

            <strong>
              #{order.id}
            </strong>
          </div>

        </div>

        {/* CATEGORY */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <Package size={18} />
          </div>

          <div>
            <span>Category</span>

            <strong>
              {order.category ||
                "Not Available"}
            </strong>
          </div>

        </div>

        {/* VALIDITY */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Validity</span>

            <strong>
              {order.validity ||
                "Not Available"}
            </strong>
          </div>

        </div>

        {/* PRICE */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <IndianRupee size={18} />
          </div>

          <div>
            <span>Product Price</span>

            <strong>
              ₹
              {Number(
                order.price
              ).toLocaleString(
                "en-GB"
              )}
            </strong>
          </div>

        </div>

      </section>

      {/* CUSTOMER INFORMATION */}

      <section className="admin-order-detail-card">

        <div className="admin-order-detail-title">

          <h2>Customer Information</h2>

          <p>
            Customer who purchased this product
          </p>

        </div>

        {/* NAME */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <UserRound size={18} />
          </div>

          <div>
            <span>Customer Name</span>

            <strong>
              {customer?.name ||
                "Unknown Customer"}
            </strong>
          </div>

        </div>

        {/* MOBILE */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <Smartphone size={18} />
          </div>

          <div>
            <span>Mobile Number</span>

            <strong>
              {customer?.mobile ||
                "Not Available"}
            </strong>
          </div>

        </div>

        {/* USER ID */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <Hash size={18} />
          </div>

          <div>
            <span>User ID</span>

            <strong>
              #{order.userId}
            </strong>
          </div>

        </div>

      </section>

      {/* ORDER INFORMATION */}

      <section className="admin-order-detail-card">

        <div className="admin-order-detail-title">

          <h2>Order Information</h2>

          <p>
            Purchase transaction details
          </p>

        </div>

        {/* ORDER ID */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <Hash size={18} />
          </div>

          <div>
            <span>Order ID</span>

            <strong>
              #{order.purchaseId}
            </strong>
          </div>

        </div>

        {/* PURCHASE DATE */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Purchased On</span>

            <strong>
              {formattedDate}
            </strong>

            {formattedTime && (
              <small>
                {formattedTime}
              </small>
            )}
          </div>

        </div>

        {/* STATUS */}

        <div className="admin-order-detail-row">

          <div className="admin-order-detail-row-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>Order Status</span>

            <strong className="admin-order-active">
              {order.status ||
                "Active"}
            </strong>
          </div>

        </div>

      </section>

      {/* NOTICE */}

      <section className="admin-order-detail-notice">

        <ShieldCheck size={20} />

        <div>
          <strong>
            Purchase Record
          </strong>

          <span>
            This order belongs to the customer
            shown above.
          </span>
        </div>

      </section>

    </main>
  );
}

export default AdminOrderDetails;