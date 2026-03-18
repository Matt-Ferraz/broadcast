import type { User } from 'firebase/auth'
import type { Timestamp } from 'firebase/firestore'

export type AuthUser = User

export type Connection = {
  id: string
  userId: string
  name: string
  createdAt: Timestamp
}

export type Contact = {
  id: string
  userId: string
  connectionId: string
  name: string
  phone: string
  createdAt: Timestamp
}

export type MessageStatus = 'scheduled' | 'sent'

export type Message = {
  id: string
  userId: string
  connectionId: string
  content: string
  contactIds: string[]
  status: MessageStatus
  scheduledAt: Timestamp
  createdAt: Timestamp
}
