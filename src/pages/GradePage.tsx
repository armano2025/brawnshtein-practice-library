import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DataState } from "../components/common/DataState";
import { TopicCard } from "../components/mathematics/TopicCard";
import { useAsyncResource } from "../hooks/useAsyncResource";
import type { Grade } from "../models/Grade";
import type { Topic } from "../models/Topic";
import { catalogService } from "../services/catalogService";

interface GradePageData {
  category: Grade | null;
  topics: Topic[];
}

export function GradePage() {
  const { id } = useParams();
  const resource = useAsyncResource<GradePageData>(`grade:${id ?? ""}`, async () => {
    if (!id) return { category: null, topics: [] };
    const category = await catalogService.getGradeBySlug(id);
    const topics = category ? await catalogService.getTopicsByGradeSlug(category.slug) : [];
    return { category, topics };
  });
  const category = resource.data?.category ?? null;
  const topics = resource.data?.topics ?? [];

  useEffect(() => {
    document.title = category
      ? `${category.title} | מאגר תרגילי בראונשטיין`
      : "המסלול לא נמצא | מאגר תרגילי בראונשטיין";

    return () => {
      document.title = "מאגר תרגילי בראונשטיין";
    };
  }, [category]);

  if (resource.isLoading) {
    return <DataState type="loading" title="טוענים את נושאי הכיתה" description="המידע יופיע בעוד רגע." />;
  }

  if (resource.error) {
    return <DataState type="error" title="לא הצלחנו לטעון את הכיתה" description="בדקו את החיבור ונסו שוב." actionLabel="חזרה למתמטיקה" actionPath="/mathematics" />;
  }

  if (!category) {
    return (
      <section className="content-container grade-error-state">
        <span className="grade-error-icon" aria-hidden="true">?</span>
        <h1>המסלול לא נמצא</h1>
        <p>לא הצלחנו למצוא את הכיתה או מסלול התרגול שביקשתם.</p>
        <Link className="secondary-link" to="/mathematics">חזרה למתמטיקה</Link>
      </section>
    );
  }

  return (
    <section className="content-container grade-page">
      <header className="grade-heading">
        <span className={`grade-heading-mark grade-heading-mark-${category.type}`} aria-hidden="true">
          {category.shortLabel}
        </span>
        <div>
          <h1>{category.title}</h1>
          <p>בחרו נושא לתרגול</p>
        </div>
      </header>

      {topics.length ? (
        <div className="topic-grid" aria-label={`נושאים עבור ${category.title}`}>
          {topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
        </div>
      ) : (
        <DataState type="empty" title="עדיין אין נושאים בכיתה זו" description="נושאים חדשים יתווספו בקרוב." />
      )}
    </section>
  );
}
