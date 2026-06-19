import { mathematicsCategories } from "../data/mathematicsCategories";
import { mathematicsTopics } from "../data/mathematicsTopics";
import { mathematicsWorksheets } from "../data/mathematicsWorksheets";
import { demoSubjects } from "../data/subjects";
import type { Grade } from "../models/Grade";
import type { Subject } from "../models/Subject";
import type { Topic } from "../models/Topic";
import type { Worksheet } from "../models/Worksheet";
import { gradeRepository } from "../repositories/firestore/gradeRepository";
import { subjectRepository } from "../repositories/firestore/subjectRepository";
import { topicRepository } from "../repositories/firestore/topicRepository";
import { worksheetRepository } from "../repositories/firestore/worksheetRepository";

export const isDemoDataEnabled = import.meta.env.VITE_USE_DEMO_DATA === "true";

function activeByOrder<T extends { isActive: boolean; order: number }>(items: readonly T[]): T[] {
  return items.filter((item) => item.isActive).sort((first, second) => first.order - second.order);
}

async function getSubjects(): Promise<Subject[]> {
  const subjects = isDemoDataEnabled ? [...demoSubjects] : await subjectRepository.getAll();
  return activeByOrder(subjects);
}

async function getGrades(subjectId: string): Promise<Grade[]> {
  const grades = isDemoDataEnabled
    ? mathematicsCategories.filter((grade) => grade.subjectId === subjectId)
    : await gradeRepository.getByField("subjectId", subjectId);
  return activeByOrder(grades);
}

async function getGradeBySlug(slug: string): Promise<Grade | null> {
  if (isDemoDataEnabled) {
    return mathematicsCategories.find((grade) => grade.slug === slug) ?? null;
  }

  return gradeRepository.getBySlug(slug);
}

async function getTopicsByGradeSlug(gradeSlug: string): Promise<Topic[]> {
  const topics = isDemoDataEnabled
    ? mathematicsTopics.filter((topic) => topic.gradeSlug === gradeSlug)
    : await topicRepository.getByField("gradeSlug", gradeSlug);
  return activeByOrder(topics);
}

async function getTopicBySlug(slug: string): Promise<Topic | null> {
  if (isDemoDataEnabled) {
    return mathematicsTopics.find((topic) => topic.slug === slug) ?? null;
  }

  return topicRepository.getBySlug(slug);
}

async function getWorksheetsByTopicSlug(topicSlug: string): Promise<Worksheet[]> {
  const worksheets = isDemoDataEnabled
    ? mathematicsWorksheets.filter((worksheet) => worksheet.topicSlug === topicSlug)
    : await worksheetRepository.getByField("topicSlug", topicSlug);
  return worksheets.filter((worksheet) => worksheet.isActive);
}

async function getWorksheetBySlug(slug: string): Promise<Worksheet | null> {
  if (isDemoDataEnabled) {
    return mathematicsWorksheets.find((worksheet) => worksheet.slug === slug) ?? null;
  }

  return worksheetRepository.getBySlug(slug);
}

export const catalogService = {
  getSubjects,
  getGrades,
  getGradeBySlug,
  getTopicsByGradeSlug,
  getTopicBySlug,
  getWorksheetsByTopicSlug,
  getWorksheetBySlug,
};
