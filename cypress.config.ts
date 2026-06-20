import { defineConfig } from "cypress";
import { deleteApp, initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, deleteDoc, getDocs, getFirestore, query, where } from "firebase/firestore";

interface AdminCleanupEnvironment {
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
}

async function cleanupWorksheetByTitle(title: string, environment: AdminCleanupEnvironment): Promise<number> {
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };

  if (!environment.ADMIN_EMAIL || !environment.ADMIN_PASSWORD || !firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error("Admin cleanup requires the configured Firebase and Cypress environment variables.");
  }

  const app = initializeApp(firebaseConfig, `cypress-cleanup-${Date.now()}`);
  const auth = getAuth(app);

  try {
    await signInWithEmailAndPassword(auth, environment.ADMIN_EMAIL, environment.ADMIN_PASSWORD);
    const snapshot = await getDocs(query(collection(getFirestore(app), "worksheets"), where("title", "==", title)));
    await Promise.all(snapshot.docs.map((document) => deleteDoc(document.ref)));
    return snapshot.size;
  } finally {
    if (auth.currentUser) {
      await signOut(auth);
    }
    await deleteApp(app);
  }
}

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:4173",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      on("task", {
        cleanupWorksheetByTitle: (title: string) => cleanupWorksheetByTitle(title, config.env),
      });
      return config;
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
});
