import {
  ChevronRight,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import BottomNav from "../components/BottomNav";
import "../css/Profile.css";

/* =========================
   CURRENT USER TYPE
========================= */

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
  email?: string;
  inviteCode?: string;
  walletBalance?: number;
};

/* =========================
   GET CURRENT USER
========================= */

const getCurrentUser = (): CurrentUser | null => {
  try {
    const savedUser =
      localStorage.getItem("currentUser");

    if (!savedUser) {
      return null;
    }

    const parsed =
      JSON.parse(savedUser);

    return parsed;
  } catch (error) {
    console.error(
      "Current user read error:",
      error
    );

    return null;
  }
};

/* =========================
   PROFILE
========================= */

function Profile() {
  const navigate = useNavigate();

  /* =========================
     USER DATA
  ========================= */

  const currentUser =
    getCurrentUser();

  const userName =
    currentUser?.name?.trim() ||
    "Welcome User";

  const userMobile =
    currentUser?.mobile?.trim() ||
    "";

  const userEmail =
    currentUser?.email?.trim() ||
    "";

  const inviteCode =
    currentUser?.inviteCode ||
    "";

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    /*
      Current logged-in session remove.
      MongoDB user delete nahi hoga.
    */

    localStorage.removeItem(
      "currentUser"
    );

    localStorage.removeItem(
      "userLoggedIn"
    );

    /*
      Purani keys bhi clean kar dete hain.
    */

    localStorage.removeItem(
      "isLoggedIn"
    );

    localStorage.removeItem(
      "userProfile"
    );

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  };

  /* =========================
     UI
  ========================= */

  return (
    <main className="profile-page">

      {/* HEADER */}

      <section className="profile-header">

        <h1>
          My Profile
        </h1>

        <p>
          Manage your account
        </p>

      </section>

      {/* USER CARD */}

      <section className="profile-user-card">

        <div className="profile-avatar">

          <UserRound
            size={35}
          />

        </div>

        {/* REGISTERED NAME */}

        <h2>
          {userName}
        </h2>

        {/* MOBILE / EMAIL */}

        <p>
          {userMobile
            ? `+91 ${userMobile}`
            : userEmail ||
              "Member Account"}
        </p>

        {/* STATUS */}

        <span>

          <ShieldCheck
            size={14}
          />

          Active Member

        </span>

        {/* INVITE CODE */}

        {inviteCode && (
          <small
            style={{
              display: "block",
              marginTop: "8px",
            }}
          >
            Invite Code:{" "}
            <strong>
              {inviteCode}
            </strong>
          </small>
        )}

      </section>

      {/* MENU */}

      <section className="profile-menu">

        {/* MY PRODUCTS */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/my-products"
            )
          }
        >

          <div className="profile-menu-icon">

            <Package
              size={20}
            />

          </div>

          <div className="profile-menu-text">

            <strong>
              My Products
            </strong>

            <span>
              View your purchased
              products
            </span>

          </div>

          <ChevronRight
            size={19}
          />

        </button>

        {/* PERSONAL INFORMATION */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/edit-profile"
            )
          }
        >

          <div className="profile-menu-icon">

            <UserRound
              size={20}
            />

          </div>

          <div className="profile-menu-text">

            <strong>
              Personal Information
            </strong>

            <span>
              Manage your account
              details
            </span>

          </div>

          <ChevronRight
            size={19}
          />

        </button>

        {/* SETTINGS */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/settings"
            )
          }
        >

          <div className="profile-menu-icon">

            <Settings
              size={20}
            />

          </div>

          <div className="profile-menu-text">

            <strong>
              Settings
            </strong>

            <span>
              Account preferences
            </span>

          </div>

          <ChevronRight
            size={19}
          />

        </button>

      </section>

      {/* LOGOUT */}

      <button
        type="button"
        className="profile-logout"
        onClick={
          handleLogout
        }
      >

        <LogOut
          size={18}
        />

        Logout

      </button>

      <BottomNav />

    </main>
  );
}

export default Profile;