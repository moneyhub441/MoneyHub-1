import {
  CheckCircle2,
  LoaderCircle,
  XCircle,
  WalletCards,
} from "lucide-react";
import API_URL from "../config/api";
import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

type PaymentState =
  | "checking"
  | "success"
  | "failed";

type VerifyResponse = {
  success: boolean;
  status?: string;
  message?: string;
  amount?: number;
  balance?: number;
  alreadyCredited?: boolean;
};

function PaymentStatus() {
  const navigate =
    useNavigate();

  const [
    paymentState,
    setPaymentState,
  ] = useState<PaymentState>(
    "checking"
  );

  const [message, setMessage] =
    useState(
      "Verifying your payment..."
    );

  const [amount, setAmount] =
    useState(0);

 

  useEffect(() => {
    const verifyPayment =
      async () => {
        try {
          /* =====================
             GET ORDER ID
          ===================== */

          const params =
            new URLSearchParams(
              window.location.search
            );

          const orderId =
            params.get(
              "order_id"
            );

          /* =====================
             GET CURRENT USER
          ===================== */

          const savedUser =
            localStorage.getItem(
              "currentUser"
            );

          const currentUser =
            savedUser
              ? JSON.parse(
                  savedUser
                )
              : null;

          const userId =
            String(
              currentUser?.id ||
                ""
            );

          /* =====================
             CHECK DATA
          ===================== */

          if (
            !orderId ||
            !userId
          ) {
            setPaymentState(
              "failed"
            );

            setMessage(
              "Payment information is missing."
            );

            return;
          }

          /* =====================
             VERIFY FROM BACKEND
          ===================== */

          const response =
            await fetch(
              `${API_URL}/api/payment/verify/${encodeURIComponent(
                orderId
              )}?userId=${encodeURIComponent(
                userId
              )}`
            );

          const data:
            VerifyResponse =
            await response.json();

          /* =====================
             FAILED
          ===================== */

          if (
            !response.ok ||
            !data.success ||
            data.status !==
              "PAID"
          ) {
            setPaymentState(
              "failed"
            );

            setMessage(
              data.message ||
                "Payment was not completed."
            );

            return;
          }

          /* =====================
             SUCCESS
          ===================== */

          setAmount(
            Number(
              data.amount || 0
            )
          );

          setPaymentState(
            "success"
          );

          setMessage(
            data.alreadyCredited
              ? "Payment was already credited to your wallet."
              : "Payment successful. Balance added to your wallet."
          );

          /* =====================
             UPDATE CURRENT USER
          ===================== */

          if (
            typeof data.balance ===
            "number"
          ) {
            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                ...currentUser,

                walletBalance:
                  data.balance,
              })
            );
          }

          /* =====================
             CLEAR TEMP ORDER
          ===================== */

          sessionStorage.removeItem(
            "moneyHubPaymentOrder"
          );
        } catch (error) {
          console.error(
            "Payment verify error:",
            error
          );

          setPaymentState(
            "failed"
          );

          setMessage(
            "Unable to verify payment."
          );
        }
      };

    verifyPayment();
  }, [API_URL]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        padding: "20px",
        background:
          "#f7f7f7",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "20px",
          padding:
            "35px 20px",
          textAlign:
            "center",
        }}
      >

        {/* ICON */}

        {paymentState ===
          "checking" && (
          <LoaderCircle
            size={48}
          />
        )}

        {paymentState ===
          "success" && (
          <CheckCircle2
            size={48}
          />
        )}

        {paymentState ===
          "failed" && (
          <XCircle
            size={48}
          />
        )}

        {/* TITLE */}

        <h1>
          {paymentState ===
          "checking"
            ? "Checking Payment"
            : paymentState ===
                "success"
              ? "Payment Successful"
              : "Payment Failed"}
        </h1>

        {/* MESSAGE */}

        <p>
          {message}
        </p>

        {/* AMOUNT */}

        {paymentState ===
          "success" &&
          amount > 0 && (
            <h2>
              ₹
              {amount.toLocaleString(
                "en-IN"
              )}
            </h2>
          )}

        {/* BUTTON */}

        {paymentState !==
          "checking" && (
          <button
            type="button"
            onClick={() =>
              navigate(
                paymentState ===
                  "success"
                  ? "/wallet"
                  : "/add-balance",
                {
                  replace:
                    true,
                }
              )
            }
          >
            <WalletCards
              size={18}
            />

            {paymentState ===
            "success"
              ? "Go to Wallet"
              : "Try Again"}
          </button>
        )}

      </section>
    </main>
  );
}

export default PaymentStatus;