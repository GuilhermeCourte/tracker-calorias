import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { type Fast, type FastType } from "@/lib/schemas/fast";

function fastsCol(uid: string) {
  return collection(db, "users", uid, "fasts");
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Usuário não autenticado");
  return uid;
}

function toFast(snap: QueryDocumentSnapshot<DocumentData>): Fast {
  const data = snap.data();
  return {
    id: snap.id,
    startAt: (data.startAt as Timestamp).toDate(),
    endAt: data.endAt ? (data.endAt as Timestamp).toDate() : null,
    plannedType: data.plannedType as FastType,
    plannedDurationMinutes: data.plannedDurationMinutes as number,
    durationMinutes: typeof data.durationMinutes === "number" ? data.durationMinutes : null,
  };
}

export async function getActiveFast(): Promise<Fast | null> {
  const uid = requireUid();
  const q = query(fastsCol(uid), where("endAt", "==", null), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toFast(snap.docs[0]);
}

export async function startFast(input: {
  plannedType: FastType;
  plannedDurationMinutes: number;
}): Promise<string> {
  const uid = requireUid();
  const active = await getActiveFast();
  if (active) throw new Error("Já existe um jejum ativo. Encerre antes de iniciar outro.");
  const ref = await addDoc(fastsCol(uid), {
    startAt: Timestamp.now(),
    endAt: null,
    plannedType: input.plannedType,
    plannedDurationMinutes: input.plannedDurationMinutes,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function endFast(id: string, startAt: Date): Promise<void> {
  const uid = requireUid();
  const now = new Date();
  const durationMinutes = Math.max(
    0,
    Math.round((now.getTime() - startAt.getTime()) / 60000),
  );
  await updateDoc(doc(fastsCol(uid), id), {
    endAt: Timestamp.fromDate(now),
    durationMinutes,
  });
}

export async function listCompletedFasts(): Promise<Fast[]> {
  const uid = requireUid();
  const q = query(
    fastsCol(uid),
    where("endAt", "!=", null),
    orderBy("endAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map(toFast);
}
