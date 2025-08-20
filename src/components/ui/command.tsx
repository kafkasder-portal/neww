"use client"

import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const commandVariants = cva(
  [
    // Base styles with enhanced UX
    "flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-popover",
        primary: "bg-primary/5 border border-primary/20",
        secondary: "bg-secondary/5 border border-secondary/20",
        outline: "border-2 border-border bg-background",
        glass: "bg-white/10 backdrop-blur-md border border-white/20",
      },
      size: {
        sm: "max-h-64",
        default: "max-h-96",
        lg: "max-h-[32rem]",
        xl: "max-h-[40rem]",
        full: "h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive> &
    VariantProps<typeof commandVariants>
>(({ className, variant, size, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(commandVariants({ variant, size, className }))}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const commandInputVariants = cva(
  [
    // Base styles with enhanced UX
    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
    "transition-all duration-200 ease-out",
    // Enhanced focus states
    "focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: "border-b border-border",
        primary: "border-b border-primary/20",
        secondary: "border-b border-secondary/20",
        outline: "border border-border rounded-md",
        ghost: "border-none",
      },
      size: {
        sm: "h-8 text-xs",
        default: "h-11 text-sm",
        lg: "h-14 text-base",
        xl: "h-16 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> &
    VariantProps<typeof commandInputVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div className="flex items-center border-b border-border px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(commandInputVariants({ variant, size, className }))}
      {...props}
    />
  </div>
))
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const commandEmptyVariants = cva(
  [
    // Base styles with enhanced UX
    "py-6 text-center text-sm",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        primary: "text-primary/70",
        secondary: "text-secondary-foreground/70",
        muted: "text-muted-foreground/70",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty> &
    VariantProps<typeof commandEmptyVariants>
>(({ className, variant, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn(commandEmptyVariants({ variant, className }))}
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const commandGroupVariants = cva(
  [
    // Base styles with enhanced UX
    "overflow-hidden p-1 text-foreground",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "",
        primary: "bg-primary/5",
        secondary: "bg-secondary/5",
        muted: "bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group> &
    VariantProps<typeof commandGroupVariants>
>(({ className, variant, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(commandGroupVariants({ variant, className }))}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const commandSeparatorVariants = cva(
  [
    // Base styles with enhanced UX
    "-mx-1 h-px",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "bg-border",
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        muted: "bg-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator> &
    VariantProps<typeof commandSeparatorVariants>
>(({ className, variant, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(commandSeparatorVariants({ variant, className }))}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const commandItemVariants = cva(
  [
    // Base styles with enhanced UX
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "transition-all duration-150 ease-out",
    // Enhanced hover effects
    "hover:bg-accent/80 hover:text-accent-foreground",
  ],
  {
    variants: {
      variant: {
        default: "",
        primary: "aria-selected:bg-primary/10 aria-selected:text-primary",
        secondary: "aria-selected:bg-secondary/10 aria-selected:text-secondary-foreground",
        destructive: "text-destructive aria-selected:bg-destructive/10 aria-selected:text-destructive",
      },
      size: {
        sm: "px-1.5 py-1 text-xs",
        default: "px-2 py-1.5 text-sm",
        lg: "px-3 py-2 text-base",
        xl: "px-4 py-2.5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> &
    VariantProps<typeof commandItemVariants>
>(({ className, variant, size, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(commandItemVariants({ variant, size, className }))}
    {...props}
  />
))
CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  commandVariants,
  commandInputVariants,
  commandEmptyVariants,
  commandGroupVariants,
  commandSeparatorVariants,
  commandItemVariants,
}
