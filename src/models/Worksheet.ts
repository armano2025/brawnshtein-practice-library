export interface Worksheet {
  id: string;
  slug: string;
  subjectId: "mathematics";
  gradeSlug: string;
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
