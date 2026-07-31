import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";
import API_URL from "../config/api";
import "../css/EditProfile.css";

type UserProfile = {
  name: string;
  mobile: string;
  email: string;
};

type ApiUser = {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  inviteCode?: string;
  walletBalance?: number;
  status?: string;
};

type ProfileResponse = {
  success: boolean;
  message?: string;
  user?: ApiUser;
};

function EditProfile() {
  const navigate =
    useNavigate();

  const [profile, setProfile] =
    useState<UserProfile>({
      name: "",
      mobile: "",
      email: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");



  /* =========================
     CURRENT USER
  ========================= */

  const getCurrentUser = () => {
    try {
      const savedUser =
        localStorage.getItem(
          "currentUser"
        );

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  };

  /* =========================
     LOAD PROFILE FROM MONGODB
  ========================= */

  useEffect(() => {
    const loadProfile =
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
          setError("");

          const response =
            await fetch(
              `${API_URL}/api/auth/profile/${currentUser.id}`
            );

          const data:
            ProfileResponse =
            await response.json();

          if (
            !response.ok ||
            !data.success ||
            !data.user
          ) {
            throw new Error(
              data.message ||
                "Unable to load profile"
            );
          }

          setProfile({
            name:
              data.user.name ||
              "",

            mobile:
              data.user.mobile ||
              "",

            email:
              data.user.email ||
              "",
          });

          /* Keep frontend user synced */

          localStorage.setItem(
            "currentUser",
            JSON.stringify({
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
                data.user
                  .inviteCode ||
                currentUser
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
        } catch (error) {
          console.error(
            "Load profile error:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load profile"
          );
        } finally {
          setLoading(false);
        }
      };

    loadProfile();
  }, [
    API_URL,
    navigate,
  ]);

  /* =========================
     CHANGE
  ========================= */

  const handleChange = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setProfile(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");
    setSaved(false);
  };

  /* =========================
     SAVE TO MONGODB
  ========================= */

  const handleSave = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

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

    if (!profile.name.trim()) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response =
        await fetch(
          `${API_URL}/api/auth/profile/${currentUser.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                profile.name.trim(),

              email:
                profile.email.trim(),
            }),
          }
        );

      const data:
        ProfileResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.user
      ) {
        throw new Error(
          data.message ||
            "Unable to update profile"
        );
      }

      /* =========================
         UPDATE FORM
      ========================= */

      setProfile({
        name:
          data.user.name,

        mobile:
          data.user.mobile,

        email:
          data.user.email ||
          "",
      });

      /* =========================
         SYNC CURRENT USER
      ========================= */

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
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
            data.user
              .inviteCode ||
            currentUser
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

      setSaved(true);

      window.setTimeout(
        () => {
          setSaved(false);
        },
        2000
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="edit-profile-page">

      {/* HEADER */}

      <header className="edit-profile-header">

        <button
          type="button"
          onClick={() =>
            navigate("/profile")
          }
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>
            Personal Information
          </h1>

          <p>
            Manage your profile details
          </p>
        </div>

        <span>
          <UserRound size={20} />
        </span>

      </header>

      {/* PROFILE AVATAR */}

      <section className="edit-profile-user">

        <div className="edit-profile-avatar">
          <UserRound size={35} />
        </div>

        <h2>
          {loading
            ? "Loading..."
            : profile.name ||
              "Welcome User"}
        </h2>

        <p>
          {profile.mobile
            ? `+91 ${profile.mobile}`
            : "Member Account"}
        </p>

      </section>

      {/* FORM */}

      <form
        className="edit-profile-form"
        onSubmit={handleSave}
      >

        <div className="edit-profile-title">

          <h2>
            Profile Details
          </h2>

          <p>
            Update your personal information
          </p>

        </div>

        {/* NAME */}

        <div className="edit-profile-field">

          <div className="edit-profile-field-icon">
            <UserRound size={19} />
          </div>

          <div>

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={
                loading ||
                saving
              }
              required
            />

          </div>

        </div>

        {/* MOBILE */}

        <div className="edit-profile-field">

          <div className="edit-profile-field-icon">
            <Phone size={19} />
          </div>

          <div>

            <label>
              Mobile Number
            </label>

            <input
              type="tel"
              name="mobile"
              value={profile.mobile}
              placeholder="Mobile number"
              disabled
              readOnly
            />

          </div>

        </div>

        {/* EMAIL */}

        <div className="edit-profile-field">

          <div className="edit-profile-field-icon">
            <Mail size={19} />
          </div>

          <div>

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter email address"
              disabled={
                loading ||
                saving
              }
            />

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            {error}
          </div>
        )}

        {/* SAVE */}

        <button
          type="submit"
          className="edit-profile-save"
          disabled={
            loading ||
            saving
          }
        >

          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Changes"}

        </button>

      </form>

      {/* SUCCESS */}

      {saved && (
        <div className="edit-profile-success">

          <CheckCircle2
            size={20}
          />

          <div>

            <strong>
              Profile Updated
            </strong>

            <span>
              Your changes have
              been saved.
            </span>

          </div>

        </div>
      )}

    </main>
  );
}

export default EditProfile;