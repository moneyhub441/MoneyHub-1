import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";
import API_URL from "../config/api";
import "../css/ChangeMobile.css";

/* =========================
   TYPES
========================= */

type CurrentUser = {
  id: string;
  name?: string;
  mobile?: string;
  email?: string;
  inviteCode?: string;
  walletBalance?: number;
};

type ChangeMobileResponse = {
  success: boolean;
  message?: string;

  user?: {
    id: string;
    name: string;
    mobile: string;
    email?: string;
    inviteCode?: string;
    walletBalance?: number;
    status?: string;
  };
};

/* =========================
   COMPONENT
========================= */

function ChangeMobile() {
  const navigate =
    useNavigate();

  const [mobile, setMobile] =
    useState("");

  const [
    currentMobile,
    setCurrentMobile,
  ] = useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /* =========================
     API
  ========================= */



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

        return JSON.parse(saved);
      } catch {
        return null;
      }
    };

  /* =========================
     LOAD CURRENT MOBILE
  ========================= */

  useEffect(() => {
    const loadUser =
      async () => {
        const currentUser =
          getCurrentUser();

        if (!currentUser?.id) {
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

          const response =
            await fetch(
              `${API_URL}/api/auth/profile/${currentUser.id}`
            );

          const data =
            await response.json();

          if (
            !response.ok ||
            !data.success ||
            !data.user
          ) {
            throw new Error(
              data.message ||
                "Unable to load mobile number"
            );
          }

          const savedMobile =
            String(
              data.user.mobile ||
                ""
            );

          setMobile(
            savedMobile
          );

          setCurrentMobile(
            savedMobile
          );
        } catch (error) {
          console.error(
            "Load mobile error:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load mobile number"
          );
        } finally {
          setLoading(false);
        }
      };

    loadUser();
  }, [
    API_URL,
    navigate,
  ]);

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
      setSuccess(false);
    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setError("");
    setSuccess(false);

    /* VALIDATION */

    if (!mobile) {
      setError(
        "Please enter your mobile number."
      );

      return;
    }

    if (mobile.length !== 10) {
      setError(
        "Please enter a valid 10 digit mobile number."
      );

      return;
    }

    if (
      mobile === currentMobile
    ) {
      setError(
        "Please enter a different mobile number."
      );

      return;
    }

    const currentUser =
      getCurrentUser();

    if (!currentUser?.id) {
      navigate(
        "/login",
        {
          replace: true,
        }
      );

      return;
    }

    try {
      setSaving(true);

      /* =========================
         UPDATE MONGODB
      ========================= */

      const response =
        await fetch(
          `${API_URL}/api/auth/change-mobile/${currentUser.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              mobile,
            }),
          }
        );

      const data:
        ChangeMobileResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.user
      ) {
        setError(
          data.message ||
            "Unable to update mobile number."
        );

        return;
      }

      /* =========================
         SYNC CURRENT USER
      ========================= */

      const updatedUser = {
        ...currentUser,

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
          data.user.inviteCode ||
          currentUser.inviteCode ||
          "",

        walletBalance:
          Number(
            data.user.walletBalance ||
              0
          ),
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(
          updatedUser
        )
      );

      /* =========================
         UPDATE SCREEN
      ========================= */

      setMobile(
        data.user.mobile
      );

      setCurrentMobile(
        data.user.mobile
      );

      setSuccess(true);

      window.setTimeout(
        () => {
          setSuccess(false);
        },
        2500
      );
    } catch (error) {
      console.error(
        "Change mobile API error:",
        error
      );

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <main className="change-mobile-page">

      {/* HEADER */}

      <header className="change-mobile-header">

        <button
          type="button"
          onClick={() =>
            navigate("/settings")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>

          <h1>
            Mobile Number
          </h1>

          <p>
            Manage registered mobile
          </p>

        </div>

        <span>
          <Smartphone size={20} />
        </span>

      </header>

      {/* HERO */}

      <section className="change-mobile-hero">

        <div className="change-mobile-hero-icon">

          <Phone size={28} />

        </div>

        <h2>
          Update Mobile Number
        </h2>

        <p>
          Keep your registered mobile
          number up to date.
        </p>

      </section>

      {/* FORM */}

      <form
        className="change-mobile-form"
        onSubmit={handleSubmit}
      >

        <div className="change-mobile-title">

          <h2>
            Registered Mobile
          </h2>

          <p>
            Enter your 10 digit
            mobile number
          </p>

        </div>

        <label className="change-mobile-label">
          Mobile Number
        </label>

        <div className="change-mobile-input">

          <div className="mobile-country-code">
            +91
          </div>

          <input
            type="tel"
            inputMode="numeric"
            value={mobile}
            onChange={
              handleMobileChange
            }
            placeholder={
              loading
                ? "Loading..."
                : "Enter mobile number"
            }
            maxLength={10}
            disabled={
              loading ||
              saving
            }
          />

          {mobile.length ===
            10 && (
            <CheckCircle2
              className="mobile-valid"
              size={19}
            />
          )}

        </div>

        <div className="mobile-counter">
          {mobile.length}/10
        </div>

        {/* ERROR */}

        {error && (
          <div className="change-mobile-error">
            {error}
          </div>
        )}

        {/* SAVE */}

        <button
          type="submit"
          className="change-mobile-save"
          disabled={
            loading ||
            saving
          }
        >

          <Save size={17} />

          {saving
            ? "Saving..."
            : "Save Mobile Number"}

        </button>

      </form>

      {/* SECURITY */}

      <section className="mobile-security">

        <ShieldCheck
          size={20}
        />

        <div>

          <strong>
            Secure Account
          </strong>

          <span>
            Your mobile number is
            used for account
            identification and
            security.
          </span>

        </div>

      </section>

      {/* SUCCESS */}

      {success && (
        <div className="change-mobile-success">

          <CheckCircle2
            size={21}
          />

          <div>

            <strong>
              Mobile Updated
            </strong>

            <span>
              Your mobile number
              has been saved.
            </span>

          </div>

        </div>
      )}

    </main>
  );
}

export default ChangeMobile;