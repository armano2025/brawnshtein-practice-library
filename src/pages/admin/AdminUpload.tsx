import { type FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import type { Grade } from "../../models/Grade";
import type { Subject } from "../../models/Subject";
import type { Topic } from "../../models/Topic";
import type { Track } from "../../models/Track";
import { isValidPdfUrl } from "../../models/Worksheet";
import { adminAuthService } from "../../services/adminAuthService";
import { catalogService } from "../../services/catalogService";
import { worksheetService } from "../../services/worksheetService";

interface AdminUploadProps {
  user: User;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

export function AdminUpload({ user }: AdminUploadProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [gradeSlug, setGradeSlug] = useState("");
  const [trackSlug, setTrackSlug] = useState("");
  const [topicSlug, setTopicSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    void catalogService.getSubjects()
      .then((items) => {
        setSubjects(items);
        setSubjectId(items[0]?.id ?? "");
      })
      .catch(() => setToast({ type: "error", message: "לא הצלחנו לטעון את רשימת המקצועות." }))
      .finally(() => setIsLoadingCatalog(false));
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    setGradeSlug("");
    setTrackSlug("");
    setTopicSlug("");
    void catalogService.getGrades(subjectId).then(setGrades).catch(() => setGrades([]));
  }, [subjectId]);

  useEffect(() => {
    if (!gradeSlug) {
      setTracks([]);
      setTopics([]);
      return;
    }
    setTrackSlug("");
    setTopicSlug("");
    void Promise.all([
      catalogService.getTracksByGradeSlug(gradeSlug),
      catalogService.getTopicsByGradeSlug(gradeSlug),
    ]).then(([nextTracks, nextTopics]) => {
      setTracks(nextTracks);
      setTopics(nextTopics);
    }).catch(() => {
      setTracks([]);
      setTopics([]);
    });
  }, [gradeSlug]);

  const availableTopics = useMemo(() => {
    if (!trackSlug) return tracks.length ? [] : topics;
    const activeTrack = tracks.find((track) => track.slug === trackSlug);
    return activeTrack ? topics.filter((topic) => activeTrack.topicSlugs.includes(topic.slug)) : [];
  }, [topics, tracks, trackSlug]);

  const hasPdfUrl = pdfUrl.trim().length > 0;
  const pdfUrlIsValid = isValidPdfUrl(pdfUrl);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);
    if (!pdfUrlIsValid) {
      setToast({ type: "error", message: "כתובת ה־PDF אינה תקינה." });
      return;
    }

    setIsSaving(true);
    try {
      await worksheetService.addWorksheet({
        subjectId: "mathematics",
        gradeSlug,
        trackSlug: trackSlug || undefined,
        topicSlug,
        title,
        description,
        tags: tags.split(","),
        pdfUrl,
      });
      setTitle("");
      setDescription("");
      setTags("");
      setPdfUrl("");
      setToast({ type: "success", message: "התרגול נשמר בהצלחה ויופיע בדף הנושא." });
    } catch {
      setToast({ type: "error", message: "שמירת התרגול נכשלה. בדקו את ההרשאות ונסו שוב." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="content-container admin-upload-page">
      <header className="admin-upload-heading">
        <div><span className="section-kicker">ניהול תכנים</span><h1>הוספת תרגול</h1><p>הוסיפו קישור ישיר לקובץ PDF מאתר הקבצים המאושר.</p></div>
        <button type="button" onClick={() => void adminAuthService.signOut()}>יציאה</button>
      </header>

      <form className="admin-card admin-upload-form" onSubmit={handleSubmit}>
        <p className="admin-account">מחובר: {user.email ?? "חשבון מנהל"}</p>
        <div className="admin-form-grid">
          <label>מקצוע<select data-cy="admin-subject" value={subjectId} onChange={(event) => setSubjectId(event.target.value)} disabled={isLoadingCatalog} required><option value="">בחרו מקצוע</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select></label>
          <label>כיתה<select data-cy="admin-grade" value={gradeSlug} onChange={(event) => setGradeSlug(event.target.value)} required><option value="">בחרו כיתה</option>{grades.map((grade) => <option key={grade.id} value={grade.slug}>{grade.title}</option>)}</select></label>
          {tracks.length > 0 && <label>מסלול<select data-cy="admin-track" value={trackSlug} onChange={(event) => { setTrackSlug(event.target.value); setTopicSlug(""); }} required><option value="">בחרו מסלול</option>{tracks.map((track) => <option key={track.id} value={track.slug}>{track.name}</option>)}</select></label>}
          <label>נושא<select data-cy="admin-topic" value={topicSlug} onChange={(event) => setTopicSlug(event.target.value)} disabled={!gradeSlug || (tracks.length > 0 && !trackSlug)} required><option value="">בחרו נושא</option>{availableTopics.map((topic) => <option key={topic.id} value={topic.slug}>{topic.name}</option>)}</select></label>
          <label className="admin-field-wide">שם התרגול<input data-cy="admin-title" value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
          <label className="admin-field-wide">תיאור<textarea data-cy="admin-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={4} required /></label>
          <label className="admin-field-wide">תגיות (מופרדות בפסיקים)<input data-cy="admin-tags" value={tags} onChange={(event) => setTags(event.target.value)} /></label>
          <label className="admin-field-wide">כתובת PDF<input data-cy="admin-pdf-url" dir="ltr" type="url" value={pdfUrl} onChange={(event) => setPdfUrl(event.target.value)} aria-invalid={hasPdfUrl && !pdfUrlIsValid} aria-describedby="pdf-url-help" required /><span id="pdf-url-help" className={hasPdfUrl && !pdfUrlIsValid ? "field-help field-help-error" : "field-help"}>הכתובת חייבת להתחיל ב־https://brawnshtein-pdfs.pages.dev/ ולהסתיים ב־.pdf</span></label>
        </div>
        <button data-cy="admin-save" className="admin-save-button" type="submit" disabled={isSaving || !pdfUrlIsValid}>{isSaving ? "שומרים..." : "שמור"}</button>
      </form>

      {toast && <div className={`admin-toast admin-toast-${toast.type}`} role="status">{toast.message}</div>}
    </section>
  );
}
