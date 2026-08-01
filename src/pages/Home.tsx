import {
  ArrowDown,
  ArrowUp,
  Bell,
  CalendarCheck,
  ChevronRight,
  Headphones,
  Package,
  Settings,
  ShoppingBag,
  UserRound,
  WalletCards,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import "../css/Home.css";

/* =========================
   TYPES
========================= */

type RecentTransaction = {
  id: number;
  user: string;
  title: string;
  amount: number;
  type: "credit" | "debit";
};

type Notification = {
  id?: number;
  title?: string;
  message?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
};

/* =========================
   50 RECENT TRANSACTIONS
========================= */

const recentTransactions: RecentTransaction[] =
  Array.from({ length: 50 }, (_, index) => {
    const lastFour = String(
      1000 + ((index * 173 + 2680) % 9000)
    );

    const activities = [
      {
        title: "Purchased Plan",
        type: "credit" as const,
        amount: 1480,
      },
      {
        title: "Recharged Wallet",
        type: "credit" as const,
        amount: 4000,
      },
      {
        title: "Withdrawal",
        type: "debit" as const,
        amount: 2500,
      },
      {
        title: "Daily Income",
        type: "credit" as const,
        amount: 315,
      },
      {
        title: "Product Purchased",
        type: "credit" as const,
        amount: 700,
      },
    ];

    const activity =
      activities[index % activities.length];

    return {
      id: index + 1,

      user: `User ****${lastFour}`,

      title: activity.title,

      amount: activity.amount,

      type: activity.type,
    };
  });

/* =========================
   HOME COMPONENT
========================= */

function Home() {
  const navigate = useNavigate();

  /* =========================
     CURRENT USER
  ========================= */

  let currentUserId = 0;
  let currentUserName = "User";

  try {
    const savedUser =
      localStorage.getItem("currentUser");

    const currentUser = savedUser
      ? JSON.parse(savedUser)
      : null;

    currentUserId = Number(
      currentUser?.id || 0
    );

    currentUserName =
      currentUser?.name?.trim() ||
      "User";
  } catch (error) {
    console.error(
      "Current user load error:",
      error
    );

    currentUserId = 0;
    currentUserName = "User";
  }

  /* =========================
     AUTOMATIC GREETING
  ========================= */

  const currentHour =
    new Date().getHours();

  let greeting = "Good Evening";

  if (
    currentHour >= 5 &&
    currentHour < 12
  ) {
    greeting = "Good Morning";
  } else if (
    currentHour >= 12 &&
    currentHour < 17
  ) {
    greeting = "Good Afternoon";
  } else if (
    currentHour >= 17 &&
    currentHour < 21
  ) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  /* =========================
     NOTIFICATION COUNT
  ========================= */

  let notificationCount = 0;

  if (currentUserId) {
    try {
      const savedNotifications =
        localStorage.getItem(
          `notifications_${currentUserId}`
        );

      const notifications: Notification[] =
        savedNotifications
          ? JSON.parse(savedNotifications)
          : [];

      if (Array.isArray(notifications)) {
        notificationCount =
          notifications.filter(
            (notification) => {
              if (
                typeof notification.read ===
                "boolean"
              ) {
                return (
                  notification.read === false
                );
              }

              if (
                typeof notification.isRead ===
                "boolean"
              ) {
                return (
                  notification.isRead ===
                  false
                );
              }

              return true;
            }
          ).length;
      }
    } catch (error) {
      console.error(
        "Notification load error:",
        error
      );

      notificationCount = 0;
    }
  }

  /* =========================
     UI
  ========================= */

  return (
    <main className="home-page">

      {/* =====================
          HEADER
      ===================== */}

      <header className="home-header">

        {/* BRAND */}

        <div className="home-brand">

          <div className="home-brand-logo">
            ₹
          </div>

          <div>
            <h1>
              MONEY HUB
            </h1>

            <p>
              SMART PRODUCTS
            </p>
          </div>

        </div>

        {/* HEADER BUTTONS */}

        <div className="home-header-buttons">

          {/* SUPPORT */}

          <button
            type="button"
            aria-label="Support"
            onClick={() =>
              navigate("/support")
            }
          >
            <Headphones size={20} />
          </button>

          {/* NOTIFICATIONS */}

          <button
            type="button"
            aria-label="Notifications"
            onClick={() =>
              navigate("/notifications")
            }
          >
            <Bell size={20} />

            {notificationCount > 0 && (
              <span>
                {notificationCount > 99
                  ? "99+"
                  : notificationCount}
              </span>
            )}

          </button>

          {/* SETTINGS */}

          <button
            type="button"
            aria-label="Settings"
            onClick={() =>
              navigate("/settings")
            }
          >
            <Settings size={20} />
          </button>

        </div>

      </header>

      {/* =====================
          GREEN HERO
      ===================== */}

      <section className="home-hero">

        <div
          className="
            home-hero-circle
            circle-one
          "
        />

        <div
          className="
            home-hero-circle
            circle-two
          "
        />

        {/* USER */}

        <div className="home-user">

          <div className="home-user-avatar">
            <UserRound size={27} />
          </div>

          <div>

            <p>
              👋 {greeting}
            </p>

            <h2>
              Welcome {currentUserName}
            </h2>

            <span>
              SMART SHOPPING • BETTER BENEFITS
            </span>

          </div>

        </div>

        {/* HERO ART */}

        <ShoppingBag
          className="home-hero-art"
          size={105}
        />

      </section>

      {/* =====================
          QUICK ACTIONS
      ===================== */}

      <section className="home-white-card">

        <div className="home-section-title">

          <h2>
            ⚡ Quick Actions
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            See All

            <ChevronRight size={16} />
          </button>

        </div>

        <div className="home-quick-grid">

          {/* CHECK-IN */}

          <QuickCard
            icon={
              <CalendarCheck size={21} />
            }
            title="Check-In"
            subtitle="Get Rewards"
            onClick={() =>
              navigate("/check-in")
            }
          />

          {/* WALLET */}

          <QuickCard
            icon={
              <WalletCards size={21} />
            }
            title="Wallet"
            subtitle="Add Balance"
            onClick={() =>
              navigate("/wallet")
            }
          />

          {/* ORDERS */}

          <QuickCard
            icon={
              <Package size={21} />
            }
            title="Orders"
            subtitle="My Products"
            onClick={() =>
              navigate("/my-products")
            }
          />

          {/* SHOP */}

          <QuickCard
            icon={
              <ShoppingBag size={21} />
            }
            title="Shop"
            subtitle="View Products"
            onClick={() =>
              navigate("/products")
            }
          />

        </div>

      </section>

      {/* =====================
          FEATURED PRODUCT
      ===================== */}

      <section className="home-featured">

        {/* TOP */}

        <div className="home-featured-top">

          <div>

            <h3>
              👑 Featured Product
            </h3>

            <p>
              Popular choice for members
            </p>

          </div>

          <span>
            POPULAR
          </span>

        </div>

        {/* PRODUCT CONTENT */}

        <div className="home-product-content">

          {/* IMAGE */}

          <div className="home-product-image">

            <div className="product-box-art">

              <Package
                size={58}
                strokeWidth={1.4}
              />

              <strong>
                MONEY
              </strong>

              <small>
                HUB
              </small>

            </div>

          </div>

          {/* DETAILS */}

          <div className="home-product-details">

            {/* DAILY INCOME */}

            <div>

              <span>
                Daily Income
              </span>

              <strong>
                ₹270
              </strong>

            </div>

            {/* TOTAL INCOME */}

            <div>

              <span>
                Total Income
              </span>

              <strong>
                ₹4,715
              </strong>

            </div>

            {/* DURATION */}

            <div>

              <span>
                Duration
              </span>

              <strong>
                15 Days
              </strong>

            </div>

          </div>

        </div>

        {/* PRODUCT BOTTOM */}

        <div className="home-product-bottom">

          <div>

            <span>
              Product Price
            </span>

            <strong>
              ₹700
            </strong>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            <ShoppingBag size={17} />

            Buy Now
          </button>

        </div>

      </section>

      {/* =====================
          VIEW PRODUCTS
      ===================== */}

      <button
        className="home-view-products"
        type="button"
        onClick={() =>
          navigate("/products")
        }
      >
        View All Products

        <span>
          →
        </span>
      </button>

      {/* =========================
          RECENT TRANSACTIONS
          50 USERS AUTO SCROLL
      ========================= */}

      <section
        className="
          home-white-card
          home-transactions-section
        "
      >

        {/* HEADING */}

        <div className="home-section-title">

          <h2 className="home-transactions-heading">

            <span className="home-transactions-heading-icon">
              <CalendarCheck size={15} />
            </span>

            Recent Transactions

          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/wallet-history")
            }
          >
            View All

            <ChevronRight size={16} />
          </button>

        </div>

        {/* TRANSACTION WINDOW */}

        <div className="home-transactions-window">

          {/* AUTO SCROLL CONTAINER */}

          <div className="home-transactions-scroll">

            {[
              ...recentTransactions,
              ...recentTransactions,
            ].map(
              (
                transaction,
                index
              ) => (

                <div
                  className="home-transaction-item"
                  key={`${transaction.id}-${index}`}
                >

                  {/* ICON */}

                  <div
                    className={
                      `home-transaction-icon ${
                        transaction.type
                      }`
                    }
                  >

                    {transaction.type ===
                    "credit" ? (
                      <ArrowUp size={23} />
                    ) : (
                      <ArrowDown size={23} />
                    )}

                  </div>

                  {/* USER DETAILS */}

                  <div className="home-transaction-info">

                    <strong>
                      {transaction.user}
                    </strong>

                    <span>
                      {transaction.title}
                    </span>

                  </div>

                  {/* AMOUNT */}

                  <strong
                    className={
                      `home-transaction-amount ${
                        transaction.type
                      }`
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

                </div>

              )
            )}

          </div>

        </div>

      </section>

      {/* =====================
          BOTTOM NAV
      ===================== */}

      <BottomNav />

    </main>
  );
}

/* =========================
   QUICK CARD
========================= */

function QuickCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="home-quick-card"
      type="button"
      onClick={onClick}
    >

      <div className="home-quick-icon">
        {icon}
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {subtitle}
      </span>

      <i />

    </button>
  );
}

export default Home;