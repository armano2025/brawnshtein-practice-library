import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DataState } from "../components/common/DataState";
import { WorksheetCard } from "../components/mathematics/WorksheetCard";
import { PdfViewer } from "../components/worksheets/PdfViewer";
import { WorksheetInformationCard } from "../components/worksheets/WorksheetInformationCard";
import { useAsyncResource } from "../hooks/useAsyncResource";
import type { Topic } from "../models/Topic";
import type { Worksheet } from "../models/Worksheet";
import { worksheetAnalytics } from "../lib/worksheetAnalytics";
import { catalogService } from "../services/catalogService";

interface WorksheetPageData {
  worksheet: Worksheet | null;
  topic: Topic | null;
  relatedWorksheets: Worksheet[];
}

export function WorksheetPage() {
  const { id } = useParams();
  const resource = useAsyncResource<WorksheetPageData>(`worksheet:${id ?? ""}`, async () => {
    if (!id) return { worksheet: null, topic: null, relatedWorksheets: [] };
    const worksheet = await catalogService.getWorksheetBySlug(id);
    if (!worksheet) return { worksheet: null, topic: null, relatedWorksheets: [] };
    const [topic, topicWorksheets] = await Promise.all([
      catalogService.getTopicBySlug(worksheet.topicSlug),
      catalogService.getWorksheetsByTopicSlug(worksheet.topicSlug),
    ]);
    const relatedWorksheets = topicWorksheets
      .filter((candidate) => candidate.slug !== worksheet.slug)
      .slice(0, 4);
    return { worksheet, topic, relatedWorksheets };
  });
  const worksheet = resource.data?.worksheet ?? null;
  const topic = resource.data?.topic ?? null;
  const relatedWorksheets = resource.data?.relatedWorksheets ?? [];

  useEffect(() => {
    document.title = worksheet
      ? `${worksheet.title} | מאגר תרגילי בראונשטיין`
      : "התרגול לא נמצא | מאגר תרגילי בראונשטיין";

    if (worksheet) {
      void worksheetAnalytics.recordView(worksheet.id);
    }

    return () => {
      document.title = "מאגר תרגילי בראונשטיין";
    };
  }, [worksheet]);

  if (resource.isLoading) {
    return <DataState type="loading" title="טוענים את התרגול" description="הקובץ והפרטים יופיעו בעוד רגע." />;
  }

  if (resource.error) {
    return <DataState type="error" title="לא הצלחנו לטעון את התרגול" description="בדקו את החיבור ונסו שוב." actionLabel="חזרה למתמטיקה" actionPath="/mathematics" />;
  }

  if (!worksheet || !topic) {
    return (
      <section className="content-container worksheet-error-state">
        <span className="worksheet-state-icon" aria-hidden="true">?</span>
        <h1>התרגול לא נמצא</h1>
        <p>לא הצלחנו למצוא את דף התרגול שביקשתם.</p>
        <Link className="secondary-link" to="/mathematics">חזרה למתמטיקה</Link>
      </section>
    );
  }

  const handleDownload = () => {
    void worksheetAnalytics.recordDownload(worksheet.id);
  };

  return (
    <div className="content-container worksheet-detail-page">
      <WorksheetInformationCard worksheet={worksheet} />

      <div className="worksheet-primary-actions">
        <a className="worksheet-action worksheet-action-primary" href={worksheet.pdfUrl} target="_blank" rel="noreferrer">
          פתח במסך מלא
        </a>
        <a className="worksheet-action worksheet-action-secondary" href={worksheet.pdfUrl} download onClick={handleDownload}>
          הורד PDF
        </a>
        <Link className="worksheet-action worksheet-action-quiet" to={`/topic/${topic.slug}`}>
          חזרה לנושא
        </Link>
      </div>

      <PdfViewer
        pdfUrl={worksheet.pdfUrl}
        title={worksheet.title}
        onDownload={handleDownload}
      />

      <section className="related-worksheets-section" aria-labelledby="related-worksheets-title">
        <div className="related-worksheets-heading">
          <div>
            <span>עוד לתרגול</span>
            <h2 id="related-worksheets-title">תרגולים נוספים בנושא</h2>
          </div>
          <Link to={`/topic/${topic.slug}`}>לכל התרגולים</Link>
        </div>

        {relatedWorksheets.length > 0 ? (
          <div className="worksheet-grid related-worksheets-grid">
            {relatedWorksheets.map((relatedWorksheet) => (
              <WorksheetCard key={relatedWorksheet.id} worksheet={relatedWorksheet} />
            ))}
          </div>
        ) : (
          <div className="related-worksheets-empty">
            <span aria-hidden="true">＋</span>
            <p>עדיין אין תרגולים נוספים בנושא זה</p>
          </div>
        )}
      </section>
    </div>
  );
}
