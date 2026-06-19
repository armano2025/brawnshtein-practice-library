import type { Topic } from "../models/Topic";

interface TopicDefinition {
  slug: string;
  name: string;
  description: string;
}

function createTopics(gradeSlug: string, definitions: readonly TopicDefinition[]): Topic[] {
  return definitions.map((topic, index) => ({
    id: `${gradeSlug}-${topic.slug}`,
    slug: `${gradeSlug}-${topic.slug}`,
    gradeSlug,
    name: topic.name,
    description: topic.description,
    order: index + 1,
    isActive: true,
  }));
}

const elementaryTopics = {
  numbers: { slug: "numbers-and-operations", name: "מספרים ופעולות חשבון", description: "היכרות עם מספרים, ערך המקום ופעולות בסיסיות" },
  addition: { slug: "addition-and-subtraction", name: "חיבור וחיסור", description: "תרגול חיבור וחיסור במגוון דרגות קושי" },
  multiplication: { slug: "multiplication-and-division", name: "כפל וחילוק", description: "לוח הכפל, חילוק ותרגילים משולבים" },
  fractions: { slug: "fractions", name: "שברים", description: "הכרת שברים ופעולות בשברים פשוטים" },
  decimals: { slug: "decimal-fractions", name: "שברים עשרוניים", description: "קריאה, השוואה ופעולות בשברים עשרוניים" },
  percentages: { slug: "percentages", name: "אחוזים", description: "חישובי אחוזים ויישומים מחיי היום־יום" },
  order: { slug: "order-of-operations", name: "סדר פעולות חשבון", description: "פתרון תרגילים לפי סדר הפעולות הנכון" },
  wordProblems: { slug: "word-problems", name: "בעיות מילוליות", description: "הבנת שאלות ובניית דרך פתרון" },
  geometry: { slug: "geometry", name: "גיאומטריה", description: "צורות, זוויות, היקפים ושטחים" },
  measurement: { slug: "measurement", name: "מדידות", description: "אורך, משקל, זמן ויחידות מידה" },
  review: { slug: "tests-and-review", name: "מבחנים ותרגול מסכם", description: "חזרה מסכמת ומבחני תרגול" },
} satisfies Record<string, TopicDefinition>;

const middleSchoolTopics: readonly TopicDefinition[] = [
  { slug: "signed-numbers", name: "מספרים מכוונים", description: "פעולות במספרים חיוביים ושליליים" },
  { slug: "powers-and-roots", name: "חזקות ושורשים", description: "חוקי חזקות, שורשים ותרגול משולב" },
  { slug: "algebraic-expressions", name: "ביטויים אלגבריים", description: "פישוט, הצבה וכינוס איברים דומים" },
  { slug: "equations", name: "משוואות", description: "פתרון משוואות ויישום בבעיות" },
  { slug: "inequalities", name: "אי־שוויונים", description: "פתרון וייצוג אי־שוויונים" },
  { slug: "ratio-and-proportion", name: "יחס ופרופורציה", description: "יחסים, קנה מידה וחלוקה ביחס נתון" },
  { slug: "percentages", name: "אחוזים", description: "שינוי באחוזים ובעיות שימושיות" },
  { slug: "functions", name: "פונקציות", description: "טבלאות, גרפים וקצב השתנות" },
  { slug: "geometry", name: "גיאומטריה", description: "זוויות, משולשים, מרובעים ומעגלים" },
  { slug: "statistics", name: "סטטיסטיקה", description: "איסוף נתונים, ממוצע וייצוגים גרפיים" },
  { slug: "probability", name: "הסתברות", description: "מרחב מדגם וחישובי הסתברות בסיסיים" },
  { slug: "tests-and-review", name: "מבחנים ותרגול מסכם", description: "חזרה מסכמת ומבחנים לדוגמה" },
];

const highSchoolTopics: readonly TopicDefinition[] = [
  { slug: "algebra", name: "אלגברה", description: "משוואות, מערכות משוואות וביטויים אלגבריים" },
  { slug: "functions", name: "פונקציות", description: "חקירת פונקציות וייצוגים גרפיים" },
  { slug: "trigonometry", name: "טריגונומטריה", description: "יחסים טריגונומטריים ופתרון משולשים" },
  { slug: "analytic-geometry", name: "גיאומטריה אנליטית", description: "ישרים, מעגלים ומקומות גיאומטריים" },
  { slug: "sequences", name: "סדרות", description: "סדרות חשבוניות והנדסיות" },
  { slug: "probability", name: "הסתברות", description: "מאורעות, הסתברות מותנית ועצים" },
  { slug: "statistics", name: "סטטיסטיקה", description: "מדדי מרכז, פיזור והתפלגות נתונים" },
  { slug: "calculus", name: "חדו״א", description: "גבולות, נגזרות, אינטגרלים ויישומים" },
  { slug: "three-units", name: "3 יח״ל", description: "תרגול ממוקד לתוכנית של שלוש יחידות" },
  { slug: "four-units", name: "4 יח״ל", description: "תרגול ממוקד לתוכנית של ארבע יחידות" },
  { slug: "five-units", name: "5 יח״ל", description: "תרגול מתקדם לתוכנית של חמש יחידות" },
  { slug: "bagrut-exams", name: "בגרויות", description: "שאלוני בגרות ותרגול לפי נושאים" },
  { slug: "mock-exams", name: "מבחני מתכונת", description: "מבחני הכנה מלאים במתכונת בגרות" },
  { slug: "final-tests", name: "מבחנים מסכמים", description: "מבחנים מסכמים וחזרה שנתית" },
];

