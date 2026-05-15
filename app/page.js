"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

/* ─── Styles ─────────────────────────────────────────────────────────── */
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  card: {
    width: "100%",
    maxWidth: 440,
    background: "var(--surface)",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(var(--surface), var(--surface)), linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    borderRadius: "var(--radius)",
    padding: "clamp(1.5rem, 5vw, 2.5rem)",
    textAlign: "center",
    boxShadow: "0 20px 25px -5px rgba(212, 175, 55, 0.15), 0 10px 10px -5px rgba(0,0,0,0.02)",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "linear-gradient(135deg, #bf953f, #aa771c)",
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: 10,
    fontWeight: 700,
    color: "white",
    marginBottom: "1.5rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    boxShadow: "0 4px 10px rgba(191, 149, 63, 0.3)",
  },
  title: {
    fontFamily: "var(--font-montserrat)",
    fontSize: "clamp(24px, 7vw, 34px)",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: "var(--text)",
    marginBottom: 10,
    lineHeight: 1.1,
  },
  subtitle: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(13px, 4vw, 15px)",
    color: "var(--muted)",
    marginBottom: "2rem",
    lineHeight: 1.4,
  },
  inputWrap: {
    position: "relative",
    marginBottom: 15,
  },
  atSign: {
    position: "absolute",
    left: 15,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#00A57D",
    fontSize: 16,
    fontWeight: 600,
    pointerEvents: "none",
    userSelect: "none",
  },
  input: {
    fontFamily: "var(--font-inter)",
    width: "100%",
    background: "#f8fafc",
    border: "2px solid #f1f5f9",
    borderRadius: "var(--radius-sm)",
    padding: "14px 14px 14px 38px",
    fontSize: 16,
    color: "var(--text)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
  },
  btn: {
    fontFamily: "var(--font-montserrat)",
    width: "100%",
    background: "linear-gradient(135deg, #00A57D, #008a68)",
    color: "white",
    fontWeight: 700,
    fontSize: 16,
    borderRadius: "var(--radius-sm)",
    padding: "16px",
    transition: "all 0.2s",
    letterSpacing: "0.01em",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(0, 165, 125, 0.2), 0 4px 6px -2px rgba(0, 165, 125, 0.1)",
  },
  btnDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
    background: "#94a3b8",
  },
  errorBox: {
    background: "var(--error-bg)",
    border: "1px solid rgba(248,113,113,0.3)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    fontSize: 13,
    color: "var(--error)",
    marginBottom: 10,
    textAlign: "left",
  },
  /* Result card */
  resultCard: {
    width: "100%",
    maxWidth: 440,
    background: "var(--surface)",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(var(--surface), var(--surface)), linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    borderRadius: "var(--radius)",
    padding: "clamp(1.5rem, 5vw, 2.5rem)",
    textAlign: "center",
    boxShadow: "0 20px 25px -5px rgba(212, 175, 55, 0.2)",
  },
  bigNumber: {
    fontFamily: "var(--font-montserrat)",
    fontSize: "clamp(80px, 22vw, 120px)",
    fontWeight: 900,
    letterSpacing: "-0.06em",
    background: "linear-gradient(135deg, #1e293b, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1,
    marginBottom: "0.5rem",
  },
  successBox: {
    fontFamily: "var(--font-inter)",
    background: "var(--success-bg)",
    border: "1px solid #d1fae5",
    borderRadius: "var(--radius-sm)",
    padding: "12px 16px",
    fontSize: 14,
    color: "#065f46",
    fontWeight: 500,
    margin: "1.5rem 0",
  },
  userTag: {
    fontFamily: "var(--font-montserrat)",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 15,
    color: "var(--muted)",
    marginBottom: "0.5rem",
  },
  enterAgainBtn: {
    background: "transparent",
    border: "1px solid var(--border-hover)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 22px",
    fontSize: 14,
    color: "var(--muted)",
    marginTop: "1.5rem",
    transition: "border-color 0.2s, color 0.2s",
  },
  /* Entries list */
  listCard: {
    width: "100%",
    maxWidth: 440,
    marginTop: "1.5rem",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    fontSize: 13,
    color: "var(--muted)",
  },
  entryRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    marginBottom: 8,
  },
  entryNum: {
    fontWeight: 800,
    fontSize: 24,
    color: "var(--primary)",
    minWidth: 60,
    letterSpacing: "-0.04em",
  },
  entryUser: {
    flex: 1,
    fontSize: 15,
    fontWeight: 500,
    color: "var(--text)",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  entryTime: {
    fontSize: 11,
    color: "var(--muted)",
    whiteSpace: "nowrap",
  },
};

