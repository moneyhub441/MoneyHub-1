import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

import "../css/Login.css";

/* =========================
   TYPES
========================= */

type LoginUser = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  inviteCode?: string;
  walletBalance?: number;
};

type LoginResponse = {
  success: boolean;
  message?: string;
  user?: LoginUser;
};

/* =========================
   COMPONENT
========================= */

function Login() {
  const navigate = useNavigate();

  /* =========================
     STATES
  ========================= */

  const [showPassword, setShowPassword] =
    useState(false);

  const [mobile, setMobile] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     API URL
  ========================= */



  /* =========================
     MOBILE CHANGE
  ========================= */

  const handleMobileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value.replace(
        /\D/g,
        ""
      );

    if (value.length <= 10) {
      setMobile(value);
      setError("");
    }
  };

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    /* MOBILE VALIDATION */

    if (mobile.length !== 10) {
      setError(
        "Please enter a valid 10 digit mobile number."
      );

      return;
    }

    /* PASSWORD VALIDATION */

    if (!password.trim()) {
      setError(
        "Please enter your password."
      );

      return;
    }

    try {
      setLoading(true);

      /* =========================
         LOGIN API
      ========================= */

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            mobile,
            password,
          }),
        }
      );

      const data: LoginResponse =
        await response.json();

      /* =========================
         LOGIN FAILED
      ========================= */

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to login."
        );

        return;
      }

      if (!data.user) {
        setError(
          "User information was not received."
        );

        return;
      }

      /* =========================
         SAVE CURRENT USER

         Temporary frontend session.
         Password is NOT stored.
      ========================= */

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: data.user.id,

          name: data.user.name,

          mobile: data.user.mobile,

          email:
            data.user.email || "",

          inviteCode:
            data.user.inviteCode || "",

          walletBalance:
            Number(
              data.user.walletBalance ||
                0
            ),
        })
      );

      /* =========================
         LOGIN STATUS
      ========================= */

      localStorage.setItem(
        "userLoggedIn",
        "true"
      );

      /* =========================
         HOME
      ========================= */

      navigate(
        "/home",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Login API error:",
        error
      );

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <main className="login-page">

      {/* =====================
          HERO
      ===================== */}

      <section className="login-hero">

        <div className="login-main-logo">
          <span>₹</span>
        </div>

        <h1>
          MONEY HUB
        </h1>

        <p>
          SMART PRODUCTS • BETTER REWARDS
        </p>

      </section>

      {/* =====================
          LOGIN CARD
      ===================== */}

      <section className="login-card">

        <div className="login-heading">

          <div>

            <h2>
              Welcome{" "}
              <span>
                Back
              </span>
            </h2>

            <p>
              Login to your Money Hub
              account
            </p>

          </div>

          <div className="login-small-logo">
            ₹
          </div>

        </div>

        {/* =====================
            FORM
        ===================== */}

        <form
          onSubmit={handleLogin}
        >

          {/* MOBILE */}

          <div className="login-field">

            <div className="login-field-icon">
              <UserRound size={20} />
            </div>

            <div className="login-field-content">

              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                disabled={loading}
                onChange={
                  handleMobileChange
                }
                placeholder="Enter 10 digit mobile number"
                autoComplete="tel"
                required
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <div className="login-field-icon">
              <LockKeyhole
                size={20}
              />
            </div>

            <div className="login-field-content">

              <label>
                Password
              </label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                disabled={loading}
                onChange={(event) => {
                  setPassword(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>

            <button
              type="button"
              className="login-eye"
              disabled={loading}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
            >

              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}

            </button>

          </div>

          {/* =================
              FORGOT PASSWORD
          ================= */}

          <button
            type="button"
            className="login-forgot"
            disabled={loading}
            onClick={() => {
              /*
                Forgot password page/API
                next phase me connect hogi.
              */

              setError(
                "Forgot password service will be available soon."
              );
            }}
          >
            Forgot Password?
          </button>

          {/* =================
              ERROR
          ================= */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* =================
              LOGIN
          ================= */}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >

            {loading
              ? "Logging In..."
              : "Login"}

            {!loading && (
              <span>
                →
              </span>
            )}

          </button>

        </form>

        {/* =====================
            DIVIDER
        ===================== */}

        <div className="login-divider">

          <i />

          <span>
            OR
          </span>

          <i />

        </div>

        {/* =====================
            REGISTER
        ===================== */}

        <button
          type="button"
          className="login-register-button"
          disabled={loading}
          onClick={() =>
            navigate("/register")
          }
        >

          <span>

            <UserRound size={17} />

            Create New Account

          </span>

          <b>
            →
          </b>

        </button>

      </section>

    </main>
  );
}

export default Login;