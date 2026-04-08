import { atomFamily } from 'jotai/utils'
import { atomWithObservable } from 'jotai/utils'
import { getConnections } from '@/modules/connections/services/connectionsService'
import type { Connection } from '@/shared/types'

export const connectionsAtom = atomFamily((userId: string) =>
  atomWithObservable<Connection[] | null>(() => getConnections(userId), { initialValue: null }),
)
