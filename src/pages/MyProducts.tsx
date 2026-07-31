import {
  ArrowLeft,
  Clock3,
  Package,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import API_URL from "../config/api";
import "../css/MyProducts.css";

/* =========================
   TYPES
========================= */

type PurchasedProduct = {
  id: string;
  purchaseId: string;
  userId: string;

  name: string;
  productName?: string;

  image: string;
  productImage?: string;

  price: number;
  dailyIncome: number;
  totalIncome: number;
  duration: number;

  purchasedAt: string;

  status:
    | "Active"
    | "Completed"
    | "Cancelled";

  earnedIncome?: number;
  creditedDays?: number;
  lastIncomeAt?: string | null;
};

type PurchasesResponse = {
  success: boolean;
  message?: string;
  purchases?: PurchasedProduct[];
};

type WalletResponse = {
  success: boolean;
  message?: string;

  wallet?: {
    balance: number;
  };
};

type IncomeResponse = {
  success: boolean;
  message?: string;
  creditedAmount?: number;
};

/* =========================
   ONE DAY
========================= */

const ONE_DAY =
  24 * 60 * 60 * 1000;

/* =========================
   COMPONENT
========================= */

function MyProducts() {
  const navigate = useNavigate();



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

  const [products, setProducts] =
    useState<PurchasedProduct[]>([]);

  const [
    walletBalance,
    setWalletBalance,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =========================
     LOAD PRODUCTS
  ========================= */

  const loadProducts =
    useCallback(async () => {
      if (!currentUserId) {
        setProducts([]);
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/purchases/user/${currentUserId}`
        );

      const data:
        PurchasesResponse =
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
     LOAD WALLET
  ========================= */

  const loadWallet =
    useCallback(async () => {
      if (!currentUserId) {
        setWalletBalance(0);
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/wallet/${currentUserId}`
        );

      const data:
        WalletResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.wallet
      ) {
        throw new Error(
          data.message ||
            "Unable to load wallet."
        );
      }

      setWalletBalance(
        Number(
          data.wallet.balance || 0
        )
      );
    }, [
      API_URL,
      currentUserId,
    ]);

  /* =========================
     PROCESS INCOME
  ========================= */

  const processIncome =
    useCallback(async () => {
      if (!currentUserId) {
        return;
      }

      const response =
        await fetch(
          `${API_URL}/api/purchases/process-income/${currentUserId}`,
          {
            method: "POST",
          }
        );

      const data:
        IncomeResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to process income."
        );
      }
    }, [
      API_URL,
      currentUserId,
    ]);

  /* =========================
     REFRESH PAGE DATA
  ========================= */

  const refreshData =
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

        /*
          Pehle backend check karega
          koi 24-hour income due hai
          ya nahi.
        */

        await processIncome();

        /*
          Uske baad latest products
          aur wallet load honge.
        */

        await Promise.all([
          loadProducts(),
          loadWallet(),
        ]);
      } catch (error) {
        console.error(
          "My Products error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your products."
        );
      } finally {
        setLoading(false);
      }
    }, [
      currentUserId,
      navigate,
      processIncome,
      loadProducts,
      loadWallet,
    ]);

  /* =========================
     PAGE OPEN
  ========================= */

  useEffect(() => {
    refreshData();

    /*
      Page open rehne par
      every minute backend check.

      Income complete 24 hours
      ke baad hi credit hogi.
    */

    const interval =
      window.setInterval(
        () => {
          refreshData();
        },
        60 * 1000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [refreshData]);

  /* =========================
     TOTAL EARNED
  ========================= */

  const totalEarned =
    products.reduce(
      (total, product) =>
        total +
        Number(
          product.earnedIncome ||
            0
        ),
      0
    );

  /* =========================
     NEXT INCOME
  ========================= */

  const getNextIncomeText = (
    product: PurchasedProduct
  ) => {
    if (
      product.status ===
      "Completed"
    ) {
      return "Completed";
    }

    if (
      product.status ===
      "Cancelled"
    ) {
      return "Cancelled";
    }

    const purchaseTime =
      new Date(
        product.purchasedAt
      ).getTime();

    if (
      Number.isNaN(
        purchaseTime
      )
    ) {
      return "Waiting";
    }

    const creditedDays =
      Number(
        product.creditedDays ||
          0
      );

    /*
      Next payment:
      purchase time +
      (creditedDays + 1) days
    */

    const nextIncomeTime =
      purchaseTime +
      (creditedDays + 1) *
        ONE_DAY;

    const remaining =
      nextIncomeTime -
      Date.now();

    if (remaining <= 0) {
      return "Processing...";
    }

    const hours =
      Math.floor(
        remaining /
          (60 * 60 * 1000)
      );

    const minutes =
      Math.floor(
        (
          remaining %
          (60 * 60 * 1000)
        ) /
          (60 * 1000)
      );

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (minutes > 0) {
      return `${minutes}m`;
    }

    return "< 1m";
  };

  /* =========================
     UI
  ========================= */

  return (
    <main className="my-products-page">

      {/* HEADER */}

      <header className="my-products-header">

        <button
          type="button"
          onClick={() =>
            navigate("/profile")
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>

          <h1>
            My Products
          </h1>

          <p>
            Your active products
            and earnings
          </p>

        </div>

        <span>
          <Package
            size={20}
          />
        </span>

      </header>

      {/* SUMMARY */}

      <section className="my-products-summary">

        <article>

          <div>
            <Package
              size={19}
            />
          </div>

          <span>
            My Products
          </span>

          <strong>
            {products.length}
          </strong>

        </article>

        <article>

          <div>
            <TrendingUp
              size={19}
            />
          </div>

          <span>
            Total Earned
          </span>

          <strong>
            ₹
            {totalEarned.toLocaleString(
              "en-IN"
            )}
          </strong>

        </article>

        <article>

          <div>
            <WalletCards
              size={19}
            />
          </div>

          <span>
            Wallet
          </span>

          <strong>
            ₹
            {walletBalance.toLocaleString(
              "en-IN"
            )}
          </strong>

        </article>

      </section>

      {/* ERROR */}

      {error && (
        <div
          style={{
            margin: "12px 16px",
            padding: "10px",
            borderRadius: "10px",
            background: "#fff1f2",
            color: "#dc2626",
            textAlign: "center",
            fontSize: "9px",
            fontWeight: "700",
          }}
        >
          {error}
        </div>
      )}

      {/* PRODUCTS */}

      <section className="my-products-card">

        <div className="my-products-title">

          <div>

            <h2>
              Purchased Products
            </h2>

            <p>
              Daily income is credited
              every 24 hours
            </p>

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="my-products-empty">

            <Package
              size={38}
            />

            <strong>
              Loading Products...
            </strong>

            <span>
              Please wait.
            </span>

          </div>

        ) : products.length === 0 ? (

          /* EMPTY */

          <div className="my-products-empty">

            <Package
              size={38}
            />

            <strong>
              No Products Yet
            </strong>

            <span>
              Purchase a product
              to start.
            </span>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products"
                )
              }
            >
              View Products
            </button>

          </div>

        ) : (

          /* LIST */

          <div className="my-products-list">

            {products.map(
              (product) => {

                const earned =
                  Number(
                    product.earnedIncome ||
                      0
                  );

                const creditedDays =
                  Number(
                    product.creditedDays ||
                      0
                  );

                const progress =
                  Number(
                    product.totalIncome
                  ) > 0
                    ? Math.min(
                        (
                          earned /
                          Number(
                            product.totalIncome
                          )
                        ) *
                          100,
                        100
                      )
                    : 0;

                return (

                  <article
                    className="my-product-item"
                    key={
                      product.purchaseId ||
                      product.id
                    }
                    onClick={() =>
                      navigate(
                        `/my-products/${
                          product.purchaseId ||
                          product.id
                        }`
                      )
                    }
                  >

                    {/* IMAGE */}

                    <div className="my-product-image">

                      {product.image ? (

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                      ) : (

                        <Package
                          size={40}
                        />

                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="my-product-content">

                      <div className="my-product-heading">

                        <div>

                          <span>
                            PRODUCT
                          </span>

                          <h3>
                            {
                              product.name
                            }
                          </h3>

                        </div>

                        <b
                          className={
                            product.status ===
                            "Completed"
                              ? "completed"
                              : "active"
                          }
                        >
                          {
                            product.status
                          }
                        </b>

                      </div>

                      {/* DETAILS */}

                      <div className="my-product-details">

                        <div>

                          <span>
                            Price
                          </span>

                          <strong>
                            ₹
                            {Number(
                              product.price
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Daily Income
                          </span>

                          <strong>
                            +₹
                            {Number(
                              product.dailyIncome
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Earned
                          </span>

                          <strong>
                            ₹
                            {earned.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Total Income
                          </span>

                          <strong>
                            ₹
                            {Number(
                              product.totalIncome
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                      </div>

                      {/* PROGRESS */}

                      <div className="my-product-progress">

                        <div>

                          <span>
                            Progress
                          </span>

                          <strong>
                            {creditedDays}/
                            {
                              product.duration
                            }{" "}
                            Days
                          </strong>

                        </div>

                        <div className="my-product-progress-bar">

                          <i
                            style={{
                              width:
                                `${progress}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* NEXT INCOME */}

                      <div className="my-product-next-income">

                        <Clock3
                          size={16}
                        />

                        <div>

                          <span>
                            {product.status ===
                            "Completed"
                              ? "Income Status"
                              : "Next Income In"}
                          </span>

                          <strong>
                            {getNextIncomeText(
                              product
                            )}
                          </strong>

                        </div>

                        {product.status ===
                          "Active" && (

                          <b>
                            +₹
                            {Number(
                              product.dailyIncome
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </b>

                        )}

                      </div>

                    </div>

                  </article>
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

export default MyProducts;