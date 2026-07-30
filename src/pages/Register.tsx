import {
  Eye,
  EyeOff,
  Gift,
  LockKeyhole,
  Smartphone,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "../css/Register.css";

/* =========================
   TYPES
========================= */

type RegisteredUser = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  inviteCode?: string;
  walletBalance?: number;
};

type RegisterResponse = {
  success: boolean;
  message?: string;
  user?: RegisteredUser;
};

/* =========================
   REGISTER
========================= */

function Register() {
  const navigate =
    useNavigate();

  /* =========================
     STATES
  ========================= */

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [name, setName] =
    useState("");

  const [mobile, setMobile] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    referralCode,
    setReferralCode,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     API URL
  ========================= */

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  /* =========================
     GET REFERRAL FROM URL

     Example:
     /register?ref=MH12345
  ========================= */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const ref =
      params.get("ref");

    if (ref) {
      setReferralCode(
        ref
          .trim()
          .toUpperCase()
      );
    }
  }, []);

  /* =========================
     MOBILE CHANGE
  ========================= */

  const handleMobileChange = (
    event:
      React.ChangeEvent<HTMLInputElement>
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
     REGISTER
  ========================= */

  const handleRegister = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    /* NAME */

    if (!name.trim()) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    /* MOBILE */

    if (mobile.length !== 10) {
      setError(
        "Please enter a valid 10 digit mobile number."
      );

      return;
    }

    /* PASSWORD */

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      /* =========================
         REGISTER API
      ========================= */

      const response =
        await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                name.trim(),

              mobile,

              password,

              referralCode:
                referralCode
                  .trim()
                  .toUpperCase(),
            }),
          }
        );

      const data:
        RegisterResponse =
        await response.json();

      /* =========================
         ERROR
      ========================= */

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to create account."
        );

        return;
      }

      if (!data.user) {
        setError(
          "User data was not received from server."
        );

        return;
      }

      /* =========================
         CURRENT USER
      ========================= */

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id:
            String(
              data.user.id
            ),

          name:
            data.user.name,

          mobile:
            data.user.mobile,

          email:
            data.user.email ||
            "",

          inviteCode:
            data.user
              .inviteCode ||
            "",

          walletBalance:
            Number(
              data.user
                .walletBalance ||
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
         GO HOME
      ========================= */

      navigate(
        "/home",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Register API error:",
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
    <main className="register-page">

      {/* HERO */}

      <section className="register-hero">

        <div className="register-main-logo">
          <span>₹</span>
        </div>

        <h1>
          MONEY HUB
        </h1>

        <p>
          SMART PRODUCTS • BETTER REWARDS
        </p>

      </section>

      {/* REGISTER CARD */}

      <section className="register-card">

        <div className="register-heading">

          <div>

            <h2>
              Create Your{" "}
              <span>
                Account
              </span>
            </h2>

            <p>
              Join Money Hub & create
              your account
            </p>

          </div>

          <div className="register-small-logo">
            ₹
          </div>

        </div>

        {/* FORM */}

        <form
          onSubmit={
            handleRegister
          }
        >

          {/* FULL NAME */}

          <div className="register-field">

            <div className="register-field-icon">
              <UserRound
                size={20}
              />
            </div>

            <div className="register-field-content">

              <label>
                Full Name
              </label>

              <input
                type="text"
                value={name}
                disabled={loading}
                onChange={(event) => {
                  setName(
                    event.target.value
                  );

                  setError("");
                }}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

            </div>

          </div>

          {/* MOBILE */}

          <div className="register-field">

            <div className="register-field-icon">
              <Smartphone
                size={20}
              />
            </div>

            <div className="register-field-content">

              <label>
                Mobile Number
              </label>

              <input
                type="tel"
                inputMode="numeric"
                value={mobile}
                disabled={loading}
                onChange={
                  handleMobileChange
                }
                placeholder="Enter 10 digit mobile number"
                autoComplete="tel"
                maxLength={10}
                required
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="register-field">

            <div className="register-field-icon">
              <LockKeyhole
                size={20}
              />
            </div>

            <div className="register-field-content">

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
                placeholder="Create a strong password"
                autoComplete="new-password"
                minLength={6}
                required
              />

            </div>

            <button
              type="button"
              className="register-eye"
              disabled={loading}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              onClick={() =>
                setShowPassword(
                  (value) =>
                    !value
                )
              }
            >

              {showPassword ? (
                <EyeOff
                  size={19}
                />
              ) : (
                <Eye
                  size={19}
                />
              )}

            </button>

          </div>

          {/* REFERRAL */}

          <div className="register-field">

            <div className="register-field-icon">
              <Gift
                size={20}
              />
            </div>

            <div className="register-field-content">

              <label>
                Referral Code
                (Optional)
              </label>

              <input
                type="text"
                value={
                  referralCode
                }
                disabled={loading}
                onChange={(event) => {
                  setReferralCode(
                    event.target.value
                      .toUpperCase()
                  );

                  setError("");
                }}
                placeholder="Enter referral code"
                autoCapitalize="characters"
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

            {!loading && (
              <span>
                →
              </span>
            )}

          </button>

        </form>

        {/* LOGIN */}

        <button
          type="button"
          className="register-login-button"
          disabled={loading}
          onClick={() =>
            navigate(
              "/login"
            )
          }
        >

          <span>
            Already registered?

            <strong>
              {" "}Login
            </strong>
          </span>

          <b>
            →
          </b>

        </button>

      </section>

    </main>
  );
}

export default Register;