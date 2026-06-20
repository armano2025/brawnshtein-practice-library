import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { adminAuthService } from "../../services/adminAuthService";

interface AdminGuardProps {
  children: (user: User) => ReactNode;
}

type GuardState = "loading" | "signed-out" | "checking" | "authorized" | "forbidden" | "error";

export function AdminGuard({ children }: AdminGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<GuardState>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let current = true;
    let unsubscribe: () => void = () => undefined;

    try {
      unsubscribe = adminAuthService.observeUser((nextUser) => {
        if (!current) return;
        setUser(nextUser);
        setMessage("");
        if (!nextUser) {
          setState("signed-out");
          return;
        }

        setState("checking");
        void adminAuthService.isAdmin(nextUser.uid)
          .then((isAdmin) => {
            if (current) setState(isAdmin ? "authorized" : "forbidden");
          })
          .catch(() => {
            if (current) setState("error");
          });
      });
    } catch {
      setState("error");
    }

    return () => {
      current = false;
      unsubscribe();
    };
  }, []);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setMessage("");
    try {
      await adminAuthService.signIn(email.trim(), password);
    } catch {
      setState("signed-out");
      setMessage("הכניסה נכשלה. בדקו את פרטי ההתחברות ונסו שוב.");
    }
  };

  if (state === "loading" || state === "checking") {
    return <section className="admin-state"><h1>בודקים הרשאת מנהל</h1><p>רק רגע, אנחנו מאמתים את החשבון.</p></section>;
  }

  if (state === "forbidden") {
    return (
      <section className="admin-state">
        <h1>אין הרשאת מנהל לחשבון זה</h1>
        <p>החשבון מחובר, אך מזהה המשתמש אינו מופיע ברשימת המנהלים.</p>
        <button type="button" onClick={() => void adminAuthService.signOut()}>יציאה</button>
      </section>
    );
  }

  if (state === "error") {
    return <section className="admin-state"><h1>לא ניתן לבדוק הרשאות</h1><p>בדקו את הגדרת Firebase ואת מסמך המנהלים.</p></section>;
  }

  if (state === "authorized" && user) {
    return <>{children(user)}</>;
  }

  return (
    <section className="content-container admin-login-page">
      <form className="admin-card admin-login-form" onSubmit={handleSignIn}>
        <div>
          <span className="section-kicker">גישה מוגנת</span>
          <h1>כניסת מנהל</h1>
          <p>התחברו באמצעות חשבון Firebase מורשה.</p>
        </div>
        <label>
          כתובת אימייל
          <input data-cy="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
        </label>
        <label>
          סיסמה
          <input data-cy="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        </label>
        {message && <p className="admin-form-error" role="alert">{message}</p>}
        <button data-cy="admin-login" type="submit">כניסה</button>
      </form>
    </section>
  );
}
