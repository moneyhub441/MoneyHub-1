import {
  ArrowLeft,
  CheckCircle2,
  Package,
  ShoppingCart,
  WalletCards,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import BottomNav from "../components/BottomNav";

import {
  getProducts,
  type Product,
} from "../data/productStorage";

import "../css/Products.css";

/* =========================
   TYPES
========================= */

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
  email?: string;
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

type PurchaseResponse = {
  success: boolean;
  message?: string;

  purchase?: {
    _id?: string;
    id?: string;
    userId: string;
    productId?: string | null;
    productName: string;
    productImage?: string;
    price: number;
    dailyIncome: number;
    totalIncome: number;
    duration: number;
    status: string;
    purchasedAt: string;
  };

  wallet?: {
    balance: number;
  };
};

/* =========================
   COMPONENT
========================= */

function Products() {
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
    MongoDB ObjectId string hai.
    Isko Number() nahi karna.
  */

  const currentUserId =
    String(
      currentUser?.id || ""
    );

  /* =========================
     STATES
  ========================= */

  const [
    activeTab,
    setActiveTab,
  ] = useState<
    "Daily" | "Welfare"
  >("Daily");

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<Product | null>(
    null
  );

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  /* =========================
     PRODUCTS
  ========================= */

  const [allProducts] =
    useState<Product[]>(() =>
      getProducts()
    );

  const products =
    allProducts.filter(
      (product) =>
        product.type === activeTab
    );

  /* =========================
     GET WALLET BALANCE
  ========================= */

  const getWalletBalance =
    async () => {
      if (!currentUserId) {
        throw new Error(
          "Please login again."
        );
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

      return Number(
        data.wallet.balance || 0
      );
    };

  /* =========================
     BUY BUTTON
  ========================= */

  const handleBuy = async (
    product: Product
  ) => {
    if (loading) {
      return;
    }

    setError("");
    setSuccess(false);

    /* LOGIN */

    if (!currentUserId) {
      navigate(
        "/login",
        {
          replace: true,
        }
      );

      return;
    }

    try {
      setLoading(true);

      /* =====================
         GET SERVER WALLET
      ===================== */

      const walletBalance =
        await getWalletBalance();

      /* =====================
         BALANCE CHECK
      ===================== */

      if (
        walletBalance <
        Number(product.price)
      ) {
        navigate(
          "/wallet",
          {
            state: {
              message:
                "Insufficient wallet balance.",

              requiredAmount:
                Number(
                  product.price
                ),
            },
          }
        );

        return;
      }

      /* =====================
         OPEN CONFIRM MODAL
      ===================== */

      setSelectedProduct(
        product
      );
    } catch (error) {
      console.error(
        "Wallet check error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to check wallet balance."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CONFIRM PURCHASE
  ========================= */

  const confirmPurchase =
    async () => {
      if (
        !selectedProduct ||
        loading
      ) {
        return;
      }

      if (!currentUserId) {
        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return;
      }

      setError("");
      setSuccess(false);

      try {
        setLoading(true);

        /* =====================
           PURCHASE API
        ===================== */

        const response =
          await fetch(
            `${API_URL}/api/purchases`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  userId:
                    currentUserId,

                  /*
                    Existing productStorage
                    product ID MongoDB ID
                    hona zaroori nahi.

                    Backend invalid ID ko
                    null handle kar raha hai.
                  */

                  productId:
                    String(
                      selectedProduct.id ||
                        ""
                    ),

                  productName:
                    selectedProduct.name,

                  productImage:
                    selectedProduct.image ||
                    "",

                  price:
                    Number(
                      selectedProduct.price
                    ),

                  dailyIncome:
                    Number(
                      selectedProduct
                        .dailyIncome
                    ),

                  totalIncome:
                    Number(
                      selectedProduct
                        .totalIncome
                    ),

                  duration:
                    Number(
                      selectedProduct
                        .duration
                    ),
                }),
            }
          );

        const data:
          PurchaseResponse =
          await response.json();

        /* =====================
           API ERROR
        ===================== */

        if (
          !response.ok ||
          !data.success
        ) {
          /*
            Agar backend ne insufficient
            balance diya to wallet open.
          */

          if (
            data.message
              ?.toLowerCase()
              .includes(
                "insufficient"
              )
          ) {
            setSelectedProduct(
              null
            );

            navigate(
              "/wallet",
              {
                state: {
                  message:
                    data.message,
                },
              }
            );

            return;
          }

          throw new Error(
            data.message ||
              "Unable to complete purchase."
          );
        }

        /* =====================
           SUCCESS
        ===================== */

        setSelectedProduct(
          null
        );

        setSuccess(true);

        window.setTimeout(
          () => {
            setSuccess(false);

            navigate(
              "/my-products"
            );
          },
          1500
        );
      } catch (error) {
        console.error(
          "Purchase error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to complete purchase."
        );
      } finally {
        setLoading(false);
      }
    };

  /* =========================
     UI
  ========================= */

  return (
    <main className="products-page">

      {/* HEADER */}

      <header className="products-header">

        <button
          type="button"
          className="products-back"
          disabled={loading}
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
            Plan Store
          </h1>

          <p>
            Choose your product
          </p>

        </div>

        <div className="products-header-logo">

          <Package
            size={21}
          />

        </div>

      </header>

      {/* TABS */}

      <section className="products-tabs">

        <button
          type="button"
          disabled={loading}
          className={
            activeTab ===
            "Daily"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "Daily"
            )
          }
        >
          Daily Products
        </button>

        <button
          type="button"
          disabled={loading}
          className={
            activeTab ===
            "Welfare"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab(
              "Welfare"
            )
          }
        >
          Welfare Products
        </button>

      </section>

      {/* TITLE */}

      <section className="products-title">

        <div>

          <span className="products-title-icon">

            <Package
              size={19}
            />

          </span>

          <div>

            <h2>
              {activeTab ===
              "Daily"
                ? "Our Products"
                : "Welfare Products"}
            </h2>

            <p>
              Select the product
              that's right for you
            </p>

          </div>

        </div>

        <span>
          {products.length}{" "}
          Products
        </span>

      </section>

      {/* GLOBAL ERROR */}

      {error &&
        !selectedProduct && (

        <div
          style={{
            margin:
              "10px 16px",

            padding:
              "10px",

            borderRadius:
              "9px",

            background:
              "#fff1f2",

            color:
              "#dc2626",

            fontSize:
              "8px",

            fontWeight:
              "700",

            textAlign:
              "center",
          }}
        >
          {error}
        </div>

      )}

      {/* PRODUCT LIST */}

      <section className="products-list">

        {products.length ===
        0 ? (

          <div
            style={{
              padding:
                "45px 15px",

              textAlign:
                "center",

              color:
                "#999",
            }}
          >

            <Package
              size={38}
              strokeWidth={
                1.5
              }
            />

            <p>
              No products
              available.
            </p>

          </div>

        ) : (

          products.map(
            (product) => (

              <article
                className="product-card"
                key={product.id}
              >

                {/* BADGE */}

                {product.badge && (

                  <div className="product-popular-badge">

                    {
                      product.badge
                    }

                  </div>

                )}

                <div className="product-card-main">

                  {/* IMAGE */}

                  <div className="product-card-image">

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
                            .nextElementSibling as HTMLElement;

                        if (
                          fallback
                        ) {
                          fallback.style.display =
                            "flex";
                        }
                      }}
                    />

                    <div className="product-image-fallback">

                      <Package
                        size={45}
                        strokeWidth={
                          1.5
                        }
                      />

                      <strong>
                        MONEY
                      </strong>

                      <span>
                        HUB
                      </span>

                    </div>

                  </div>

                  {/* DETAILS */}

                  <div className="product-card-details">

                    <div className="product-name-row">

                      <div>

                        <span className="product-small-label">
                          PRODUCT
                        </span>

                        <h3>
                          {
                            product.name
                          }
                        </h3>

                      </div>

                      <span className="product-validity">
                        {
                          product.duration
                        }{" "}
                        Days
                      </span>

                    </div>

                    <div className="product-detail-row">

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

                    <div className="product-detail-row">

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

                    <div className="product-detail-row">

                      <span>
                        Duration
                      </span>

                      <strong>
                        {
                          product.duration
                        }{" "}
                        Days
                      </strong>

                    </div>

                  </div>

                </div>

                {/* PRICE */}

                <div className="product-card-bottom">

                  <div className="product-price">

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

                  <button
                    type="button"
                    className="product-buy-button"
                    disabled={loading}
                    onClick={() =>
                      handleBuy(
                        product
                      )
                    }
                  >

                    <ShoppingCart
                      size={17}
                    />

                    {loading
                      ? "Please Wait..."
                      : "Buy Now"}

                  </button>

                </div>

              </article>

            )
          )

        )}

      </section>

      {/* PURCHASE MODAL */}

      {selectedProduct && (

        <div className="purchase-overlay">

          <div className="purchase-modal">

            <button
              type="button"
              className="purchase-close"
              disabled={loading}
              onClick={() => {
                setSelectedProduct(
                  null
                );

                setError("");
              }}
            >
              <X
                size={20}
              />
            </button>

            <div className="purchase-modal-icon">

              <ShoppingCart
                size={28}
              />

            </div>

            <h2>
              Confirm Purchase
            </h2>

            <p>
              Product price will
              be deducted from
              your wallet.
            </p>

            <div className="purchase-summary">

              <div>

                <span>
                  Product
                </span>

                <strong>
                  {
                    selectedProduct.name
                  }
                </strong>

              </div>

              <div>

                <span>
                  Daily Income
                </span>

                <strong>
                  +₹
                  {Number(
                    selectedProduct.dailyIncome
                  ).toLocaleString(
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
                    selectedProduct.totalIncome
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Duration
                </span>

                <strong>
                  {
                    selectedProduct.duration
                  }{" "}
                  Days
                </strong>

              </div>

              <div className="purchase-total">

                <span>
                  Product Price
                </span>

                <strong>
                  ₹
                  {Number(
                    selectedProduct.price
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

            {/* MODAL ERROR */}

            {error && (

              <div
                style={{
                  marginTop:
                    "10px",

                  padding:
                    "10px",

                  borderRadius:
                    "9px",

                  background:
                    "#fff1f2",

                  color:
                    "#dc2626",

                  fontSize:
                    "8px",

                  fontWeight:
                    "700",

                  textAlign:
                    "center",
                }}
              >
                {error}
              </div>

            )}

            {/* CONFIRM */}

            <button
              type="button"
              className="purchase-confirm"
              disabled={loading}
              onClick={
                confirmPurchase
              }
            >

              <WalletCards
                size={17}
              />

              {loading
                ? "Processing..."
                : `Pay ₹${Number(
                    selectedProduct.price
                  ).toLocaleString(
                    "en-IN"
                  )}`}

            </button>

            {/* CANCEL */}

            <button
              type="button"
              className="purchase-cancel"
              disabled={loading}
              onClick={() => {
                setSelectedProduct(
                  null
                );

                setError("");
              }}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      {/* SUCCESS */}

      {success && (

        <div className="purchase-success">

          <CheckCircle2
            size={21}
          />

          <div>

            <strong>
              Purchase Successful
            </strong>

            <span>
              Product activated.
              Daily income starts
              after 24 hours.
            </span>

          </div>

        </div>

      )}

      <BottomNav />

    </main>
  );
}

export default Products;