/* ─── ChatGPT SVG icon ─────────────────────────────────────────────── */
function GPTIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z" />
      <path d="M12 18a6 6 0 0 0 6-6 6 6 0 0 0-6-6 6 6 0 0 0-6 6 6 6 0 0 0 6 6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ─── Spinning loader ────────────────────────────────────────────────── */
function Spinner() {
  return (
    <span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(10,10,15,0.3)", borderTopColor: "#0a0a0f", borderRadius: "50%", animation: "spin 0.7s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

/* ─── Winner Countdown ─────────────────────────────────────────── */
function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date("May 16, 2026 10:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 15 }}>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} style={{ minWidth: 45 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#00A57D" }}>{value}</div>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em" }}>{unit}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Number roll animation ──────────────────────────────────────────── */
function RollingNumber({ target }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 900;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <div style={s.bigNumber}>{display}</div>;
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function GiveawayPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { lucky_number, username }
  const [entries, setEntries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch latest entries on mount
  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data, count } = await supabase
      .from("entries")
      .select("username, lucky_number, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setEntries(data);
    if (count !== null) setTotalCount(count);
  }

  async function handleSubmit() {
    setError("");
    const clean = username.trim().replace(/^@/, "");
    if (!clean) { setError("Please enter your Instagram username."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: clean }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.already_entered) {
          setResult({ lucky_number: data.lucky_number, username: data.username || clean });
          // Play voice for already entered
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel(); // Stop any current speech
            const msg = new SpeechSynthesisUtterance(`Your lucky number is ${data.lucky_number}`);
            msg.rate = 0.95;
            window.speechSynthesis.speak(msg);
          }
        } else {
          setError(data.error || "Something went wrong.");
        }
      } else {
        setResult({ lucky_number: data.lucky_number, username: data.username });
        // Play voice for new entry
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel(); // Stop any current speech
          const msg = new SpeechSynthesisUtterance(`Congratulations! Your lucky number is ${data.lucky_number}`);
          msg.rate = 0.95;
          window.speechSynthesis.speak(msg);
        }
        fetchEntries();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  function reset() {
    setResult(null);
    setUsername("");
    setError("");
  }

  return (
    <main style={s.page}>
      {!result ? (
        /* ── Entry Form ── */
        <div style={s.card}>
          <div style={s.badge}>
            <GPTIcon size={12} />
            Limited Edition
          </div>

          <h1 style={s.title}>Exclusive ChatGPT GO Giveaway</h1>
          <p style={s.subtitle}>
            3 Months of pure power! Skip the wait and join the elite. Enter your handle now to claim your lucky spot.
          </p>

          <div style={s.inputWrap} className="input-focus">
            <span style={s.atSign}>@</span>
            <input
              style={s.input}
              type="text"
              placeholder="Enter your Instagram username"
              value={username}
              onChange={(e) => { 
                const val = e.target.value.replace(/^@/, "");
                setUsername(val); 
                setError(""); 
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>

          {error && <div style={s.errorBox}>{error}</div>}

          <button
            style={{ ...s.btn, ...(loading || !username.trim() ? s.btnDisabled : {}) }}
            onClick={handleSubmit}
            disabled={loading || !username.trim()}
            className="btn-hover"
          >
            {loading ? <Spinner /> : "🎲  Tap to Get My Lucky Number"}
          </button>

          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>
            Each username gets exactly one unique number (1–1000).
          </p>
        </div>
      ) : (
        /* ── Result ── */
        <div style={s.resultCard}>
          <div style={s.badge}>
            <GPTIcon size={12} />
            Your Lucky Number
          </div>

          <RollingNumber target={result.lucky_number} />

          <div style={s.userTag}>
            <GPTIcon size={14} />
            {result.username}
          </div>

          <div style={s.successBox}>
            🔒 This number is locked to your account — no one else can claim it.
          </div>

          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
              Grand Winner Announcement
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              May 16th | 10:00 AM
            </p>
            <Countdown />
          </div>
        </div>
      )}

      {/* ── Recent Entries ── */}
      <div style={s.listCard}>
        <div style={s.listHeader}>
          <span>{totalCount} total entries</span>
          <span>{1000 - totalCount} numbers remaining</span>
        </div>

        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "1.5rem 0", color: "var(--muted)", fontSize: 14 }}>
            No entries yet — be the first!
          </div>
        ) : (
          entries.map((e) => (
            <div key={e.username} style={s.entryRow}>
              <span style={s.entryNum}>#{e.lucky_number}</span>
              <span style={s.entryUser}>
                <GPTIcon size={12} style={{ verticalAlign: -2, marginRight: 4 }} /> {e.username}
              </span>
              <span style={s.entryTime}>
                {new Date(e.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
