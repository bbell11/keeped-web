"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: 15,
    color: "var(--ink)",
    background: "var(--bg)",
    border: `var(--hairline-weight) solid var(--hairline)`,
    borderRadius: "var(--radius)",
    outline: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none",
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100svh",
        padding: "var(--margin)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 480,
          width: "100%",
          gap: 40,
        }}
      >
        {/* Wordmark */}
        <h1
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "0.06em",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          Keeped
        </h1>

        {/* Tagline + brand statement */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontStyle: "italic",
              fontSize: 18,
              lineHeight: 1.5,
              color: "var(--ink)",
              margin: 0,
              textAlign: "center",
            }}
          >
            Some things deserve to be kept.
          </p>

          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-2)",
              margin: 0,
              textAlign: "center",
              letterSpacing: "0.01em",
            }}
          >
            the private version of being known
          </p>
        </div>

        {/* Form or confirmation */}
        {submitted ? (
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 16,
              color: "var(--ink)",
              margin: 0,
              animation: "fadeIn 0.6s ease",
            }}
          >
            Your place is kept.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 12,
              width: "100%",
              maxWidth: 320,
            }}
          >
            <input
              type="text"
              name="name"
              required
              autoComplete="given-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email"
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "var(--bg)",
                background: "var(--ink)",
                border: "none",
                borderRadius: "var(--radius)",
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.5 : 1,
                transition: "opacity 0.2s ease",
                marginTop: 4,
              }}
            >
              {submitting ? "..." : "Keep my place."}
            </button>

            {error && (
              <p
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  color: "var(--ink-2)",
                  margin: 0,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                }}
              >
                {error}
              </p>
            )}
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input:focus {
          border-color: var(--ink-2);
        }
      `}</style>
    </main>
  );
}
