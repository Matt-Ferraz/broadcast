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
  Timestamp,
} from 'firebase/firestore'
import type { Message, MessageStatus } from '../types'
import { db } from '../lib/firebase'

const COLLECTION = 'messages'

export const subscribeMessages = (
  userId: string,
  connectionId: string,
  onData: (messages: Message[]) => void,
  statusFilter?: MessageStatus
) => {
  const constraints = [
    where('userId', '==', userId),
    where('connectionId', '==', connectionId),
    orderBy('createdAt', 'desc'),
  ]

  if (statusFilter) {
    constraints.splice(2, 0, where('status', '==', statusFilter))
  }

  const q = query(collection(db, COLLECTION), ...constraints)

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Message)
    onData(data)
  })
}

export const createMessage = (
  userId: string,
  connectionId: string,
  content: string,
  contactIds: string[],
  scheduledAt: Date
) =>
  addDoc(collection(db, COLLECTION), {
    userId,
    connectionId,
    content,
    contactIds,
    status: 'scheduled' as MessageStatus,
    scheduledAt: Timestamp.fromDate(scheduledAt),
    createdAt: serverTimestamp(),
  })

export const updateMessage = (
  id: string,
  content: string,
  contactIds: string[],
  scheduledAt: Date
) =>
  updateDoc(doc(db, COLLECTION, id), {
    content,
    contactIds,
    scheduledAt: Timestamp.fromDate(scheduledAt),
  })

export const deleteMessage = (id: string) =>
  deleteDoc(doc(db, COLLECTION, id))
