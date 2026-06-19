import { Link } from "react-router-dom";
import type { Worksheet } from "../../models/Worksheet";

interface WorksheetCardProps {
  worksheet: Worksheet;
}

const countFormatter = new Intl.NumberFormat("he-IL");

export function WorksheetCard({ worksheet }: WorksheetCardProps) {
  return (
    <Link className="worksheet-card" to={`/worksheet/${worksheet.slug}`}>
      <div className="worksheet-card-heading">
        <span className="worksheet-file-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6m-6 4h4" />
          </svg>
        </span>
        <div>
          {worksheet.isFeatured && <span className="featured-label">מומלץ</span>}
          <h2>{worksheet.title}</h2>
        </div>
      </div>

      <p className="worksheet-description">{worksheet.description}</p>

      <ul className="worksheet-tags" aria-label="תגיות">
        {worksheet.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>

      <div className="worksheet-card-footer">
        <div className="worksheet-stats">
          <span aria-label={`${countFormatter.format(worksheet.viewCount)} צפיות`}>
            <span aria-hidden="true">◉</span> {countFormatter.format(worksheet.viewCount)} צפיות
          </span>
          <span aria-label={`${countFormatter.format(worksheet.downloadCount)} הורדות`}>
            <span aria-hidden="true">↓</span> {countFormatter.format(worksheet.downloadCount)} הורדות
          </span>
        </div>
        <span className="worksheet-open-button">פתח תרגול <span aria-hidden="true">←</span></span>
      </div>
    </Link>
  );
}
