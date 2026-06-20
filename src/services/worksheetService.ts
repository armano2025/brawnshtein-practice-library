import type { Worksheet } from "../models/Worksheet";
import { isValidPdfUrl } from "../models/Worksheet";
import type { FirestoreRepository } from "../repositories/firestore/createFirestoreRepository";
import { worksheetRepository } from "../repositories/firestore/worksheetRepository";

export interface CreateWorksheetInput {
  slug?: string;
  subjectId: "mathematics";
  gradeSlug: string;
  trackSlug?: string;
  topicSlug: string;
  title: string;
  description: string;
  tags: string[];
  pdfUrl: string;
}

export type UpdateWorksheetInput = Partial<Omit<CreateWorksheetInput, "subjectId">>;

type WorksheetWriter = Pick<FirestoreRepository<Worksheet>, "create" | "update">;

function createStableSuffix(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function validatePdfUrl(pdfUrl: string): string {
  const normalizedUrl = pdfUrl.trim();
  if (!isValidPdfUrl(normalizedUrl)) {
    throw new Error("PDF URL must point to a .pdf file on brawnshtein-pdfs.pages.dev.");
  }
  return normalizedUrl;
}

export function createWorksheetService(repository: WorksheetWriter = worksheetRepository) {
  return {
    async addWorksheet(data: CreateWorksheetInput): Promise<Worksheet> {
      const suffix = createStableSuffix();
      const now = new Date().toISOString();
      const worksheet: Worksheet = {
        id: `worksheet-${suffix}`,
        slug: data.slug?.trim() || `worksheet-${suffix}`,
        subjectId: data.subjectId,
        gradeSlug: data.gradeSlug,
        ...(data.trackSlug ? { trackSlug: data.trackSlug } : {}),
        topicSlug: data.topicSlug,
        title: data.title.trim(),
        description: data.description.trim(),
        tags: data.tags.map((tag) => tag.trim()).filter(Boolean),
        pdfUrl: validatePdfUrl(data.pdfUrl),
        isActive: true,
        isFeatured: false,
        viewCount: 0,
        downloadCount: 0,
        createdAt: now,
        updatedAt: now,
        accessLevel: "public",
      };

      await repository.create(worksheet);
      return worksheet;
    },

    async updateWorksheet(id: string, data: UpdateWorksheetInput): Promise<void> {
      const updates: Partial<Omit<Worksheet, "id">> = {
        ...data,
        ...(data.pdfUrl ? { pdfUrl: validatePdfUrl(data.pdfUrl) } : {}),
        updatedAt: new Date().toISOString(),
      };
      await repository.update(id, updates);
    },
  };
}

export const worksheetService = createWorksheetService();
