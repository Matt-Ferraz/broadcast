import { useRxValue } from '@/shared/hooks/useObservable'
import { getConnections } from '@/modules/connections/services/connectionsService'

export function useConnections(userId: string) {
  return useRxValue(() => getConnections(userId), [userId])
}
