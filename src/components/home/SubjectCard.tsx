import { Link } from "react-router-dom";
import type { SubjectIcon } from "../../models/Subject";

interface SubjectCardProps {
  title: string;
  icon: SubjectIcon;
  color: string;
  path?: string;
}

const icons = {
  calculator: <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1 3v4h8V6H8Zm0 8h2m4 0h2m-8 3h2m4 0h2" />,
  letters: <path d="m5 19 5.5-14h3L19 19m-11.8-4h9.6M5 7h3m8 0h3" />,
  language: <path d="M4 5h16M9 5c0 6 3 10 8 13M15 5c0 5-3 9-8 12m3.5 2L15 8m-8 7h10" />,
  physics: <path d="M12 12c3.9 0 7-1.3 7-3s-3.1-3-7-3-7 1.3-7 3 3.1 3 7 3Zm0 0c-2 3.4-2.4 6.8-.9 7.7 1.5.8 4.3-1.3 6.3-4.7s2.4-6.8.9-7.7M12 12c-2-3.4-4.8-5.5-6.3-4.7-1.5.9-1.1 4.3.9 7.7s4.8 5.5 6.3 4.7M12 12h.01" />,
};

export function SubjectCard({ title, icon, color, path }: SubjectCardProps) {
  const content = (
    <>
      <span className="subject-icon" style={{ "--subject-color": color } as React.CSSProperties} aria-hidden="true">
        <svg viewBox="0 0 24 24">{icons[icon]}</svg>
      </span>
      <span className="subject-details">
        <strong>{title}</strong>
        <span>{path ? "לצפייה בתרגולים" : "בקרוב"}</span>
      </span>
      {path && <span className="card-arrow" aria-hidden="true">←</span>}
    </>
  );

  return path ? (
    <Link className="subject-card subject-card-active" to={path}>{content}</Link>
  ) : (
    <div className="subject-card subject-card-disabled" aria-disabled="true">{content}</div>
  );
}
