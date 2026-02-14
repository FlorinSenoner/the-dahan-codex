import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <div
      style={{
        viewTransitionName: 'toast-container',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999999,
        pointerEvents: 'none',
      }}
    >
      <SonnerToaster
        position="bottom-center"
        style={{ pointerEvents: 'auto' }}
        toastOptions={{
          classNames: {
            toast: 'bg-background border-border',
            title: 'text-foreground',
            description: 'text-muted-foreground',
            actionButton: 'bg-primary text-primary-foreground',
            cancelButton: 'bg-muted text-muted-foreground',
          },
        }}
      />
    </div>
  )
}
