import { SearchBox } from "../components/home/SearchBox";
import { SubjectCard } from "../components/home/SubjectCard";
import { DataState } from "../components/common/DataState";
import { useAsyncResource } from "../hooks/useAsyncResource";
import { catalogService } from "../services/catalogService";

export function HomePage() {
  const subjectsResource = useAsyncResource("subjects", () => catalogService.getSubjects());

  return (
    <>
      <section className="hero-section">
        <div className="hero-decoration hero-decoration-one" aria-hidden="true" />
        <div className="hero-decoration hero-decoration-two" aria-hidden="true" />
        <div className="content-container hero-content">
          <span className="eyebrow">לומדים. מתרגלים. מצליחים.</span>
          <h1>מאגר תרגילי בראונשטיין</h1>
          <p>תרגולים מסודרים לפי מקצוע, כיתה ונושא</p>
          <SearchBox />
        </div>
      </section>

      <section className="content-container subjects-section" aria-labelledby="subjects-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">מתחילים כאן</span>
            <h2 id="subjects-title">בחרו מקצוע</h2>
          </div>
          <p>בחרו את תחום הלימוד הרצוי והמשיכו לתרגול</p>
        </div>
        {subjectsResource.isLoading ? (
          <DataState type="loading" title="טוענים מקצועות" description="המידע יופיע בעוד רגע." />
        ) : subjectsResource.error ? (
          <DataState type="error" title="לא הצלחנו לטעון את המקצועות" description="בדקו את החיבור ונסו לרענן את העמוד." />
        ) : subjectsResource.data?.length ? (
          <div className="subjects-grid">
            {subjectsResource.data.map((subject) => (
              <SubjectCard
                key={subject.id}
                title={subject.name}
                icon={subject.icon}
                color={subject.color}
                path={subject.status === "active" ? subject.path : undefined}
              />
            ))}
          </div>
        ) : (
          <DataState type="empty" title="עדיין אין מקצועות להצגה" description="מקצועות חדשים יתווספו בקרוב." />
        )}
      </section>
    </>
  );
}
