import type { DocumentData } from "firebase/firestore";
import type { Subject, SubjectIcon, SubjectStatus } from "../../models/Subject";
import { createFirestoreRepository } from "./createFirestoreRepository";

function normalizeSubject(id: string, data: DocumentData): Subject {
  return {
    id,
    slug: String(data.slug ?? id),
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    icon: (data.icon ?? "calculator") as SubjectIcon,
    color: String(data.color ?? "#2563eb"),
    path: data.path ? String(data.path) : undefined,
    status: (data.status ?? "coming-soon") as SubjectStatus,
    order: Number(data.order ?? 0),
    isActive: Boolean(data.isActive),
  };
}

export const subjectRepository = createFirestoreRepository<Subject>("subjects", normalizeSubject);
