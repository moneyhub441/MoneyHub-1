import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  History,
  Minus,
  Plus,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../css/AdminWalletDetails.css";

/* =========================
   TYPES
========================= */

type Wallet = {
  id: string;
  userId: string;
  balance: number;
  totalAdded: number;
  totalWithdrawn: number;
  totalIncome: number;
};

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

type Customer = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
};

type WalletResponse = {
  success: boolean;
  message?: string;
  wallet?: Wallet;
  transactions?: Transaction[];
};

type AdminWalletListResponse = {
  success: boolean;
  message?: string;

  wallets?: Array<{
    id: string;
    userId: string;

    user: Customer | null;

    balance: number;
    totalAdded: number;
    totalWithdrawn: number;
    totalIncome: number;

    transactionCount: number;
  }>;
};

type WalletActionResponse = {
  success: boolean;
  message?: string;

  wallet?: {
    balance: number;
    totalAdded: number;
    totalWithdrawn: number;
    totalIncome: number;
  };

  transaction?: Transaction;
};

type ActionType =
  | "credit"
  | "debit"
  | null;

/* =========================
   COMPONENT
========================= */

function AdminWalletDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const userId = String(id || "");

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
    customer,
    setCustomer,
  ] =
    useState<Customer | null>(
      null
    );

  const [
    wallet,
    setWallet,
  ] =
    useState<Wallet | null>(
      null
    );

  const [
    transactions,
    setTransactions,
  ] = useState<
    Transaction[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    pageError,
    setPageError,
  ] = useState("");

  /* =========================
     MODAL
  ========================= */

  const [
    actionType,
    setActionType,
  ] =
    useState<ActionType>(
      null
    );

  const [amount, setAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const [error, setError] =
    useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  /* =========================
     LOAD WALLET
  ========================= */

  const loadWallet =
    useCallback(async () => {
      if (!userId) {
        setPageError(
          "Invalid user ID."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setPageError("");

        /*
          Wallet + transactions
        */

        const walletResponse =
          await fetch(
            `${API_URL}/api/wallet/${userId}`
          );

        const walletData:
          WalletResponse =
          await walletResponse.json();

        if (
          !walletResponse.ok ||
          !walletData.success ||
          !walletData.wallet
        ) {
          throw new Error(
            walletData.message ||
              "Unable to load wallet."
          );
        }

        /*
          Admin wallet list se
          customer information.
        */

        const adminResponse =
          await fetch(
            `${API_URL}/api/wallet/admin/all`
          );

        const adminData:
          AdminWalletListResponse =
          await adminResponse.json();

        if (
          !adminResponse.ok ||
          !adminData.success
        ) {
          throw new Error(
            adminData.message ||
              "Unable to load customer information."
          );
        }

        const matchedWallet =
          (
            adminData.wallets ||
            []
          ).find(
            (item) =>
              String(
                item.userId
              ) === userId
          );

        setCustomer(
          matchedWallet?.user ||
            null
        );

        setWallet(
          walletData.wallet
        );

        setTransactions(
          Array.isArray(
            walletData.transactions
          )
            ? walletData.transactions
            : []
        );
      } catch (error) {
        console.error(
          "Admin wallet details error:",
          error
        );

        setWallet(null);
        setCustomer(null);
        setTransactions([]);

        setPageError(
          error instanceof Error
            ? error.message
            : "Unable to load wallet."
        );
      } finally {
        setLoading(false);
      }
    }, [
      API_URL,
      userId,
    ]);

  /* =========================
     PAGE LOAD
  ========================= */

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  /* =========================
     BALANCE
  ========================= */

  const balance =
    Number(
      wallet?.balance || 0
    );

  /* =========================
     STATS
  ========================= */

  const totalCredit =
    useMemo(() => {
      return transactions
        .filter(
          (transaction) =>
            transaction.type ===
            "credit"
        )
        .reduce(
          (
            total,
            transaction
          ) =>
            total +
            Number(
              transaction.amount ||
                0
            ),
          0
        );
    }, [transactions]);

  const totalDebit =
    useMemo(() => {
      return transactions
        .filter(
          (transaction) =>
            transaction.type ===
            "debit"
        )
        .reduce(
          (
            total,
            transaction
          ) =>
            total +
            Number(
              transaction.amount ||
                0
            ),
          0
        );
    }, [transactions]);

  /* =========================
     OPEN ACTION
  ========================= */

  const openAction = (
    type:
      | "credit"
      | "debit"
  ) => {
    setActionType(type);

    setAmount("");
    setNote("");
    setError("");
    setSuccess("");
  };

  /* =========================
     CLOSE ACTION
  ========================= */

  const closeAction = () => {
    if (actionLoading) {
      return;
    }

    setActionType(null);
    setAmount("");
    setNote("");
    setError("");
  };

  /* =========================
     AMOUNT CHANGE
  ========================= */

  const handleAmountChange = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value.replace(
        /\D/g,
        ""
      );

    if (
      value.length <= 8
    ) {
      setAmount(value);
      setError("");
    }
  };

  /* =========================
     UPDATE WALLET
  ========================= */

  const handleWalletUpdate =
    async () => {
      if (
        !actionType ||
        !wallet ||
        actionLoading
      ) {
        return;
      }

      const numericAmount =
        Number(amount);

      if (
        !amount ||
        !Number.isFinite(
          numericAmount
        ) ||
        numericAmount <= 0
      ) {
        setError(
          "Please enter a valid amount."
        );

        return;
      }

      if (
        actionType ===
          "debit" &&
        numericAmount >
          balance
      ) {
        setError(
          `Insufficient wallet balance. Available balance: ₹${balance.toLocaleString(
            "en-IN"
          )}`
        );

        return;
      }

      const confirmed =
        window.confirm(
          actionType ===
            "credit"
            ? `Add ₹${numericAmount.toLocaleString(
                "en-IN"
              )} to this wallet?`
            : `Deduct ₹${numericAmount.toLocaleString(
                "en-IN"
              )} from this wallet?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(true);
        setError("");
        setSuccess("");

        const response =
          await fetch(
            `${API_URL}/api/wallet/admin/${userId}/${actionType}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  amount:
                    numericAmount,

                  note:
                    note.trim(),
                }),
            }
          );

        const data:
          WalletActionResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.wallet
        ) {
          throw new Error(
            data.message ||
              "Unable to update wallet."
          );
        }

        /* =====================
           UPDATE WALLET UI
        ===================== */

        setWallet(
          (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,

              balance:
                Number(
                  data.wallet!
                    .balance ||
                    0
                ),

              totalAdded:
                Number(
                  data.wallet!
                    .totalAdded ||
                    0
                ),

              totalWithdrawn:
                Number(
                  data.wallet!
                    .totalWithdrawn ||
                    0
                ),

              totalIncome:
                Number(
                  data.wallet!
                    .totalIncome ||
                    0
                ),
            };
          }
        );

        /* =====================
           ADD TRANSACTION UI
        ===================== */

        if (
          data.transaction
        ) {
          setTransactions(
            (current) => [
              data.transaction!,
              ...current,
            ]
          );
        } else {
          /*
            Agar backend transaction
            response missing ho to
            fresh data reload.
          */

          await loadWallet();
        }

        const action =
          actionType;

        setActionType(null);
        setAmount("");
        setNote("");
        setError("");

        setSuccess(
          data.message ||
            (action ===
            "credit"
              ? `₹${numericAmount.toLocaleString(
                  "en-IN"
                )} added successfully.`
              : `₹${numericAmount.toLocaleString(
                  "en-IN"
                )} deducted successfully.`)
        );

        window.setTimeout(
          () => {
            setSuccess("");
          },
          2500
        );
      } catch (error) {
        console.error(
          "Admin wallet update error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to update wallet."
        );
      } finally {
        setActionLoading(false);
      }
    };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="admin-wallet-detail-page">

        <header className="admin-wallet-detail-header">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/wallets"
              )
            }
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>
            <h1>
              Wallet Details
            </h1>

            <p>
              Loading customer
              wallet...
            </p>
          </div>

          <span>
            <WalletCards
              size={20}
            />
          </span>

        </header>

        <section className="admin-wallet-not-found">

          <WalletCards
            size={38}
          />

          <h2>
            Loading Wallet...
          </h2>

          <p>
            Please wait.
          </p>

        </section>

      </main>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */

  if (!wallet) {
    return (
      <main className="admin-wallet-detail-page">

        <header className="admin-wallet-detail-header">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/wallets"
              )
            }
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>

            <h1>
              Wallet Details
            </h1>

            <p>
              Customer wallet
            </p>

          </div>

          <span>
            <WalletCards
              size={20}
            />
          </span>

        </header>

        <section className="admin-wallet-not-found">

          <WalletCards
            size={38}
          />

          <h2>
            Wallet Not Found
          </h2>

          <p>
            {pageError ||
              "This customer wallet could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/wallets"
              )
            }
          >
            Back to Wallets
          </button>

        </section>

      </main>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <main className="admin-wallet-detail-page">

      {/* HEADER */}

      <header className="admin-wallet-detail-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/wallets"
            )
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>

          <h1>
            Wallet Details
          </h1>

          <p>
            Manage customer
            wallet
          </p>

        </div>

        <span>
          <WalletCards
            size={20}
          />
        </span>

      </header>

      {/* PAGE ERROR */}

      {pageError && (
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
          {pageError}
        </div>
      )}

      {/* CUSTOMER */}

      <section className="admin-wallet-customer">

        <div className="admin-wallet-customer-avatar">

          <UserRound
            size={25}
          />

        </div>

        <div>

          <span>
            CUSTOMER
          </span>

          <h2>
            {customer?.name ||
              "Unknown Customer"}
          </h2>

          <p>
            {customer?.mobile ||
              "Mobile not available"}
          </p>

          {customer?.email && (
            <small>
              {customer.email}
            </small>
          )}

          <small>
            User #{userId}
          </small>

        </div>

      </section>

      {/* BALANCE */}

      <section className="admin-wallet-balance-hero">

        <div>

          <span>
            AVAILABLE BALANCE
          </span>

          <h2>
            ₹
            {balance.toLocaleString(
              "en-IN"
            )}
          </h2>

          <p>
            Current customer
            wallet balance
          </p>

        </div>

        <div className="admin-wallet-balance-icon">

          <WalletCards
            size={30}
          />

        </div>

      </section>

      {/* ACTIONS */}

      <section className="admin-wallet-actions">

        <button
          type="button"
          className="credit"
          onClick={() =>
            openAction(
              "credit"
            )
          }
        >

          <span>
            <Plus
              size={21}
            />
          </span>

          <strong>
            Add Money
          </strong>

          <small>
            Credit wallet
          </small>

        </button>

        <button
          type="button"
          className="debit"
          onClick={() =>
            openAction(
              "debit"
            )
          }
        >

          <span>
            <Minus
              size={21}
            />
          </span>

          <strong>
            Deduct Money
          </strong>

          <small>
            Debit wallet
          </small>

        </button>

      </section>

      {/* STATS */}

      <section className="admin-wallet-detail-stats">

        <article>

          <div className="credit">
            <ArrowDownLeft
              size={19}
            />
          </div>

          <span>
            Total Credit
          </span>

          <strong>
            ₹
            {totalCredit.toLocaleString(
              "en-IN"
            )}
          </strong>

        </article>

        <article>

          <div className="debit">
            <ArrowUpRight
              size={19}
            />
          </div>

          <span>
            Total Debit
          </span>

          <strong>
            ₹
            {totalDebit.toLocaleString(
              "en-IN"
            )}
          </strong>

        </article>

      </section>

      {/* TRANSACTIONS */}

      <section className="admin-wallet-transactions-card">

        <div className="admin-wallet-transactions-title">

          <div>

            <h2>
              Transaction History
            </h2>

            <p>
              {
                transactions.length
              }{" "}
              transactions
            </p>

          </div>

          <History
            size={20}
          />

        </div>

        {transactions.length ===
        0 ? (

          <div className="admin-wallet-transactions-empty">

            <History
              size={33}
            />

            <strong>
              No Transactions
            </strong>

            <span>
              Wallet transactions
              will appear here.
            </span>

          </div>

        ) : (

          <div className="admin-wallet-transactions-list">

            {transactions.map(
              (
                transaction
              ) => (

                <article
                  className="admin-wallet-transaction"
                  key={
                    transaction.id
                  }
                >

                  <div
                    className={`admin-wallet-transaction-icon ${transaction.type}`}
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

                  <div className="admin-wallet-transaction-info">

                    <strong>
                      {
                        transaction.title
                      }
                    </strong>

                    <span>
                      {transaction.description ||
                        "Wallet transaction"}
                    </span>

                    <small>
                      {new Date(
                        transaction.createdAt
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

                  <div className="admin-wallet-transaction-right">

                    <strong
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

                    </strong>

                    <span>
                      {transaction.status ||
                        "Completed"}
                    </span>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

      {/* SECURITY */}

      <section className="admin-wallet-security">

        <ShieldCheck
          size={20}
        />

        <div>

          <strong>
            Admin Wallet Control
          </strong>

          <span>
            Every manual wallet
            change creates a
            transaction record.
          </span>

        </div>

      </section>

      {/* MODAL */}

      {actionType && (

        <div className="admin-wallet-modal-overlay">

          <div className="admin-wallet-modal">

            <button
              type="button"
              className="admin-wallet-modal-close"
              disabled={
                actionLoading
              }
              onClick={
                closeAction
              }
            >
              <X
                size={20}
              />
            </button>

            <div
              className={`admin-wallet-modal-icon ${actionType}`}
            >

              {actionType ===
              "credit" ? (

                <Plus
                  size={27}
                />

              ) : (

                <Minus
                  size={27}
                />

              )}

            </div>

            <h2>
              {actionType ===
              "credit"
                ? "Add Money"
                : "Deduct Money"}
            </h2>

            <p>
              {actionType ===
              "credit"
                ? `Add balance to ${
                    customer?.name ||
                    "customer"
                  }'s wallet.`
                : `Deduct balance from ${
                    customer?.name ||
                    "customer"
                  }'s wallet.`}
            </p>

            <div className="admin-wallet-modal-balance">

              <span>
                Current Balance
              </span>

              <strong>
                ₹
                {balance.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* AMOUNT */}

            <div className="admin-wallet-modal-field">

              <label>
                Amount
              </label>

              <div className="admin-wallet-amount-input">

                <span>
                  ₹
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  disabled={
                    actionLoading
                  }
                  onChange={
                    handleAmountChange
                  }
                  placeholder="0"
                  autoFocus
                />

              </div>

            </div>

            {/* NOTE */}

            <div className="admin-wallet-modal-field">

              <label>
                Note
              </label>

              <input
                type="text"
                value={note}
                disabled={
                  actionLoading
                }
                onChange={(
                  event
                ) =>
                  setNote(
                    event.target
                      .value
                  )
                }
                placeholder={
                  actionType ===
                  "credit"
                    ? "Reason for adding balance"
                    : "Reason for deducting balance"
                }
              />

            </div>

            {/* ERROR */}

            {error && (

              <div className="admin-wallet-modal-error">
                {error}
              </div>

            )}

            {/* CONFIRM */}

            <button
              type="button"
              className={`admin-wallet-confirm ${actionType}`}
              disabled={
                actionLoading
              }
              onClick={
                handleWalletUpdate
              }
            >

              {actionType ===
              "credit" ? (
                <Plus
                  size={18}
                />
              ) : (
                <Minus
                  size={18}
                />
              )}

              {actionLoading
                ? "Processing..."
                : actionType ===
                    "credit"
                  ? "Add Balance"
                  : "Deduct Balance"}

            </button>

            <button
              type="button"
              className="admin-wallet-cancel"
              disabled={
                actionLoading
              }
              onClick={
                closeAction
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* SUCCESS */}

      {success && (

        <div className="admin-wallet-success">

          <ShieldCheck
            size={20}
          />

          <div>

            <strong>
              Wallet Updated
            </strong>

            <span>
              {success}
            </span>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminWalletDetails;