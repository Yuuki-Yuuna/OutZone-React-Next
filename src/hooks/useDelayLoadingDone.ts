import { useRef, useState } from 'react'
import { useUpdateEffect } from 'ahooks'

// 当一个加载状态过快的从true变为false时，等待它知道达到最小时间后才变为true
export const useDelayLoadingDone = (value: boolean, wait: number = 500) => {
  const timestampRef = useRef(Date.now())
  const timeoutRef = useRef<NodeJS.Timeout>()
  const [loading, setLoading] = useState(value)

  useUpdateEffect(() => {
    clearTimeout(timeoutRef.current)
    if (!value) {
      const dt = Date.now() - timestampRef.current
      if (dt < wait) {
        timeoutRef.current = setTimeout(() => setLoading(false), wait - dt)
      } else {
        setLoading(false)
      }
    }
    timestampRef.current = Date.now()
  }, [value])

  return loading
}
