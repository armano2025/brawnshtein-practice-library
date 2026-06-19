import { useEffect } from "react";
import { DataState } from "../components/common/DataState";
import { GradeCard } from "../components/mathematics/GradeCard";
import { useAsyncResource } from "../hooks/useAsyncResource";
import { catalogService } from "../services/catalogService";

export function MathematicsPage() {
  const gradesResource = useAsyncResource("mathematics-grades", () => catalogService.getGrades("mathematics"));

  useEffect(() => {
    document.title = "מתמטיקה | מאגר תרגילי בראונשטיין";

    return () => {
      document.title = "מאגר תרגילי בראונשטיין";
    };
  }, []);

  if (gradesResource.isLoading) {
    return <DataState type="loading" title="טוענים כיתות ומסלולים" description="המידע יופיע בעוד רגע." />;
  }

  if (gradesResource.error) {
    return <DataState type="error" title="לא הצלחנו לטעון את המתמטיקה" description="בדקו את החיבור ל־Firebase ונסו שוב." actionLabel="חזרה לדף הבית" actionPath="/" />;
  }

  return (
    <section className="content-container mathematics-page">
      <header className="mathematics-heading">
        <span className="mathematics-heading-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1 3v4h8V6H8Zm0 8h2m4 0h2m-8 3h2m4 0h2" />
          </svg>
        </span>
        <div>
          <h1>מתמטיקה</h1>
          <p>בחרו כיתה או מסלול תרגול</p>
        </div>
      </header>

      {gradesResource.data?.length ? (
        <div className="grade-grid" aria-label="כיתות ומסלולי תרגול">
          {gradesResource.data.map((category) => (
            <GradeCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <DataState type="empty" title="עדיין אין כיתות להצגה" description="כיתות ומסלולים יתווספו בקרוב." />
      )}
    </section>
  );
}
