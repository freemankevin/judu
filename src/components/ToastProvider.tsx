import { createContext, useContext } from 'react'
import { useToast as useToastHook } from '../hooks/useToast'

const ToastContext = createContext<ReturnType<typeof useToastHook> | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToastHook()
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${toast.toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
        <div className="bg-ink-900 dark:bg-paper-100 text-paper-50 dark:text-ink-900 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3">
          <i className="fas fa-check-circle text-green-400 dark:text-green-600 text-base"></i>
          <span className="font-medium text-sm">{toast.toast.message}</span>
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
