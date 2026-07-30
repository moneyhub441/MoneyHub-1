import {
  ArrowLeft,
  BanknoteArrowDown,
  CheckCircle2,
  Clock3,
  Search,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "../css/AdminWithdrawals.css";

/* =========================
   TYPES
========================= */

type Customer = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
};

type WithdrawRequest = {
  id: string;

  userId: string;

  user: Customer | null;

  amount: number;

  upiId: string;

  status:
    | "Pending"
    | "Approved"
    | "Rejected";

  createdAt: string;

  processedAt?: string | null;
};

type FilterType =
  | "All"
  | "Pending"
  | "Approved"
  | "Rejected";

type WithdrawalsResponse = {
  success: boolean;

  message?: string;

  withdrawals?: WithdrawRequest[];
};

/* =========================
   COMPONENT
========================= */

function AdminWithdrawals() {
  const navigate =
    useNavigate();

  /* =========================
     API URL
  ========================= */

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  /* =========================
     STATES
  ========================= */

  const [
    requests,
    setRequests,
  ] = useState<
    WithdrawRequest[]
  >([]);

  const [
    filter,
    setFilter,
  ] =
    useState<FilterType>(
      "All"
    );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =========================
     LOAD WITHDRAWALS
  ========================= */

  useEffect(() => {
    const loadWithdrawals =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/withdrawals/admin/all`
            );

          const data:
            WithdrawalsResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load withdrawals."
            );
          }

          setRequests(
            Array.isArray(
              data.withdrawals
            )
              ? data.withdrawals
              : []
          );
        } catch (error) {
          console.error(
            "Admin withdrawals error:",
            error
          );

          setRequests([]);

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load withdrawals."
          );
        } finally {
          setLoading(false);
        }
      };

    loadWithdrawals();
  }, [API_URL]);

  /* =========================
     COUNTS
  ========================= */

  const pendingCount =
    requests.filter(
      (request) =>
        request.status ===
        "Pending"
    ).length;

  const approvedCount =
    requests.filter(
      (request) =>
        request.status ===
        "Approved"
    ).length;

  const rejectedCount =
    requests.filter(
      (request) =>
        request.status ===
        "Rejected"
    ).length;

  /* =========================
     FILTER + SEARCH
  ========================= */

  const filteredRequests =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return requests.filter(
        (request) => {
          const matchesFilter =
            filter === "All" ||
            request.status ===
              filter;

          const requestId =
            String(
              request.id || ""
            ).toLowerCase();

          const userId =
            String(
              request.userId || ""
            ).toLowerCase();

          const amount =
            String(
              request.amount || ""
            ).toLowerCase();

          const upiId =
            String(
              request.upiId || ""
            ).toLowerCase();

          const customerName =
            String(
              request.user?.name ||
                ""
            ).toLowerCase();

          const mobile =
            String(
              request.user?.mobile ||
                ""
            ).toLowerCase();

          const email =
            String(
              request.user?.email ||
                ""
            ).toLowerCase();

          const matchesSearch =
            searchValue === "" ||
            requestId.includes(
              searchValue
            ) ||
            userId.includes(
              searchValue
            ) ||
            amount.includes(
              searchValue
            ) ||
            upiId.includes(
              searchValue
            ) ||
            customerName.includes(
              searchValue
            ) ||
            mobile.includes(
              searchValue
            ) ||
            email.includes(
              searchValue
            );

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      requests,
      filter,
      search,
    ]);

  /* =========================
     UI
  ========================= */

  return (
    <main className="admin-withdrawals-page">

      {/* HEADER */}

      <header className="admin-withdrawals-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>

          <h1>
            Withdrawals
          </h1>

          <p>
            Customer withdrawal
            requests
          </p>

        </div>

        <span>
          <BanknoteArrowDown
            size={20}
          />
        </span>

      </header>

      {/* SUMMARY */}

      <section className="admin-withdrawal-stats">

        <article>

          <div className="pending">
            <Clock3
              size={19}
            />
          </div>

          <span>
            Pending
          </span>

          <strong>
            {pendingCount}
          </strong>

        </article>

        <article>

          <div className="approved">
            <CheckCircle2
              size={19}
            />
          </div>

          <span>
            Approved
          </span>

          <strong>
            {approvedCount}
          </strong>

        </article>

        <article>

          <div className="rejected">
            <XCircle
              size={19}
            />
          </div>

          <span>
            Rejected
          </span>

          <strong>
            {rejectedCount}
          </strong>

        </article>

      </section>

      {/* SEARCH + FILTER */}

      <section className="admin-withdrawal-tools">

        <div className="admin-withdrawal-search">

          <Search
            size={17}
          />

          <input
            type="text"
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
            placeholder="Search customer, mobile, UPI, ID or amount..."
          />

        </div>

        <div className="admin-withdrawal-filters">

          {(
            [
              "All",
              "Pending",
              "Approved",
              "Rejected",
            ] as FilterType[]
          ).map(
            (item) => (

              <button
                type="button"
                key={item}
                className={
                  filter ===
                  item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(
                    item
                  )
                }
              >
                {item}
              </button>

            )
          )}

        </div>

      </section>

      {/* ERROR */}

      {error && (
        <div
          style={{
            margin:
              "12px 16px",

            padding:
              "11px 12px",

            borderRadius:
              "10px",

            background:
              "#fff1f2",

            color:
              "#dc2626",

            fontSize:
              "11px",

            fontWeight:
              "700",

            textAlign:
              "center",
          }}
        >
          {error}
        </div>
      )}

      {/* REQUESTS */}

      <section className="admin-withdrawal-card">

        <div className="admin-withdrawal-title">

          <div>

            <h2>
              Withdrawal Requests
            </h2>

            <p>
              {
                filteredRequests.length
              }{" "}
              records found
            </p>

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="admin-withdrawal-empty">

            <Clock3
              size={35}
            />

            <strong>
              Loading Requests...
            </strong>

            <span>
              Please wait.
            </span>

          </div>

        ) : filteredRequests.length ===
          0 ? (

          /* EMPTY */

          <div className="admin-withdrawal-empty">

            <BanknoteArrowDown
              size={35}
            />

            <strong>
              No Requests Found
            </strong>

            <span>
              Customer withdrawal
              requests will appear
              here.
            </span>

          </div>

        ) : (

          /* LIST */

          <div className="admin-withdrawal-list">

            {filteredRequests.map(
              (request) => (

                <article
                  className="admin-withdrawal-item"
                  key={
                    request.id
                  }
                  onClick={() =>
                    navigate(
                      `/admin/withdrawals/${request.id}`
                    )
                  }
                >

                  {/* ICON */}

                  <div
                    className={`admin-withdrawal-item-icon ${request.status.toLowerCase()}`}
                  >

                    {request.status ===
                    "Approved" ? (

                      <CheckCircle2
                        size={20}
                      />

                    ) : request.status ===
                      "Rejected" ? (

                      <XCircle
                        size={20}
                      />

                    ) : (

                      <Clock3
                        size={20}
                      />

                    )}

                  </div>

                  {/* INFO */}

                  <div className="admin-withdrawal-info">

                    <strong>
                      {request
                        .user
                        ?.name ||
                        "Unknown Customer"}
                    </strong>

                    <span>
                      {request
                        .user
                        ?.mobile ||
                        "Mobile not available"}
                    </span>

                    {request.upiId && (
                      <span>
                        UPI:{" "}
                        {
                          request.upiId
                        }
                      </span>
                    )}

                    <span>
                      Request #
                      {request.id}
                    </span>

                    <small>
                      {new Date(
                        request.createdAt
                      ).toLocaleString(
                        "en-GB",
                        {
                          day:
                            "2-digit",

                          month:
                            "short",

                          year:
                            "numeric",

                          hour:
                            "2-digit",

                          minute:
                            "2-digit",
                        }
                      )}
                    </small>

                  </div>

                  {/* RIGHT */}

                  <div className="admin-withdrawal-right">

                    <strong>
                      ₹
                      {Number(
                        request.amount
                      ).toLocaleString(
                        "en-IN"
                      )}
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

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminWithdrawals;