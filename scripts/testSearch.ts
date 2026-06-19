import assert from "node:assert/strict";
import { mathematicsCategories } from "../src/data/mathematicsCategories";
import { mathematicsTopics } from "../src/data/mathematicsTopics";
import { mathematicsWorksheets } from "../src/data/mathematicsWorksheets";
import { demoSubjects } from "../src/data/subjects";
import type { SearchCatalog } from "../src/models/Search";
import { normalizeSearchText, searchCatalog } from "../src/utils/searchCatalog";

const catalog: SearchCatalog = {
  subjects: [...demoSubjects],
  grades: [...mathematicsCategories],
  topics: [...mathematicsTopics],
  worksheets: [...mathematicsWorksheets],
};

assert.equal(normalizeSearchText("  כיתה ח׳  "), "כיתה ח");
assert.equal(searchCatalog(catalog, "").length, 0);
assert.equal(searchCatalog(catalog, "חיפוש שלא קיים").length, 0);
assert.ok(searchCatalog(catalog, "מתמטיקה").some((result) => result.path === "/mathematics"));
assert.ok(searchCatalog(catalog, "כיתה ח").some((result) => result.path === "/grade/grade-8"));
assert.ok(searchCatalog(catalog, "משוואות").some((result) => result.type === "topic"));
assert.ok(searchCatalog(catalog, "לוח הכפל").some((result) => result.path === "/worksheet/grade-3-multiplication-table"));

console.log("Search tests passed.");
