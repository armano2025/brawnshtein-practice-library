export interface Worksheet {
  id: string;
  slug: string;
  subjectId: "mathematics";
  gradeSlug: string;
  trackSlug?: string;
  topicSlug: string;
  title: string;
  description: string;
  tags: string[];
  pdfUrl: string;
  storagePath?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  accessLevel: "public";
}

const EXTERNAL_PDF_URL_PATTERN = /^https:\/\/brawnshtein-pdfs\.pages\.dev\/.+\.pdf$/i;

export function isValidPdfUrl(value: string): boolean {
  return EXTERNAL_PDF_URL_PATTERN.test(value.trim());
}
