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
import type { Contact } from '@/shared/types'
import { db } from '@/shared/lib/firebase'

const COLLECTION = 'contacts'
const collectionRef = collection(db, COLLECTION) as CollectionReference<Contact>

export function getContacts(userId: string, connectionId: string): Observable<Contact[]> {
  const q = query(
    collectionRef,
    where('userId', '==', userId),
    where('connectionId', '==', connectionId),
    orderBy('createdAt', 'desc'),
  )
  return collectionData(q, { idField: 'id' }) as Observable<Contact[]>
}

export function createContact(userId: string, connectionId: string, name: string, phone: string) {
  return addDoc(collection(db, COLLECTION), {
    userId,
    connectionId,
    name,
    phone,
    createdAt: serverTimestamp(),
  })
}

export function updateContact(id: string, name: string, phone: string) {
  return updateDoc(doc(db, COLLECTION, id), { name, phone })
}

export function deleteContact(id: string) {
  return deleteDoc(doc(db, COLLECTION, id))
}
