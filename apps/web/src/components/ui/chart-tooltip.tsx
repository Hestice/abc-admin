"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface ChartTooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  formattedValue?: string
  label?: string
  payload?: Array<{
    value: number
    name: string
    color: string
  }>
}

export function ChartTooltip({ className, formattedValue, label, payload, ...props }: ChartTooltipProps) {
  if (!payload || !payload.length || !label) {
    return null
  }

  return (
    <div className={cn("rounded-lg border bg-background p-2 shadow-md", className)} {...props}>
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">{label}</div>
          {formattedValue && <div className="text-right text-sm font-medium">{formattedValue}</div>}
        </div>
        {payload.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="text-sm font-medium">{item.name}</div>
            </div>
            <div className="text-sm text-muted-foreground">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
