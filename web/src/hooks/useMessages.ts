import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Message, MessageStatus } from '../types'
import {
  subscribeMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} from '../services/messagesService'

export const useMessages = (connectionId: string, statusFilter?: MessageStatus) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !connectionId) return
    const unsubscribe = subscribeMessages(user.uid, connectionId, (data) => {
      setMessages(data)
      setLoading(false)
    }, statusFilter)
    return unsubscribe
  }, [user, connectionId, statusFilter])

  const create = (content: string, contactIds: string[], scheduledAt: Date) =>
    createMessage(user!.uid, connectionId, content, contactIds, scheduledAt)

  const update = (id: string, content: string, contactIds: string[], scheduledAt: Date) =>
    updateMessage(id, content, contactIds, scheduledAt)

  const remove = (id: string) => deleteMessage(id)

  return { messages, loading, create, update, remove }
}
