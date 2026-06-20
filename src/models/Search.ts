import type { Grade } from "./Grade";
import type { Subject } from "./Subject";
import type { Topic } from "./Topic";
import type { Track } from "./Track";
import type { Worksheet } from "./Worksheet";

export interface SearchCatalog {
  subjects: Subject[];
  grades: Grade[];
  topics: Topic[];
  tracks: Track[];
  worksheets: Worksheet[];
}

export type SearchResultType = "subject" | "grade" | "track" | "topic" | "worksheet";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  path: string;
  score: number;
}
