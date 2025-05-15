
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant = "default", ...props }) {
        return (
          <Toast 
            key={id} 
            variant={variant}
            {...props}
            className="fixed top-4 right-4 z-50 min-w-[300px] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg rounded-lg"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-gray-900 dark:text-white font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-gray-600 dark:text-gray-300">{description}</ToastDescription>
              )}
            </div>
            <ToastClose className="absolute top-2 right-2 rounded-md p-1 text-gray-500 opacity-60 transition-opacity hover:opacity-100 focus:opacity-100" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
