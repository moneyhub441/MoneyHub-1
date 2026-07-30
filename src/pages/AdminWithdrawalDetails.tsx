import {
  ArrowLeft,
  BanknoteArrowDown,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Hash,
  IndianRupee,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "../css/AdminWithdrawalDetails.css";

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

type WithdrawalResponse = {
  success: boolean;
  message?: string;
  withdrawal?: WithdrawRequest;
};

type ActionResponse = {
  success: boolean;
  message?: string;

  withdrawal?: {
    id: string;
    amount: number;
    upiId: string;

    status:
      | "Pending"
      | "Approved"
      | "Rejected";

    processedAt?: string | null;
  };

  wallet?: {
    balance: number;
    totalWithdrawn?: number;
  };
};

/* =========================
   COMPONENT
========================= */

function AdminWithdrawalDetails() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

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
    request,
    setRequest,
  ] =
    useState<WithdrawRequest | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  /* =========================
     LOAD REQUEST
  ========================= */

  const loadRequest =
    useCallback(async () => {
      if (!id) {
        setRequest(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/withdrawals/admin/${id}`
          );

        const data:
          WithdrawalResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.withdrawal
        ) {
          throw new Error(
            data.message ||
              "Unable to load withdrawal request."
          );
        }

        setRequest(
          data.withdrawal
        );
      } catch (error) {
        console.error(
          "Load withdrawal error:",
          error
        );

        setRequest(null);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load withdrawal request."
        );
      } finally {
        setLoading(false);
      }
    }, [
      API_URL,
      id,
    ]);

  /* =========================
     PAGE LOAD
  ========================= */

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  /* =========================
     APPROVE / REJECT
  ========================= */

  const updateRequestStatus =
    async (
      newStatus:
        | "Approved"
        | "Rejected"
    ) => {
      if (
        !request ||
        actionLoading
      ) {
        return;
      }

      if (
        request.status !==
        "Pending"
      ) {
        setError(
          `This withdrawal is already ${request.status}.`
        );

        return;
      }

      const action =
        newStatus ===
        "Approved"
          ? "approve"
          : "reject";

      /*
        Confirmation so admin
        accidental click se
        process na kare.
      */

      const confirmed =
        window.confirm(
          newStatus ===
            "Approved"
            ? `Approve withdrawal of ₹${Number(
                request.amount
              ).toLocaleString(
                "en-IN"
              )}?`
            : `Reject withdrawal of ₹${Number(
                request.amount
              ).toLocaleString(
                "en-IN"
              )}?`
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
            `${API_URL}/api/withdrawals/admin/${request.id}/${action}`,
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data:
          ActionResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success ||
          !data.withdrawal
        ) {
          throw new Error(
            data.message ||
              `Unable to ${action} withdrawal.`
          );
        }

        /*
          Backend response ke
          according UI update.
        */

        setRequest(
          (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,

              status:
                data.withdrawal!
                  .status,

              processedAt:
                data.withdrawal!
                  .processedAt ||
                new Date().toISOString(),
            };
          }
        );

        setSuccess(
          data.message ||
            `Withdrawal ${newStatus.toLowerCase()} successfully.`
        );
      } catch (error) {
        console.error(
          "Withdrawal action error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to process withdrawal."
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
      <main className="admin-withdraw-detail-page">

        <header className="admin-withdraw-detail-header">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/withdrawals"
              )
            }
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>
            <h1>
              Request Details
            </h1>

            <p>
              Loading withdrawal...
            </p>
          </div>

          <span>
            <BanknoteArrowDown
              size={20}
            />
          </span>

        </header>

        <section className="admin-withdraw-not-found">

          <Clock3
            size={38}
          />

          <h2>
            Loading Request...
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

  if (!request) {
    return (
      <main className="admin-withdraw-detail-page">

        <header className="admin-withdraw-detail-header">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/withdrawals"
              )
            }
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>
            <h1>
              Request Details
            </h1>

            <p>
              Withdrawal information
            </p>
          </div>

          <span>
            <BanknoteArrowDown
              size={20}
            />
          </span>

        </header>

        <section className="admin-withdraw-not-found">

          <BanknoteArrowDown
            size={38}
          />

          <h2>
            Request Not Found
          </h2>

          <p>
            {error ||
              "This withdrawal request could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/withdrawals"
              )
            }
          >
            Back to Withdrawals
          </button>

        </section>

      </main>
    );
  }

  /* =========================
     DATE
  ========================= */

  const createdDate =
    new Date(
      request.createdAt
    );

  const formattedDate =
    createdDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  const formattedTime =
    createdDate.toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  /* =========================
     PROCESSED DATE
  ========================= */

  const processedDate =
    request.processedAt
      ? new Date(
          request.processedAt
        )
      : null;

  /* =========================
     STATUS ICON
  ========================= */

  const StatusIcon =
    request.status ===
    "Approved"
      ? CheckCircle2
      : request.status ===
          "Rejected"
        ? XCircle
        : Clock3;

  /* =========================
     UI
  ========================= */

  return (
    <main className="admin-withdraw-detail-page">

      {/* HEADER */}

      <header className="admin-withdraw-detail-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/withdrawals"
            )
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>

          <h1>
            Request Details
          </h1>

          <p>
            Withdrawal information
          </p>

        </div>

        <span>
          <BanknoteArrowDown
            size={20}
          />
        </span>

      </header>

      {/* SUCCESS */}

      {success && (
        <div
          style={{
            margin:
              "12px 16px",

            padding:
              "11px 12px",

            borderRadius:
              "10px",

            background:
              "#ecfdf5",

            color:
              "#047857",

            fontSize:
              "11px",

            fontWeight:
              "700",

            textAlign:
              "center",
          }}
        >
          {success}
        </div>
      )}

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

      {/* HERO */}

      <section className="admin-withdraw-detail-hero">

        <div className="admin-withdraw-detail-icon">
          <IndianRupee
            size={31}
          />
        </div>

        <span>
          WITHDRAWAL AMOUNT
        </span>

        <h2>
          ₹
          {Number(
            request.amount
          ).toLocaleString(
            "en-IN"
          )}
        </h2>

        <div
          className={`admin-withdraw-detail-status ${request.status.toLowerCase()}`}
        >
          <StatusIcon
            size={13}
          />

          {request.status}
        </div>

      </section>

      {/* INFORMATION */}

      <section className="admin-withdraw-detail-card">

        <div className="admin-withdraw-detail-title">

          <h2>
            Request Information
          </h2>

          <p>
            Details submitted with
            this withdrawal
          </p>

        </div>

        {/* CUSTOMER */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <Smartphone
              size={18}
            />
          </div>

          <div>

            <span>
              Customer Name
            </span>

            <strong>
              {request.user
                ?.name ||
                "Unknown Customer"}
            </strong>

          </div>

        </div>

        {/* MOBILE */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <Smartphone
              size={18}
            />
          </div>

          <div>

            <span>
              Mobile Number
            </span>

            <strong>
              {request.user
                ?.mobile ||
                "Not Available"}
            </strong>

          </div>

        </div>

        {/* USER ID */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <Hash
              size={18}
            />
          </div>

          <div>

            <span>
              User ID
            </span>

            <strong>
              #
              {
                request.userId
              }
            </strong>

          </div>

        </div>

        {/* REQUEST ID */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <Hash
              size={18}
            />
          </div>

          <div>

            <span>
              Request ID
            </span>

            <strong>
              #
              {
                request.id
              }
            </strong>

          </div>

        </div>

        {/* AMOUNT */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <IndianRupee
              size={18}
            />
          </div>

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

          </div>

        </div>

        {/* UPI */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <Smartphone
              size={18}
            />
          </div>

          <div>

            <span>
              UPI ID
            </span>

            <strong>
              {request.upiId ||
                "Not Available"}
            </strong>

          </div>

        </div>

        {/* DATE */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <CalendarDays
              size={18}
            />
          </div>

          <div>

            <span>
              Requested On
            </span>

            <strong>
              {
                formattedDate
              }
            </strong>

            <small>
              {
                formattedTime
              }
            </small>

          </div>

        </div>

        {/* STATUS */}

        <div className="admin-withdraw-detail-row">

          <div className="admin-withdraw-detail-row-icon">
            <ShieldCheck
              size={18}
            />
          </div>

          <div>

            <span>
              Current Status
            </span>

            <strong
              className={`admin-withdraw-status-text ${request.status.toLowerCase()}`}
            >
              {
                request.status
              }
            </strong>

            {processedDate && (
              <small>
                Processed:{" "}
                {processedDate.toLocaleString(
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
            )}

          </div>

        </div>

      </section>

      {/* ADMIN ACTIONS */}

      {request.status ===
        "Pending" && (

        <section className="admin-withdraw-actions">

          <div>

            <h2>
              Admin Action
            </h2>

            <p>
              Review this withdrawal
              request.
            </p>

          </div>

          <div className="admin-withdraw-action-buttons">

            <button
              type="button"
              className="reject"
              disabled={
                actionLoading
              }
              onClick={() =>
                updateRequestStatus(
                  "Rejected"
                )
              }
            >
              {actionLoading
                ? "Processing..."
                : "Reject Request"}
            </button>

            <button
              type="button"
              className="approve"
              disabled={
                actionLoading
              }
              onClick={() =>
                updateRequestStatus(
                  "Approved"
                )
              }
            >
              {actionLoading
                ? "Processing..."
                : "Approve Request"}
            </button>

          </div>

        </section>

      )}

      {/* NOTICE */}

      <section className="admin-withdraw-detail-notice">

        <ShieldCheck
          size={20}
        />

        <div>

          <strong>
            Withdrawal Processing
          </strong>

          <span>
            Approving this request
            deducts the withdrawal
            amount from the user's
            wallet and creates a
            wallet transaction.
            Rejecting it does not
            deduct wallet balance.
          </span>

        </div>

      </section>

    </main>
  );
}

export default AdminWithdrawalDetails;