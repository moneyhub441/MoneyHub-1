import {
  Check,
  Copy,
  Gift,
  Link2,
  MessageCircle,
  Share2,
  UserPlus,
  Users,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import BottomNav from "../components/BottomNav";

import "../css/Promotion.css";

/* =========================
   TYPES
========================= */

type CurrentUser = {
  id: string;
  name?: string;
  mobile?: string;
  email?: string;
  inviteCode?: string;
};

type ReferralUser = {
  id: string;
  name: string;
  mobile?: string;
  status?: string;
  createdAt?: string;
};

type ReferralResponse = {
  success: boolean;
  message?: string;

  inviteCode?: string;

  totalInvites?: number;
  joined?: number;

  referrals?: ReferralUser[];
};

/* =========================
   CURRENT USER
========================= */

const getCurrentUser =
  (): CurrentUser | null => {
    try {
      const saved =
        localStorage.getItem(
          "currentUser"
        );

      if (!saved) {
        return null;
      }

      const parsed =
        JSON.parse(saved);

      if (
        !parsed ||
        !parsed.id
      ) {
        return null;
      }

      return {
        ...parsed,

        // IMPORTANT:
        // MongoDB id string hoti hai
        id: String(parsed.id),
      };
    } catch {
      return null;
    }
  };

/* =========================
   DATE
========================= */

const formatDate = (
  value?: string
) => {
  if (!value) {
    return "Joined";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Joined";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/* =========================
   COMPONENT
========================= */

function Promotion() {
  const navigate =
    useNavigate();

  const [copied, setCopied] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [inviteCode, setInviteCode] =
    useState("");

  const [
    inviteHistory,
    setInviteHistory,
  ] = useState<ReferralUser[]>([]);

  const [
    totalInvites,
    setTotalInvites,
  ] = useState(0);

  const [joined, setJoined] =
    useState(0);

  /* =========================
     API
  ========================= */

  const API_URL =
    import.meta.env
      .VITE_API_URL ||
    "http://localhost:5000";

  /* =========================
     CURRENT USER
  ========================= */

  const currentUser =
    getCurrentUser();

  const currentUserId =
    currentUser?.id
      ? String(currentUser.id)
      : "";

  /* =========================
     LOAD REFERRAL DATA
  ========================= */

  useEffect(() => {
    const loadReferralData =
      async () => {
        if (!currentUserId) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/auth/referrals/${currentUserId}`
            );

          const data: ReferralResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Unable to load promotion data"
            );
          }

          setInviteCode(
            data.inviteCode ||
              currentUser?.inviteCode ||
              ""
          );

          setTotalInvites(
            Number(
              data.totalInvites ||
                0
            )
          );

          setJoined(
            Number(
              data.joined || 0
            )
          );

          setInviteHistory(
            Array.isArray(
              data.referrals
            )
              ? data.referrals
              : []
          );
        } catch (error) {
          console.error(
            "Promotion load error:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load promotion data"
          );
        } finally {
          setLoading(false);
        }
      };

    loadReferralData();
  }, [
    API_URL,
    currentUserId,
  ]);

  /* =========================
     INVITE LINK
  ========================= */

  const inviteLink =
    inviteCode
      ? `${window.location.origin}/register?ref=${encodeURIComponent(
          inviteCode
        )}`
      : "";

  /* =========================
     COPY
  ========================= */

  const handleCopy =
    async () => {
      if (!inviteLink) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          inviteLink
        );

        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(false);
          },
          2000
        );
      } catch (error) {
        console.error(
          "Copy failed:",
          error
        );
      }
    };

  /* =========================
     SHARE
  ========================= */

  const handleShare =
    async () => {
      if (
        !inviteCode ||
        !inviteLink
      ) {
        return;
      }

      const shareText =
        `Join Money Hub using my referral code ${inviteCode}`;

      try {
        if (
          navigator.share
        ) {
          await navigator.share({
            title:
              "Join Money Hub",

            text:
              shareText,

            url:
              inviteLink,
          });

          return;
        }

        await navigator.clipboard.writeText(
          inviteLink
        );

        setCopied(true);

        window.setTimeout(
          () => {
            setCopied(false);
          },
          2000
        );
      } catch (error) {
        console.error(
          "Share failed:",
          error
        );
      }
    };

  /* =========================
     WHATSAPP
  ========================= */

  const handleWhatsApp =
    () => {
      if (
        !inviteCode ||
        !inviteLink
      ) {
        return;
      }

      const message =
        `Join Money Hub\n\n` +
        `Use my referral code: ${inviteCode}\n\n` +
        `Register here:\n${inviteLink}`;

      const encoded =
        encodeURIComponent(
          message
        );

      window.open(
        `https://wa.me/?text=${encoded}`,
        "_blank",
        "noopener,noreferrer"
      );
    };

  /* =========================
     NOT LOGGED IN
  ========================= */

  if (!currentUserId) {
    return (
      <main className="promotion-page">

        <section
          className="promotion-card"
          style={{
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <Gift size={35} />

          <h2>
            Login Required
          </h2>

          <p>
            Please login to access
            your referral link.
          </p>

          <button
            type="button"
            className="promotion-main-share"
            style={{
              marginTop: "20px",
            }}
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </section>

        <BottomNav />

      </main>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <main className="promotion-page">

      {/* HEADER */}

      <header className="promotion-header">

        <div>
          <h1>
            Promotion
          </h1>

          <p>
            Invite friends and grow
            your community
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleShare
          }
          disabled={
            !inviteCode ||
            loading
          }
        >
          <Share2 size={20} />
        </button>

      </header>

      {/* HERO */}

      <section className="promotion-hero">

        <div
          className="
            promotion-circle
            promotion-circle-one
          "
        />

        <div
          className="
            promotion-circle
            promotion-circle-two
          "
        />

        <div className="promotion-hero-icon">
          <Gift size={31} />
        </div>

        <h2>
          Invite Your Friends
        </h2>

        <p>
          Share your personal
          invitation link with
          friends and grow your
          Money Hub community.
        </p>

        <div className="promotion-code">

          <span>
            Your Invite Code
          </span>

          <strong>
            {loading
              ? "Loading..."
              : inviteCode ||
                "Unavailable"}
          </strong>

        </div>

      </section>

      {/* ERROR */}

      {error && (
        <section
          className="promotion-card"
          style={{
            color: "#b91c1c",
            textAlign: "center",
          }}
        >
          {error}
        </section>
      )}

      {/* STATS */}

      <section className="promotion-stats">

        <div>

          <span className="promotion-stat-icon">
            <Users size={20} />
          </span>

          <div>

            <strong>
              {totalInvites}
            </strong>

            <span>
              Total Invites
            </span>

          </div>

        </div>

        <div>

          <span className="promotion-stat-icon">
            <UserPlus size={20} />
          </span>

          <div>

            <strong>
              {joined}
            </strong>

            <span>
              Joined
            </span>

          </div>

        </div>

      </section>

      {/* INVITE LINK */}

      <section className="promotion-card">

        <div className="promotion-card-heading">

          <div className="promotion-heading-icon">
            <Link2 size={19} />
          </div>

          <div>

            <h2>
              Your Invite Link
            </h2>

            <p>
              Share this link
              with your friends
            </p>

          </div>

        </div>

        <div className="promotion-link-box">

          <span>
            {loading
              ? "Loading..."
              : inviteLink ||
                "Invite link unavailable"}
          </span>

          <button
            type="button"
            onClick={
              handleCopy
            }
            disabled={
              !inviteLink ||
              loading
            }
          >
            {copied ? (
              <Check size={18} />
            ) : (
              <Copy size={18} />
            )}
          </button>

        </div>

        <div className="promotion-share-buttons">

          <button
            type="button"
            className="promotion-main-share"
            onClick={
              handleShare
            }
            disabled={
              !inviteLink ||
              loading
            }
          >
            <Share2 size={17} />

            Share Invite
          </button>

          <button
            type="button"
            className="promotion-whatsapp"
            onClick={
              handleWhatsApp
            }
            disabled={
              !inviteLink ||
              loading
            }
          >
            <MessageCircle
              size={18}
            />
          </button>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="promotion-card">

        <div className="promotion-section-title">

          <h2>
            How It Works
          </h2>

          <p>
            Invite your friends
            in three easy steps
          </p>

        </div>

        <div className="promotion-steps">

          <div className="promotion-step">

            <span>1</span>

            <div>

              <strong>
                Share Link
              </strong>

              <p>
                Send your
                invitation link
                to your friends.
              </p>

            </div>

          </div>

          <div className="promotion-step">

            <span>2</span>

            <div>

              <strong>
                Friend Registers
              </strong>

              <p>
                Your friend
                registers through
                your referral
                link.
              </p>

            </div>

          </div>

          <div className="promotion-step">

            <span>3</span>

            <div>

              <strong>
                Track Invitations
              </strong>

              <p>
                Registered users
                automatically
                appear in your
                invite history.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* INVITE HISTORY */}

      <section className="promotion-card">

        <div className="promotion-section-title">

          <h2>
            Invite History
          </h2>

          <p>
            Members who joined
            using your link
          </p>

        </div>

        {loading ? (

          <div
            style={{
              padding: "30px 10px",
              textAlign: "center",
              color: "#999",
            }}
          >
            Loading invitations...
          </div>

        ) : inviteHistory.length ===
          0 ? (

          <div
            style={{
              padding:
                "30px 10px",

              textAlign:
                "center",

              color:
                "#999",

              fontSize:
                "9px",
            }}
          >

            <UserPlus size={30} />

            <p>
              No invited members
              yet.
            </p>

          </div>

        ) : (

          <div className="promotion-history">

            {inviteHistory.map(
              (invite) => (

                <div
                  className="promotion-history-item"
                  key={
                    invite.id
                  }
                >

                  <div className="promotion-history-avatar">

                    <UserPlus
                      size={18}
                    />

                  </div>

                  <div className="promotion-history-info">

                    <strong>
                      {invite.name}
                    </strong>

                    <span>
                      {formatDate(
                        invite.createdAt
                      )}
                    </span>

                  </div>

                  <b>
                    Joined
                  </b>

                </div>

              )
            )}

          </div>

        )}

      </section>

      {/* COPY SUCCESS */}

      {copied && (

        <div className="promotion-toast">

          <Check size={19} />

          <div>

            <strong>
              Link Copied
            </strong>

            <span>
              Invitation link
              copied successfully.
            </span>

          </div>

        </div>

      )}

      <BottomNav />

    </main>
  );
}

export default Promotion;