import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Package,
  ShieldCheck,
  TrendingUp,
  WalletCards,
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
import API_URL from "../config/api";
import "../css/MyProductDetails.css";

/* =========================
   TYPES
========================= */

type PurchasedProduct = {
  id: string;
  purchaseId: string;
  userId: string;

  productId?: string | null;

  name: string;
  productName?: string;

  image: string;
  productImage?: string;

  price: number;
  dailyIncome: number;
  totalIncome: number;
  duration: number;

  type?: "Daily" | "Welfare";
  badge?: string;

  purchasedAt: string;

  status:
    | "Active"
    | "Completed"
    | "Cancelled";

  earnedIncome?: number;
  creditedDays?: number;

  lastIncomeAt?: string | null;

  createdAt?: string;
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
    id: string;
    userId: string;

    balance: number;
    totalAdded: number;
    totalWithdrawn: number;
    totalIncome: number;
  };
};

type IncomeResponse = {
  success: boolean;
  message?: string;

  creditedAmount?: number;

  wallet?: {
    balance: number;
    totalIncome: number;
  };
};

/* =========================
   CONSTANT
========================= */

const ONE_DAY =
  24 * 60 * 60 * 1000;

/* =========================
   COMPONENT
========================= */

function MyProductDetails() {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  /* =========================
     API
  ========================= */



  /* =========================
     STATES
  ========================= */

  const [
    product,
    setProduct,
  ] =
    useState<PurchasedProduct | null>(
      null
    );

  const [
    walletBalance,
    setWalletBalance,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [now, setNow] =
    useState(
      Date.now()
    );

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
        ? JSON.parse(
            savedUser
          )
        : null;

    /*
      IMPORTANT:

      MongoDB ObjectId
      STRING hoti hai.

      Number() nahi lagana.
    */

    currentUserId =
      String(
        currentUser?.id ||
          ""
      );
  } catch {
    currentUserId = "";
  }

  /* =========================
     PROCESS INCOME
  ========================= */

  const processIncome =
    useCallback(
      async () => {
        if (
          !currentUserId
        ) {
          return;
        }

        const response =
          await fetch(
            `${API_URL}/api/purchases/process-income/${currentUserId}`,
            {
              method:
                "POST",
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
      },
      [
        API_URL,
        currentUserId,
      ]
    );

  /* =========================
     LOAD PRODUCT
  ========================= */

  const loadProduct =
    useCallback(
      async () => {
        if (
          !currentUserId ||
          !id
        ) {
          setProduct(
            null
          );

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
              "Unable to load product."
          );
        }

        const purchases =
          Array.isArray(
            data.purchases
          )
            ? data.purchases
            : [];

        /*
          purchaseId / id
          dono check karenge.
        */

        const foundProduct =
          purchases.find(
            (item) =>
              String(
                item.purchaseId ||
                  item.id
              ) ===
              String(id)
          );

        setProduct(
          foundProduct ||
            null
        );
      },
      [
        API_URL,
        currentUserId,
        id,
      ]
    );

  /* =========================
     LOAD WALLET
  ========================= */

  const loadWallet =
    useCallback(
      async () => {
        if (
          !currentUserId
        ) {
          setWalletBalance(
            0
          );

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
            data.wallet
              .balance || 0
          )
        );
      },
      [
        API_URL,
        currentUserId,
      ]
    );

  /* =========================
     REFRESH DATA
  ========================= */

  const refreshData =
    useCallback(
      async (
        showLoader =
          false
      ) => {
        if (
          !currentUserId
        ) {
          setProduct(
            null
          );

          setWalletBalance(
            0
          );

          setLoading(
            false
          );

          return;
        }

        try {
          if (
            showLoader
          ) {
            setLoading(
              true
            );
          }

          setError("");

          /*
            STEP 1:
            Backend income check.

            Backend hi decide karega
            24 hours complete hui
            ya nahi.
          */

          await processIncome();

          /*
            STEP 2:
            Latest MongoDB product
            + wallet load.
          */

          await Promise.all([
            loadProduct(),
            loadWallet(),
          ]);

          setNow(
            Date.now()
          );
        } catch (error) {
          console.error(
            "Product details error:",
            error
          );

          setError(
            error instanceof
              Error
              ? error.message
              : "Unable to load product details."
          );
        } finally {
          if (
            showLoader
          ) {
            setLoading(
              false
            );
          }
        }
      },
      [
        currentUserId,
        processIncome,
        loadProduct,
        loadWallet,
      ]
    );

  /* =========================
     PAGE LOAD
  ========================= */

  useEffect(() => {
    refreshData(
      true
    );

    /*
      Page open rehne par
      har minute backend check.

      Lekin backend income
      complete 24 hours ke
      baad hi credit karega.
    */

    const interval =
      window.setInterval(
        () => {
          refreshData(
            false
          );
        },
        60 * 1000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    refreshData,
  ]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="my-product-details-page">

        <header className="my-product-details-header">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/my-products"
              )
            }
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>

            <h1>
              Product Details
            </h1>

            <p>
              Loading product...
            </p>

          </div>

          <span>
            <Package
              size={20}
            />
          </span>

        </header>

        <section className="product-not-found">

          <div>
            <Package
              size={35}
            />
          </div>

          <h2>
            Loading...
          </h2>

          <p>
            Please wait while
            we load your product.
          </p>

        </section>

      </main>
    );
  }

  /* =========================
     NOT FOUND
  ========================= */

  if (!product) {
    return (
      <main className="my-product-details-page">

        <header className="my-product-details-header">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/my-products"
              )
            }
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>

            <h1>
              Product Details
            </h1>

            <p>
              Your purchased product
            </p>

          </div>

          <span>
            <Package
              size={20}
            />
          </span>

        </header>

        <section className="product-not-found">

          <div>
            <Package
              size={35}
            />
          </div>

          <h2>
            Product Not Found
          </h2>

          <p>
            {error ||
              "We couldn't find this product in your account."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/my-products"
              )
            }
          >
            Back to My Products
          </button>

        </section>

      </main>
    );
  }

  /* =========================
     VALUES
  ========================= */

  const earnedIncome =
    Number(
      product.earnedIncome ||
        0
    );

  const creditedDays =
    Number(
      product.creditedDays ||
        0
    );

  const totalIncome =
    Number(
      product.totalIncome ||
        0
    );

  const duration =
    Number(
      product.duration ||
        0
    );

  const remainingIncome =
    Math.max(
      totalIncome -
        earnedIncome,
      0
    );

  const remainingDays =
    Math.max(
      duration -
        creditedDays,
      0
    );

  /* =========================
     PROGRESS
  ========================= */

  const progress =
    totalIncome > 0
      ? Math.min(
          (
            earnedIncome /
            totalIncome
          ) * 100,
          100
        )
      : 0;

  /* =========================
     PURCHASE DATE
  ========================= */

  const purchasedDateObject =
    new Date(
      product.purchasedAt
    );

  const purchaseDate =
    !Number.isNaN(
      purchasedDateObject.getTime()
    )
      ? purchasedDateObject.toLocaleDateString(
          "en-GB",
          {
            day:
              "2-digit",

            month:
              "short",

            year:
              "numeric",
          }
        )
      : "Not Available";

  const purchaseTime =
    !Number.isNaN(
      purchasedDateObject.getTime()
    )
      ? purchasedDateObject.toLocaleTimeString(
          "en-GB",
          {
            hour:
              "2-digit",

            minute:
              "2-digit",
          }
        )
      : "";

  /* =========================
     NEXT INCOME
  ========================= */

  const getNextIncome =
    () => {
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

      const purchasedTime =
        new Date(
          product.purchasedAt
        ).getTime();

      if (
        Number.isNaN(
          purchasedTime
        )
      ) {
        return "Waiting";
      }

      const nextCreditTime =
        purchasedTime +
        (creditedDays + 1) *
          ONE_DAY;

      const remaining =
        nextCreditTime -
        now;

      if (
        remaining <= 0
      ) {
        return "Processing...";
      }

      const hours =
        Math.floor(
          remaining /
            (60 *
              60 *
              1000)
        );

      const minutes =
        Math.floor(
          (
            remaining %
            (60 *
              60 *
              1000)
          ) /
            (60 *
              1000)
        );

      if (
        hours > 0
      ) {
        return `${hours}h ${minutes}m`;
      }

      if (
        minutes > 0
      ) {
        return `${minutes}m`;
      }

      return "< 1m";
    };

  /* =========================
     UI
  ========================= */

  return (
    <main className="my-product-details-page">

      {/* HEADER */}

      <header className="my-product-details-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/my-products"
            )
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>

          <h1>
            Product Details
          </h1>

          <p>
            Earnings & product
            information
          </p>

        </div>

        <span>
          <Package
            size={20}
          />
        </span>

      </header>

      {/* ERROR */}

      {error && (
        <div
          style={{
            margin:
              "10px 16px",
            padding:
              "10px 12px",
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
          }}
        >
          {error}
        </div>
      )}

      {/* PRODUCT HERO */}

      <section className="my-product-details-hero">

        <div className="my-product-details-image">

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

                const fallback =
                  event
                    .currentTarget
                    .nextElementSibling as
                    HTMLElement;

                if (
                  fallback
                ) {
                  fallback.style.display =
                    "grid";
                }
              }}
            />
          ) : null}

          <div
            className="my-product-details-fallback"
            style={{
              display:
                product.image
                  ? undefined
                  : "grid",
            }}
          >
            <Package
              size={48}
              strokeWidth={
                1.4
              }
            />
          </div>

        </div>

        <span
          className={`my-product-active ${product.status.toLowerCase()}`}
        >
          <CheckCircle2
            size={13}
          />

          {
            product.status
          }
        </span>

        <h2>
          {product.name}
        </h2>

        <p>
          {product.type ===
          "Welfare"
            ? "Welfare Product"
            : "Daily Income Product"}
        </p>

      </section>

      {/* NEXT INCOME */}

      <section className="my-product-next-card">

        <div className="my-product-next-icon">

          <Clock3
            size={24}
          />

        </div>

        <div>

          <span>
            {product.status ===
            "Completed"
              ? "Income Status"
              : "Next Income In"}
          </span>

          <strong>
            {getNextIncome()}
          </strong>

          {product.status ===
            "Active" && (
            <small>
              +₹
              {Number(
                product.dailyIncome
              ).toLocaleString(
                "en-IN"
              )}{" "}
              after every 24
              hours
            </small>
          )}

        </div>

      </section>

      {/* EARNING SUMMARY */}

      <section className="my-product-earning-grid">

        <article>

          <div>
            <TrendingUp
              size={19}
            />
          </div>

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

        </article>

        <article>

          <div>
            <IndianRupee
              size={19}
            />
          </div>

          <span>
            Earned
          </span>

          <strong>
            ₹
            {earnedIncome.toLocaleString(
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
            Remaining
          </span>

          <strong>
            ₹
            {remainingIncome.toLocaleString(
              "en-IN"
            )}
          </strong>

        </article>

        <article>

          <div>
            <CalendarDays
              size={19}
            />
          </div>

          <span>
            Days Left
          </span>

          <strong>
            {remainingDays}
          </strong>

        </article>

      </section>

      {/* PROGRESS */}

      <section className="my-product-progress-card">

        <div className="my-product-progress-title">

          <div>

            <h2>
              Income Progress
            </h2>

            <p>
              {creditedDays} of{" "}
              {duration} days
              completed
            </p>

          </div>

          <strong>
            {Math.round(
              progress
            )}
            %
          </strong>

        </div>

        <div className="my-product-detail-progress-bar">

          <i
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>

        <div className="my-product-progress-values">

          <span>
            ₹
            {earnedIncome.toLocaleString(
              "en-IN"
            )}{" "}
            earned
          </span>

          <span>
            ₹
            {totalIncome.toLocaleString(
              "en-IN"
            )}{" "}
            total
          </span>

        </div>

      </section>

      {/* PRODUCT INFORMATION */}

      <section className="my-product-info-card">

        <div className="my-product-info-title">

          <h2>
            Product Information
          </h2>

          <p>
            Your purchased product
            details
          </p>

        </div>

        {/* PRICE */}

        <div className="my-product-detail-row">

          <div className="my-product-detail-icon">
            <IndianRupee
              size={18}
            />
          </div>

          <div>

            <span>
              Product Price
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

        </div>

        {/* DAILY */}

        <div className="my-product-detail-row">

          <div className="my-product-detail-icon">
            <TrendingUp
              size={18}
            />
          </div>

          <div>

            <span>
              Daily Income
            </span>

            <strong>
              ₹
              {Number(
                product.dailyIncome
              ).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        {/* TOTAL */}

        <div className="my-product-detail-row">

          <div className="my-product-detail-icon">
            <WalletCards
              size={18}
            />
          </div>

          <div>

            <span>
              Total Income
            </span>

            <strong>
              ₹
              {totalIncome.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

        {/* DURATION */}

        <div className="my-product-detail-row">

          <div className="my-product-detail-icon">
            <Clock3
              size={18}
            />
          </div>

          <div>

            <span>
              Duration
            </span>

            <strong>
              {duration} Days
            </strong>

          </div>

        </div>

        {/* PURCHASE DATE */}

        <div className="my-product-detail-row">

          <div className="my-product-detail-icon">
            <CalendarDays
              size={18}
            />
          </div>

          <div>

            <span>
              Purchase Date
            </span>

            <strong>
              {purchaseDate}
            </strong>

            {purchaseTime && (
              <small>
                {
                  purchaseTime
                }
              </small>
            )}

          </div>

        </div>

        {/* STATUS */}

        <div className="my-product-detail-row">

          <div className="my-product-detail-icon">
            <ShieldCheck
              size={18}
            />
          </div>

          <div>

            <span>
              Status
            </span>

            <strong
              className={`product-status-text ${product.status.toLowerCase()}`}
            >
              {
                product.status
              }
            </strong>

          </div>

        </div>

      </section>

      {/* WALLET */}

      <section className="my-product-wallet-card">

        <WalletCards
          size={22}
        />

        <div>

          <span>
            Current Wallet
            Balance
          </span>

          <strong>
            ₹
            {walletBalance.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/wallet"
            )
          }
        >
          View Wallet
        </button>

      </section>

      {/* PURCHASE ID */}

      <section className="my-product-purchase-id">

        <div>

          <span>
            Purchase ID
          </span>

          <strong>
            #
            {product.purchaseId ||
              product.id}
          </strong>

        </div>

        <CheckCircle2
          size={20}
        />

      </section>

      {/* SUPPORT */}

      <button
        type="button"
        className="my-product-support"
        onClick={() =>
          navigate(
            "/support"
          )
        }
      >
        Need Help With This
        Product?
      </button>

    </main>
  );
}

export default MyProductDetails;