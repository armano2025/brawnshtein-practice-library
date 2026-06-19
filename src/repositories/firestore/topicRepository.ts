import type { DocumentData } from "firebase/firestore";
import type { Topic } from "../../models/Topic";
import { createFirestoreRepository } from "./createFirestoreRepository";

function normalizeTopic(id: string, data: DocumentData): Topic {
  return {
    id,
    slug: String(data.slug ?? id),
    gradeSlug: String(data.gradeSlug ?? ""),
    name: String(data.name ?? ""),
    description: String(data.description ?? ""),
    order: Number(data.order ?? 0),
    isActive: Boolean(data.isActive),
  };
}

export const topicRepository = createFirestoreRepository<Topic>("topics", normalizeTopic);
