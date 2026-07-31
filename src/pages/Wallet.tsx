import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  History,
  Plus,
  BanknoteArrowDown,
  WalletCards,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import "../css/Wallet.css";

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

type WalletData = {
  id: string;
  userId: string;
  balance: number;
  totalAdded: number;
  totalWithdrawn: number;
  totalIncome: number;
};

type WalletResponse = {
  success: boolean;
  message?: string;
  wallet?: WalletData;
  transactions?: Transaction[];
};

type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  upiId: string;

  status:
    | "Pending"
    | "Approved"
    | "Rejected";

  createdAt: string;
};

type WithdrawalResponse = {
  success: boolean;
  message?: string;
  withdrawals?: Withdrawal[];
};

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
};

/* =========================
   COMPONENT
========================= */

function Wallet() {
  const navigate =
    useNavigate();

 

  /* =========================
     CURRENT USER
  ========================= */

  let currentUser:
    CurrentUser | null = null;

  try {
    const savedUser =
      localStorage.getItem(
        "currentUser"
      );

    currentUser =
      savedUser
        ? JSON.parse(savedUser)
        : null;
  } catch {
    currentUser = null;
  }

  const currentUserId =
    currentUser?.id || "";

  /* =========================
     STATES
  ========================= */

  const [wallet, setWallet] =
    useState<WalletData | null>(
      null
    );

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>(
    []
  );

  const [
    withdrawals,
    setWithdrawals,
  ] = useState<Withdrawal[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================
     LOAD WALLET
  ========================= */

  const loadWallet =
    useCallback(
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

          /* =====================
             WALLET
          ===================== */

          const walletResponse =
            await fetch(
              `${API_URL}/api/wallet/${currentUserId}`
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

          /* =====================
             WITHDRAWALS
          ===================== */

          const withdrawalResponse =
            await fetch(
              `${API_URL}/api/withdrawals/user/${currentUserId}`
            );

          const withdrawalData:
            WithdrawalResponse =
            await withdrawalResponse.json();

          if (
            withdrawalResponse.ok &&
            withdrawalData.success
          ) {
            setWithdrawals(
              Array.isArray(
                withdrawalData.withdrawals
              )
                ? withdrawalData.withdrawals
                : []
            );
          } else {
            setWithdrawals([]);
          }
        } catch (error) {
          console.error(
            "Wallet load error:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load wallet."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        API_URL,
        currentUserId,
      ]
    );

  /* =========================
     PAGE OPEN
  ========================= */

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  /* =========================
     PENDING WITHDRAWALS
  ========================= */

  const pendingWithdrawals =
    withdrawals.filter(
      (withdrawal) =>
        withdrawal.status ===
        "Pending"
    );

  const pendingAmount =
    pendingWithdrawals.reduce(
      (total, withdrawal) =>
        total +
        Number(
          withdrawal.amount || 0
        ),
      0
    );

  /*
    Wallet balance MongoDB me
    actual balance hai.

    Pending withdrawal ko
    available amount se minus
    karke show kar rahe hain.
  */

  const walletBalance =
    Number(
      wallet?.balance || 0
    );

  const availableBalance =
    Math.max(
      walletBalance -
        pendingAmount,
      0
    );

  /* =========================
     RECENT TRANSACTIONS
  ========================= */

  const recentTransactions =
  [...transactions]
    .sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )
    .slice(0, 3);

  /* =========================
     DATE
  ========================= */

  const formatDate = (
    value: string
  ) => {
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
     UI
  ========================= */

  return (
    <main className="wallet-page">

      {/* HEADER */}

      <header className="wallet-header">

        <button
          type="button"
          onClick={() =>
            navigate("/home")
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>
          <h1>
            My Wallet
          </h1>

          <p>
            Balance & transaction
            history
          </p>
        </div>

        <span>
          <WalletCards
            size={20}
          />
        </span>

      </header>

      {/* ERROR */}

      {error && (
        <section
          className="wallet-info"
        >
          <WalletCards
            size={20}
          />

          <div>
            <strong>
              Unable to Load Wallet
            </strong>

            <span>
              {error}
            </span>
          </div>
        </section>
      )}

      {/* BALANCE */}

      <section className="wallet-balance-card">

        <div className="wallet-circle wallet-circle-one" />

        <div className="wallet-circle wallet-circle-two" />

        <div className="wallet-balance-top">

          <div>

            <span>
              Available Balance
            </span>

            <h2>
              ₹
              {loading
                ? "..."
                : availableBalance.toLocaleString(
                    "en-IN"
                  )}
            </h2>

          </div>

          <div className="wallet-main-icon">

            <WalletCards
              size={28}
            />

          </div>

        </div>

        <div className="wallet-account-status">

          <span>
            Wallet Status
          </span>

          <strong>
            Active
          </strong>

        </div>

      </section>

      {/* ACTIONS */}

      <section className="wallet-actions">

        {/* ADD BALANCE */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/add-balance"
            )
          }
        >
          <span>
            <Plus size={21} />
          </span>

          <strong>
            Add Balance
          </strong>

          <small>
            Recharge wallet
          </small>
        </button>

        {/* WITHDRAW */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/withdraw"
            )
          }
        >
          <span>
            <BanknoteArrowDown
              size={21}
            />
          </span>

          <strong>
            Withdraw
          </strong>

          <small>
            Request payout
          </small>
        </button>

        {/* HISTORY */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/wallet-history"
            )
          }
        >
          <span>
            <History
              size={21}
            />
          </span>

          <strong>
            History
          </strong>

          <small>
            View transactions
          </small>
        </button>

      </section>

      {/* PENDING WITHDRAWALS */}

      {pendingWithdrawals.length >
        0 && (

        <section className="wallet-withdraw-card">

          <div className="wallet-withdraw-heading">

            <div>
              <h2>
                Withdrawal Requests
              </h2>

              <p>
                Waiting for processing
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/withdraw-history"
                )
              }
            >
              View History
            </button>

          </div>

          <div className="wallet-withdraw-list">

            {pendingWithdrawals.map(
              (request) => (

                <div
                  className="wallet-withdraw-item"
                  key={
                    request.id
                  }
                >

                  <div>

                    <span>
                      Withdrawal Amount
                    </span>

                    <strong>
                      ₹
                      {Number(
                        request.amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <small>
                      {formatDate(
                        request.createdAt
                      )}
                    </small>

                  </div>

                  <b>
                    {request.status}
                  </b>

                </div>

              )
            )}

          </div>

        </section>
      )}

      {/* TRANSACTIONS */}

      <section className="wallet-history-card">

        <div className="wallet-section-heading">

          <div>

            <h2>
              Recent Transactions
            </h2>

            <p>
              Your latest wallet
              activity
            </p>

          </div>

          {transactions.length >
            0 && (

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/wallet-history"
                )
              }
            >
              View All
            </button>
          )}

        </div>

        {/* LOADING */}

        {loading ? (

          <div
            style={{
              padding: "35px 10px",
              textAlign: "center",
              color: "#999",
              fontSize: "9px",
            }}
          >
            Loading wallet...
          </div>

        ) : recentTransactions.length ===
          0 ? (

          <div
            style={{
              padding: "35px 10px",
              textAlign: "center",
              color: "#999",
              fontSize: "9px",
            }}
          >
            No wallet transactions
            yet.
          </div>

        ) : (

          <div className="wallet-transaction-list">

            {recentTransactions.map(
              (transaction) => (

                <div
                  className="wallet-transaction"
                  key={
                    transaction.id
                  }
                >

                  <div
                    className={`wallet-transaction-icon ${transaction.type}`}
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

                  <div className="wallet-transaction-info">

                    <strong>
                      {
                        transaction.title
                      }
                    </strong>

                    {transaction.description && (
                      <small>
                        {
                          transaction.description
                        }
                      </small>
                    )}

                    <span>
                      {formatDate(
                        transaction.createdAt
                      )}
                    </span>

                  </div>

                  <b
                    className={
                      transaction.type ===
                      "credit"
                        ? "wallet-credit"
                        : "wallet-debit"
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

                </div>

              )
            )}

          </div>
        )}

      </section>

      {/* INFO */}

      <section className="wallet-info">

        <WalletCards
          size={20}
        />

        <div>

          <strong>
            Wallet
          </strong>

          <span>
            Wallet balance and
            transactions are securely
            stored in your account.
          </span>

        </div>

      </section>

    </main>
  );
}

export default Wallet;