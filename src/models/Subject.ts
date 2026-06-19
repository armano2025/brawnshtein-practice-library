export type SubjectIcon = "calculator" | "letters" | "language" | "physics";
export type SubjectStatus = "active" | "coming-soon";

export interface Subject {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: SubjectIcon;
  color: string;
  path?: string;
  status: SubjectStatus;
  order: number;
  isActive: boolean;
}
