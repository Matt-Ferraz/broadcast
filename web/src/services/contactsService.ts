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
import type { Contact } from '../types'
import { db } from '../lib/firebase'

const COLLECTION = 'contacts'

export const subscribeContacts = (
  userId: string,
  connectionId: string,
  onData: (contacts: Contact[]) => void
) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    where('connectionId', '==', connectionId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Contact)
    onData(data)
  })
}

export const createContact = (userId: string, connectionId: string, name: string, phone: string) =>
  addDoc(collection(db, COLLECTION), {
    userId,
    connectionId,
    name,
    phone,
    createdAt: serverTimestamp(),
  })

export const updateContact = (id: string, name: string, phone: string) =>
  updateDoc(doc(db, COLLECTION, id), { name, phone })

export const deleteContact = (id: string) =>
  deleteDoc(doc(db, COLLECTION, id))
