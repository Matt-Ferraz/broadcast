import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type CollectionReference,
} from 'firebase/firestore'
import { collectionData } from 'rxfire/firestore'
import type { Observable } from 'rxjs'
import type { Connection } from '@/shared/types'
import { db } from '@/shared/lib/firebase'

const COLLECTION = 'connections'
const collectionRef = collection(db, COLLECTION) as CollectionReference<Connection>

export function getConnections(userId: string): Observable<Connection[]> {
  const q = query(collectionRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
  return collectionData(q, { idField: 'id' }) as Observable<Connection[]>
}

export function createConnection(userId: string, name: string) {
  return addDoc(collection(db, COLLECTION), {
    userId,
    name,
    createdAt: serverTimestamp(),
  })
}

export function updateConnection(id: string, name: string) {
  return updateDoc(doc(db, COLLECTION, id), { name })
}

export function deleteConnection(id: string) {
  return deleteDoc(doc(db, COLLECTION, id))
}
