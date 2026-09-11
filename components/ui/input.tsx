import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-3.5 text-base text-sand-200 transition-all duration-200 placeholder:text-sand-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand-400/30 focus-visible:border-sand-400/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }