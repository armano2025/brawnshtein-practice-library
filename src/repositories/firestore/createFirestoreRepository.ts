import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "../../lib/firebase";

interface RepositoryEntity {
  id: string;
  slug: string;
}

export interface FirestoreRepository<T extends RepositoryEntity> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  getBySlug: (slug: string) => Promise<T | null>;
  getByField: (field: string, value: string) => Promise<T[]>;
  create: (entity: T) => Promise<void>;
  update: (id: string, updates: Partial<Omit<T, "id">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function requireFirestore() {
  const firestore = getFirebaseDb();

  if (!firestore) {
    throw new Error("Firebase is not configured. Add the required VITE_FIREBASE_* environment variables.");
  }

  return firestore;
}

export function createFirestoreRepository<T extends RepositoryEntity>(
  collectionName: string,
  normalize: (id: string, data: DocumentData) => T,
): FirestoreRepository<T> {
  const getCollection = () => collection(requireFirestore(), collectionName);

  return {
    async getAll() {
      const snapshot = await getDocs(getCollection());
      return snapshot.docs.map((document) => normalize(document.id, document.data()));
    },

    async getById(id) {
      const snapshot = await getDoc(doc(getCollection(), id));
      return snapshot.exists() ? normalize(snapshot.id, snapshot.data()) : null;
    },

    async getBySlug(slug) {
      const snapshot = await getDocs(query(getCollection(), where("slug", "==", slug), limit(1)));
      const firstDocument = snapshot.docs[0];
      return firstDocument ? normalize(firstDocument.id, firstDocument.data()) : null;
    },

    async getByField(field, value) {
      const snapshot = await getDocs(query(getCollection(), where(field, "==", value)));
      return snapshot.docs.map((document) => normalize(document.id, document.data()));
    },

    async create(entity) {
      await setDoc(doc(getCollection(), entity.id), entity as DocumentData);
    },

    async update(id, updates) {
      await updateDoc(doc(getCollection(), id), updates as DocumentData);
    },

    async remove(id) {
      await deleteDoc(doc(getCollection(), id));
    },
  };
}
