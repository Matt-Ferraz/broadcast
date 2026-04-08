import { atomFamily } from 'jotai/utils'
import { atomWithObservable } from 'jotai/utils'
import { getMessages } from '@/modules/messages/services/messagesService'
import type { Message, MessageStatus } from '@/shared/types'

export const messagesAtom = atomFamily(
  (params: { userId: string; connectionId: string; statusFilter?: MessageStatus }) =>
    atomWithObservable<Message[] | null>(
      () => getMessages(params.userId, params.connectionId, params.statusFilter),
      { initialValue: null },
    ),
  (a, b) =>
    a.userId === b.userId &&
    a.connectionId === b.connectionId &&
    a.statusFilter === b.statusFilter,
)
