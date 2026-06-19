import type { Subject } from "../models/Subject";

export const demoSubjects: readonly Subject[] = [
  { id: "mathematics", slug: "mathematics", name: "מתמטיקה", description: "תרגול במתמטיקה לכל הכיתות", icon: "calculator", color: "#2563eb", path: "/mathematics", status: "active", order: 1, isActive: true },
  { id: "english", slug: "english", name: "אנגלית", description: "תרגול באנגלית", icon: "letters", color: "#f59e0b", status: "coming-soon", order: 2, isActive: true },
  { id: "language", slug: "language", name: "שפה", description: "תרגול בשפה", icon: "language", color: "#10b981", status: "coming-soon", order: 3, isActive: true },
  { id: "physics", slug: "physics", name: "פיסיקה", description: "תרגול בפיסיקה", icon: "physics", color: "#8b5cf6", status: "coming-soon", order: 4, isActive: true },
];
