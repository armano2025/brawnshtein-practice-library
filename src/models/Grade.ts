export interface Grade {
  id: string;
  slug: string;
  subjectId: "mathematics";
  title: string;
  shortLabel: string;
  type: "grade" | "track";
  order: number;
  isActive: boolean;
}
