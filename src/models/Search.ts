import type { Grade } from "./Grade";
import type { Subject } from "./Subject";
import type { Topic } from "./Topic";
import type { Worksheet } from "./Worksheet";

export interface SearchCatalog {
  subjects: Subject[];
  grades: Grade[];
  topics: Topic[];
  worksheets: Worksheet[];
}

export type SearchResultType = "subject" | "grade" | "topic" | "worksheet";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  path: string;
  score: number;
}
