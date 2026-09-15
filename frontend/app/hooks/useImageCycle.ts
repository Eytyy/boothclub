import {useEffect, useState} from 'react'

type CycleState = {
  prevCount: number
  prevEnabled: boolean
  index: number
  progress: number
}

export function useImageCycle(count: number, enabled: boolean, intervalMs = 2500) {
  const [state, setState] = useState<CycleState>({
    prevCount: count,
    prevEnabled: enabled,
    index: 0,
    progress: 0,
  })

  // Reconcile state from props during render rather than inside an effect:
  // - reset the cycle whenever the source length changes
  // - clear progress whenever the cycle is disabled so the next run starts clean
  if (state.prevCount !== count) {
    setState({prevCount: count, prevEnabled: enabled, index: 0, progress: 0})
  } else if (state.prevEnabled !== enabled) {
    setState({
      prevCount: count,
      prevEnabled: enabled,
      index: state.index,
      progress: enabled ? state.progress : 0,
    })
  }

  useEffect(() => {
    if (!enabled || count <= 1) return

    let frame = 0
    let startedAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const ratio = elapsed / intervalMs
      if (ratio >= 1) {
        setState((s) => ({...s, index: (s.index + 1) % count, progress: 0}))
        startedAt = now
      } else {
        setState((s) => ({...s, progress: ratio}))
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [count, enabled, intervalMs])

  return {index: state.index, progress: state.progress}
}
