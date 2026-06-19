import type { Worksheet } from "../../models/Worksheet";

interface WorksheetInformationCardProps {
  worksheet: Worksheet;
}

const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const countFormatter = new Intl.NumberFormat("he-IL");

export function WorksheetInformationCard({ worksheet }: WorksheetInformationCardProps) {
  return (
    <article className="worksheet-information-card">
      <div className="worksheet-information-heading">
        <span className="worksheet-information-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 0v5h5M9 13h6m-6 4h4" />
          </svg>
        </span>
        <div>
          {worksheet.isFeatured && <span className="featured-label">מומלץ</span>}
          <h1>{worksheet.title}</h1>
        </div>
      </div>

      <p className="worksheet-information-description">{worksheet.description}</p>

      <ul className="worksheet-information-tags" aria-label="תגיות">
        {worksheet.tags.map((tag) => <li key={tag}>{tag}</li>)}
      </ul>

      <dl className="worksheet-metadata">
        <div>
          <dt>תאריך יצירה</dt>
          <dd>{dateFormatter.format(new Date(worksheet.createdAt))}</dd>
        </div>
        <div>
          <dt>צפיות</dt>
          <dd>{countFormatter.format(worksheet.viewCount)}</dd>
        </div>
        <div>
          <dt>הורדות</dt>
          <dd>{countFormatter.format(worksheet.downloadCount)}</dd>
        </div>
      </dl>
    </article>
  );
}
