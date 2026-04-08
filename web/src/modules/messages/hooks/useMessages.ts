import { useAtomValue } from 'jotai'
import { messagesAtom } from '@/modules/messages/atoms/messagesAtoms'
import type { MessageStatus } from '@/shared/types'

export function useMessages(userId: string, connectionId: string, statusFilter?: MessageStatus) {
  const data = useAtomValue(messagesAtom({ userId, connectionId, statusFilter }))
  return { data: data ?? [], loading: data === null }
}