const homeschoolingTopics: readonly TopicDefinition[] = [
  { slug: "first-grade-preparation", name: "הכנה לכיתה א׳", description: "מיומנויות חשבון ראשונות לקראת בית הספר" },
  { slug: "elementary", name: "יסודי", description: "מסלול תרגול גמיש לכיתות היסוד" },
  { slug: "middle-school", name: "חטיבת ביניים", description: "לימוד עצמאי ותרגול לחטיבת הביניים" },
  { slug: "high-school", name: "תיכון", description: "תוכנית תרגול עצמאית לרמת התיכון" },
  { slug: "general-worksheets", name: "דפי עבודה כלליים", description: "דפי עבודה להדפסה במגוון רמות" },
  { slug: "enrichment", name: "העשרה", description: "נושאים מעשירים מעבר לתוכנית הלימודים" },
];

const generalPracticeTopics: readonly TopicDefinition[] = [
  { slug: "review-sheets", name: "דפי חזרה", description: "דפי חזרה קצרים וממוקדים" },
  { slug: "holidays", name: "חופשות וחגים", description: "תרגול קליל ורציף לתקופות החופשה" },
  { slug: "weekly-challenge", name: "אתגר שבועי", description: "אתגר מתמטי חדש בכל שבוע" },
  { slug: "quick-practice", name: "תרגול מהיר", description: "מקבצי שאלות קצרים לחימום ולחזרה" },
  { slug: "test-preparation", name: "הכנה למבחן", description: "תרגול ממוקד לקראת מבחנים" },
  { slug: "math-puzzles", name: "חידות מתמטיות", description: "חידות מספרים, היגיון ודפוסים" },
  { slug: "thinking-games", name: "משחקי חשיבה", description: "משחקים לפיתוח חשיבה מתמטית" },
];

const elementaryTopicsByGrade: Record<string, readonly TopicDefinition[]> = {
  "grade-1": [elementaryTopics.numbers, elementaryTopics.addition, elementaryTopics.wordProblems, elementaryTopics.geometry, elementaryTopics.measurement, elementaryTopics.review],
  "grade-2": [elementaryTopics.numbers, elementaryTopics.addition, elementaryTopics.multiplication, elementaryTopics.wordProblems, elementaryTopics.geometry, elementaryTopics.measurement, elementaryTopics.review],
  "grade-3": [elementaryTopics.numbers, elementaryTopics.addition, elementaryTopics.multiplication, elementaryTopics.fractions, elementaryTopics.order, elementaryTopics.wordProblems, elementaryTopics.geometry, elementaryTopics.measurement, elementaryTopics.review],
  "grade-4": [elementaryTopics.numbers, elementaryTopics.addition, elementaryTopics.multiplication, elementaryTopics.fractions, elementaryTopics.decimals, elementaryTopics.order, elementaryTopics.wordProblems, elementaryTopics.geometry, elementaryTopics.measurement, elementaryTopics.review],
  "grade-5": Object.values(elementaryTopics),
  "grade-6": Object.values(elementaryTopics),
};

export const mathematicsTopics: readonly Topic[] = [
  ...Object.entries(elementaryTopicsByGrade).flatMap(([gradeSlug, topics]) => createTopics(gradeSlug, topics)),
  ...["grade-7", "grade-8", "grade-9"].flatMap((gradeSlug) => createTopics(gradeSlug, middleSchoolTopics)),
  ...["grade-10", "grade-11", "grade-12"].flatMap((gradeSlug) => createTopics(gradeSlug, highSchoolTopics)),
  ...createTopics("homeschooling", homeschoolingTopics),
  ...createTopics("general-practice", generalPracticeTopics),
];

export function getActiveTopicsByGradeSlug(gradeSlug: string): Topic[] {
  return mathematicsTopics
    .filter((topic) => topic.gradeSlug === gradeSlug && topic.isActive)
    .sort((firstTopic, secondTopic) => firstTopic.order - secondTopic.order);
}

export function getMathematicsTopicBySlug(slug: string | undefined) {
  return mathematicsTopics.find((topic) => topic.slug === slug);
}
