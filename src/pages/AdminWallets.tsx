import {
  ArrowLeft,
  ChevronRight,
  Search,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "../css/AdminWallets.css";

/* =========================
   TYPES
========================= */

type Customer = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
};

type WalletCustomer = {
  id: string;
  userId: string;

  user: Customer | null;

  balance: number;
  totalAdded: number;
  totalWithdrawn: number;
  totalIncome: number;

  transactionCount: number;
};

type WalletSummary = {
  totalWallets: number;
  activeWallets: number;
  totalWalletBalance: number;
};

type AdminWalletResponse = {
  success: boolean;
  message?: string;

  summary?: WalletSummary;

  wallets?: WalletCustomer[];
};

/* =========================
   COMPONENT
========================= */

function AdminWallets() {
  const navigate =
    useNavigate();

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
    wallets,
    setWallets,
  ] = useState<
    WalletCustomer[]
  >([]);

  const [
    summary,
    setSummary,
  ] = useState<WalletSummary>({
    totalWallets: 0,
    activeWallets: 0,
    totalWalletBalance: 0,
  });

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =========================
     LOAD ALL WALLETS
  ========================= */

  useEffect(() => {
    const loadWallets =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/wallet/admin/all`
            );

          const data:
            AdminWalletResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load customer wallets."
            );
          }

          const walletList =
            Array.isArray(
              data.wallets
            )
              ? data.wallets
              : [];

          setWallets(
            walletList
          );

          setSummary({
            totalWallets:
              Number(
                data.summary
                  ?.totalWallets ??
                  walletList.length
              ),

            activeWallets:
              Number(
                data.summary
                  ?.activeWallets ??
                  0
              ),

            totalWalletBalance:
              Number(
                data.summary
                  ?.totalWalletBalance ??
                  0
              ),
          });
        } catch (error) {
          console.error(
            "Admin wallets error:",
            error
          );

          setWallets([]);

          setSummary({
            totalWallets: 0,
            activeWallets: 0,
            totalWalletBalance: 0,
          });

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load customer wallets."
          );
        } finally {
          setLoading(false);
        }
      };

    loadWallets();
  }, [API_URL]);

  /* =========================
     SEARCH
  ========================= */

  const filteredWallets =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      if (!searchValue) {
        return wallets;
      }

      return wallets.filter(
        (wallet) => {
          const name =
            String(
              wallet.user?.name ||
                ""
            ).toLowerCase();

          const mobile =
            String(
              wallet.user?.mobile ||
                ""
            ).toLowerCase();

          const email =
            String(
              wallet.user?.email ||
                ""
            ).toLowerCase();

          const userId =
            String(
              wallet.userId ||
                ""
            ).toLowerCase();

          const walletId =
            String(
              wallet.id ||
                ""
            ).toLowerCase();

          const balance =
            String(
              wallet.balance ||
                0
            ).toLowerCase();

          return (
            name.includes(
              searchValue
            ) ||
            mobile.includes(
              searchValue
            ) ||
            email.includes(
              searchValue
            ) ||
            userId.includes(
              searchValue
            ) ||
            walletId.includes(
              searchValue
            ) ||
            balance.includes(
              searchValue
            )
          );
        }
      );
    }, [
      wallets,
      search,
    ]);

  /* =========================
     UI
  ========================= */

  return (
    <main className="admin-wallets-page">

      {/* HEADER */}

      <header className="admin-wallets-header">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <ArrowLeft
            size={21}
          />
        </button>

        <div>

          <h1>
            Customer Wallets
          </h1>

          <p>
            Manage customer wallet
            accounts
          </p>

        </div>

        <span>
          <WalletCards
            size={20}
          />
        </span>

      </header>

      {/* HERO */}

      <section className="admin-wallets-hero">

        <div>

          <span>
            TOTAL WALLET BALANCE
          </span>

          <h2>
            ₹
            {Number(
              summary.totalWalletBalance
            ).toLocaleString(
              "en-IN"
            )}
          </h2>

          <p>
            Combined balance of all
            customer wallets
          </p>

        </div>

        <div className="admin-wallets-hero-icon">

          <WalletCards
            size={31}
          />

        </div>

      </section>

      {/* STATS */}

      <section className="admin-wallets-stats">

        <article>

          <div>
            <Users
              size={20}
            />
          </div>

          <span>
            Total Wallets
          </span>

          <strong>
            {
              summary.totalWallets
            }
          </strong>

        </article>

        <article>

          <div>
            <WalletCards
              size={20}
            />
          </div>

          <span>
            Active Wallets
          </span>

          <strong>
            {
              summary.activeWallets
            }
          </strong>

        </article>

      </section>

      {/* SEARCH */}

      <section className="admin-wallets-tools">

        <div className="admin-wallets-search">

          <Search
            size={17}
          />

          <input
            type="text"
            value={search}
            onChange={(
              event
            ) =>
              setSearch(
                event.target
                  .value
              )
            }
            placeholder="Search customer, mobile or ID..."
          />

        </div>

      </section>

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

      {/* CUSTOMER WALLETS */}

      <section className="admin-wallets-card">

        <div className="admin-wallets-title">

          <div>

            <h2>
              Customer Wallets
            </h2>

            <p>
              {
                filteredWallets.length
              }{" "}
              wallets found
            </p>

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="admin-wallets-empty">

            <WalletCards
              size={37}
            />

            <strong>
              Loading Wallets...
            </strong>

            <span>
              Please wait.
            </span>

          </div>

        ) : filteredWallets.length ===
          0 ? (

          /* EMPTY */

          <div className="admin-wallets-empty">

            <WalletCards
              size={37}
            />

            <strong>
              No Wallets Found
            </strong>

            <span>
              Customer wallets will
              appear here.
            </span>

          </div>

        ) : (

          /* LIST */

          <div className="admin-wallets-list">

            {filteredWallets.map(
              (wallet) => (

                <button
                  type="button"
                  className="admin-wallet-item"
                  key={
                    wallet.id
                  }
                  onClick={() =>
                    navigate(
                      `/admin/wallets/${wallet.userId}`
                    )
                  }
                >

                  {/* AVATAR */}

                  <div className="admin-wallet-avatar">

                    <UserRound
                      size={20}
                    />

                  </div>

                  {/* USER */}

                  <div className="admin-wallet-info">

                    <strong>
                      {wallet.user
                        ?.name ||
                        "Unknown Customer"}
                    </strong>

                    <span>
                      {wallet.user
                        ?.mobile ||
                        "Mobile not available"}
                    </span>

                    {wallet.user
                      ?.email && (

                      <small>
                        {
                          wallet.user
                            .email
                        }
                      </small>

                    )}

                    <small>
                      User #
                      {
                        wallet.userId
                      }
                    </small>

                    <small>
                      {
                        wallet.transactionCount
                      }{" "}
                      Transactions
                    </small>

                  </div>

                  {/* BALANCE */}

                  <div className="admin-wallet-right">

                    <span>
                      Balance
                    </span>

                    <strong>
                      ₹
                      {Number(
                        wallet.balance
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <ChevronRight
                      size={17}
                    />

                  </div>

                </button>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminWallets;