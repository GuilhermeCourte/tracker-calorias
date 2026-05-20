import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  return uid;
}

export async function getDailyCalorieGoal(): Promise<number | null> {
  const uid = requireUid();
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const value = snap.data().dailyCalorieGoal;
  return typeof value === "number" ? value : null;
}

export async function setDailyCalorieGoal(value: number): Promise<void> {
  const uid = requireUid();
  await setDoc(
    doc(db, "users", uid),
    {
      dailyCalorieGoal: value,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
