import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui";
import { useDocumentTitle } from "../../../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPages.module.css";

/** FR-01 sign-in. Falls back to a local mock session while the Django auth API is pending. */
export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle("Sign In");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
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
          <Button type="submit">Sign in</Button>
        </form>

        <p className={styles.footer}>
          New to Meridian? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
