import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import type { Connection } from '../types'
import { db } from '../lib/firebase'

const COLLECTION = 'connections'

export const subscribeConnections = (
  userId: string,
  onData: (connections: Connection[]) => void
) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Connection)
    onData(data)
  })
}

export const createConnection = (userId: string, name: string) =>
  addDoc(collection(db, COLLECTION), {
    userId,
    name,
    createdAt: serverTimestamp(),
  })

export const updateConnection = (id: string, name: string) =>
  updateDoc(doc(db, COLLECTION, id), { name })

export const deleteConnection = (id: string) =>
  deleteDoc(doc(db, COLLECTION, id))
