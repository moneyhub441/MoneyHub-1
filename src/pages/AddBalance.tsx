import {
  ArrowLeft,
  IndianRupee,
  Plus,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { load } from "@cashfreepayments/cashfree-js";

import "../css/AddBalance.css";

const quickAmounts = [
  100,
  500,
  1000,
  2000,
];

/* =========================
   CURRENT USER TYPE
========================= */

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
  email?: string;
};

/* =========================
   CREATE ORDER RESPONSE
========================= */

type CreateOrderResponse = {
  success: boolean;
  message?: string;
  orderId?: string;
  paymentSessionId?: string;
};

/* =========================
   COMPONENT
========================= */

function AddBalance() {
  const navigate =
    useNavigate();

  const [amount, setAmount] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     API URL
  ========================= */

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  /* =========================
     GET CURRENT USER
  ========================= */

  const getCurrentUser =
    (): CurrentUser | null => {
      try {
        const saved =
          localStorage.getItem(
            "currentUser"
          );

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
      }
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
     PAYMENT
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

    /* =========================
       USER
    ========================= */

    const currentUser =
      getCurrentUser();

    if (
      !currentUser?.id ||
      !currentUser?.mobile
    ) {
      setError(
        "Please login again before adding balance."
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
        "Please enter a valid amount."
      );

      return;
    }

    if (
      numericAmount < 100
    ) {
      setError(
        "Minimum amount is ₹100."
      );

      return;
    }

    try {
      setLoading(true);

      /* =========================
         CREATE CASHFREE ORDER
      ========================= */

      const response =
        await fetch(
          `${API_URL}/api/payment/create-order`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount:
                numericAmount,

              customerPhone:
                currentUser.mobile,

              customerId:
                currentUser.id,
            }),
          }
        );

      const data:
        CreateOrderResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to create payment order."
        );
      }

      if (
        !data.paymentSessionId ||
        !data.orderId
      ) {
        throw new Error(
          "Payment session was not received."
        );
      }

      /* =========================
         SAVE ORDER TEMPORARILY
      ========================= */

      sessionStorage.setItem(
        "moneyHubPaymentOrder",
        JSON.stringify({
          orderId:
            data.orderId,

          userId:
            currentUser.id,

          amount:
            numericAmount,
        })
      );

      /* =========================
         LOAD CASHFREE
      ========================= */

      const cashfree =
        await load({
          mode: "production",
        });

      /* =========================
         OPEN CHECKOUT
      ========================= */

      await cashfree.checkout({
        paymentSessionId:
          data.paymentSessionId,

        redirectTarget:
          "_self",
      });

    } catch (error) {
      console.error(
        "Add balance error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );

      setLoading(false);
    }
  };

  return (
    <main className="add-balance-page">

      {/* HEADER */}

      <header className="add-balance-header">

        <button
          type="button"
          onClick={() =>
            navigate("/wallet")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>
            Add Balance
          </h1>

          <p>
            Wallet balance request
          </p>
        </div>

        <span>
          <WalletCards size={20} />
        </span>

      </header>

      {/* HERO */}

      <section className="add-balance-hero">

        <div className="add-balance-hero-icon">
          <Plus size={30} />
        </div>

        <h2>
          Add Wallet Balance
        </h2>

        <p>
          Enter the amount you want
          to add to your wallet.
        </p>

      </section>

      {/* FORM */}

      <form
        className="add-balance-card"
        onSubmit={handleSubmit}
      >

        <div className="add-balance-title">

          <h2>
            Enter Amount
          </h2>

          <p>
            Minimum amount ₹100
          </p>

        </div>

        <div className="add-balance-input">

          <IndianRupee
            size={25}
          />

          <input
            type="text"
            inputMode="numeric"
            value={amount}
            disabled={loading}
            onChange={
              handleAmountChange
            }
            placeholder="0"
          />

        </div>

        {/* QUICK AMOUNTS */}

        <div className="quick-amounts">

          {quickAmounts.map(
            (value) => (

              <button
                key={value}
                type="button"
                disabled={loading}
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
          <div className="add-balance-error">
            {error}
          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          className="add-balance-submit"
          disabled={loading}
        >

          <WalletCards
            size={18}
          />

          {loading
            ? "Opening Payment..."
            : amount
              ? `Continue with ₹${Number(
                  amount
                ).toLocaleString(
                  "en-IN"
                )}`
              : "Continue"}

        </button>

      </form>

      {/* SECURITY */}

      <section className="add-balance-security">

        <ShieldCheck
          size={21}
        />

        <div>

          <strong>
            Secure Payment
          </strong>

          <span>
            Wallet balance is credited
            only after successful payment
            verification by the server.
          </span>

        </div>

      </section>

    </main>
  );
}

export default AddBalance;