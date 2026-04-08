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
  Timestamp,
  type CollectionReference,
} from 'firebase/firestore'
import { collectionData } from 'rxfire/firestore'
import type { Observable } from 'rxjs'
import type { Message, MessageStatus } from '@/shared/types'
import { db } from '@/shared/lib/firebase'

const COLLECTION = 'messages'
const collectionRef = collection(db, COLLECTION) as CollectionReference<Message>

export function getMessages(
  userId: string,
  connectionId: string,
  statusFilter?: MessageStatus,
): Observable<Message[]> {
  const constraints = [
    where('userId', '==', userId),
    where('connectionId', '==', connectionId),
    orderBy('createdAt', 'desc'),
  ]

  if (statusFilter) {
    constraints.splice(2, 0, where('status', '==', statusFilter))
  }

  const q = query(collectionRef, ...constraints)
  return collectionData(q, { idField: 'id' }) as Observable<Message[]>
}

export function createMessage(
  userId: string,
  connectionId: string,
  content: string,
  contactIds: string[],
  scheduledAt: Date,
) {
  return addDoc(collection(db, COLLECTION), {
    userId,
    connectionId,
    content,
    contactIds,
    status: 'scheduled' as MessageStatus,
    scheduledAt: Timestamp.fromDate(scheduledAt),
    createdAt: serverTimestamp(),
  })
}

export function updateMessage(
  id: string,
  content: string,
  contactIds: string[],
  scheduledAt: Date,
) {
  return updateDoc(doc(db, COLLECTION, id), {
    content,
    contactIds,
    scheduledAt: Timestamp.fromDate(scheduledAt),
  })
}

export function deleteMessage(id: string) {
  return deleteDoc(doc(db, COLLECTION, id))
}
