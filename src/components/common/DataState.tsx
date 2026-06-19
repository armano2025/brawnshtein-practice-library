import { Link } from "react-router-dom";

interface DataStateProps {
  type: "loading" | "error" | "empty";
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
}

export function DataState({ type, title, description, actionLabel, actionPath }: DataStateProps) {
  return (
    <section className={`content-container data-state data-state-${type}`} aria-live="polite">
      <span className="data-state-icon" aria-hidden="true">{type === "loading" ? "…" : type === "error" ? "!" : "＋"}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {actionLabel && actionPath && <Link className="secondary-link" to={actionPath}>{actionLabel}</Link>}
    </section>
  );
}
