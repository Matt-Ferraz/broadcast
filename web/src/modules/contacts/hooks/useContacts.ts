import { useAtomValue } from 'jotai'
import { contactsAtom } from '@/modules/contacts/atoms/contactsAtoms'

export function useContacts(userId: string, connectionId: string) {
  const data = useAtomValue(contactsAtom({ userId, connectionId }))
  return { data: data ?? [], loading: data === null }
}
