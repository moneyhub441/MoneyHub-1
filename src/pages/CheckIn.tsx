import {
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  Flame,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/CheckIn.css";

function CheckIn() {
  const navigate = useNavigate();

  const today = new Date().toDateString();

  const savedDate = localStorage.getItem("lastCheckIn");

  const [checkedIn, setCheckedIn] = useState(
    savedDate === today
  );

  const [success, setSuccess] = useState(false);

  const [streak, setStreak] = useState(
    Number(localStorage.getItem("checkInStreak")) || 0
  );

  const handleCheckIn = () => {
    if (checkedIn) return;

    const newStreak = streak + 1;

    localStorage.setItem("lastCheckIn", today);

    localStorage.setItem(
      "checkInStreak",
      String(newStreak)
    );

    setStreak(newStreak);
    setCheckedIn(true);
    setSuccess(true);

    window.setTimeout(() => {
      setSuccess(false);
    }, 2500);
  };

  return (
    <main className="checkin-page">
      {/* HEADER */}

      <header className="checkin-header">
        <button
          type="button"
          onClick={() => navigate("/home")}
        >
          <ChevronLeft size={22} />
        </button>

        <div>
          <h1>Daily Check-In</h1>
          <p>Track your daily activity</p>
        </div>

        <span>
          <CalendarCheck size={20} />
        </span>
      </header>

      {/* HERO */}

      <section className="checkin-hero">
        <div className="checkin-hero-icon">
          {checkedIn ? (
            <CheckCircle2 size={34} />
          ) : (
            <CalendarCheck size={34} />
          )}
        </div>

        <h2>
          {checkedIn
            ? "Checked In Today!"
            : "Daily Check-In"}
        </h2>

        <p>
          {checkedIn
            ? "Your check-in for today has been recorded."
            : "Check in once every day to maintain your activity streak."}
        </p>
      </section>

      {/* STREAK */}

      <section className="checkin-stats">
        <div>
          <span className="checkin-stat-icon">
            <Flame size={22} />
          </span>

          <div>
            <span>Current Streak</span>

            <strong>
              {streak} {streak === 1 ? "Day" : "Days"}
            </strong>
          </div>
        </div>

        <div>
          <span className="checkin-stat-icon">
            <CalendarCheck size={22} />
          </span>

          <div>
            <span>Today's Status</span>

            <strong>
              {checkedIn ? "Completed" : "Pending"}
            </strong>
          </div>
        </div>
      </section>

      {/* CHECK IN CARD */}

      <section className="checkin-card">
        <div className="checkin-card-title">
          <h2>Today's Check-In</h2>

          <p>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div
          className={`checkin-status ${
            checkedIn ? "completed" : ""
          }`}
        >
          <div>
            {checkedIn ? (
              <CheckCircle2 size={25} />
            ) : (
              <CalendarCheck size={25} />
            )}
          </div>

          <div>
            <strong>
              {checkedIn
                ? "Check-In Completed"
                : "Ready to Check-In"}
            </strong>

            <span>
              {checkedIn
                ? "Come back tomorrow for your next check-in."
                : "Tap the button below to record today's activity."}
            </span>
          </div>
        </div>

        <button
          type="button"
          className={`checkin-button ${
            checkedIn ? "completed" : ""
          }`}
          disabled={checkedIn}
          onClick={handleCheckIn}
        >
          {checkedIn ? (
            <>
              <CheckCircle2 size={18} />
              Checked In
            </>
          ) : (
            <>
              <CalendarCheck size={18} />
              Check-In Now
            </>
          )}
        </button>
      </section>

      {/* INFO */}

      <section className="checkin-info">
        <CalendarCheck size={20} />

        <div>
          <strong>Daily Activity</strong>

          <span>
            You can check in once per calendar day.
            Your status is stored on this device.
          </span>
        </div>
      </section>

      {/* SUCCESS */}

      {success && (
        <div className="checkin-success">
          <CheckCircle2 size={21} />

          <div>
            <strong>Check-In Successful</strong>
            <span>Today's activity was recorded.</span>
          </div>
        </div>
      )}
    </main>
  );
}

export default CheckIn;