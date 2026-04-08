import { atomFamily } from 'jotai/utils'
import { atomWithObservable } from 'jotai/utils'
import { getContacts } from '@/modules/contacts/services/contactsService'
import type { Contact } from '@/shared/types'

export const contactsAtom = atomFamily(
  (params: { userId: string; connectionId: string }) =>
    atomWithObservable<Contact[] | null>(
      () => getContacts(params.userId, params.connectionId),
      { initialValue: null },
    ),
  (a, b) => a.userId === b.userId && a.connectionId === b.connectionId,
)
