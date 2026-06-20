import assert from "node:assert/strict";
import { mathematicsCategories } from "../src/data/mathematicsCategories";
import { mathematicsTopics } from "../src/data/mathematicsTopics";
import { mathematicsTracks } from "../src/data/mathematicsTracks";
import { mathematicsWorksheets } from "../src/data/mathematicsWorksheets";
import { demoSubjects } from "../src/data/subjects";
import type { SearchCatalog } from "../src/models/Search";
import type { Worksheet } from "../src/models/Worksheet";
import { isValidPdfUrl } from "../src/models/Worksheet";
import { createWorksheetService } from "../src/services/worksheetService";
import { getSearchHighlightSegments, normalizeSearchText, searchCatalog } from "../src/utils/searchCatalog";

const catalog: SearchCatalog = {
  subjects: [...demoSubjects],
  grades: [...mathematicsCategories],
  topics: [...mathematicsTopics],
  tracks: [...mathematicsTracks],
  worksheets: [...mathematicsWorksheets],
};

assert.equal(normalizeSearchText("  כיתה ח׳  "), "כיתה ח");
assert.deepEqual(getSearchHighlightSegments("לוח הכפל — תרגול מדורג", "לוח הכפל"), [
  { text: "לוח", isMatch: true },
  { text: " ", isMatch: false },
  { text: "הכפל", isMatch: true },
  { text: " — תרגול מדורג", isMatch: false },
]);
assert.deepEqual(getSearchHighlightSegments("כיתה ח׳", "כיתה ח"), [
  { text: "כיתה", isMatch: true },
  { text: " ", isMatch: false },
  { text: "ח", isMatch: true },
  { text: "׳", isMatch: false },
]);
assert.deepEqual(getSearchHighlightSegments("מתמטיקה", ""), [{ text: "מתמטיקה", isMatch: false }]);
assert.equal(searchCatalog(catalog, "").length, 0);
assert.equal(searchCatalog(catalog, "חיפוש שלא קיים").length, 0);
assert.ok(searchCatalog(catalog, "מתמטיקה").some((result) => result.path === "/mathematics"));
assert.ok(searchCatalog(catalog, "כיתה ח").some((result) => result.path === "/grade/grade-8"));
assert.ok(searchCatalog(catalog, "5 יח״ל כיתה י").some((result) => (
  result.path === "/grade/grade-10/track/grade-10-5-units"
)));
assert.equal(mathematicsTracks.length, 9);
assert.equal(new Set(mathematicsTracks.map((track) => track.slug)).size, mathematicsTracks.length);
assert.ok(mathematicsTracks.every((track) => track.topicSlugs.length > 0));
assert.ok(searchCatalog(catalog, "משוואות").some((result) => result.type === "topic"));
assert.ok(searchCatalog(catalog, "לוח הכפל").some((result) => result.path === "/worksheet/grade-3-multiplication-table"));

assert.equal(isValidPdfUrl("https://brawnshtein-pdfs.pages.dev/grade-7/percentages/sample.pdf"), true);
assert.equal(isValidPdfUrl("https://brawnshtein-pdfs.pages.dev/grade-7/sample.PDF"), true);
assert.equal(isValidPdfUrl("https://example.com/sample.pdf"), false);
assert.equal(isValidPdfUrl("http://brawnshtein-pdfs.pages.dev/sample.pdf"), false);

let createdWorksheet: Worksheet | null = null;
const testWorksheetService = createWorksheetService({
  async create(worksheet) {
    createdWorksheet = worksheet;
  },
  async update() {
    return undefined;
  },
});
await testWorksheetService.addWorksheet({
  subjectId: "mathematics",
  gradeSlug: "grade-7",
  topicSlug: "grade-7-percentages",
  title: "תרגול אחוזים",
  description: "תרגול לדוגמה",
  tags: ["אחוזים", "כיתה ז"],
  pdfUrl: "https://brawnshtein-pdfs.pages.dev/grade-7/percentages/sample.pdf",
});
assert.ok(createdWorksheet);
assert.equal(createdWorksheet.pdfUrl, "https://brawnshtein-pdfs.pages.dev/grade-7/percentages/sample.pdf");
assert.equal(createdWorksheet.viewCount, 0);
assert.equal(Object.hasOwn(createdWorksheet, "trackSlug"), false);
await assert.rejects(() => testWorksheetService.addWorksheet({
  subjectId: "mathematics",
  gradeSlug: "grade-7",
  topicSlug: "grade-7-percentages",
  title: "כתובת לא תקינה",
  description: "תרגול לדוגמה",
  tags: [],
  pdfUrl: "https://example.com/sample.pdf",
}));

console.log("Search tests passed.");
