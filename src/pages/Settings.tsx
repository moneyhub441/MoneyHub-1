import {
  ArrowLeft,
  Bell,
  ChevronRight,
  HelpCircle,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <main className="settings-page">

      {/* HEADER */}

      <header className="settings-header">
        <button
          type="button"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Settings</h1>
          <p>Manage account preferences</p>
        </div>

        <span>
          <ShieldCheck size={20} />
        </span>
      </header>

      {/* ACCOUNT */}

      <section className="settings-section">
        <div className="settings-title">
          <h2>Account Settings</h2>
          <p>Manage your account security</p>
        </div>

        <button
  type="button"
  className="settings-item"
  onClick={() => navigate("/change-password")}
>
          <div className="settings-icon">
            <LockKeyhole size={20} />
          </div>

          <div className="settings-text">
            <strong>Change Password</strong>
            <span>Update your account password</span>
          </div>

          <ChevronRight size={19} />
        </button>

       <button
  type="button"
  className="settings-item"
  onClick={() => navigate("/change-mobile")}
>
          <div className="settings-icon">
            <Smartphone size={20} />
          </div>

          <div className="settings-text">
            <strong>Mobile Number</strong>
            <span>Manage registered mobile</span>
          </div>

          <ChevronRight size={19} />
        </button>
      </section>

      {/* PREFERENCES */}

      <section className="settings-section">
        <div className="settings-title">
          <h2>Preferences</h2>
          <p>Customise your experience</p>
        </div>

        <div className="settings-item">
          <div className="settings-icon">
            <Bell size={20} />
          </div>

          <div className="settings-text">
            <strong>Notifications</strong>
            <span>Receive account notifications</span>
          </div>

          <button
            type="button"
            aria-label="Toggle notifications"
            className={`settings-switch ${
              notifications ? "active" : ""
            }`}
            onClick={() =>
              setNotifications((value) => !value)
            }
          >
            <span />
          </button>
        </div>

        <div className="settings-item">
          <div className="settings-icon">
            <Moon size={20} />
          </div>

          <div className="settings-text">
            <strong>Dark Mode</strong>
            <span>Change application appearance</span>
          </div>

          <button
            type="button"
            aria-label="Toggle dark mode"
            className={`settings-switch ${
              darkMode ? "active" : ""
            }`}
            onClick={() =>
              setDarkMode((value) => !value)
            }
          >
            <span />
          </button>
        </div>
      </section>

      {/* SUPPORT */}

      <section className="settings-section">
        <div className="settings-title">
          <h2>Support</h2>
          <p>Help and application information</p>
        </div>

        <button
  type="button"
  className="settings-item"
  onClick={() => navigate("/support")}
>
          <div className="settings-icon">
            <HelpCircle size={20} />
          </div>

          <div className="settings-text">
            <strong>Help & Support</strong>
            <span>Get help with your account</span>
          </div>

          <ChevronRight size={19} />
        </button>

        <div className="settings-version">
          <span>App Version</span>
          <strong>1.0.0</strong>
        </div>
      </section>

    </main>
  );
}

export default Settings;