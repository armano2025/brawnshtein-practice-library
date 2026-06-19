import type { SearchCatalog, SearchResult } from "../models/Search";

const MAX_RESULTS = 10;

export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("he")
    .normalize("NFKD")
    .replace(/[\u0591-\u05c7]/g, "")
    .replace(/[׳״'"`]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function scoreMatch(query: string, searchableText: string, title: string): number {
  const normalizedTitle = normalizeSearchText(title);
  const normalizedText = normalizeSearchText(searchableText);
  const tokens = query.split(" ").filter(Boolean);

  if (!tokens.every((token) => normalizedText.includes(token))) {
    return 0;
  }

  if (normalizedTitle === query) return 100;
  if (normalizedTitle.startsWith(query)) return 80;
  if (normalizedTitle.includes(query)) return 65;
  return 40 + tokens.length;
}

export function searchCatalog(catalog: SearchCatalog, rawQuery: string): SearchResult[] {
  const query = normalizeSearchText(rawQuery);

  if (!query) return [];

  const results: SearchResult[] = [];
  const addResult = (result: Omit<SearchResult, "score">, searchableText: string) => {
    const score = scoreMatch(query, searchableText, result.title);
    if (score > 0) results.push({ ...result, score });
  };

  catalog.subjects
    .filter((subject) => subject.isActive && subject.status === "active" && subject.path)
    .forEach((subject) => addResult({
      id: subject.id,
      type: "subject",
      title: subject.name,
      description: subject.description,
      path: subject.path!,
    }, `${subject.name} ${subject.description}`));

  catalog.grades.filter((grade) => grade.isActive).forEach((grade) => addResult({
    id: grade.id,
    type: "grade",
    title: grade.title,
    description: grade.type === "track" ? "מסלול תרגול במתמטיקה" : "כיתה במתמטיקה",
    path: `/grade/${grade.slug}`,
  }, `${grade.title} ${grade.shortLabel}`));

  catalog.topics.filter((topic) => topic.isActive).forEach((topic) => {
    const grade = catalog.grades.find((item) => item.slug === topic.gradeSlug);
    addResult({
      id: topic.id,
      type: "topic",
      title: topic.name,
      description: grade ? `${grade.title} · ${topic.description}` : topic.description,
      path: `/topic/${topic.slug}`,
    }, `${topic.name} ${topic.description} ${grade?.title ?? ""}`);
  });

  catalog.worksheets.filter((worksheet) => worksheet.isActive).forEach((worksheet) => {
    const grade = catalog.grades.find((item) => item.slug === worksheet.gradeSlug);
    const topic = catalog.topics.find((item) => item.slug === worksheet.topicSlug);
    addResult({
      id: worksheet.id,
      type: "worksheet",
      title: worksheet.title,
      description: [grade?.title, topic?.name].filter(Boolean).join(" · ") || worksheet.description,
      path: `/worksheet/${worksheet.slug}`,
    }, `${worksheet.title} ${worksheet.description} ${worksheet.tags.join(" ")} ${grade?.title ?? ""} ${topic?.name ?? ""}`);
  });

  return results
    .sort((first, second) => second.score - first.score || first.title.localeCompare(second.title, "he"))
    .slice(0, MAX_RESULTS);
}
