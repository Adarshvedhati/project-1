import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { isNetworkError } from "../../../services/api/client";
import { authApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import type { RegisterPayload } from "../types";
import styles from "./AuthPages.module.css";

const EMPTY: RegisterPayload = { email: "", password: "", firstName: "", lastName: "", role: "researcher" };

/** FR-01 registration for researchers/authors. */
export function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Register");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const session = await authApi.register(form);
      signIn(session.user, session.token);
      navigate("/");
    } catch (err) {
      if (import.meta.env.DEV && isNetworkError(err)) {
        // Dev convenience only: backend not running -> click-through mock session.
        signIn(
          {
            id: "mock-user",
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            roles: [form.role],
            status: "active",
          },
          "mock-token"
        );
        navigate("/");
      } else {
        setError(err instanceof Error ? err.message : "Could not create the account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <h1>Create your account</h1>
        <p className={styles.subtitle}>Register to submit manuscripts, save searches and track reviews.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>First name</span>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
            </label>
            <label className={styles.field}>
              <span>Last name</span>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </label>

          <label className={styles.field}>
            <span>I am primarily a…</span>
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as RegisterPayload["role"] }))}
            >
              <option value="researcher">Researcher / reader</option>
              <option value="author">Author</option>
            </select>
          </label>

          {error && (
            <p role="alert" style={{ color: "var(--color-accent, #8a1c1c)", margin: 0 }}>
              {error}
            </p>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className={styles.footer}>
          Already registered? <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
