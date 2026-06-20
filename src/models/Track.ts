export type UnitLevel = 3 | 4 | 5;

export interface Track {
  id: string;
  slug: string;
  gradeSlug: string;
  name: string;
  description: string;
  shortLabel: string;
  unitLevel: UnitLevel;
  topicSlugs: string[];
  order: number;
  isActive: boolean;
}
