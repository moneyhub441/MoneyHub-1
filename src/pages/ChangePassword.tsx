import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/ChangePassword.css";

type ChangePasswordResponse = {
  success: boolean;
  message?: string;
};

type CurrentUser = {
  id?: string;
  name?: string;
  mobile?: string;
  email?: string;
};

function ChangePassword() {
  const navigate = useNavigate();

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrent,
    setShowCurrent,
  ] = useState(false);

  const [
    showNew,
    setShowNew,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  /* =========================
     API URL
  ========================= */

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

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

        return saved
          ? JSON.parse(saved)
          : null;
      } catch {
        return null;
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

    if (loading) {
      return;
    }

    setError("");
    setSuccess(false);

    /* =========================
       VALIDATION
    ========================= */

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill all password fields."
      );

      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );

      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      setError(
        "New password must be different from current password."
      );

      return;
    }

    /* =========================
       USER
    ========================= */

    const currentUser =
      getCurrentUser();

    if (!currentUser?.id) {
      localStorage.removeItem(
        "currentUser"
      );

      localStorage.removeItem(
        "userLoggedIn"
      );

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

      /* =========================
         BACKEND API
      ========================= */

      const response =
        await fetch(
          `${API_URL}/api/auth/change-password/${currentUser.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          }
        );

      const data:
        ChangePasswordResponse =
        await response.json();

      /* =========================
         API ERROR
      ========================= */

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to change password."
        );

        return;
      }

      /* =========================
         SUCCESS
      ========================= */

      setSuccess(true);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);

      window.setTimeout(
        () => {
          setSuccess(false);
        },
        2500
      );
    } catch (error) {
      console.error(
        "Change password API error:",
        error
      );

      setError(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="change-password-page">

      {/* HEADER */}

      <header className="change-password-header">

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
            Change Password
          </h1>

          <p>
            Update your account password
          </p>

        </div>

        <span>
          <ShieldCheck size={20} />
        </span>

      </header>

      {/* SECURITY */}

      <section className="password-security-card">

        <div>
          <LockKeyhole size={27} />
        </div>

        <h2>
          Account Security
        </h2>

        <p>
          Create a strong password to
          keep your account secure.
        </p>

      </section>

      {/* FORM */}

      <form
        className="change-password-form"
        onSubmit={handleSubmit}
      >

        <div className="password-form-title">

          <h2>
            Update Password
          </h2>

          <p>
            Enter your current and new
            password
          </p>

        </div>

        <PasswordField
          label="Current Password"
          placeholder="Enter current password"
          value={currentPassword}
          setValue={setCurrentPassword}
          show={showCurrent}
          setShow={setShowCurrent}
          disabled={loading}
          autoComplete="current-password"
        />

        <PasswordField
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          setValue={setNewPassword}
          show={showNew}
          setShow={setShowNew}
          disabled={loading}
          autoComplete="new-password"
        />

        <PasswordField
          label="Confirm New Password"
          placeholder="Enter new password again"
          value={confirmPassword}
          setValue={setConfirmPassword}
          show={showConfirm}
          setShow={setShowConfirm}
          disabled={loading}
          autoComplete="new-password"
        />

        {/* ERROR */}

        {error && (
          <div className="password-error">
            {error}
          </div>
        )}

        {/* SAVE */}

        <button
          type="submit"
          className="password-save-button"
          disabled={loading}
        >

          <Save size={17} />

          {loading
            ? "Updating..."
            : "Update Password"}

        </button>

      </form>

      {/* TIPS */}

      <section className="password-tips">

        <h3>
          Password Tips
        </h3>

        <div>
          <CheckCircle2 size={15} />

          <span>
            Use at least 6 characters
          </span>
        </div>

        <div>
          <CheckCircle2 size={15} />

          <span>
            Use letters and numbers
          </span>
        </div>

        <div>
          <CheckCircle2 size={15} />

          <span>
            Do not share your password
          </span>
        </div>

      </section>

      {/* SUCCESS */}

      {success && (
        <div className="password-success">

          <CheckCircle2 size={21} />

          <div>

            <strong>
              Password Updated
            </strong>

            <span>
              Your password has been
              changed successfully.
            </span>

          </div>

        </div>
      )}

    </main>
  );
}

/* =========================
   PASSWORD FIELD
========================= */

type PasswordFieldProps = {
  label: string;
  placeholder: string;
  value: string;

  setValue:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  show: boolean;

  setShow:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;

  disabled?: boolean;

  autoComplete?:
    "current-password" |
    "new-password";
};

function PasswordField({
  label,
  placeholder,
  value,
  setValue,
  show,
  setShow,
  disabled = false,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <div className="password-field">

      <label>
        {label}
      </label>

      <div className="password-input-box">

        <LockKeyhole size={18} />

        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
          placeholder={placeholder}
          autoComplete={
            autoComplete
          }
          disabled={disabled}
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            setShow(
              (value) =>
                !value
            )
          }
        >

          {show ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}

        </button>

      </div>

    </div>
  );
}

export default ChangePassword;