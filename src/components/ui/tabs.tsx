"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tabsVariants = cva(
  [
    // Base styles with enhanced UX
    "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary/10",
        secondary: "bg-secondary/10",
        outline: "border border-border bg-transparent",
        ghost: "bg-transparent",
      },
      size: {
        sm: "h-8 text-xs",
        default: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsListVariants = cva(
  [
    // Base styles with enhanced UX
    "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary/10",
        secondary: "bg-secondary/10",
        outline: "border border-border bg-transparent",
        ghost: "bg-transparent",
      },
      size: {
        sm: "h-8 text-xs",
        default: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  [
    // Base styles with enhanced UX
    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    "transition-all duration-200 ease-out",
    // Enhanced hover effects
    "hover:bg-background hover:text-foreground",
    // Active states
    "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
  ],
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground",
        primary: "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        secondary: "data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground",
        outline: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-border",
        ghost: "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
      },
      size: {
        sm: "h-6 px-2 py-1 text-xs",
        default: "h-8 px-3 py-1.5 text-sm",
        lg: "h-10 px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsContentVariants = cva(
  [
    // Base styles with enhanced UX
    "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "transition-all duration-200 ease-out",
    // Animation states
    "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2",
    "data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-top-2",
  ],
  {
    variants: {
      variant: {
        default: "",
        primary: "",
        secondary: "",
        outline: "",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size, className }))}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size, className }))}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> &
    VariantProps<typeof tabsContentVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, className }))}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  tabsVariants,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants
}
