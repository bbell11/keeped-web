"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";

type FormState = "idle" | "submitting" | "fading" | "success";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Client-side validation
    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedEmail.includes("@") ||
      !trimmedEmail.includes(".")
    ) {
      setError("please fill in your name and email");
      triggerShake();
      if (!trimmedName) {
        nameRef.current?.focus();
      } else {
        emailRef.current?.focus();
      }
      return;
    }

    setFormState("submitting");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormState("idle");
        setError(data.error || "something went wrong");
        return;
      }

      // Success: wait 400ms → fade out → replace with success state after 350ms
      setTimeout(() => {
        setFormState("fading");
        setTimeout(() => setFormState("success"), 350);
      }, 400);
    } catch {
      setFormState("idle");
      setError("something went wrong");
    }
  }

  const isSubmitting = formState === "submitting";
  const isFading = formState === "fading";
  const isSuccess = formState === "success";

  return (
    <>
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.page}>
        <div className={styles.card}>

          {/* Header */}
          <header className={styles.header}>
            <span className={styles.headerLeft}>KEEPED</span>
            <span className={styles.headerCenter}>ref. 001 — march 2026</span>
            <span className={styles.headerRight}>WAITLIST</span>
          </header>

          {/* Header rule */}
          <div className={styles.headerRule} aria-hidden="true" />

          {/* Form section / success state */}
          {isSuccess ? (
            <div className={styles.successSection}>
              <p className={styles.successHeadline}>your place is kept.</p>
              <p className={styles.successSub}>You will hear from us.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={`${styles.formSection}${isFading ? ` ${styles.formSectionFading}` : ""}`}
            >
              <h1 className={styles.headline}>join the waitlist</h1>

              <input
                ref={nameRef}
                type="text"
                name="name"
                autoComplete="given-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name"
                disabled={isSubmitting}
                className={`${styles.input} ${styles.nameInput}${shake ? ` ${styles.shake}` : ""}`}
              />

              <input
                ref={emailRef}
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                disabled={isSubmitting}
                className={`${styles.input} ${styles.emailInput}${shake ? ` ${styles.shake}` : ""}`}
              />

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.button}
              >
                {isSubmitting ? "—" : "keep my place"}
              </button>
            </form>
          )}

          {/* Double rule */}
          <div className={styles.doubleRule} aria-hidden="true">
            <div className={styles.doubleRuleLine} />
            <div className={styles.doubleRuleLine} />
          </div>

          {/* Content section */}
          <section className={styles.contentSection}>
            <p className={styles.tagline}>Some things deserve to be kept.</p>
            <p className={styles.subtagline}>The private version of being known.</p>

            <div className={styles.bodyCopy}>
              <p>
                There is a version of you that doesn&apos;t make it into conversation.
                It lives in the drive home. In the gap between who you are
                publicly and who you actually are.
              </p>
              <p>
                Keeped is a daily journal. One prompt. Private by default.
                Shared by choice. Be witnessed rather than watched.
              </p>
            </div>
          </section>

          {/* Footer rule */}
          <div className={styles.footerRule} aria-hidden="true" />

          {/* Footer */}
          <footer className={styles.footer}>
            <span className={styles.footerLeft}>KEEPED</span>
            <span className={styles.footerCenter}>ref. 001 — march 2026</span>
            <span className={styles.footerRight}>WAITLIST</span>
          </footer>

        </div>
      </div>
    </>
  );
}
