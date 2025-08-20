"use client"

import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const breadcrumbVariants = cva(
  [
    // Base styles with enhanced UX
    "flex items-center space-x-1 text-sm text-muted-foreground",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "",
        primary: "text-primary/70",
        secondary: "text-secondary-foreground/70",
        muted: "text-muted-foreground",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const breadcrumbItemVariants = cva(
  [
    // Base styles with enhanced UX
    "transition-all duration-200 ease-out",
    // Enhanced hover effects
    "hover:text-foreground",
  ],
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-foreground",
        primary: "text-primary/70 hover:text-primary",
        secondary: "text-secondary-foreground/70 hover:text-secondary-foreground",
        muted: "text-muted-foreground hover:text-foreground",
      },
      active: {
        true: "text-foreground font-medium",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
    },
  }
)

const breadcrumbSeparatorVariants = cva(
  [
    // Base styles with enhanced UX
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "text-muted-foreground/50",
        primary: "text-primary/30",
        secondary: "text-secondary-foreground/30",
        muted: "text-muted-foreground/30",
      },
      size: {
        sm: "h-3 w-3",
        default: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  showHome?: boolean
  homeHref?: string
  maxItems?: number
  onItemClick?: (item: BreadcrumbItem, index: number) => void
}

const Breadcrumb = React.forwardRef<
  HTMLElement,
  BreadcrumbProps
>(({ 
  className, 
  variant, 
  size,
  items, 
  separator = <ChevronRight />,
  showHome = true,
  homeHref = "/",
  maxItems,
  onItemClick,
  ...props 
}, ref) => {
  const allItems = showHome 
    ? [{ label: "Home", href: homeHref, icon: <Home className="h-4 w-4" /> }, ...items]
    : items

  const displayItems = maxItems 
    ? allItems.slice(-maxItems)
    : allItems

  const handleItemClick = (item: BreadcrumbItem, index: number) => {
    if (onItemClick) {
      onItemClick(item, index)
    }
  }

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn(breadcrumbVariants({ variant, size, className }))}
      {...props}
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isFirst = index === 0

          return (
            <li key={index} className="flex items-center">
              {!isFirst && (
                <span className={cn(breadcrumbSeparatorVariants({ variant, size }), "mx-1")}>
                  {separator}
                </span>
              )}
              <span
                className={cn(
                  breadcrumbItemVariants({ variant, active: isLast }),
                  "flex items-center space-x-1",
                  item.href && !isLast && "cursor-pointer",
                  isLast && "pointer-events-none"
                )}
                onClick={() => handleItemClick(item, index)}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
})
Breadcrumb.displayName = "Breadcrumb"

// Enhanced Breadcrumb with truncation
interface BreadcrumbTruncatedProps extends BreadcrumbProps {
  truncateAt?: number
  truncateText?: string
}

const BreadcrumbTruncated = React.forwardRef<
  HTMLElement,
  BreadcrumbTruncatedProps
>(({ 
  className, 
  variant, 
  size,
  items, 
  truncateAt = 3,
  truncateText = "...",
  ...props 
}, ref) => {
  const shouldTruncate = items.length > truncateAt

  if (!shouldTruncate) {
    return (
      <Breadcrumb
        ref={ref}
        className={className}
        variant={variant}
        size={size}
        items={items}
        {...props}
      />
    )
  }

  const firstItems = items.slice(0, 1)
  const lastItems = items.slice(-truncateAt + 1)
  const truncatedItems = [...firstItems, { label: truncateText, href: undefined }, ...lastItems]

  return (
    <Breadcrumb
      ref={ref}
      className={className}
      variant={variant}
      size={size}
      items={truncatedItems}
      {...props}
    />
  )
})
BreadcrumbTruncated.displayName = "BreadcrumbTruncated"

export { Breadcrumb, BreadcrumbTruncated, breadcrumbVariants, breadcrumbItemVariants, breadcrumbSeparatorVariants }
