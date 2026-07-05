"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full h-9 rounded-lg border border-zinc-200 px-3 bg-zinc-50/50 outline-none text-zinc-900 focus:border-blue-500 focus:bg-white cursor-pointer font-medium appearance-none pr-8 transition-colors dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50 dark:focus:border-blue-500 dark:focus:bg-zinc-950",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400">
          <ChevronDown className="h-4 w-4 shrink-0" />
        </div>
      </div>
    )
  }
)

Select.displayName = "Select"
