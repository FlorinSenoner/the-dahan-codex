import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Heading, Text } from '@/components/ui/typography'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <EmptyState
            action={<Button onClick={() => window.location.reload()}>Reload Page</Button>}
            content={
              import.meta.env.DEV && this.state.error ? (
                <pre className="text-xs text-left bg-muted p-3 rounded-md mb-6 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              ) : null
            }
            description={
              <Text as="p" className="text-muted-foreground mb-6">
                An unexpected error occurred. Try reloading the page.
              </Text>
            }
            title={
              <Heading as="h1" className="text-2xl text-foreground mb-2" variant="h1">
                Something went wrong
              </Heading>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}
