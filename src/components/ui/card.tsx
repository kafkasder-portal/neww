import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  [
    // Base styles with enhanced UX
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    "transition-all duration-200 ease-out",
    "relative overflow-hidden",
    // Enhanced hover effects
    "hover:shadow-md hover:-translate-y-0.5",
    // Focus states
    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: "border-border",
        outline: "border-2 border-border bg-transparent",
        elevated: "border-border shadow-lg hover:shadow-xl",
        interactive: [
          "border-border cursor-pointer",
          "hover:shadow-lg hover:-translate-y-1 hover:border-primary/50",
          "active:translate-y-0 active:shadow-md",
        ],
        glass: [
          "border-white/20 bg-white/10 backdrop-blur-md",
          "hover:bg-white/20 hover:shadow-lg",
        ],
        gradient: [
          "border-transparent bg-gradient-to-br from-card to-card/80",
          "hover:from-card/90 hover:to-card/70",
        ],
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-md",
        default: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      radius: "default",
    },
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, padding, radius, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, padding, radius, className }))}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }