import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { type Meal, type MealFormValues, type MealType } from "@/lib/schemas/meal";
import { endOfDay, startOfDay } from "@/lib/date";

function mealsCol(uid: string) {
  return collection(db, "users", uid, "meals");
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  return uid;
}

function toMeal(snap: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>): Meal {
  const data = snap.data();
  if (!data) throw new Error("Documento vazio");
  return {
    id: snap.id,
    datetime: (data.datetime as Timestamp).toDate(),
    description: data.description as string,
    calories: data.calories as number,
    mealType: data.mealType as MealType,
  };
}

export async function listMealsByDate(date: Date): Promise<Meal[]> {
  const uid = requireUid();
  const q = query(
    mealsCol(uid),
    where("datetime", ">=", Timestamp.fromDate(startOfDay(date))),
    where("datetime", "<=", Timestamp.fromDate(endOfDay(date))),
    orderBy("datetime", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map(toMeal);
}

export async function getMeal(id: string): Promise<Meal | null> {
  const uid = requireUid();
  const snap = await getDoc(doc(mealsCol(uid), id));
  if (!snap.exists()) return null;
  return toMeal(snap);
}

export async function createMeal(values: MealFormValues): Promise<string> {
  const uid = requireUid();
  const docRef = await addDoc(mealsCol(uid), {
    datetime: Timestamp.fromDate(new Date(values.datetime)),
    description: values.description,
    calories: values.calories,
    mealType: values.mealType,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMeal(id: string, values: MealFormValues): Promise<void> {
  const uid = requireUid();
  await updateDoc(doc(mealsCol(uid), id), {
    datetime: Timestamp.fromDate(new Date(values.datetime)),
    description: values.description,
    calories: values.calories,
    mealType: values.mealType,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMeal(id: string): Promise<void> {
  const uid = requireUid();
  await deleteDoc(doc(mealsCol(uid), id));
}
