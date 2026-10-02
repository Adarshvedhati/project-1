import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { isNetworkError } from "../../../services/api/client";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPages.module.css";

/** FR-01 sign-in against the Django auth API (mock session only in dev when the API is unreachable). */
export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Sign In");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const session = await authApi.login({ email, password });
      signIn(session.user, session.token);
      navigate("/");
    } catch (err) {
      if (import.meta.env.DEV && isNetworkError(err)) {
        // Dev convenience only: backend not running -> click-through mock session.
        signIn(
          {
            id: "mock-user",
            email,
            firstName: email.split("@")[0] || "Researcher",
            lastName: "",
            roles: ["researcher", "author"],
            status: "active",
          },
          "mock-token"
        );
        navigate("/");
      } else {
        setError(err instanceof Error ? err.message : "Could not sign in. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <h1>Sign in</h1>
        <p className={styles.subtitle}>Access your submissions, reviews and saved searches.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && (
            <p role="alert" style={{ color: "var(--color-accent, #8a1c1c)", margin: 0 }}>
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className={styles.footer}>
          New to Meridian? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
