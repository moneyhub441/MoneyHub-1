import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Hash,
  IndianRupee,
  ShieldCheck,
  Smartphone,
  UserRound,
  WalletCards,
} from "lucide-react";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../css/AdminBalanceRequestDetails.css";

type BalanceRequest = {
  id: number;
  userId: number;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

type Customer = {
  id: number;
  name: string;
  mobile: string;
  email?: string;
};

function AdminBalanceRequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // =========================
  // LOAD REQUESTS
  // =========================

  let requests: BalanceRequest[] = [];

  try {
    const saved =
      localStorage.getItem("balanceRequests");

    requests = saved
      ? JSON.parse(saved)
      : [];
  } catch {
    requests = [];
  }

  // =========================
  // FIND REQUEST
  // =========================

  const foundRequest = requests.find(
    (item) =>
      Number(item.id) === Number(id)
  );

  const [request, setRequest] =
  useState<BalanceRequest | undefined>(
    foundRequest
  );

  // =========================
  // LOAD CUSTOMERS
  // =========================

  let customers: Customer[] = [];

  try {
    const savedCustomers =
      localStorage.getItem("customers");

    customers = savedCustomers
      ? JSON.parse(savedCustomers)
      : [];
  } catch {
    customers = [];
  }

  const customer = customers.find(
    (item) =>
      Number(item.id) ===
      Number(request?.userId)
  );

  // =========================
  // NOT FOUND
  // =========================

  // =========================
// UPDATE REQUEST STATUS
// =========================

const updateRequestStatus = (
  newStatus: "Approved" | "Rejected"
) => {
  if (!request) return;

  // Already processed
  if (request.status !== "Pending") {
    return;
  }

  const userId = Number(request.userId);

  if (!userId) {
    console.error(
      "Balance request has no valid userId."
    );
    return;
  }

  // =========================
  // APPROVE = ADD MONEY
  // =========================

  if (newStatus === "Approved") {
    const balanceKey =
      `walletBalance_${userId}`;

    const transactionKey =
      `walletTransactions_${userId}`;

    const currentBalance = Number(
      localStorage.getItem(balanceKey) || "0"
    );

    const newBalance =
      currentBalance + Number(request.amount);

    localStorage.setItem(
      balanceKey,
      String(newBalance)
    );

    // =========================
    // CREDIT TRANSACTION
    // =========================

    let oldTransactions: any[] = [];

    try {
      const savedTransactions =
        localStorage.getItem(transactionKey);

      oldTransactions = savedTransactions
        ? JSON.parse(savedTransactions)
        : [];
    } catch {
      oldTransactions = [];
    }

    const transaction = {
      id: Date.now(),

      title: "Balance Added",

      description: "Wallet balance approved by admin",

      date: new Date().toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),

      type: "credit",

      amount: Number(request.amount),

      status: "Completed",
    };

    localStorage.setItem(
      transactionKey,
      JSON.stringify([
        transaction,
        ...oldTransactions,
      ])
    );
  }

  // =========================
  // UPDATE REQUEST STATUS
  // =========================

  const updatedRequests = requests.map(
    (item) =>
      Number(item.id) === Number(request.id)
        ? {
            ...item,
            status: newStatus,
          }
        : item
  );

  localStorage.setItem(
    "balanceRequests",
    JSON.stringify(updatedRequests)
  );

  setRequest({
    ...request,
    status: newStatus,
  });
};

  if (!request) {
    return (
      <main className="admin-balance-detail-page">

        <header className="admin-balance-detail-header">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/balance-requests")
            }
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1>Request Details</h1>
            <p>Balance request information</p>
          </div>

          <span>
            <WalletCards size={20} />
          </span>
        </header>

        <section className="admin-balance-detail-not-found">
          <WalletCards size={38} />

          <h2>Request Not Found</h2>

          <p>
            This balance request could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/balance-requests")
            }
          >
            Back to Balance Requests
          </button>
        </section>

      </main>
    );
  }

  // =========================
  // DATE + TIME
  // =========================

  const formattedDate = new Date(
    request.createdAt
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(
    request.createdAt
  ).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="admin-balance-detail-page">

      {/* HEADER */}

      <header className="admin-balance-detail-header">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/balance-requests")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Request Details</h1>
          <p>Balance request information</p>
        </div>

        <span>
          <WalletCards size={20} />
        </span>

      </header>

      {/* HERO */}

      <section className="admin-balance-detail-hero">

        <div className="admin-balance-detail-main-icon">
          <IndianRupee size={31} />
        </div>

        <span>REQUESTED AMOUNT</span>

        <h2>
          ₹
          {Number(request.amount).toLocaleString(
            "en-GB"
          )}
        </h2>

        <div
          className={`admin-balance-detail-status ${request.status.toLowerCase()}`}
        >
          <Clock3 size={13} />

          {request.status}
        </div>

      </section>

      {/* INFORMATION */}

      <section className="admin-balance-detail-card">

        <div className="admin-balance-detail-title">
          <h2>Request Information</h2>

          <p>
            Customer and balance request details
          </p>
        </div>

        {/* CUSTOMER NAME */}

        <div className="admin-balance-detail-row">

          <div className="admin-balance-detail-row-icon">
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

        <div className="admin-balance-detail-row">

          <div className="admin-balance-detail-row-icon">
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

        <div className="admin-balance-detail-row">

          <div className="admin-balance-detail-row-icon">
            <Hash size={18} />
          </div>

          <div>
            <span>User ID</span>

            <strong>
              #{request.userId}
            </strong>
          </div>

        </div>

        {/* REQUEST ID */}

        <div className="admin-balance-detail-row">

          <div className="admin-balance-detail-row-icon">
            <Hash size={18} />
          </div>

          <div>
            <span>Request ID</span>

            <strong>
              #{request.id}
            </strong>
          </div>

        </div>

        {/* AMOUNT */}

        <div className="admin-balance-detail-row">

          <div className="admin-balance-detail-row-icon">
            <IndianRupee size={18} />
          </div>

          <div>
            <span>Requested Amount</span>

            <strong>
              ₹
              {Number(
                request.amount
              ).toLocaleString("en-GB")}
            </strong>
          </div>

        </div>

        {/* DATE */}

        <div className="admin-balance-detail-row">

          <div className="admin-balance-detail-row-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Requested On</span>

            <strong>
              {formattedDate}
            </strong>

            <small>
              {formattedTime}
            </small>
          </div>

        </div>

        {/* STATUS */}

        <div className="admin-balance-detail-row">

          <div className="admin-balance-detail-row-icon">
            <ShieldCheck size={18} />
          </div>

          <div>
            <span>Current Status</span>

            <strong
              className={`admin-balance-detail-status-text ${request.status.toLowerCase()}`}
            >
              {request.status}
            </strong>
          </div>

        </div>

      </section>

      {/* ADMIN ACTION */}

      {request.status === "Pending" && (
        <section className="admin-balance-detail-actions">

          <div>
            <h2>Admin Action</h2>

            <p>
              Review this balance request.
            </p>
          </div>

          <div className="admin-balance-detail-action-buttons">

            <button
  type="button"
  className="reject"
  onClick={() =>
    updateRequestStatus("Rejected")
  }
>
  Reject Request
</button>

            <button
  type="button"
  className="approve"
  onClick={() =>
    updateRequestStatus("Approved")
  }
>
  Approve Request
</button>

          </div>

        </section>
      )}

      {/* NOTICE */}

      <section className="admin-balance-detail-notice">

        <ShieldCheck size={20} />

        <div>
          <strong>Balance Approval</strong>

          <span>
            The wallet balance will be credited only
            after the request is approved.
          </span>
        </div>

      </section>

    </main>
  );
}

export default AdminBalanceRequestDetails;