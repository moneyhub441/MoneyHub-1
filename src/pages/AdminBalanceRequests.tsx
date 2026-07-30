import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Search,
  WalletCards,
  XCircle,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/AdminBalanceRequests.css";

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

type FilterType =
  | "All"
  | "Pending"
  | "Approved"
  | "Rejected";

function AdminBalanceRequests() {
  const navigate = useNavigate();

  const [filter, setFilter] =
    useState<FilterType>("All");

  const [search, setSearch] = useState("");

  // =========================
  // LOAD BALANCE REQUESTS
  // =========================

  const loadRequests = (): BalanceRequest[] => {
    try {
      const saved =
        localStorage.getItem("balanceRequests");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [requests] =
    useState<BalanceRequest[]>(loadRequests);

  // =========================
  // LOAD CUSTOMERS
  // =========================

  const loadCustomers = (): Customer[] => {
    try {
      const saved =
        localStorage.getItem("customers");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [customers] =
    useState<Customer[]>(loadCustomers);

  // =========================
  // COUNTS
  // =========================

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "Rejected"
  ).length;

  // =========================
  // FILTER + SEARCH
  // =========================

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesFilter =
        filter === "All" ||
        request.status === filter;

      const searchValue =
        search.trim().toLowerCase();

      const customer = customers.find(
        (item) =>
          Number(item.id) ===
          Number(request.userId)
      );

      const matchesSearch =
        searchValue === "" ||
        String(request.id).includes(searchValue) ||
        String(request.amount).includes(searchValue) ||
        String(request.userId).includes(searchValue) ||
        (customer?.name || "")
          .toLowerCase()
          .includes(searchValue) ||
        (customer?.mobile || "")
          .toLowerCase()
          .includes(searchValue);

      return matchesFilter && matchesSearch;
    });
  }, [requests, customers, filter, search]);

  return (
    <main className="admin-balance-page">

      {/* HEADER */}

      <header className="admin-balance-header">
        <button
          type="button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Balance Requests</h1>
          <p>Customer wallet recharge requests</p>
        </div>

        <span>
          <WalletCards size={20} />
        </span>
      </header>

      {/* SUMMARY */}

      <section className="admin-balance-stats">

        <article>
          <div className="pending">
            <Clock3 size={19} />
          </div>

          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </article>

        <article>
          <div className="approved">
            <CheckCircle2 size={19} />
          </div>

          <span>Approved</span>
          <strong>{approvedCount}</strong>
        </article>

        <article>
          <div className="rejected">
            <XCircle size={19} />
          </div>

          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
        </article>

      </section>

      {/* SEARCH + FILTER */}

      <section className="admin-balance-tools">

        <div className="admin-balance-search">
          <Search size={17} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customer, ID or amount..."
          />
        </div>

        <div className="admin-balance-filters">
          {(
            [
              "All",
              "Pending",
              "Approved",
              "Rejected",
            ] as FilterType[]
          ).map((item) => (
            <button
              type="button"
              key={item}
              className={
                filter === item ? "active" : ""
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

      </section>

      {/* REQUEST LIST */}

      <section className="admin-balance-card">

        <div className="admin-balance-title">
          <div>
            <h2>Balance Requests</h2>

            <p>
              {filteredRequests.length} records found
            </p>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="admin-balance-empty">
            <WalletCards size={35} />

            <strong>No Requests Found</strong>

            <span>
              Customer balance requests will appear
              here.
            </span>
          </div>
        ) : (
          <div className="admin-balance-list">

            {filteredRequests.map((request) => {
              const customer = customers.find(
                (item) =>
                  Number(item.id) ===
                  Number(request.userId)
              );

              return (
                <article
  className="admin-balance-item"
  key={request.id}
  onClick={() =>
    navigate(
      `/admin/balance-requests/${request.id}`
    )
  }
>

                  <div
                    className={`admin-balance-item-icon ${request.status.toLowerCase()}`}
                  >
                    {request.status ===
                    "Approved" ? (
                      <CheckCircle2 size={20} />
                    ) : request.status ===
                      "Rejected" ? (
                      <XCircle size={20} />
                    ) : (
                      <Clock3 size={20} />
                    )}
                  </div>

                  <div className="admin-balance-info">

                    <strong>
                      {customer?.name ||
                        "Unknown Customer"}
                    </strong>

                    <span>
                      {customer?.mobile ||
                        "Mobile not available"}
                    </span>

                    <span>
                      Request #{request.id}
                    </span>

                    <small>
                      {new Date(
                        request.createdAt
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </small>

                  </div>

                  <div className="admin-balance-right">

                    <strong>
                      ₹
                      {Number(
                        request.amount
                      ).toLocaleString("en-GB")}
                    </strong>

                    <span
                      className={request.status.toLowerCase()}
                    >
                      {request.status}
                    </span>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

    </main>
  );
}

export default AdminBalanceRequests;