import {
  ArrowLeft,
  BanknoteArrowDown,
  Bell,
  CheckCheck,
  CircleDollarSign,
  Package,
  ShoppingBag,
  UserPlus,
  WalletCards,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/AdminNotifications.css";

/* =========================
   TYPES
========================= */

type Customer = {
  id: number;
  name: string;
  mobile: string;
  email?: string;
};

type WithdrawRequest = {
  id: number;
  userId: number;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

type BalanceRequest = {
  id: number;
  userId: number;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
};

type PurchasedProduct = {
  id: number;
  purchaseId: number;
  userId: number;
  name: string;
  price: number;
  status: string;
  purchasedAt?: string;
};

type NotificationType =
  | "withdraw"
  | "balance"
  | "order";

type AdminNotification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  amount?: number;
  userId: number;
  createdAt: string;
  status?: string;
  targetId: number;
};

/* =========================
   SAFE LOCAL STORAGE
========================= */

const getStorageArray = <T,>(
  key: string
): T[] => {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
};

/* =========================
   COMPONENT
========================= */

function AdminNotifications() {
  const navigate = useNavigate();

  const [refreshKey, setRefreshKey] =
    useState(0);

  /* =========================
     LOAD DATA
  ========================= */

  const customers =
    getStorageArray<Customer>(
      "customers"
    );

  const withdrawals =
    getStorageArray<WithdrawRequest>(
      "withdrawRequests"
    );

  const balanceRequests =
    getStorageArray<BalanceRequest>(
      "balanceRequests"
    );

  const orders =
    getStorageArray<PurchasedProduct>(
      "myProducts"
    );

  /* =========================
     READ NOTIFICATIONS
  ========================= */

  const getReadIds = (): string[] => {
    try {
      const saved =
        localStorage.getItem(
          "adminReadNotifications"
        );

      const parsed = saved
        ? JSON.parse(saved)
        : [];

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  };

  const readIds = getReadIds();

  /* =========================
     CUSTOMER
  ========================= */

  const getCustomer = (
    userId: number
  ) => {
    return customers.find(
      (customer) =>
        Number(customer.id) ===
        Number(userId)
    );
  };

  /* =========================
     CREATE NOTIFICATIONS
  ========================= */

  const notifications =
    useMemo(() => {
      const data: AdminNotification[] =
        [];

      /* WITHDRAWALS */

      withdrawals.forEach(
        (request) => {
          const customer =
            getCustomer(
              request.userId
            );

          data.push({
            id: `withdraw-${request.id}`,

            type: "withdraw",

            title:
              "Withdrawal Request",

            description:
              `${
                customer?.name ||
                "Customer"
              } requested withdrawal`,

            amount:
              Number(request.amount),

            userId:
              Number(request.userId),

            createdAt:
              request.createdAt,

            status:
              request.status,

            targetId:
              request.id,
          });
        }
      );

      /* BALANCE */

      balanceRequests.forEach(
        (request) => {
          const customer =
            getCustomer(
              request.userId
            );

          data.push({
            id: `balance-${request.id}`,

            type: "balance",

            title:
              "Balance Request",

            description:
              `${
                customer?.name ||
                "Customer"
              } requested wallet balance`,

            amount:
              Number(request.amount),

            userId:
              Number(request.userId),

            createdAt:
              request.createdAt,

            status:
              request.status,

            targetId:
              request.id,
          });
        }
      );

      /* ORDERS */

      orders.forEach((order) => {
        const customer =
          getCustomer(
            order.userId
          );

        data.push({
          id: `order-${order.purchaseId}`,

          type: "order",

          title:
            "New Product Purchase",

          description:
            `${
              customer?.name ||
              "Customer"
            } purchased ${order.name}`,

          amount:
            Number(order.price),

          userId:
            Number(order.userId),

          createdAt:
            order.purchasedAt ||
            new Date(0).toISOString(),

          status:
            order.status,

          targetId:
            order.purchaseId,
        });
      });

      return data.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );
    }, [
      refreshKey,
      customers.length,
      withdrawals.length,
      balanceRequests.length,
      orders.length,
    ]);

  /* =========================
     UNREAD
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

  const markRead = (
    notificationId: string
  ) => {
    const oldIds =
      getReadIds();

    if (
      oldIds.includes(
        notificationId
      )
    ) {
      return;
    }

    const updatedIds = [
      ...oldIds,
      notificationId,
    ];

    localStorage.setItem(
      "adminReadNotifications",
      JSON.stringify(
        updatedIds
      )
    );

    setRefreshKey(
      (value) => value + 1
    );
  };

  /* =========================
     MARK ALL READ
  ========================= */

  const markAllRead = () => {
    const allIds =
      notifications.map(
        (notification) =>
          notification.id
      );

    localStorage.setItem(
      "adminReadNotifications",
      JSON.stringify(allIds)
    );

    setRefreshKey(
      (value) => value + 1
    );
  };

  /* =========================
     OPEN NOTIFICATION
  ========================= */

  const openNotification = (
    notification:
      AdminNotification
  ) => {
    markRead(
      notification.id
    );

    if (
      notification.type ===
      "withdraw"
    ) {
      navigate(
        `/admin/withdrawals/${notification.targetId}`
      );

      return;
    }

    if (
      notification.type ===
      "balance"
    ) {
      navigate(
        `/admin/balance-requests/${notification.targetId}`
      );

      return;
    }

    navigate(
      `/admin/orders/${notification.targetId}`
    );
  };

  /* =========================
     ICON
  ========================= */

  const getIcon = (
    type: NotificationType
  ) => {
    if (type === "withdraw") {
      return (
        <BanknoteArrowDown
          size={20}
        />
      );
    }

    if (type === "balance") {
      return (
        <WalletCards size={20} />
      );
    }

    return (
      <ShoppingBag size={20} />
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <main className="admin-notification-page">

      {/* HEADER */}

      <header className="admin-notification-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>

          <h1>
            Notifications
          </h1>

          <p>
            Admin activity centre
          </p>

        </div>

        <span>
          <Bell size={20} />
        </span>

      </header>

      {/* HERO */}

      <section className="admin-notification-hero">

        <div>

          <span>
            ADMIN ALERTS
          </span>

          <h2>
            {unreadCount} Unread
          </h2>

          <p>
            Review customer requests
            and purchases.
          </p>

        </div>

        <div>
          <Bell size={31} />

          {unreadCount > 0 && (
            <span>
              {unreadCount}
            </span>
          )}
        </div>

      </section>

      {/* ACTION */}

      <section className="admin-notification-tools">

        <div>

          <strong>
            Recent Activity
          </strong>

          <span>
            {notifications.length} total
            notifications
          </span>

        </div>

        {unreadCount > 0 && (
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

      {/* LIST */}

      <section className="admin-notification-card">

        {notifications.length ===
        0 ? (

          <div className="admin-notification-empty">

            <Bell size={37} />

            <strong>
              No Notifications
            </strong>

            <span>
              New admin activity
              will appear here.
            </span>

          </div>

        ) : (

          <div className="admin-notification-list">

            {notifications.map(
              (notification) => {

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
                    className={`admin-notification-item ${
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

                    <div
                      className={`admin-notification-icon ${notification.type}`}
                    >
                      {getIcon(
                        notification.type
                      )}
                    </div>

                    <div className="admin-notification-info">

                      <div>

                        <strong>
                          {
                            notification.title
                          }
                        </strong>

                        {!isRead && (
                          <span className="admin-unread-dot" />
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
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </small>

                    </div>

                    <div className="admin-notification-right">

                      {notification.amount !==
                        undefined && (
                        <strong>
                          ₹
                          {notification.amount.toLocaleString(
                            "en-GB"
                          )}
                        </strong>
                      )}

                      {notification.status && (
                        <span
                          className={notification.status.toLowerCase()}
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

      {/* QUICK LINKS */}

      <section className="admin-notification-quick">

        <h2>
          Quick Management
        </h2>

        <div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/withdrawals"
              )
            }
          >
            <BanknoteArrowDown
              size={19}
            />

            <span>
              Withdrawals
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/balance-requests"
              )
            }
          >
            <CircleDollarSign
              size={19}
            />

            <span>
              Balance
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/orders"
              )
            }
          >
            <Package size={19} />

            <span>
              Orders
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/customers"
              )
            }
          >
            <UserPlus size={19} />

            <span>
              Customers
            </span>
          </button>

        </div>

      </section>

    </main>
  );
}

export default AdminNotifications;