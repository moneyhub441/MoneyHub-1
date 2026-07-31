import {
  ArrowLeft,
  BanknoteArrowDown,
  CheckCircle2,
  IndianRupee,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import "../css/Withdraw.css";

/* =========================
   TYPES
========================= */

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
};

type WalletResponse = {
  success: boolean;

  message?: string;

  wallet?: {
    id: string;
    userId: string;
    balance: number;
    totalAdded: number;
    totalWithdrawn: number;
    totalIncome: number;
  };
};

type WithdrawResponse = {
  success: boolean;

  message?: string;

  withdrawal?: {
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

  wallet?: {
    balance: number;
    pendingWithdrawal: number;
    availableBalance: number;
  };
};

const quickAmounts = [
  100,
  500,
  1000,
  2000,
];

/* =========================
   COMPONENT
========================= */

function Withdraw() {
  const navigate =
    useNavigate();

  /* =========================
     API URL
  ========================= */



  /* =========================
     STATES
  ========================= */

  const [amount, setAmount] =
    useState("");

  const [upiId, setUpiId] =
    useState("");

  const [
    walletBalance,
    setWalletBalance,
  ] = useState(0);

  const [
    availableBalance,
    setAvailableBalance,
  ] = useState(0);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    walletLoading,
    setWalletLoading,
  ] = useState(true);

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
        ? JSON.parse(savedUser)
        : null;
  } catch {
    currentUser = null;
  }

  /*
    IMPORTANT:
    MongoDB ID string hoti hai.

    Number(currentUser.id)
    bilkul use nahi karna.
  */

  const currentUserId =
    currentUser?.id || "";

  /* =========================
     LOAD WALLET
  ========================= */

  useEffect(() => {
    const loadWallet =
      async () => {
        if (!currentUserId) {
          setWalletBalance(0);
          setAvailableBalance(0);

          setError(
            "Please login again before requesting withdrawal."
          );

          setWalletLoading(false);

          return;
        }

        try {
          setWalletLoading(true);
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

          const balance =
            Number(
              walletData.wallet.balance ||
                0
            );

          setWalletBalance(
            balance
          );

          /* =====================
             WITHDRAWAL HISTORY

             Pending amount bhi
             calculate karenge.
          ===================== */

          const historyResponse =
            await fetch(
              `${API_URL}/api/withdrawals/user/${currentUserId}`
            );

          const historyData =
            await historyResponse.json();

          if (
            !historyResponse.ok ||
            !historyData.success
          ) {
            throw new Error(
              historyData.message ||
                "Unable to load withdrawal information."
            );
          }

          const withdrawals =
            Array.isArray(
              historyData.withdrawals
            )
              ? historyData.withdrawals
              : [];

          const pendingAmount =
            withdrawals
              .filter(
                (
                  withdrawal: {
                    status?: string;
                  }
                ) =>
                  withdrawal.status ===
                  "Pending"
              )
              .reduce(
                (
                  total: number,
                  withdrawal: {
                    amount?: number;
                  }
                ) =>
                  total +
                  Number(
                    withdrawal.amount ||
                      0
                  ),
                0
              );

          setAvailableBalance(
            Math.max(
              balance -
                pendingAmount,
              0
            )
          );
        } catch (error) {
          console.error(
            "Load wallet error:",
            error
          );

          setWalletBalance(0);
          setAvailableBalance(0);

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load wallet."
          );
        } finally {
          setWalletLoading(false);
        }
      };

    loadWallet();
  }, [
    API_URL,
    currentUserId,
  ]);

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

    if (value.length <= 6) {
      setAmount(value);
      setError("");
    }
  };

  /* =========================
     QUICK AMOUNT
  ========================= */

  const selectAmount = (
    value: number
  ) => {
    setAmount(
      String(value)
    );

    setError("");
  };

  /* =========================
     WITHDRAW
  ========================= */

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess(false);

    /* =========================
       LOGIN CHECK
    ========================= */

    if (!currentUserId) {
      setError(
        "Please login again before requesting withdrawal."
      );

      return;
    }

    /* =========================
       AMOUNT
    ========================= */

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
        "Please enter a valid withdrawal amount."
      );

      return;
    }

    if (
      numericAmount < 100
    ) {
      setError(
        "Minimum withdrawal amount is ₹100."
      );

      return;
    }

    /* =========================
       AVAILABLE BALANCE
    ========================= */

    if (
      numericAmount >
      availableBalance
    ) {
      setError(
        `Available withdrawal balance is ₹${availableBalance.toLocaleString(
          "en-IN"
        )}.`
      );

      return;
    }

    /* =========================
       UPI
    ========================= */

    const cleanUpiId =
      upiId.trim();

    if (!cleanUpiId) {
      setError(
        "Please enter your UPI ID."
      );

      return;
    }

    const upiPattern =
      /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z0-9.-]{2,64}$/;

    if (
      !upiPattern.test(
        cleanUpiId
      )
    ) {
      setError(
        "Please enter a valid UPI ID."
      );

      return;
    }

    /* =========================
       BACKEND REQUEST
    ========================= */

    try {
      setLoading(true);

      const response =
        await fetch(
          `${API_URL}/api/withdrawals`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId:
                currentUserId,

              amount:
                numericAmount,

              upiId:
                cleanUpiId,
            }),
          }
        );

      const data:
        WithdrawResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to submit withdrawal request."
        );
      }

      /* =========================
         UPDATE AVAILABLE BALANCE
      ========================= */

      if (data.wallet) {
        setWalletBalance(
          Number(
            data.wallet.balance ||
              0
          )
        );

        setAvailableBalance(
          Number(
            data.wallet
              .availableBalance ||
              0
          )
        );
      }

      /* =========================
         SUCCESS
      ========================= */

      setSuccess(true);

      setAmount("");
      setUpiId("");

      window.setTimeout(
        () => {
          navigate(
            "/withdraw-history"
          );
        },
        1500
      );
    } catch (error) {
      console.error(
        "Withdrawal request error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit withdrawal request."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <main className="withdraw-page">

      {/* HEADER */}

      <header className="withdraw-header">

        <button
          type="button"
          onClick={() =>
            navigate("/wallet")
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>
          <h1>
            Withdraw
          </h1>

          <p>
            Request wallet withdrawal
          </p>
        </div>

        <span>
          <BanknoteArrowDown
            size={20}
          />
        </span>

      </header>

      {/* BALANCE */}

      <section className="withdraw-balance-card">

        <div>

          <span>
            Available Balance
          </span>

          <h2>
            ₹
            {walletLoading
              ? "..."
              : availableBalance.toLocaleString(
                  "en-IN"
                )}
          </h2>

          {walletBalance !==
            availableBalance && (
            <small>
              Wallet Balance: ₹
              {walletBalance.toLocaleString(
                "en-IN"
              )}
            </small>
          )}

        </div>

        <div className="withdraw-wallet-icon">
          <WalletCards
            size={27}
          />
        </div>

      </section>

      {/* FORM */}

      <form
        className="withdraw-card"
        onSubmit={handleSubmit}
      >

        <div className="withdraw-title">

          <h2>
            Withdraw Amount
          </h2>

          <p>
            Minimum withdrawal ₹100
          </p>

        </div>

        {/* AMOUNT */}

        <div className="withdraw-input">

          <IndianRupee
            size={25}
          />

          <input
            type="text"
            inputMode="numeric"
            value={amount}
            disabled={
              loading ||
              walletLoading
            }
            onChange={
              handleAmountChange
            }
            placeholder="0"
          />

        </div>

        {/* UPI */}

        <div className="withdraw-upi-field">

          <label
            htmlFor="withdraw-upi"
          >
            UPI ID
          </label>

          <input
            id="withdraw-upi"
            type="text"
            value={upiId}
            disabled={loading}
            onChange={(
              event
            ) => {
              setUpiId(
                event.target.value
              );

              setError("");
            }}
            placeholder="example@upi"
            autoComplete="off"
          />

          <span>
            Withdrawal will be sent
            to this UPI ID.
          </span>

        </div>

        {/* QUICK AMOUNTS */}

        <div className="withdraw-quick-amounts">

          {quickAmounts.map(
            (value) => (

              <button
                key={value}
                type="button"
                disabled={
                  loading ||
                  walletLoading
                }
                className={
                  amount ===
                  String(value)
                    ? "active"
                    : ""
                }
                onClick={() =>
                  selectAmount(
                    value
                  )
                }
              >
                ₹
                {value.toLocaleString(
                  "en-IN"
                )}
              </button>

            )
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="withdraw-error">
            {error}
          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          className="withdraw-submit"
          disabled={
            loading ||
            walletLoading
          }
        >

          <BanknoteArrowDown
            size={18}
          />

          {loading
            ? "Submitting..."
            : amount
              ? `Withdraw ₹${Number(
                  amount
                ).toLocaleString(
                  "en-IN"
                )}`
              : "Request Withdrawal"}

        </button>

      </form>

      {/* SECURITY */}

      <section className="withdraw-security">

        <ShieldCheck
          size={21}
        />

        <div>

          <strong>
            Secure Withdrawal
          </strong>

          <span>
            Withdrawal requests are
            reviewed before processing.
          </span>

        </div>

      </section>

      {/* SUCCESS */}

      {success && (

        <div className="withdraw-success">

          <CheckCircle2
            size={21}
          />

          <div>

            <strong>
              Withdrawal Requested
            </strong>

            <span>
              Your request has been
              submitted successfully.
            </span>

          </div>

        </div>

      )}

    </main>
  );
}

export default Withdraw;