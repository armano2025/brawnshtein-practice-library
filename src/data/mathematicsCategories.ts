import type { Grade } from "../models/Grade";

export const mathematicsCategories: readonly Grade[] = [
  { id: "grade-1", slug: "grade-1", subjectId: "mathematics", title: "כיתה א׳", shortLabel: "א׳", type: "grade", order: 1, isActive: true },
  { id: "grade-2", slug: "grade-2", subjectId: "mathematics", title: "כיתה ב׳", shortLabel: "ב׳", type: "grade", order: 2, isActive: true },
  { id: "grade-3", slug: "grade-3", subjectId: "mathematics", title: "כיתה ג׳", shortLabel: "ג׳", type: "grade", order: 3, isActive: true },
  { id: "grade-4", slug: "grade-4", subjectId: "mathematics", title: "כיתה ד׳", shortLabel: "ד׳", type: "grade", order: 4, isActive: true },
  { id: "grade-5", slug: "grade-5", subjectId: "mathematics", title: "כיתה ה׳", shortLabel: "ה׳", type: "grade", order: 5, isActive: true },
  { id: "grade-6", slug: "grade-6", subjectId: "mathematics", title: "כיתה ו׳", shortLabel: "ו׳", type: "grade", order: 6, isActive: true },
  { id: "grade-7", slug: "grade-7", subjectId: "mathematics", title: "כיתה ז׳", shortLabel: "ז׳", type: "grade", order: 7, isActive: true },
  { id: "grade-8", slug: "grade-8", subjectId: "mathematics", title: "כיתה ח׳", shortLabel: "ח׳", type: "grade", order: 8, isActive: true },
  { id: "grade-9", slug: "grade-9", subjectId: "mathematics", title: "כיתה ט׳", shortLabel: "ט׳", type: "grade", order: 9, isActive: true },
  { id: "grade-10", slug: "grade-10", subjectId: "mathematics", title: "כיתה י׳", shortLabel: "י׳", type: "grade", order: 10, isActive: true },
  { id: "grade-11", slug: "grade-11", subjectId: "mathematics", title: "כיתה י״א", shortLabel: "י״א", type: "grade", order: 11, isActive: true },
  { id: "grade-12", slug: "grade-12", subjectId: "mathematics", title: "כיתה י״ב", shortLabel: "י״ב", type: "grade", order: 12, isActive: true },
  { id: "homeschooling", slug: "homeschooling", subjectId: "mathematics", title: "חינוך ביתי", shortLabel: "⌂", type: "track", order: 13, isActive: true },
  { id: "general-practice", slug: "general-practice", subjectId: "mathematics", title: "תרגול כללי", shortLabel: "✦", type: "track", order: 14, isActive: true },
];

export function getMathematicsCategoryBySlug(slug: string | undefined) {
  return mathematicsCategories.find((category) => category.slug === slug);
}
