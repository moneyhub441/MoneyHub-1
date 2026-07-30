import {
  ArrowDownLeft,
  ArrowLeft,
  BanknoteArrowDown,
  Bell,
  CheckCheck,
  CheckCircle2,
  Package,
  WalletCards,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import "../css/Notifications.css";

/* =========================
   TYPES
========================= */

type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  upiId?: string;

  status:
    | "Pending"
    | "Approved"
    | "Rejected";

  createdAt: string;
  processedAt?: string | null;
};

type PurchasedProduct = {
  id: string;
  purchaseId?: string;
  userId: string;

  name?: string;
  productName?: string;

  price: number;

  status:
    | "Active"
    | "Completed"
    | "Cancelled";

  purchasedAt?: string;
  createdAt?: string;
};

type WalletTransaction = {
  id: string;

  title: string;
  description?: string;

  type:
    | "credit"
    | "debit";

  amount: number;

  category?: string;
  status?: string;

  referenceId?: string;

  createdAt: string;
};

type WithdrawalResponse = {
  success: boolean;
  message?: string;
  withdrawals?: Withdrawal[];
};

type PurchaseResponse = {
  success: boolean;
  message?: string;
  purchases?: PurchasedProduct[];
};

type WalletResponse = {
  success: boolean;
  message?: string;

  transactions?: WalletTransaction[];
};

type NotificationType =
  | "withdraw"
  | "product"
  | "wallet";

type CustomerNotification = {
  id: string;

  type: NotificationType;

  title: string;
  description: string;

  amount?: number;
  status?: string;

  createdAt: string;

  target?: string;
};

/* =========================
   COMPONENT
========================= */

