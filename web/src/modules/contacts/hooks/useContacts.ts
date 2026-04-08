import { useRxValue } from '@/shared/hooks/useObservable'
import { getContacts } from '@/modules/contacts/services/contactsService'

export function useContacts(userId: string, connectionId: string) {
  return useRxValue(() => getContacts(userId, connectionId), [userId, connectionId])
}
