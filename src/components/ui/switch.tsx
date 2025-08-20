"use client"

import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const switchVariants = cva(
  [
    // Base styles with enhanced UX
    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
    "transition-all duration-200 ease-out",
    // Enhanced hover effects
    "hover:data-[state=checked]:bg-primary/90 hover:data-[state=unchecked]:bg-input/80",
  ],
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        primary: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary/20",
        secondary: "data-[state=checked]:bg-secondary data-[state=unchecked]:bg-secondary/20",
        success: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-green-100",
        warning: "data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-orange-100",
        error: "data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-red-100",
      },
      size: {
        sm: "h-4 w-7",
        default: "h-6 w-11",
        lg: "h-8 w-14",
        xl: "h-10 w-18",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const switchThumbVariants = cva(
  [
    // Base styles with enhanced UX
    "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
    "transition-all duration-200 ease-out",
    // Enhanced shadow effects
    "data-[state=checked]:shadow-md data-[state=unchecked]:shadow-sm",
  ],
  {
    variants: {
      size: {
        sm: "h-3 w-3 data-[state=checked]:translate-x-3",
        default: "h-5 w-5 data-[state=checked]:translate-x-5",
        lg: "h-7 w-7 data-[state=checked]:translate-x-6",
        xl: "h-9 w-9 data-[state=checked]:translate-x-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
  VariantProps<typeof switchVariants>
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ variant, size, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(switchThumbVariants({ size }))}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

// Enhanced Switch with label
interface SwitchWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
  VariantProps<typeof switchVariants> {
  label?: string
  description?: string
  labelPosition?: "left" | "right"
}

const SwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchWithLabelProps
>(({
  className,
  variant,
  size,
  label,
  description,
  labelPosition = "left",
  ...props
}, ref) => {
  const switchElement = (
    <Switch
      ref={ref}
      className={className}
      variant={variant}
      size={size}
      {...props}
    />
  )

  const labelElement = (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )

  return (
    <div className="flex items-center space-x-2">
      {labelPosition === "left" && labelElement}
      {switchElement}
      {labelPosition === "right" && labelElement}
    </div>
  )
})
SwitchWithLabel.displayName = "SwitchWithLabel"

export { Switch, switchThumbVariants, switchVariants, SwitchWithLabel }