function Notifications() {
  const navigate =
    useNavigate();

  /* =========================
     API URL
  ========================= */

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  /* =========================
     CURRENT USER
  ========================= */

  let currentUserId = "";

  try {
    const savedUser =
      localStorage.getItem(
        "currentUser"
      );

    const currentUser =
      savedUser
        ? JSON.parse(savedUser)
        : null;

    /*
      MongoDB ObjectId string hai.
      Number() nahi lagana.
    */

    currentUserId =
      String(
        currentUser?.id || ""
      );
  } catch {
    currentUserId = "";
  }

  /* =========================
     STATES
  ========================= */

  const [
    withdrawals,
    setWithdrawals,
  ] = useState<Withdrawal[]>([]);

  const [
    products,
    setProducts,
  ] = useState<
    PurchasedProduct[]
  >([]);

  const [
    transactions,
    setTransactions,
  ] = useState<
    WalletTransaction[]
  >([]);

  const [
    readIds,
    setReadIds,
  ] = useState<string[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =========================
     READ STORAGE KEY
  ========================= */

  const readStorageKey =
    `readNotifications_${currentUserId}`;

  /* =========================
     LOAD READ IDS
  ========================= */

  const loadReadIds =
    useCallback(() => {
      if (!currentUserId) {
        setReadIds([]);
        return;
      }

      try {
        const saved =
          localStorage.getItem(
            readStorageKey
          );

        const parsed =
          saved
            ? JSON.parse(saved)
            : [];

        setReadIds(
          Array.isArray(parsed)
            ? parsed.map(String)
            : []
        );
      } catch {
        setReadIds([]);
      }
    }, [
      currentUserId,
      readStorageKey,
    ]);

  /* =========================
     LOAD WITHDRAWALS
  ========================= */

  const loadWithdrawals =
    useCallback(async () => {
      const response =
        await fetch(
          `${API_URL}/api/withdrawals/user/${currentUserId}`
        );

      const data:
        WithdrawalResponse =
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

      setWithdrawals(
        data.withdrawals || []
      );
    }, [
      API_URL,
      currentUserId,
    ]);

  /* =========================
     LOAD PRODUCTS
  ========================= */

  const loadProducts =
    useCallback(async () => {
      const response =
        await fetch(
          `${API_URL}/api/purchases/user/${currentUserId}`
        );

      const data:
        PurchaseResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load products."
        );
      }

      setProducts(
        data.purchases || []
      );
    }, [
      API_URL,
      currentUserId,
    ]);

  /* =========================
     LOAD WALLET TRANSACTIONS
  ========================= */

  const loadTransactions =
    useCallback(async () => {
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
            "Unable to load wallet activity."
        );
      }

      setTransactions(
        data.transactions || []
      );
    }, [
      API_URL,
      currentUserId,
    ]);

  /* =========================
     LOAD ALL
  ========================= */

  const loadData =
    useCallback(async () => {
      if (!currentUserId) {
        setLoading(false);

        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      try {
        setError("");

        await Promise.all([
          loadWithdrawals(),
          loadProducts(),
          loadTransactions(),
        ]);
      } catch (error) {
        console.error(
          "Notifications error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load notifications."
        );
      } finally {
        setLoading(false);
      }
    }, [
      currentUserId,
      navigate,
      loadWithdrawals,
      loadProducts,
      loadTransactions,
    ]);

  /* =========================
     PAGE OPEN
  ========================= */

  useEffect(() => {
    loadReadIds();
    loadData();
  }, [
    loadReadIds,
    loadData,
  ]);

  /* =========================
     BUILD NOTIFICATIONS
  ========================= */

  const notifications =
    useMemo<
      CustomerNotification[]
    >(() => {
      const list:
        CustomerNotification[] =
        [];

      /* =====================
         WITHDRAWALS
      ===================== */

      withdrawals.forEach(
        (request) => {
          let title =
            "Withdrawal Requested";

          let description =
            "Your withdrawal request is waiting for processing.";

          if (
            request.status ===
            "Approved"
          ) {
            title =
              "Withdrawal Approved";

            description =
              "Your withdrawal request has been approved.";
          }

          if (
            request.status ===
            "Rejected"
          ) {
            title =
              "Withdrawal Rejected";

            description =
              "Your withdrawal request was rejected.";
          }

          list.push({
            /*
              Status ID me include hai.

              Pending -> Approved hone
              par nayi notification
              unread dikhegi.
            */

            id:
              `withdraw-${request.id}-${request.status}`,

            type:
              "withdraw",

            title,

            description,

            amount:
              Number(
                request.amount || 0
              ),

            status:
              request.status,

            createdAt:
              request.processedAt ||
              request.createdAt,

            target:
              "/withdraw-history",
          });
        }
      );

      /* =====================
         PRODUCTS
      ===================== */

      products.forEach(
        (product) => {
          const purchaseId =
            String(
              product.purchaseId ||
                product.id
            );

          const productName =
            product.name ||
            product.productName ||
            "Product";

          list.push({
            id:
              `product-${purchaseId}`,

            type:
              "product",

            title:
              "Product Purchased",

            description:
              `${productName} has been added to your products.`,

            amount:
              Number(
                product.price || 0
              ),

            status:
              product.status ||
              "Active",

            createdAt:
              product.purchasedAt ||
              product.createdAt ||
              new Date(
                0
              ).toISOString(),

            target:
              `/my-products/${purchaseId}`,
          });
        }
      );

      /* =====================
         WALLET TRANSACTIONS
      ===================== */

      transactions.forEach(
        (transaction) => {
          /*
            Product Purchase already
            product notification me
            aa raha hai.

            Duplicate notification
            avoid karenge.
          */

          if (
            transaction.category ===
              "purchase" ||
            transaction.title ===
              "Product Purchase"
          ) {
            return;
          }

          /*
            Withdrawal approval ke
            transaction ko bhi skip
            kar sakte hain because
            withdrawal notification
            already available hai.
          */

          if (
            transaction.category ===
              "withdrawal" ||
            transaction.title ===
              "Withdrawal"
          ) {
            return;
          }

          list.push({
            id:
              `wallet-${transaction.id}`,

            type:
              "wallet",

            title:
              transaction.title ||
              (transaction.type ===
              "credit"
                ? "Wallet Credit"
                : "Wallet Debit"),

            description:
              transaction.description ||
              (transaction.type ===
              "credit"
                ? "Money was added to your wallet."
                : "Money was deducted from your wallet."),

            amount:
              Number(
                transaction.amount ||
                  0
              ),

            status:
              transaction.status ||
              "Completed",

            createdAt:
              transaction.createdAt,

            target:
              "/wallet-history",
          });
        }
      );

      /* =====================
         SORT NEWEST FIRST
      ===================== */

      return list.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );
    }, [
      withdrawals,
      products,
      transactions,
    ]);

  /* =========================
     UNREAD COUNT
  ========================= */

  const unreadCount =
    notifications.filter(
      (notification) =>
        !readIds.includes(
          notification.id
        )
    ).length;

  /* =========================
     MARK ONE READ
  ========================= */

  const markAsRead = (
    notificationId: string
  ) => {
    if (
      readIds.includes(
        notificationId
      )
    ) {
      return;
    }

    const newReadIds = [
      ...readIds,
      notificationId,
    ];

    setReadIds(
      newReadIds
    );

    localStorage.setItem(
      readStorageKey,
      JSON.stringify(
        newReadIds
      )
    );
  };

  /* =========================
     MARK ALL READ
  ========================= */

  const markAllRead =
    () => {
      const allIds =
        notifications.map(
          (notification) =>
            notification.id
        );

      setReadIds(
        allIds
      );

      localStorage.setItem(
        readStorageKey,
        JSON.stringify(
          allIds
        )
      );
    };

  /* =========================
     OPEN NOTIFICATION
  ========================= */

  const openNotification = (
    notification:
      CustomerNotification
  ) => {
    markAsRead(
      notification.id
    );

    if (
      notification.target
    ) {
      navigate(
        notification.target
      );
    }
  };

  /* =========================
     ICON
  ========================= */

  const getIcon = (
    notification:
      CustomerNotification
  ) => {
    if (
      notification.type ===
      "withdraw"
    ) {
      if (
        notification.status ===
        "Approved"
      ) {
        return (
          <CheckCircle2
            size={20}
          />
        );
      }

      if (
        notification.status ===
        "Rejected"
      ) {
        return (
          <XCircle
            size={20}
          />
        );
      }

      return (
        <BanknoteArrowDown
          size={20}
        />
      );
    }

    if (
      notification.type ===
      "product"
    ) {
      return (
        <Package
          size={20}
        />
      );
    }

    if (
      notification.type ===
      "wallet"
    ) {
      if (
        notification.title ===
          "Daily Income" ||
        notification.title ===
          "Balance Added"
      ) {
        return (
          <ArrowDownLeft
            size={20}
          />
        );
      }

      return (
        <WalletCards
          size={20}
        />
      );
    }

    return (
      <Bell
        size={20}
      />
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <main className="notifications-page">

      {/* HEADER */}

      <header className="notifications-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/home"
            )
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>

          <h1>
            Notifications
          </h1>

          <p>
            Your latest account
            activity
          </p>

        </div>

        <span>

          <Bell
            size={20}
          />

          {unreadCount >
            0 && (
            <b>
              {unreadCount >
              99
                ? "99+"
                : unreadCount}
            </b>
          )}

        </span>

      </header>

      {/* HERO */}

      <section className="notifications-hero">

        <div>

          <span>
            ACCOUNT ACTIVITY
          </span>

          <h2>
            {unreadCount} New
          </h2>

          <p>
            Stay updated with
            your account
            activity.
          </p>

        </div>

        <div className="notifications-hero-icon">

          <Bell
            size={31}
          />

        </div>

      </section>

      {/* TOOL */}

      <section className="notifications-tools">

        <div>

          <strong>
            Recent Notifications
          </strong>

          <span>
            {
              notifications.length
            }{" "}
            total notifications
          </span>

        </div>

        {unreadCount >
          0 && (

          <button
            type="button"
            onClick={
              markAllRead
            }
          >

            <CheckCheck
              size={15}
            />

            Mark All Read

          </button>

        )}

      </section>

      {/* ERROR */}

      {error && (
        <div
          style={{
            margin:
              "10px 16px",

            padding:
              "10px",

            borderRadius:
              "10px",

            background:
              "#fff1f2",

            color:
              "#dc2626",

            fontSize:
              "10px",

            fontWeight:
              "700",

            textAlign:
              "center",
          }}
        >
          {error}
        </div>
      )}

      {/* LIST */}

      <section className="notifications-card">

        {loading ? (

          <div className="notifications-empty">

            <Bell
              size={37}
            />

            <strong>
              Loading...
            </strong>

            <span>
              Loading your
              account activity.
            </span>

          </div>

        ) : notifications.length ===
          0 ? (

          <div className="notifications-empty">

            <Bell
              size={37}
            />

            <strong>
              No Notifications
            </strong>

            <span>
              Your account
              updates will
              appear here.
            </span>

          </div>

        ) : (

          <div className="notifications-list">

            {notifications.map(
              (
                notification
              ) => {
                const isRead =
                  readIds.includes(
                    notification.id
                  );

                return (
                  <button
                    type="button"
                    key={
                      notification.id
                    }
                    className={`notification-item ${
                      isRead
                        ? "read"
                        : "unread"
                    }`}
                    onClick={() =>
                      openNotification(
                        notification
                      )
                    }
                  >

                    {/* ICON */}

                    <div
                      className={`notification-item-icon ${notification.type} ${notification.status?.toLowerCase() || ""}`}
                    >
                      {getIcon(
                        notification
                      )}
                    </div>

                    {/* INFO */}

                    <div className="notification-item-info">

                      <div className="notification-title-row">

                        <strong>
                          {
                            notification.title
                          }
                        </strong>

                        {!isRead && (
                          <span className="notification-unread-dot" />
                        )}

                      </div>

                      <p>
                        {
                          notification.description
                        }
                      </p>

                      <small>
                        {new Date(
                          notification.createdAt
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

                    <div className="notification-item-right">

                      {notification.amount !==
                        undefined && (

                        <strong>
                          ₹
                          {Number(
                            notification.amount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      )}

                      {notification.status && (

                        <span
                          className={
                            notification.status.toLowerCase()
                          }
                        >
                          {
                            notification.status
                          }
                        </span>

                      )}

                    </div>

                  </button>
                );
              }
            )}

          </div>

        )}

      </section>

      <BottomNav />

    </main>
  );
}

export default Notifications;