import { useRxValue } from '@/shared/hooks/useObservable'
import { getMessages } from '@/modules/messages/services/messagesService'
import type { MessageStatus } from '@/shared/types'

export function useMessages(userId: string, connectionId: string, statusFilter?: MessageStatus) {
  return useRxValue(() => getMessages(userId, connectionId, statusFilter), [userId, connectionId, statusFilter])
}
