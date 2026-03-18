import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Contact } from '../types'
import {
  subscribeContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contactsService'

export const useContacts = (connectionId: string) => {
  const { user } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !connectionId) return
    const unsubscribe = subscribeContacts(user.uid, connectionId, (data) => {
      setContacts(data)
      setLoading(false)
    })
    return unsubscribe
  }, [user, connectionId])

  const create = (name: string, phone: string) =>
    createContact(user!.uid, connectionId, name, phone)

  const update = (id: string, name: string, phone: string) => updateContact(id, name, phone)

  const remove = (id: string) => deleteContact(id)

  return { contacts, loading, create, update, remove }
}
