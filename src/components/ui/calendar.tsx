"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const calendarVariants = cva(
  [
    // Base styles with enhanced UX
    "p-3",
    "transition-all duration-200 ease-out",
  ],
  {
    variants: {
      variant: {
        default: "",
        bordered: "border border-border rounded-lg",
        outlined: "border-2 border-border rounded-lg",
        ghost: "",
      },
      size: {
        sm: "p-2",
        default: "p-3",
        lg: "p-4",
        xl: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type CalendarProps = React.ComponentProps<typeof DayPicker> &
  VariantProps<typeof calendarVariants>

function Calendar({
  className,
  variant,
  size,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(calendarVariants({ variant, size, className }))}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

// Enhanced Calendar with custom styling
interface CalendarEnhancedProps extends CalendarProps {
  showHeader?: boolean
  headerTitle?: string
  showTodayButton?: boolean
  onTodayClick?: () => void
}

const CalendarEnhanced = React.forwardRef<HTMLDivElement, CalendarEnhancedProps>(
  ({ 
    className, 
    variant, 
    size,
    showHeader = true,
    headerTitle = "Calendar",
    showTodayButton = true,
    onTodayClick,
    ...props 
  }, ref) => {
    return (
      <div ref={ref} className="space-y-4">
        {showHeader && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{headerTitle}</h3>
            {showTodayButton && (
              <button
                onClick={onTodayClick}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "text-xs"
                )}
              >
                Today
              </button>
            )}
          </div>
        )}
        <Calendar
          className={className}
          variant={variant}
          size={size}
          {...props}
        />
      </div>
    )
  }
)
CalendarEnhanced.displayName = "CalendarEnhanced"

export { Calendar, CalendarEnhanced, calendarVariants }
