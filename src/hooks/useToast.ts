import { useState, useCallback } from 'react'

interface ToastState {
  message: string
  visible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    visible: false
  })

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
    
    setTimeout(() => {
      setToast((prev: ToastState) => ({ ...prev, visible: false }))
    }, 3000)
  }, [])

  return { toast, showToast }
}
