import { useEffect, useState } from 'react'
import type { Observable } from 'rxjs'

export function useObservable<T>(observable: Observable<T[]>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = observable.subscribe((data) => {
      setData(data)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [observable])

  return { data, loading }
}

export function useRxValue<T>(observableCallback: () => Observable<T[]>, deps: unknown[]) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = observableCallback().subscribe((data) => {
      setData(data)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading }
}
