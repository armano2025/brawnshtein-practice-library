import type { Track, UnitLevel } from "../models/Track";

const highSchoolGradeSlugs = ["grade-10", "grade-11", "grade-12"] as const;

const topicKeysByUnitLevel: Record<UnitLevel, readonly string[]> = {
  3: [
    "algebra",
    "functions",
    "trigonometry",
    "analytic-geometry",
    "sequences",
    "probability",
    "statistics",
    "three-units",
    "bagrut-exams",
    "mock-exams",
    "final-tests",
  ],
  4: [
    "algebra",
    "functions",
    "trigonometry",
    "analytic-geometry",
    "sequences",
    "probability",
    "statistics",
    "calculus",
    "four-units",
    "bagrut-exams",
    "mock-exams",
    "final-tests",
  ],
  5: [
    "algebra",
    "functions",
    "trigonometry",
    "analytic-geometry",
    "sequences",
    "probability",
    "statistics",
    "calculus",
    "five-units",
    "bagrut-exams",
    "mock-exams",
    "final-tests",
  ],
};

const trackDefinitions: readonly Omit<Track, "id" | "slug" | "gradeSlug" | "topicSlugs">[] = [
  { name: "3 יח״ל", description: "מסלול ממוקד לתוכנית הלימודים של שלוש יחידות", shortLabel: "3", unitLevel: 3, order: 1, isActive: true },
  { name: "4 יח״ל", description: "מסלול מעמיק לתוכנית הלימודים של ארבע יחידות", shortLabel: "4", unitLevel: 4, order: 2, isActive: true },
  { name: "5 יח״ל", description: "מסלול מתקדם לתוכנית הלימודים של חמש יחידות", shortLabel: "5", unitLevel: 5, order: 3, isActive: true },
];

export const mathematicsTracks: readonly Track[] = highSchoolGradeSlugs.flatMap((gradeSlug) => (
  trackDefinitions.map((definition) => {
    const slug = `${gradeSlug}-${definition.unitLevel}-units`;
    return {
      ...definition,
      id: slug,
      slug,
      gradeSlug,
      topicSlugs: topicKeysByUnitLevel[definition.unitLevel].map((topicKey) => `${gradeSlug}-${topicKey}`),
    };
  })
));

export function getActiveTracksByGradeSlug(gradeSlug: string): Track[] {
  return mathematicsTracks
    .filter((track) => track.gradeSlug === gradeSlug && track.isActive)
    .sort((first, second) => first.order - second.order);
}

export function getMathematicsTrackBySlug(slug: string | undefined): Track | undefined {
  return mathematicsTracks.find((track) => track.slug === slug);
}
