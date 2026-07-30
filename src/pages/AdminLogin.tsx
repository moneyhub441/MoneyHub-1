import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("Please enter admin username.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter admin password.");
      return;
    }

    /*
      DEVELOPMENT ONLY

      Ye real authentication nahi hai.
      Backend banne ke baad username/password
      server par verify hoga.
    */

    if (
      username === "admin" &&
      password === "admin123"
    ) {
      sessionStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      navigate("/admin/dashboard");
      return;
    }

    setError("Invalid admin username or password.");
  };

  return (
    <main className="admin-login-page">

      <section className="admin-login-container">

        {/* LOGO */}

        <div className="admin-login-logo">
          <div>
            <ShieldCheck size={34} />
          </div>

          <h1>MONEY HUB</h1>
          <span>ADMIN PANEL</span>
        </div>

        {/* CARD */}

        <form
          className="admin-login-card"
          onSubmit={handleSubmit}
        >
          <div className="admin-login-title">
            <h2>Admin Login</h2>

            <p>
              Sign in to manage your application
            </p>
          </div>

          {/* USERNAME */}

          <label className="admin-login-field">
            <span>Username</span>

            <div>
              <UserRound size={18} />

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>
          </label>

          {/* PASSWORD */}

          <label className="admin-login-field">
            <span>Password</span>

            <div>
              <LockKeyhole size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </label>

          {/* ERROR */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            className="admin-login-submit"
          >
            <ShieldCheck size={18} />
            Login to Admin
          </button>

        </form>

        <p className="admin-login-security">
          Protected administration area
        </p>

      </section>

    </main>
  );
}

export default AdminLogin;