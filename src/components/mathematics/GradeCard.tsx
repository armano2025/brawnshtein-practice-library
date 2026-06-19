import { Link } from "react-router-dom";
import type { Grade } from "../../models/Grade";

interface GradeCardProps {
  category: Grade;
}

export function GradeCard({ category }: GradeCardProps) {
  return (
    <Link className="grade-card" to={`/grade/${category.slug}`}>
      <span className={`grade-card-mark grade-card-mark-${category.type}`} aria-hidden="true">
        {category.shortLabel}
      </span>
      <span className="grade-card-title">{category.title}</span>
      <span className="grade-card-arrow" aria-hidden="true">←</span>
    </Link>
  );
}
