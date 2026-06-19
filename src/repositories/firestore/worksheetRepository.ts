import type { DocumentData, Timestamp } from "firebase/firestore";
import type { Worksheet } from "../../models/Worksheet";
import { createFirestoreRepository } from "./createFirestoreRepository";

function normalizeDate(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate().toISOString();
  }

  return new Date(0).toISOString();
}

function normalizeWorksheet(id: string, data: DocumentData): Worksheet {
  return {
    id,
    slug: String(data.slug ?? id),
    subjectId: "mathematics",
    gradeSlug: String(data.gradeSlug ?? ""),
    topicSlug: String(data.topicSlug ?? ""),
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    pdfUrl: String(data.pdfUrl ?? ""),
    storagePath: data.storagePath ? String(data.storagePath) : undefined,
    isActive: Boolean(data.isActive),
    isFeatured: Boolean(data.isFeatured),
    viewCount: Number(data.viewCount ?? 0),
    downloadCount: Number(data.downloadCount ?? 0),
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt),
    accessLevel: "public",
  };
}

export const worksheetRepository = createFirestoreRepository<Worksheet>("worksheets", normalizeWorksheet);
