import type { DocumentData } from "firebase/firestore";
import type { Grade } from "../../models/Grade";
import { createFirestoreRepository } from "./createFirestoreRepository";

function normalizeGrade(id: string, data: DocumentData): Grade {
  return {
    id,
    slug: String(data.slug ?? id),
    subjectId: "mathematics",
    title: String(data.title ?? ""),
    shortLabel: String(data.shortLabel ?? ""),
    type: data.type === "track" ? "track" : "grade",
    order: Number(data.order ?? 0),
    isActive: Boolean(data.isActive),
  };
}

export const gradeRepository = createFirestoreRepository<Grade>("grades", normalizeGrade);
