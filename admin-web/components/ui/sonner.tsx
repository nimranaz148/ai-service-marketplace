"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface-raised group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-hairline group-[.toaster]:shadow-raised",
          description: "group-[.toast]:text-ink-muted",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-ink-muted",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
