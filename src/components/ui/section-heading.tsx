import type { ReactNode } from 'react'
import { Heading } from '@/components/ui/typography'

interface SectionHeadingProps {
  icon?: ReactNode
  title: ReactNode
  className?: string
}

export function SectionHeading({ icon, title, className }: SectionHeadingProps) {
  return (
    <Heading
      as="h2"
      className={['flex items-center gap-2', className].filter(Boolean).join(' ')}
      variant="h2"
    >
      {icon}
      {title}
    </Heading>
  )
}
