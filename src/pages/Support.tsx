import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Headphones,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../css/Support.css";

type FAQ = {
  id: number;
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    id: 1,
    question: "How can I update my profile?",
    answer:
      "Go to Profile, open Personal Information and update your details.",
  },
  {
    id: 2,
    question: "Where can I see my products?",
    answer:
      "Open My Products from your Profile or from the Home page.",
  },
  {
    id: 3,
    question: "How can I change my password?",
    answer:
      "Go to Profile → Settings → Change Password.",
  },
];

function Support() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [openFaq, setOpenFaq] = useState<number | null>(
    null
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your message.");
      return;
    }

    if (message.trim().length < 10) {
      setError(
        "Please enter at least 10 characters in your message."
      );
      return;
    }

    const oldTickets = JSON.parse(
      localStorage.getItem("supportTickets") || "[]"
    );

    const newTicket = {
      id: Date.now(),
      subject: subject.trim(),
      message: message.trim(),
      status: "Submitted",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "supportTickets",
      JSON.stringify([newTicket, ...oldTickets])
    );

    setSubject("");
    setMessage("");

    setSuccess(true);

    window.setTimeout(() => {
      setSuccess(false);
    }, 2500);
  };

  return (
    <main className="support-page">
      {/* HEADER */}

      <header className="support-header">
        <button
          type="button"
          onClick={() => navigate("/settings")}
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Help & Support</h1>
          <p>We're here to help</p>
        </div>

        <span>
          <Headphones size={20} />
        </span>
      </header>

      {/* HERO */}

      <section className="support-hero">
        <div className="support-hero-icon">
          <Headphones size={31} />
        </div>

        <h2>How can we help?</h2>

        <p>
          Send us your question or check the frequently
          asked questions below.
        </p>
      </section>

      {/* CONTACT OPTIONS */}

      <section className="support-contact-grid">
        <div className="support-contact-card">
          <div>
            <MessageCircle size={20} />
          </div>

          <strong>Support</strong>
          <span>Send a message</span>
        </div>

        <div className="support-contact-card">
          <div>
            <Mail size={20} />
          </div>

          <strong>Email</strong>
          <span>Contact support</span>
        </div>
      </section>

      {/* SUPPORT FORM */}

      <form
        className="support-form"
        onSubmit={handleSubmit}
      >
        <div className="support-form-title">
          <h2>Send a Message</h2>
          <p>Tell us how we can help you</p>
        </div>

        <div className="support-field">
          <label>Subject</label>

          <input
            type="text"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            placeholder="Enter subject"
            maxLength={80}
          />
        </div>

        <div className="support-field">
          <label>Message</label>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Describe your issue..."
            maxLength={500}
          />

          <span className="support-character-count">
            {message.length}/500
          </span>
        </div>

        {error && (
          <div className="support-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="support-submit"
        >
          <Send size={17} />
          Submit Request
        </button>
      </form>

      {/* FAQ */}

      <section className="support-faq">
        <div className="support-faq-title">
          <h2>Frequently Asked Questions</h2>
          <p>Quick answers to common questions</p>
        </div>

        <div className="support-faq-list">
          {faqs.map((faq) => (
            <div
              className={`support-faq-item ${
                openFaq === faq.id ? "active" : ""
              }`}
              key={faq.id}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenFaq(
                    openFaq === faq.id
                      ? null
                      : faq.id
                  )
                }
              >
                <span>{faq.question}</span>

                <ChevronDown size={18} />
              </button>

              {openFaq === faq.id && (
                <div className="support-faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SUCCESS */}

      {success && (
        <div className="support-success">
          <CheckCircle2 size={21} />

          <div>
            <strong>Request Submitted</strong>

            <span>
              Your support request has been saved.
            </span>
          </div>
        </div>
      )}
    </main>
  );
}

export default Support;