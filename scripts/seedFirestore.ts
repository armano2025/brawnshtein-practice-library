import { config } from "dotenv";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp, type Firestore } from "firebase-admin/firestore";
import { mathematicsCategories } from "../src/data/mathematicsCategories";
import { mathematicsTopics } from "../src/data/mathematicsTopics";
import { mathematicsWorksheets } from "../src/data/mathematicsWorksheets";
import { demoSubjects } from "../src/data/subjects";
import type { Grade } from "../src/models/Grade";
import type { Subject } from "../src/models/Subject";
import type { Topic } from "../src/models/Topic";
import type { Worksheet } from "../src/models/Worksheet";

const isDryRun = process.argv.includes("--dry-run");

interface SeedDocument {
  id: string;
}

interface SeedCollection<T extends SeedDocument> {
  name: "subjects" | "grades" | "topics" | "worksheets";
  documents: readonly T[];
  serialize: (document: T) => Record<string, unknown>;
}

interface ValidationReport {
  subjects: number;
  grades: number;
  topics: number;
  worksheets: number;
}

function withoutUndefined(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

function serializeDocument<T extends SeedDocument>(document: T): Record<string, unknown> {
  return withoutUndefined({ ...document });
}

function serializeWorksheet(worksheet: Worksheet): Record<string, unknown> {
  return withoutUndefined({
    ...worksheet,
    storagePath: worksheet.storagePath ?? "",
    createdAt: Timestamp.fromDate(new Date(worksheet.createdAt)),
    updatedAt: Timestamp.fromDate(new Date(worksheet.updatedAt)),
  });
}

const seedCollections: readonly SeedCollection<SeedDocument>[] = [
  {
    name: "subjects",
    documents: demoSubjects,
    serialize: (document) => serializeDocument(document as Subject),
  },
  {
    name: "grades",
    documents: mathematicsCategories,
    serialize: (document) => serializeDocument(document as Grade),
  },
  {
    name: "topics",
    documents: mathematicsTopics,
    serialize: (document) => serializeDocument(document as Topic),
  },
  {
    name: "worksheets",
    documents: mathematicsWorksheets,
    serialize: (document) => serializeWorksheet(document as Worksheet),
  },
];

function assertUniqueValues(collectionName: string, fieldName: string, values: readonly string[]): void {
  const uniqueValues = new Set(values);
  if (uniqueValues.size !== values.length) {
    throw new Error(`${collectionName} contains duplicate ${fieldName} values.`);
  }
}

function validateSeedData(): ValidationReport {
  for (const collection of seedCollections) {
    assertUniqueValues(collection.name, "id", collection.documents.map((document) => document.id));
  }

  assertUniqueValues("subjects", "slug", demoSubjects.map((subject) => subject.slug));
  assertUniqueValues("grades", "slug", mathematicsCategories.map((grade) => grade.slug));
  assertUniqueValues("topics", "slug", mathematicsTopics.map((topic) => topic.slug));
  assertUniqueValues("worksheets", "slug", mathematicsWorksheets.map((worksheet) => worksheet.slug));

  const subjectIds = new Set(demoSubjects.map((subject) => subject.id));
  const gradesBySlug = new Map(mathematicsCategories.map((grade) => [grade.slug, grade]));
  const topicsBySlug = new Map(mathematicsTopics.map((topic) => [topic.slug, topic]));

  for (const grade of mathematicsCategories) {
    if (!subjectIds.has(grade.subjectId)) {
      throw new Error(`Grade ${grade.id} references missing subject ${grade.subjectId}.`);
    }
  }

  for (const topic of mathematicsTopics) {
    if (!gradesBySlug.has(topic.gradeSlug)) {
      throw new Error(`Topic ${topic.id} references missing grade ${topic.gradeSlug}.`);
    }
  }

  for (const worksheet of mathematicsWorksheets) {
    const grade = gradesBySlug.get(worksheet.gradeSlug);
    const topic = topicsBySlug.get(worksheet.topicSlug);

    if (!subjectIds.has(worksheet.subjectId)) {
      throw new Error(`Worksheet ${worksheet.id} references missing subject ${worksheet.subjectId}.`);
    }

    if (!grade) {
      throw new Error(`Worksheet ${worksheet.id} references missing grade ${worksheet.gradeSlug}.`);
    }

    if (!topic) {
      throw new Error(`Worksheet ${worksheet.id} references missing topic ${worksheet.topicSlug}.`);
    }

    if (topic.gradeSlug !== worksheet.gradeSlug) {
      throw new Error(`Worksheet ${worksheet.id} has inconsistent grade and topic references.`);
    }

    if (Number.isNaN(Date.parse(worksheet.createdAt)) || Number.isNaN(Date.parse(worksheet.updatedAt))) {
      throw new Error(`Worksheet ${worksheet.id} contains an invalid date.`);
    }
  }

  return {
    subjects: demoSubjects.length,
    grades: mathematicsCategories.length,
    topics: mathematicsTopics.length,
    worksheets: mathematicsWorksheets.length,
  };
}

function printValidationReport(report: ValidationReport): void {
  console.log("\nFirestore seed validation report");
  console.table([
    { collection: "subjects", count: report.subjects },
    { collection: "grades", count: report.grades },
    { collection: "topics", count: report.topics },
    { collection: "worksheets", count: report.worksheets },
  ]);
  console.log(`Total documents: ${report.subjects + report.grades + report.topics + report.worksheets}`);
}

function initializeFirestore(): Firestore {
  const environmentFile = process.env.SEED_ENV_FILE ?? ".env.seed";
  config({ path: environmentFile });

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID is required. Add it to .env.seed.");
  }

  const app = getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
    projectId,
  });

  return getFirestore(app);
}

async function seedCollection(
  firestore: Firestore,
  collection: SeedCollection<SeedDocument>,
): Promise<number> {
  const batchSize = 450;
  let writtenDocuments = 0;

  for (let offset = 0; offset < collection.documents.length; offset += batchSize) {
    const documents = collection.documents.slice(offset, offset + batchSize);
    const batch = firestore.batch();

    for (const document of documents) {
      const documentReference = firestore.collection(collection.name).doc(document.id);
      batch.set(documentReference, collection.serialize(document), { merge: true });
    }

    await batch.commit();
    writtenDocuments += documents.length;
  }

  return writtenDocuments;
}

async function main(): Promise<void> {
  const report = validateSeedData();
  printValidationReport(report);

  if (isDryRun) {
    console.log("\nDry run completed. No Firebase connection was opened and no documents were written.");
    return;
  }

  const firestore = initializeFirestore();
  console.log(`\nSeeding Firestore project: ${process.env.FIREBASE_PROJECT_ID}`);

  for (const collection of seedCollections) {
    const writtenDocuments = await seedCollection(firestore, collection);
    console.log(`${collection.name}: ${writtenDocuments} documents created or updated`);
  }

  console.log("\nFirestore seed completed successfully.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nFirestore seed failed: ${message}`);
  process.exitCode = 1;
});
