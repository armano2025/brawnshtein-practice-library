import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "../lib/firebase";

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("Firebase Auth is not configured.");
  return auth;
}

export const adminAuthService = {
  observeUser(callback: (user: User | null) => void) {
    return onAuthStateChanged(requireAuth(), callback);
  },

  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(requireAuth(), email, password);
  },

  async signOut() {
    return signOut(requireAuth());
  },

  async isAdmin(uid: string): Promise<boolean> {
    const firestore = getFirebaseDb();
    if (!firestore) throw new Error("Firestore is not configured.");
    const snapshot = await getDoc(doc(firestore, "config", "admins"));
    const uids = snapshot.exists() && Array.isArray(snapshot.data().uids)
      ? snapshot.data().uids.map(String)
      : [];
    return uids.includes(uid);
  },
};
