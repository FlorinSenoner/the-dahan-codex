import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-headline', {
  variants: {
    variant: {
      h1: 'text-2xl font-bold',
      h2: 'text-xl font-semibold',
      h3: 'text-lg font-semibold',
      h4: 'text-base font-medium',
    },
  },
  defaultVariants: {
    variant: 'h2',
  },
})

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingElement
  asChild?: boolean
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, as, asChild = false, ...props }, ref) => {
    // Default semantic element based on variant
    const defaultElement = variant || 'h2'
    const Comp = asChild ? Slot : as || defaultElement
    return <Comp className={cn(headingVariants({ variant, className }))} ref={ref} {...props} />
  },
)
Heading.displayName = 'Heading'

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-base text-foreground',
      muted: 'text-sm text-muted-foreground',
      small: 'text-xs text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

type TextElement = 'p' | 'span' | 'div'

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: TextElement
  asChild?: boolean
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, as = 'p', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : as
    return <Comp className={cn(textVariants({ variant, className }))} ref={ref} {...props} />
  },
)
Text.displayName = 'Text'

export { Heading, headingVariants, Text, textVariants }
