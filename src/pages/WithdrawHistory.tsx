import {
  ArrowLeft,
  BanknoteArrowDown,
  CheckCircle2,
  Clock3,
  History,
  Search,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import "../css/WithdrawHistory.css";

/* =========================
   TYPES
========================= */

type WithdrawRequest = {
  id: string;
  userId: string;
  amount: number;
  upiId: string;

  status:
    | "Pending"
    | "Approved"
    | "Rejected";

  createdAt: string;
  processedAt?: string | null;
};

type WithdrawHistoryResponse = {
  success: boolean;
  message?: string;
  withdrawals?: WithdrawRequest[];
};

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
};

type FilterType =
  | "All"
  | "Pending"
  | "Approved"
  | "Rejected";

/* =========================
   COMPONENT
========================= */

function WithdrawHistory() {
  const navigate =
    useNavigate();

  /* =========================
     API URL
  ========================= */

  

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
     CURRENT USER
  ========================= */

  let currentUser:
    CurrentUser | null =
    null;

  try {
    const savedUser =
      localStorage.getItem(
        "currentUser"
      );

    currentUser =
      savedUser
        ? JSON.parse(
            savedUser
          )
        : null;
  } catch {
    currentUser = null;
  }

  const currentUserId =
    currentUser?.id || "";

  /* =========================
     LOAD WITHDRAWALS
  ========================= */

  useEffect(() => {
    const loadWithdrawals =
      async () => {
        if (!currentUserId) {
          setError(
            "Please login again."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/withdrawals/user/${currentUserId}`
            );

          const data:
            WithdrawHistoryResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load withdrawal history."
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
            "Withdrawal history error:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load withdrawal history."
          );

          setRequests([]);
        } finally {
          setLoading(false);
        }
      };

    loadWithdrawals();
  }, [
    API_URL,
    currentUserId,
  ]);

  /* =========================
     FILTER + SEARCH
  ========================= */

  const filteredRequests =
    useMemo(() => {
      const cleanSearch =
        search
          .trim()
          .toLowerCase();

      return requests.filter(
        (request) => {
          const matchesFilter =
            filter === "All" ||
            request.status ===
              filter;

          if (!cleanSearch) {
            return matchesFilter;
          }

          const matchesSearch =
            String(
              request.amount
            ).includes(
              cleanSearch
            ) ||
            String(
              request.id
            )
              .toLowerCase()
              .includes(
                cleanSearch
              ) ||
            String(
              request.upiId ||
                ""
            )
              .toLowerCase()
              .includes(
                cleanSearch
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
    <main className="withdraw-history-page">

      {/* HEADER */}

      <header className="withdraw-history-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/wallet"
            )
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>
          <h1>
            Withdrawal History
          </h1>

          <p>
            Your withdrawal requests
          </p>
        </div>

        <span>
          <History
            size={20}
          />
        </span>

      </header>

      {/* HERO */}

      <section className="withdraw-history-hero">

        <div>

          <span>
            Total Requests
          </span>

          <h2>
            {loading
              ? "..."
              : requests.length}
          </h2>

          <p>
            Track your withdrawal
            requests
          </p>

        </div>

        <div>
          <BanknoteArrowDown
            size={31}
          />
        </div>

      </section>

      {/* SEARCH */}

      <section className="withdraw-history-tools">

        <div className="withdraw-history-search">

          <Search
            size={17}
          />

          <input
            type="text"
            placeholder="Search amount or request ID..."
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        {/* FILTERS */}

        <div className="withdraw-history-filters">

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

      {/* LIST */}

      <section className="withdraw-history-card">

        <div className="withdraw-history-title">

          <h2>
            Requests
          </h2>

          <p>
            {loading
              ? "Loading..."
              : `${filteredRequests.length} records found`}
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="withdraw-history-empty">

            <XCircle
              size={35}
            />

            <strong>
              Unable to Load
            </strong>

            <span>
              {error}
            </span>

          </div>
        )}

        {/* LOADING */}

        {!error &&
          loading && (

          <div className="withdraw-history-empty">

            <History
              size={35}
            />

            <strong>
              Loading...
            </strong>

            <span>
              Loading your withdrawal
              requests.
            </span>

          </div>
        )}

        {/* EMPTY */}

        {!error &&
          !loading &&
          filteredRequests.length ===
            0 && (

          <div className="withdraw-history-empty">

            <History
              size={35}
            />

            <strong>
              No Withdrawal Requests
            </strong>

            <span>
              Your withdrawal requests
              will appear here.
            </span>

          </div>
        )}

        {/* REQUEST LIST */}

        {!error &&
          !loading &&
          filteredRequests.length >
            0 && (

          <div className="withdraw-history-list">

            {filteredRequests.map(
              (request) => (

                <article
                  className="withdraw-history-item"
                  key={
                    request.id
                  }
                >

                  {/* ICON */}

                  <div
                    className={`withdraw-history-icon ${request.status.toLowerCase()}`}
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

                  <div className="withdraw-history-info">

                    <strong>
                      Withdrawal Request
                    </strong>

                    <span>
                      ID #
                      {request.id}
                    </span>

                    <span>
                      UPI:{" "}
                      {request.upiId ||
                        "Not Available"}
                    </span>

                    <small>
                      {new Date(
                        request.createdAt
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day:
                            "2-digit",

                          month:
                            "short",

                          year:
                            "numeric",
                        }
                      )}
                    </small>

                  </div>

                  {/* RIGHT */}

                  <div className="withdraw-history-right">

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

export default WithdrawHistory;