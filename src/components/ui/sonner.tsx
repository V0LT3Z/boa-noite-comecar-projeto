
"use client"

import * as React from "react"
import { Toaster as Sonner } from "sonner"

import { cn } from "@/lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn(
        "fixed bottom-4 right-4 flex z-[100] w-auto"
      )}
      toastOptions={{
        classNames: {
          toast:
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border-none p-4 pr-8 shadow-md data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full bg-gradient-to-r from-primary to-secondary text-white",
          title: "text-base font-semibold",
          description: "text-sm opacity-95",
          actionButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
          cancelButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 disabled:pointer-events-none disabled:opacity-50",
          closeButton:
            "absolute right-2 top-2 rounded-md p-1 text-white/50 opacity-0 transition-opacity hover:text-white focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100"
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
