import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  History,
  Search,
  WalletCards,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "../css/WalletHistory.css";

/* =========================
   TYPES
========================= */

type Transaction = {
  id: string;

  title: string;

  description?: string;

  type: "credit" | "debit";

  amount: number;

  category?: string;

  status?: string;

  referenceId?: string;

  createdAt: string;
};

type WalletResponse = {
  success: boolean;

  message?: string;

  transactions?: Transaction[];
};

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
};

type FilterType =
  | "all"
  | "credit"
  | "debit";

/* =========================
   COMPONENT
========================= */

function WalletHistory() {
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
    transactions,
    setTransactions,
  ] = useState<Transaction[]>(
    []
  );

  const [
    filter,
    setFilter,
  ] =
    useState<FilterType>(
      "all"
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
     LOAD TRANSACTIONS
     FROM MONGODB
  ========================= */

  useEffect(() => {
    const loadTransactions =
      async () => {
        if (!currentUserId) {
          setError(
            "Please login again."
          );

          setTransactions([]);

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/wallet/${currentUserId}`
            );

          const data:
            WalletResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load wallet transactions."
            );
          }

          const transactionList =
            Array.isArray(
              data.transactions
            )
              ? data.transactions
              : [];

          /*
            Backend already
            newest first bhej raha hai.

            Fir bhi safe sorting.
          */

          const sorted =
            [
              ...transactionList,
            ].sort(
              (a, b) =>
                new Date(
                  b.createdAt
                ).getTime() -
                new Date(
                  a.createdAt
                ).getTime()
            );

          setTransactions(
            sorted
          );
        } catch (error) {
          console.error(
            "Wallet history error:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load wallet transactions."
          );

          setTransactions([]);
        } finally {
          setLoading(false);
        }
      };

    loadTransactions();
  }, [
    API_URL,
    currentUserId,
  ]);

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDate = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================
     FILTER + SEARCH
  ========================= */

  const filteredTransactions =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return transactions.filter(
        (transaction) => {
          const matchesFilter =
            filter === "all" ||
            transaction.type ===
              filter;

          const title =
            String(
              transaction.title ||
                ""
            ).toLowerCase();

          const description =
            String(
              transaction.description ||
                ""
            ).toLowerCase();

          const status =
            String(
              transaction.status ||
                "Completed"
            ).toLowerCase();

          const amount =
            String(
              transaction.amount ||
                ""
            ).toLowerCase();

          const id =
            String(
              transaction.id ||
                ""
            ).toLowerCase();

          const category =
            String(
              transaction.category ||
                ""
            ).toLowerCase();

          const referenceId =
            String(
              transaction.referenceId ||
                ""
            ).toLowerCase();

          const date =
            formatDate(
              transaction.createdAt
            ).toLowerCase();

          const matchesSearch =
            searchValue === "" ||
            title.includes(
              searchValue
            ) ||
            description.includes(
              searchValue
            ) ||
            status.includes(
              searchValue
            ) ||
            amount.includes(
              searchValue
            ) ||
            id.includes(
              searchValue
            ) ||
            category.includes(
              searchValue
            ) ||
            referenceId.includes(
              searchValue
            ) ||
            date.includes(
              searchValue
            );

          return (
            matchesFilter &&
            matchesSearch
          );
        }
      );
    }, [
      transactions,
      filter,
      search,
    ]);

  /* =========================
     CREDIT
  ========================= */

  const creditTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type ===
        "credit"
    );

  /* =========================
     DEBIT
  ========================= */

  const debitTransactions =
    transactions.filter(
      (transaction) =>
        transaction.type ===
        "debit"
    );

  /* =========================
     UI
  ========================= */

  return (
    <main className="wallet-history-page">

      {/* HEADER */}

      <header className="wallet-history-header">

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
            Wallet History
          </h1>

          <p>
            View your wallet activity
          </p>

        </div>

        <span>
          <History
            size={20}
          />
        </span>

      </header>

      {/* HERO */}

      <section className="wallet-history-hero">

        <div>

          <span>
            Transaction History
          </span>

          <h2>
            {loading
              ? "..."
              : transactions.length}{" "}
            Transactions
          </h2>

          <p>
            Review your recent wallet
            records.
          </p>

        </div>

        <div className="wallet-history-hero-icon">

          <WalletCards
            size={30}
          />

        </div>

      </section>

      {/* SEARCH + FILTER */}

      <section className="wallet-history-tools">

        <div className="wallet-history-search">

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
                event.target.value
              )
            }
            placeholder="Search transactions..."
          />

        </div>

        <div className="wallet-history-filters">

          <button
            type="button"
            className={
              filter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter(
                "all"
              )
            }
          >
            All (
            {transactions.length}
            )
          </button>

          <button
            type="button"
            className={
              filter === "credit"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter(
                "credit"
              )
            }
          >
            Credit (
            {
              creditTransactions.length
            }
            )
          </button>

          <button
            type="button"
            className={
              filter === "debit"
                ? "active"
                : ""
            }
            onClick={() =>
              setFilter(
                "debit"
              )
            }
          >
            Debit (
            {
              debitTransactions.length
            }
            )
          </button>

        </div>

      </section>

      {/* TRANSACTION LIST */}

      <section className="wallet-history-list-card">

        <div className="wallet-history-list-heading">

          <div>

            <h2>
              Transactions
            </h2>

            <p>
              {loading
                ? "Loading..."
                : `${filteredTransactions.length} records found`}
            </p>

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div className="wallet-history-empty">

            <div>
              <History
                size={30}
              />
            </div>

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

          <div className="wallet-history-empty">

            <div>
              <History
                size={30}
              />
            </div>

            <strong>
              Loading...
            </strong>

            <span>
              Loading wallet
              transactions.
            </span>

          </div>

        )}

        {/* EMPTY */}

        {!error &&
          !loading &&
          filteredTransactions.length ===
            0 && (

          <div className="wallet-history-empty">

            <div>
              <History
                size={30}
              />
            </div>

            <strong>
              No Transactions
            </strong>

            <span>
              No matching transaction
              was found.
            </span>

          </div>

        )}

        {/* LIST */}

        {!error &&
          !loading &&
          filteredTransactions.length >
            0 && (

          <div className="wallet-history-list">

            {filteredTransactions.map(
              (transaction) => (

                <article
                  className="wallet-history-item"
                  key={
                    transaction.id
                  }
                >

                  {/* ICON */}

                  <div
                    className={`wallet-history-item-icon ${transaction.type}`}
                  >

                    {transaction.type ===
                    "credit" ? (

                      <ArrowDownLeft
                        size={19}
                      />

                    ) : (

                      <ArrowUpRight
                        size={19}
                      />

                    )}

                  </div>

                  {/* INFORMATION */}

                  <div className="wallet-history-item-info">

                    <strong>
                      {
                        transaction.title
                      }
                    </strong>

                    {transaction.description && (

                      <span>
                        {
                          transaction.description
                        }
                      </span>

                    )}

                    <small>
                      {formatDate(
                        transaction.createdAt
                      )}
                    </small>

                  </div>

                  {/* AMOUNT */}

                  <div className="wallet-history-item-right">

                    <b
                      className={
                        transaction.type
                      }
                    >

                      {transaction.type ===
                      "credit"
                        ? "+"
                        : "-"}

                      ₹
                      {Number(
                        transaction.amount
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </b>

                    <span>
                      {
                        transaction.status ||
                        "Completed"
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

export default WalletHistory;