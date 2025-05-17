
"use client"

import * as React from "react"
import { Toaster as Sonner } from "sonner"

import { cn } from "@/lib/utils"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className={cn(
        "fixed bottom-4 right-4 flex flex-col gap-3 z-[100] w-auto font-gooddog"
      )}
      toastOptions={{
        classNames: {
          toast:
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg border-none p-4 pr-6 shadow-md transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full font-gooddog",
          title: "text-base font-semibold font-gooddog",
          description: "text-sm opacity-90 font-gooddog",
          actionButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 font-gooddog",
          cancelButton:
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 font-gooddog",
        },
        duration: 4000, // Duração consistente para todos os toasts
        unstyled: true, // Desativando os estilos padrão para aplicar completamente os nossos
      }}
      {...props}
    />
  )
}

export { Toaster }
