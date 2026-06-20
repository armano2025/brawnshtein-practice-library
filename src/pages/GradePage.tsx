import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DataState } from "../components/common/DataState";
import { TopicCard } from "../components/mathematics/TopicCard";
import { TrackCard } from "../components/mathematics/TrackCard";
import { useAsyncResource } from "../hooks/useAsyncResource";
import type { Grade } from "../models/Grade";
import type { Topic } from "../models/Topic";
import type { Track } from "../models/Track";
import { catalogService } from "../services/catalogService";

interface GradePageData {
  category: Grade | null;
  tracks: Track[];
  activeTrack: Track | null;
  topics: Topic[];
}

export function GradePage() {
  const { id, trackId } = useParams();
  const resource = useAsyncResource<GradePageData>(`grade:${id ?? ""}:track:${trackId ?? ""}`, async () => {
    if (!id) return { category: null, tracks: [], activeTrack: null, topics: [] };

    const category = await catalogService.getGradeBySlug(id);
    if (!category) return { category: null, tracks: [], activeTrack: null, topics: [] };

    const tracks = await catalogService.getTracksByGradeSlug(category.slug);
    const activeTrack = trackId ? await catalogService.getTrackBySlug(trackId) : null;
    const hasValidTrack = activeTrack?.gradeSlug === category.slug && activeTrack.isActive;
    const shouldLoadTopics = tracks.length === 0 || hasValidTrack;
    const allTopics = shouldLoadTopics ? await catalogService.getTopicsByGradeSlug(category.slug) : [];
    const topics = hasValidTrack
      ? allTopics.filter((topic) => activeTrack.topicSlugs.includes(topic.slug))
      : allTopics;

    return {
      category,
      tracks,
      activeTrack: hasValidTrack ? activeTrack : null,
      topics,
    };
  });
  const category = resource.data?.category ?? null;
  const tracks = resource.data?.tracks ?? [];
  const activeTrack = resource.data?.activeTrack ?? null;
  const topics = resource.data?.topics ?? [];
  const hasInvalidTrack = Boolean(trackId && category && !activeTrack);
  const isTrackSelection = tracks.length > 0 && !trackId;

  useEffect(() => {
    const pageName = activeTrack && category
      ? `${category.title} — ${activeTrack.name}`
      : category?.title;
    document.title = pageName
      ? `${pageName} | מאגר תרגילי בראונשטיין`
      : "המסלול לא נמצא | מאגר תרגילי בראונשטיין";

    return () => {
      document.title = "מאגר תרגילי בראונשטיין";
    };
  }, [activeTrack, category]);

  if (resource.isLoading) {
    return <DataState type="loading" title="טוענים את מסלולי הכיתה" description="המידע יופיע בעוד רגע." />;
  }

  if (resource.error) {
    return <DataState type="error" title="לא הצלחנו לטעון את הכיתה" description="בדקו את החיבור ונסו שוב." actionLabel="חזרה למתמטיקה" actionPath="/mathematics" />;
  }

  if (!category || hasInvalidTrack) {
    return (
      <section className="content-container grade-error-state">
        <span className="grade-error-icon" aria-hidden="true">?</span>
        <h1>המסלול לא נמצא</h1>
        <p>לא הצלחנו למצוא את הכיתה או מסלול היחידות שביקשתם.</p>
        <Link className="secondary-link" to={category ? `/grade/${category.slug}` : "/mathematics"}>
          {category ? "חזרה לבחירת מסלול" : "חזרה למתמטיקה"}
        </Link>
      </section>
    );
  }

  const headingTitle = activeTrack ? `${category.title} — ${activeTrack.name}` : category.title;

  return (
    <section className="content-container grade-page">
      <header className="grade-heading">
        <span className={`grade-heading-mark grade-heading-mark-${category.type}`} aria-hidden="true">
          {activeTrack?.shortLabel ?? category.shortLabel}
        </span>
        <div>
          <h1>{headingTitle}</h1>
          <p>{isTrackSelection ? "בחרו מסלול לימוד" : "בחרו נושא לתרגול"}</p>
        </div>
      </header>

      {isTrackSelection ? (
        <div className="track-grid" aria-label={`מסלולי לימוד עבור ${category.title}`}>
          {tracks.map((track) => <TrackCard key={track.id} track={track} />)}
        </div>
      ) : topics.length ? (
        <>
          {activeTrack && (
            <div className="track-context">
              <span>{activeTrack.description}</span>
              <Link to={`/grade/${category.slug}`}>החלפת מסלול</Link>
            </div>
          )}
          <div className="topic-grid" aria-label={`נושאים עבור ${headingTitle}`}>
            {topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
          </div>
        </>
      ) : (
        <DataState type="empty" title="עדיין אין נושאים במסלול זה" description="נושאים חדשים יתווספו בקרוב." />
      )}
    </section>
  );
}
