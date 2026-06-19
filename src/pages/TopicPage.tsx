import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DataState } from "../components/common/DataState";
import { WorksheetCard } from "../components/mathematics/WorksheetCard";
import { useAsyncResource } from "../hooks/useAsyncResource";
import type { Grade } from "../models/Grade";
import type { Topic } from "../models/Topic";
import type { Worksheet } from "../models/Worksheet";
import { catalogService } from "../services/catalogService";

interface TopicPageData {
  topic: Topic | null;
  category: Grade | null;
  worksheets: Worksheet[];
}

export function TopicPage() {
  const { id } = useParams();
  const resource = useAsyncResource<TopicPageData>(`topic:${id ?? ""}`, async () => {
    if (!id) return { topic: null, category: null, worksheets: [] };
    const topic = await catalogService.getTopicBySlug(id);
    if (!topic) return { topic: null, category: null, worksheets: [] };
    const [category, worksheets] = await Promise.all([
      catalogService.getGradeBySlug(topic.gradeSlug),
      catalogService.getWorksheetsByTopicSlug(topic.slug),
    ]);
    return { topic, category, worksheets };
  });
  const topic = resource.data?.topic ?? null;
  const category = resource.data?.category ?? null;
  const worksheets = resource.data?.worksheets ?? [];

  useEffect(() => {
    document.title = topic
      ? `${topic.name} | מאגר תרגילי בראונשטיין`
      : "הנושא לא נמצא | מאגר תרגילי בראונשטיין";

    return () => {
      document.title = "מאגר תרגילי בראונשטיין";
    };
  }, [topic]);

  if (resource.isLoading) {
    return <DataState type="loading" title="טוענים את התרגולים" description="המידע יופיע בעוד רגע." />;
  }

  if (resource.error) {
    return <DataState type="error" title="לא הצלחנו לטעון את הנושא" description="בדקו את החיבור ונסו שוב." actionLabel="חזרה למתמטיקה" actionPath="/mathematics" />;
  }

  if (!topic || !category) {
    return (
      <section className="content-container topic-error-state">
        <span className="topic-state-icon topic-state-icon-error" aria-hidden="true">?</span>
        <h1>הנושא לא נמצא</h1>
        <p>לא הצלחנו למצוא את נושא התרגול שביקשתם.</p>
        <Link className="secondary-link" to="/mathematics">חזרה למתמטיקה</Link>
      </section>
    );
  }

  return (
    <section className="content-container topic-page">
      <header className="topic-heading">
        <span className="topic-heading-mark" aria-hidden="true">∑</span>
        <div>
          <span className="topic-grade-label">{category.title}</span>
          <h1>{topic.name}</h1>
          <p>{topic.description}</p>
        </div>
      </header>

      <div className="worksheets-section-heading">
        <h2>תרגולים בנושא זה</h2>
        {worksheets.length > 0 && <span>{worksheets.length} תרגולים</span>}
      </div>

      {worksheets.length > 0 ? (
        <div className="worksheet-grid">
          {worksheets.map((worksheet) => (
            <WorksheetCard key={worksheet.id} worksheet={worksheet} />
          ))}
        </div>
      ) : (
        <div className="topic-empty-state">
          <span className="topic-state-icon" aria-hidden="true">＋</span>
          <h2>עדיין לא נוספו תרגולים לנושא זה</h2>
          <p>אנחנו עובדים על תרגולים חדשים. כדאי לחזור ולבדוק שוב בקרוב.</p>
          <Link className="secondary-link" to={`/grade/${category.slug}`}>חזרה לנושאי הכיתה</Link>
        </div>
      )}
    </section>
  );
}
